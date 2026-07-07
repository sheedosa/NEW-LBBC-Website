/**
 * LBBC GlueUp Scraper — Reliable HTML-based extraction
 * 
 * Data sources:
 *   Members: https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/
 *   Events:  https://lbbc.glueup.com/organization/5915/widget/event-list/full-view
 * 
 * This scraper parses server-rendered HTML from GlueUp widget pages.
 * The member directory page renders all members as <dt class="BlockRow"> elements.
 * The event list page renders events with <h2 class="content">, <time>, and background images.
 * 
 * Usage:
 *   node scripts/scrape-glueup.js          # Run once (build-time)
 *   Imported by server.js for periodic refresh
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const ORG_ID = '5915';
const BASE = 'https://lbbc.glueup.com';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── HTTP Helpers ───────────────────────────────────────────────

const TIMEOUT_MS = 30000;

// Realistic, current browser headers. GlueUp's edge (anti-bot) can 403 stale/thin UAs.
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate',
  'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'Connection': 'keep-alive',
  'Referer': `${BASE}/organization/${ORG_ID}/`,
};

// In-memory cookie jar shared across requests — GlueUp sets a session cookie on first hit.
let cookieJar = '';
function updateCookies(res) {
  const raw = res.headers.raw?.()['set-cookie']
    ?? (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
  const pairs = raw.map(c => c.split(';')[0]).filter(Boolean);
  if (!pairs.length) return;
  const jar = new Map(cookieJar ? cookieJar.split('; ').map(p => [p.split('=')[0], p]) : []);
  for (const p of pairs) jar.set(p.split('=')[0], p);
  cookieJar = [...jar.values()].join('; ');
}

// Warm up: hit the org homepage first to obtain a session cookie before scraping widgets.
async function warmUp() {
  try {
    const res = await fetch(`${BASE}/organization/${ORG_ID}/`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    updateCookies(res);
    console.log(`[Scraper] Warm-up ${res.status}; session cookie: ${cookieJar ? 'YES' : 'NONE'}`);
  } catch (err) {
    console.warn(`[Scraper] Warm-up failed (continuing): ${err.message}`);
  }
}

async function fetchPage(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Scraper] Fetching: ${url} (attempt ${attempt})`);
      const res = await fetch(url, {
        headers: { ...HEADERS, ...(cookieJar ? { Cookie: cookieJar } : {}) },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      updateCookies(res);
      if (!res.ok) {
        console.warn(`[Scraper] HTTP ${res.status} for ${url}`);
        if (attempt < retries) {
          await sleep(2000 * attempt);
          continue;
        }
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return await res.text();
    } catch (err) {
      console.error(`[Scraper] Error on attempt ${attempt}: ${err.message}`);
      if (attempt < retries) await sleep(2000 * attempt);
      else throw err;
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeImageUrl(src) {
  if (!src) return null;
  src = src.trim().replace(/['"]/g, '');
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('/')) return BASE + src;
  if (src.startsWith('http')) return src;
  return BASE + '/' + src;
}

// ─── Member Scraping ────────────────────────────────────────────

/**
 * Parse members from a GlueUp membership directory widget page.
 * Each member is a <dt class="BlockRow"> with:
 *   - data-id: the membership record ID
 *   - data-event: the AJAX URL for "More Information" overlay
 *   - img: company logo
 *   - .title: company name
 *   - .description: industry/sector
 */
function parseMembersFromHtml(html, membershipType) {
  const $ = cheerio.load(html);
  const members = [];

  $('dt.BlockRow').each((i, el) => {
    const $el = $(el);

    const name = $el.find('.title').first().text().trim();
    if (!name) return;

    const sector = $el.find('.description').first().text().trim() || 'Other';
    const dataId = $el.attr('data-id') || `${membershipType}-${i}`;
    
    // Extract glueupId from the data-event URL
    const dataEvent = $el.attr('data-event') || '';
    let glueupId = null;
    const idMatch = dataEvent.match(/id=(\d+)/);
    if (idMatch) glueupId = idMatch[1];

    // Extract logo from img tag
    const imgSrc = $el.find('img').first().attr('src');
    const logo = normalizeImageUrl(imgSrc);

    // Also check for srcset (higher quality)
    const srcset = $el.find('img').first().attr('srcset');
    let logoHq = null;
    if (srcset) {
      const srcsetUrl = srcset.split(/\s+/)[0];
      logoHq = normalizeImageUrl(srcsetUrl);
    }

    members.push({
      name,
      sector,
      logo: logoHq || logo,
      id: dataId,
      glueupId: glueupId || dataId,
      membershipType,
      members: [], // sub-members (individuals) — populated separately if needed
    });
  });

  return members;
}

