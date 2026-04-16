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
    const url = 'https://lbbc.org.uk/lbbc-memberships/';
    const response = await fetchWithRetry(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const council = [];
    const corporate = [];
    let currentList = council;

    // Find all headings and members
    $('h3.team-title, .members-con').each((i, el) => {
      const $el = $(el);
      if ($el.is('h3.team-title')) {
        const text = $el.text().trim();
        if (text.includes('Council Members')) {
          currentList = council;
        } else if (text.includes('Corporate Members')) {
          currentList = corporate;
        }
      } else {
        $el.find('a.lbbcMemberMoreInfo').each((j, a) => {
          const $a = $(a);
          const name = $a.find('strong').text().trim();
          const sector = $a.find('.company-sectors').text().trim() || 'Other';
          const logoUrl = $a.find('img').attr('src');
          const id = $a.attr('data-membershipid') || $a.attr('data-membershipID') || `m-${i}-${j}`;
          
          let fullLogoUrl = null;
          if (logoUrl) {
            if (logoUrl.startsWith('http')) {
              fullLogoUrl = logoUrl;
            } else {
              fullLogoUrl = `https://lbbc.glueup.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
            }
          }
          if (name) {
            currentList.push({ name, sector, logo: fullLogoUrl, id, members: [] });
          }
        });
      }
    });

    console.log(`[Build Scraper] Found ${council.length + corporate.length} corporate members. Fetching details...`);
    
    // Fetch individual members to link them
    const individuals = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    console.log('[Build Scraper] Fetching individual members for linking...');
    
    // Fetch letters in parallel batches of 5
    for (let i = 0; i < letters.length; i += 5) {
      const batch = letters.slice(i, i + 5);
      await Promise.all(batch.map(async (letter) => {
        const indUrl = `https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/?letter=${letter}`;
        try {
          const indRes = await fetch(indUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          });
          if (indRes.ok) {
            const indHtml = await indRes.text();
            const $ind = cheerio.load(indHtml);
            $ind('.BlockRow').each((_, el) => {
              const personName = $ind(el).find('.title').text().trim();
              const companyName = $ind(el).find('.description').text().trim();
              if (personName && companyName) {
                individuals.push({ personName, companyName });
              }
            });
          }
        } catch (e) {
          console.warn(`[Build Scraper] Failed to fetch individuals for letter ${letter}`);
        }
      }));
    }
    console.log(`[Build Scraper] Found ${individuals.length} individuals.`);

    // Fetch details in batches
    const fetchDetailsForList = async (list) => {
      // Increased batch size and concurrency
      for (let i = 0; i < list.length; i += 15) {
        const batch = list.slice(i, i + 15);
        await Promise.all(batch.map(async (member) => {
          // Link individuals
          const memberNameLower = member.name.toLowerCase();
          member.members = individuals
            .filter(ind => {
              const coLower = ind.companyName.toLowerCase();
              return coLower.includes(memberNameLower) || memberNameLower.includes(coLower);
            })
            .map(ind => ind.personName);

          if (member.id && !member.id.startsWith('m-')) {
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
      }
    };

    await fetchDetailsForList(council);
    await fetchDetailsForList(corporate);

    const data = { council, corporate, timestamp: Date.now() };
    fs.writeFileSync(path.join(DATA_DIR, 'members.json'), JSON.stringify(data, null, 2));
    console.log(`[Build Scraper] Saved ${council.length + corporate.length} members with details.`);
  } catch (err) {
    console.error('[Build Scraper] Members scraping failed:', err);
    // Save empty fallback to prevent build failure
    fs.writeFileSync(path.join(DATA_DIR, 'members.json'), JSON.stringify({ council: [], corporate: [], error: err.message }));
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
