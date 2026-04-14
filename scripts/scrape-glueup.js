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

async function scrapeMembers() {
  try {
    const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
    const councilUrl = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/';
    
    const [resCorp, resCouncil] = await Promise.all([
      fetchWithRetry(url),
      fetchWithRetry(councilUrl)
    ]);

    const htmlCorp = await resCorp.text();
    const htmlCouncil = await resCouncil.text();
    
    const $corp = cheerio.load(htmlCorp);
    const $council = cheerio.load(htmlCouncil);
    
    const corporate = [];
    const councilCompanyNames = new Set();

    // Parse Council Companies
    $council('dt.BlockRow').each((i, el) => {
      const company = $council(el).find('[itemprop="worksFor"]').text().trim();
      if (company) councilCompanyNames.add(company.toLowerCase());
      const desc = $council(el).find('.description').text().trim();
      if (desc && desc.includes('at ')) {
        councilCompanyNames.add(desc.split('at ')[1].trim().toLowerCase());
      }
    });

    // Parse Corporate Members
    $corp('dt.BlockRow').each((i, el) => {
      const name = $corp(el).find('.title').text().trim();
      const sector = $corp(el).find('.description').text().trim() || 'Other';
      const logo = $corp(el).find('img').attr('src');
      
      if (name) {
        corporate.push({
          name,
          sector,
          logo: logo ? (logo.startsWith('http') ? logo : `https://lbbc.glueup.com${logo}`) : null,
          id: `m-${i}`
        });
      }
    });

    const council = corporate.filter(m => 
      Array.from(councilCompanyNames).some(name => m.name.toLowerCase().includes(name) || name.includes(m.name.toLowerCase()))
    );
    const nonCouncil = corporate.filter(m => !council.find(c => c.name === m.name));

    const data = { council, corporate: nonCouncil, timestamp: Date.now() };
    fs.writeFileSync(path.join(DATA_DIR, 'members.json'), JSON.stringify(data, null, 2));
    console.log(`[Build Scraper] Saved ${corporate.length} members.`);
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

        if (title) {
          events.push({ id: `e-${i}-${Math.random()}`, title, date, location, image, type: 'Event' });
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