// ─── Member Detail Fetching ─────────────────────────────────────

const WIDGET_BASE = `${BASE}/organization/${ORG_ID}/widget/membership-directory`;
const WIDGET_PAGE = `${WIDGET_BASE}/corporate/`;
const AJAX_URL    = `${WIDGET_BASE}/ajax`;

/**
 * Fetch the "More Information" overlay for a single member.
 * Uses a POST to GlueUp's AJAX endpoint with the session cookie
 * obtained from the directory page. Returns { about, website } or {}.
 */
async function fetchDetail(glueupId, cookieHeader) {
  try {
    const postBody = new URLSearchParams({
      action: 'requestInfoOverlay',
      data: JSON.stringify({ type: 'corporate', id: Number(glueupId) }),
      orgID: ORG_ID,
      currentPath: `/organization/${ORG_ID}/widget/membership-directory/corporate/`,
      returnUrl: '',
    }).toString();

    const res = await fetch(AJAX_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'User-Agent': HEADERS['User-Agent'],
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': WIDGET_PAGE,
        'Origin': BASE,
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
      },
      body: postBody,
    });

    if (!res.ok) return {};

    const json = await res.json();
    const html = json?.partials?.Overlay ?? '';
    if (!html || html.length < 100) return {};

    const $ = cheerio.load(html);

    // GlueUp renders details as .labelledListItem with .label and .value
    let about = null;
    let website = null;

    $('.labelledListItem').each((_, el) => {
      const label = $(el).find('.label').text().trim().toLowerCase();
      const value = $(el).find('.value');
      if (!about && (label.includes('description') || label.includes('about'))) {
        about = value.text().trim() || null;
      }
      if (!website && label.includes('website')) {
        website = value.find('a').attr('href') || value.text().trim() || null;
      }
    });

    return { about: about || null, website: website || null };
  } catch {
    return {};
  }
}

/**
 * Run fn on items in batches of `size` with a small delay between batches
 * to avoid hammering GlueUp's servers.
 */
async function batchMap(items, size, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + size < items.length) await sleep(600);
  }
  return results;
}

export async function scrapeMembers() {
  console.log('[Scraper] Starting member directory scrape...');

  const corporateUrl = `${BASE}/organization/${ORG_ID}/widget/membership-directory/corporate/`;

  let corporate = [];
  let council = [];

  // Known council member names — extracted from the official LBBC website.
  // GlueUp's widget shows all company members together without distinguishing tiers.
  // This list is the authoritative source for council membership classification.
  // To update: add or remove company names here when membership tier changes.
  const COUNCIL_MEMBER_NAMES = new Set([
    'ALFA Holding Group',
    'ALMARAJ Company for Oil and Gas',
    'Anzar Property Investors Limited',
    'BACB',
    'Bank ABC',
    'Black Gold Automation & Control',
    'Blue Sky Oilfield Supply & Services',
    'BP',
    'CGG Services UK LTD',
    'Consolidated Contractors (UK) Ltd',
    'Core Laboratories',
    'De La Rue International',
    'DNO ASA',
    'Eltumi Partners',
    'Equinor Libya AS',
    'Eversheds Sutherland',
    'Expertise Consultancy',
    'Global Consolidated Contractors International',
    'Gulfsands Petroleum Plc',
    'HB Group',
    'Harbour Energy',
    'Jawaby Services and Investment Limited',
    'kashadah & Co',
    'Libya Holdings',
    'METLEN Energy & Metals SA',
    'Misurata Free Zone',
    'Murzuq Oil',
    'North south global sl',
    'Petroleum Research Centre',
    'PROMERGON',
    'Ribat International',
    'Safe group investment holding company',
    'Seawing Company Oil & Marine',
    'Seawing-ILK Contracting and Construction',
    'Shell International Limited',
    'StoneTurn UK Limited',
    'Takween',
    'Trouvay & Cauvin Limited',
    'Vitol SA',
    'Zahaf & Partners Law Firm',
  ]);

  try {
    // Warm up (seed session cookie) then fetch the directory via the shared-cookie helper.
    await warmUp();
    const html = await fetchPage(corporateUrl);
    console.log(`[Scraper] Session cookie: ${cookieJar ? 'YES' : 'NONE'}`);

    const allMembers = parseMembersFromHtml(html, 'corporate');
    console.log(`[Scraper] Parsed ${allMembers.length} total company members from directory`);

    // Separate council from corporate using the known council member list
    const councilNamesLower = new Set([...COUNCIL_MEMBER_NAMES].map(n => n.toLowerCase()));
    for (const member of allMembers) {
      if (councilNamesLower.has(member.name.toLowerCase())) {
        member.membershipType = 'council';
        council.push(member);
      } else {
        corporate.push(member);
      }
    }
    console.log(`[Scraper] Classified: ${council.length} council, ${corporate.length} corporate members`);

  } catch (err) {
    console.error('[Scraper] Member scraping failed:', err.message);
    const cachePath = path.join(DATA_DIR, 'members.json');
    if (fs.existsSync(cachePath)) {
      console.log('[Scraper] SAFE-UPDATE: Preserving existing members.json');
      return null;
    }
    throw err;
  }

  const totalMembers = council.length + corporate.length;
  if (totalMembers === 0) {
    console.error('[Scraper] ABORT: No members parsed. Preserving existing cache.');
    return null;
  }

  // Fetch about + website for every member in batches of 5
  console.log(`[Scraper] Fetching member details (about + website) for ${totalMembers} members…`);
  const allMembers = [...council, ...corporate];
  const details = await batchMap(allMembers, 5, m => fetchDetail(m.glueupId, cookieJar));
  details.forEach((detail, i) => {
    allMembers[i].about   = detail.about   || null;
    allMembers[i].website = detail.website || null;
  });
  const withDetails = details.filter(d => d.about || d.website).length;
  console.log(`[Scraper] Got details for ${withDetails}/${totalMembers} members`);

  const data = {
    council,
    corporate,
    timestamp: Date.now(),
    source: 'live-scrape',
    totalMembers,
  };

  fs.writeFileSync(path.join(DATA_DIR, 'members.json'), JSON.stringify(data, null, 2));
  console.log(`[Scraper] ✓ Saved ${totalMembers} members (${council.length} council, ${corporate.length} corporate)`);
  return data;
}

