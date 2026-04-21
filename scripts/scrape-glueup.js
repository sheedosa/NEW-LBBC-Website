import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const fetchWithRetry = async (url, retries = 3) => {
  const agent = new https.Agent({ rejectUnauthorized: false });
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Build Scraper] Fetching: ${url}`);
      const response = await fetch(url, {
        agent,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (response.ok) return response;
      console.warn(`[Build Scraper] Attempt ${i+1} failed: ${response.status}`);
    } catch (err) {
      console.error(`[Build Scraper] Error on attempt ${i+1}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
};

async function fetchMemberDetails(id) {
  try {
    const res = await fetch('https://lbbc.org.uk/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=lbbc_gu_memberships_ajax_action&membershipID=${id}`
    });
    if (!res.ok) return null;
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  } catch (e) {
    return null;
  }
}

async function scrapeMembers() {
  try {
    let html = '';
    let usedLocal = false;

    try {
      const url = 'https://lbbc.org.uk/lbbc-memberships/';
      const response = await fetchWithRetry(url);
      html = await response.text();
    } catch (e) {
      console.warn('[Build Scraper] Live URL failed or timed out, checking for local fallbacks...');
    }

    // If live fetch failed or returned empty, try local files
    if (!html || html.length < 500) {
      const localFiles = ['lbbc_memberships.html', 'corporate_dir.html', 'lbbc_council.html', 'lbbc_members.html'];
      for (const file of localFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
          console.log(`[Build Scraper] Using local fallback file: ${file}`);
          html = fs.readFileSync(filePath, 'utf8');
          usedLocal = true;
          break;
        }
      }
    }

    if (!html) {
      throw new Error('No member data source available (Live URL failed and no local files found)');
    }

    const $ = cheerio.load(html);
    const council = [];
    const corporate = [];
    let currentList = council;

    // Parser 1: Original LBBC Site Structure
    if ($('h3.team-title, .members-con').length > 0) {
      console.log('[Build Scraper] Detected LBBC site structure');
      $('h3.team-title, .members-con').each((i, el) => {
        const $el = $(el);
        if ($el.is('h3.team-title')) {
          const text = $el.text().trim();
          if (text.includes('Council Members')) currentList = council;
          else if (text.includes('Corporate Members')) currentList = corporate;
        } else {
          $el.find('a.lbbcMemberMoreInfo').each((j, a) => {
            const $a = $(a);
            const name = $a.find('strong').text().trim();
            const sector = $a.find('.company-sectors').text().trim() || 'Other';
            const logoUrl = $a.find('img').attr('src');
            const id = $a.attr('data-membershipid') || $a.attr('data-membershipID') || `m-${i}-${j}`;
            
            let fullLogoUrl = null;
            if (logoUrl) {
              fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `https://lbbc.glueup.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
            }
            if (name) currentList.push({ name, sector, logo: fullLogoUrl, id, members: [] });
          });
        }
      });
    }

    // Parser 2: GlueUp Widget Structure (Fallback / Direct Widget)
    if (council.length === 0 && corporate.length === 0 && $('dl.BlockRows').length > 0) {
      console.log('[Build Scraper] Detected GlueUp widget structure');
      $('dl.BlockRows dt.BlockRow').each((i, el) => {
        const $el = $(el);
        const name = $el.find('.title').text().trim();
        const sector = $el.find('.description').text().trim() || 'Other';
        const logoUrl = $el.find('img').attr('src');
        const id = $el.attr('data-id') || `w-${i}`;
        
        let fullLogoUrl = null;
        if (logoUrl) {
          fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `https://lbbc.glueup.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
        }
        
        // In the widget view we might only have one type at a time
        // We'll put them in corporate by default if we don't know
        if (name) corporate.push({ name, sector, logo: fullLogoUrl, id, members: [] });
      });
    }

    // Parser 3: If we used lbbc_memberships.html, look for individuals too
    // ... existing logic covers most cases ...

    if (council.length === 0 && corporate.length === 0) {
      throw new Error('[Build Scraper] No members parsed from any source. Aborting save to protect cache.');
    }

    console.log(`[Build Scraper] Found ${council.length} council and ${corporate.length} corporate members.`);
    
    // Fetch details in batches
    const fetchDetailsForList = async (list) => {
      console.log(`[Build Scraper] Fetching supplemental details for ${list.length} members...`);
      for (let i = 0; i < list.length; i += 10) {
        const batch = list.slice(i, i + 10);
        await Promise.all(batch.map(async (member) => {
          if (member.id && !member.id.startsWith('m-') && !member.id.startsWith('w-')) {
            const details = await fetchMemberDetails(member.id);
            if (details) {
              member.description = details.description;
              member.website = details.website;
              member.industry_txt = details.industry_txt;
              if (details.logo_uri && details.logo_uri.isSrc) {
                member.logo = details.logo_uri.src;
              }
            }
          }
        }));
        await new Promise(r => setTimeout(r, 200));
      }
    };

    // Only attempt details fetch if we're not completely offline/disconnected
    if (!usedLocal) {
      await fetchDetailsForList(council);
      await fetchDetailsForList(corporate);
    }

    const data = { 
      council, 
      corporate, 
      timestamp: Date.now(),
      source: usedLocal ? 'local-fallback' : 'live-scrape'
    };
    
    fs.writeFileSync(path.join(DATA_DIR, 'members.json'), JSON.stringify(data, null, 2));
    console.log(`[Build Scraper] Cache updated with ${council.length + corporate.length} members.`);
  } catch (err) {
    console.error('[Build Scraper] Members scraping failed:', err);
    
    const cachePath = path.join(DATA_DIR, 'members.json');
    if (fs.existsSync(cachePath)) {
      console.log('[Build Scraper] FAILURE: Preserving existing cache instead of overwriting with empty data.');
    } else {
      console.log('[Build Scraper] FAILURE: No existing cache found. Creating emergency fallback.');
      fs.writeFileSync(cachePath, JSON.stringify({ 
        council: [
          { name: 'Bank ABC', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS', id: 'f1' },
          { name: 'BACB', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/1AncCRiOHV69RThwwxusFjd44kk5Kfm3X', id: 'f2' }
        ], 
        corporate: [], 
        error: err.message,
        timestamp: Date.now()
      }));
    }
  }
}

async function scrapeEvents() {
  try {
    const upcomingUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view';
    const pastUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view?listType=past';

    const [resUp, resPast] = await Promise.all([
      fetchWithRetry(upcomingUrl),
      fetchWithRetry(pastUrl)
    ]);

    const htmlUp = await resUp.text();
    const htmlPast = await resPast.text();
    
    const $up = cheerio.load(htmlUp);
    const $past = cheerio.load(htmlPast);
    
    const parseEvents = ($) => {
      const events = [];
      $('.events-list li').each((i, el) => {
        const title = $(el).find('h2.content').text().trim();
        const date = $(el).find('time.content').text().trim();
        const location = $(el).find('.area.content').text().trim();
        const imgStyle = $(el).find('.event-image').attr('style') || '';
        const imgMatch = imgStyle.match(/url\((.*?)\)/);
        let image = imgMatch ? imgMatch[1].replace(/['"]/g, '').trim() : null;
        if (image && !image.startsWith('http')) image = `https://lbbc.glueup.com${image}`;

        const link = $(el).find('h2.content a').attr('href') || 
                     $(el).find('a[href]').first().attr('href');

        if (title) {
          events.push({ 
            id: `e-${i}-${Math.random()}`, 
            title, 
            date, 
            location, 
            image, 
            link: link ? (link.startsWith('http') ? link : `https://lbbc.glueup.com${link.startsWith('/') ? '' : '/'}${link}`) : null,
            type: 'Event' 
          });
        }
      });
      return events;
    };

    const data = { 
      upcoming: parseEvents($up), 
      past: parseEvents($past), 
      timestamp: Date.now() 
    };
    fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify(data, null, 2));
    console.log(`[Build Scraper] Saved ${data.upcoming.length + data.past.length} events.`);
  } catch (err) {
    console.error('[Build Scraper] Events scraping failed:', err);
    fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify({ upcoming: [], past: [], error: err.message }));
  }
}

async function run() {
  console.log('[Build Scraper] Starting static data generation...');
  await Promise.all([scrapeMembers(), scrapeEvents()]);
  console.log('[Build Scraper] Finished.');
}

run();