// ─── Event Scraping ─────────────────────────────────────────────

function parseEventsFromHtml(html) {
  const $ = cheerio.load(html);
  const events = [];

  // GlueUp renders events in h2.content elements with links
  // Each event block contains: h2 title, time.content date, .area.content location, .event-image background
  $('h2.content').each((i, el) => {
    const $h2 = $(el);
    const $a = $h2.find('a').first();
    const title = ($a.text() || $h2.text()).trim();
    if (!title) return;

    // Get the link
    let link = $a.attr('href') || '';
    if (link && !link.startsWith('http')) {
      link = BASE + (link.startsWith('/') ? '' : '/') + link;
    }

    // Navigate to the parent event container to find date, location, image
    // The structure is: li > (event-image div, time.content, h2.content, .area.content)
    const $container = $h2.closest('li').length ? $h2.closest('li') : $h2.parent();

    // Date
    const date = $container.find('time.content').first().text().trim();

    // Location
    const location = $container.find('.area.content').first().text().trim();

    // Image from background-image style
    let image = null;
    const $eventImage = $container.find('.event-image');
    if ($eventImage.length) {
      const style = $eventImage.attr('style') || '';
      const imgMatch = style.match(/url\(([^)]+)\)/);
      if (imgMatch) {
        image = normalizeImageUrl(imgMatch[1]);
      }
    }

    // Extract event ID from the link for stable IDs
    const eventIdMatch = link.match(/\/event\/[^/]+-(\d+)\//);
    const eventId = eventIdMatch ? eventIdMatch[1] : `e-${i}`;

    events.push({
      id: eventId,
      title,
      date,
      location,
      image,
      link,
      type: 'Event',
    });
  });

  return events;
}

export async function scrapeEvents() {
  console.log('[Scraper] Starting event scrape...');

  const upcomingUrl = `${BASE}/organization/${ORG_ID}/widget/event-list/full-view`;
  const pastUrl = `${BASE}/organization/${ORG_ID}/widget/event-list/full-view?listType=past`;

  let upcoming = [];
  let past = [];

  try {
    if (!cookieJar) await warmUp();
    const [htmlUp, htmlPast] = await Promise.all([
      fetchPage(upcomingUrl),
      fetchPage(pastUrl),
    ]);

    upcoming = parseEventsFromHtml(htmlUp);
    past = parseEventsFromHtml(htmlPast);

    console.log(`[Scraper] Parsed ${upcoming.length} upcoming and ${past.length} past events`);

    // Zero-row guard: a 200-OK page that parses to nothing usually means the markup changed
    // (or an interstitial), NOT that the org has zero events. Preserve the cache instead of
    // overwriting events.json with empty arrays.
    if (upcoming.length + past.length === 0) {
      const cachePath = path.join(DATA_DIR, 'events.json');
      if (fs.existsSync(cachePath)) {
        console.error('[Scraper] ABORT: 0 events parsed. Preserving existing events.json.');
        return null;
      }
    }
  } catch (err) {
    console.error('[Scraper] Event scraping failed:', err.message);
    const cachePath = path.join(DATA_DIR, 'events.json');
    if (fs.existsSync(cachePath)) {
      console.log('[Scraper] SAFE-UPDATE: Preserving existing events.json');
      return null;
    }
    // Write empty state as absolute fallback
    const fallback = { upcoming: [], past: [], timestamp: Date.now(), error: err.message };
    fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify(fallback, null, 2));
    return fallback;
  }

  const data = {
    upcoming,
    past,
    timestamp: Date.now(),
    source: 'live-scrape',
  };

  fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify(data, null, 2));
  console.log(`[Scraper] ✓ Saved ${upcoming.length + past.length} events`);
  return data;
}

// ─── Member Detail Fetching (for server-side proxy) ─────────────

/**
 * Fetch the "More Information" overlay for a single member.
 * Requires a session cookie obtained from the main directory page.
 * Returns parsed { description, website, contacts } or null on failure.
 */
export async function fetchMemberDetail(glueupId, type = 'corporate') {
  const url = `${BASE}/ajax/organization/${ORG_ID}/widget/membership-directory/ajax/requestInfoOverlay?type=${type}&id=${glueupId}`;
  
  try {
    // First, establish a session by hitting the directory page
    const dirUrl = `${BASE}/organization/${ORG_ID}/widget/membership-directory/${type}/`;
    const sessionRes = await fetch(dirUrl, { agent, headers: HEADERS, redirect: 'follow' });
    const cookies = sessionRes.headers.get('set-cookie') || '';
    
    // Now fetch the overlay with the session
    const res = await fetch(url, {
      agent,
      headers: {
        ...HEADERS,
        'X-Requested-With': 'XMLHttpRequest',
        'X-Platform': 'WIDGET',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': dirUrl,
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    let html = data?.data?.value?.wrapper || '';
    
    if (html.includes('404') && html.includes('Page not found')) {
      return null;
    }

    const $ = cheerio.load(html);
    
    // Extract description text
    const description = 
      $('.about-content').text().trim() ||
      $('.description').text().trim() ||
      $('.content').text().trim() || 
      null;
    
    // Extract website link
    const website = 
      $('.website a').attr('href') ||
      $('a[href*="http"]').not('[href*="glueup"]').first().attr('href') ||
      null;

    return { description, website };
  } catch (err) {
    console.warn(`[Scraper] Detail fetch failed for ${glueupId}: ${err.message}`);
    return null;
  }
}

// ─── Main Entry Point ───────────────────────────────────────────

export async function runScraper() {
  console.log('[Scraper] === Starting full data refresh ===');
  const start = Date.now();
  
  const results = await Promise.allSettled([
    scrapeMembers(),
    scrapeEvents(),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  let failures = 0;
  results.forEach((result, i) => {
    const label = i === 0 ? 'Members' : 'Events';
    if (result.status === 'fulfilled') {
      if (result.value) {
        console.log(`[Scraper] ${label}: ✓ Updated`);
      } else {
        failures++;
        console.error(`[Scraper] ${label}: ✗ Scrape returned NO data — existing cache preserved (this is a failure, not a no-op)`);
      }
    } else {
      failures++;
      console.error(`[Scraper] ${label}: ✗ Failed — ${result.reason}`);
    }
  });

  console.log(`[Scraper] === Refresh complete in ${elapsed}s (${failures} failure(s)) ===`);
  return { failures };
}

// Run directly if executed as a script
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('scrape-glueup.js') ||
  process.argv[1].includes('scrape-glueup')
);

if (isDirectRun) {
  runScraper()
    .then(({ failures }) => {
      if (failures > 0) {
        console.error(`[Scraper] ${failures} data source(s) failed to refresh — exiting non-zero so the run is visible (RED), not a silent green.`);
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('[Scraper] Fatal error:', err);
      process.exit(1);
    });
}
