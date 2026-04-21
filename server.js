import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import https from "https";
import dns from "dns";
import { promisify } from "util";

console.log('--- LBBC SERVER STARTING ---');
console.log('Time:', new Date().toISOString());
console.log('CWD:', process.cwd());
console.log('Node Version:', process.version);

const lookup = promisify(dns.lookup);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // Request logging for debugging on Hostinger
  app.use((req, res, next) => {
    console.log(`[Server] ${new Date().toISOString()} ${req.method} ${req.url} (Base: ${req.baseUrl}, Original: ${req.originalUrl})`);
    
    // Normalize API requests that might have a subfolder prefix
    if (req.url.includes('/api/') && !req.url.startsWith('/api/')) {
      const normalizedUrl = req.url.substring(req.url.indexOf('/api/'));
      console.log(`[Server] Normalizing API path: ${req.url} -> ${normalizedUrl}`);
      req.url = normalizedUrl;
    }
    
    next();
  });

  const fetchWithRetry = async (url, retries = 3) => {
    const agent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true
    });

    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        console.log(`[Scraper] Attempt ${i + 1} fetching: ${url}`);
        const response = await fetch(url, {
          signal: controller.signal,
          agent,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://lbbc.org.uk/',
            'Connection': 'keep-alive'
          }
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`[Scraper] Successfully fetched ${url}`);
          return response;
        }
        
        console.warn(`[Scraper] Fetch failed for ${url} with status ${response.status}`);
        
        if (response.status === 502 || response.status === 503 || response.status === 504 || response.status === 429) {
          if (i < retries - 1) {
            const delay = 2000 * (i + 1);
            console.log(`[Scraper] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`[Scraper] Fetch error for ${url} on attempt ${i + 1}:`, err);
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  };

  // API Route to fetch and parse GlueUp members
  const membersHandler = async (req, res) => {
    const now = Date.now();
    const CACHE_DIR = path.join(__dirname, 'public', 'data');
    const cachePath = path.join(CACHE_DIR, 'members.json');

    console.log(`[Server] Handling members request: ${req.url}`);

    // Try to serve from local cache first
    let cachedData = null;
    if (fs.existsSync(cachePath)) {
      try {
        const fileContent = fs.readFileSync(cachePath, 'utf8');
        cachedData = JSON.parse(fileContent);
        
        // If cache is fresh (less than 12 hours), serve it immediately
        const stats = fs.statSync(cachePath);
        const age = now - stats.mtimeMs;
        if (age < 12 * 60 * 60 * 1000 && cachedData.council && cachedData.council.length > 0) {
          console.log('[Server] Serving fresh members from cache');
          return res.json(cachedData);
        }
      } catch (e) {
        console.warn('[Server] Error reading cache file:', e);
      }
    }
    
    // Fallback data in case everything fails
    const fallbackData = {
      council: [
        { name: 'Bank ABC', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS', id: 'fallback-1' },
        { name: 'BACB', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/1AncCRiOHV69RThwwxusFjd44kk5Kfm3X', id: 'fallback-2' },
        { name: 'ALFA Holding Group', sector: 'Healthcare', logo: 'https://lbbc.glueup.com/resources/public/images/logo/400x200/216c1dba-14ec-45ec-85e0-11fd4db01608.png', id: 'fallback-3' },
        { name: 'ALMARAJ Company for Oil and Gas', sector: 'Energy', logo: 'https://lbbc.glueup.com/resources/public/images/logo/400x200/9806499a-9764-468a-8610-811656885662.png', id: 'fallback-4' }
      ],
      corporate: [
        { name: 'Medship Group', sector: 'Logistics', logo: 'https://lh3.googleusercontent.com/d/1x4pHfOpvq7iOxhS_o9FwIZTDIYoxNbaw', id: 'fallback-5' },
        { name: 'Crowd Digital', sector: 'Technology', logo: 'https://lh3.googleusercontent.com/d/1anu1ZRZmC7BDJWW4CTWwB_ZpWtCddibV', id: 'fallback-6' }
      ]
    };

    try {
      // If we have any cached data, send it now but trigger a background fetch if it's stale
      if (cachedData && cachedData.council && cachedData.council.length > 0) {
        res.json(cachedData);
        console.log('[Server] Serving stale cache, triggering background fetch...');
      }

      const fetchMembers = async () => {
        let scraperHtml = '';
        let source = 'live-scrape';

        try {
          const url = 'https://lbbc.org.uk/lbbc-memberships/';
          const response = await fetchWithRetry(url);
          if (response.ok) {
            scraperHtml = await response.text();
          }
        } catch (e) {
          console.warn('[Server Scraper] Live URL failed, trying local fallbacks...');
        }

        // If live failed, try local files
        if (!scraperHtml || scraperHtml.length < 500) {
          const localFiles = ['lbbc_memberships.html', 'corporate_dir.html', 'lbbc_council.html', 'lbbc_members.html'];
          for (const file of localFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
              console.log(`[Server Scraper] Using local fallback file: ${file}`);
              scraperHtml = fs.readFileSync(filePath, 'utf8');
              source = 'local-fallback';
              break;
            }
          }
        }

        if (!scraperHtml) throw new Error('No member data source available');

        const $ = cheerio.load(scraperHtml);
        const council = [];
        const corporate = [];
        let currentList = council;

        // Parser 1: Original LBBC Site Structure
        if ($('h3.team-title, .members-con').length > 0) {
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

        // Parser 2: GlueUp Widget Structure
        if (council.length === 0 && corporate.length === 0 && $('dl.BlockRows').length > 0) {
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
            if (name) corporate.push({ name, sector, logo: fullLogoUrl, id, members: [] });
          });
        }

        return { council, corporate, source };
      };

      const { council, corporate, source } = await fetchMembers();

      if (council.length === 0 && corporate.length === 0) {
        throw new Error('No members found during live scrape');
      }

      // Enrich with details
      const enrichList = async (list) => {
        for (let i = 0; i < list.length; i += 5) {
          const batch = list.slice(i, i + 5);
          await Promise.all(batch.map(async (member) => {
            if (member.id && !member.id.startsWith('m-')) {
              const details = await fetchMemberDetails(member.id);
              if (details) {
                member.description = details.description;
                member.website = details.website;
                if (details.logo_uri && details.logo_uri.isSrc) member.logo = details.logo_uri.src;
              }
            }
          }));
          await new Promise(r => setTimeout(r, 200));
        }
      };

      await enrichList(council);
      await enrichList(corporate);

      const result = { 
        council, 
        corporate,
        timestamp: now,
        source: 'live-scrape'
      };

      // CRITICAL: Only overwrite cache if we actually got data
      if (council.length > 0 || corporate.length > 0) {
        try {
          if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
          fs.writeFileSync(cachePath, JSON.stringify(result, null, 2));
          console.log('[Server] Cache updated successfully');
        } catch (e) {
          console.error('[Server] Failed to update cache:', e);
        }
      }

      if (!res.headersSent) {
        res.json(result);
      }
    } catch (error) {
      console.error('[Server] Scrape error:', error);
      if (!res.headersSent) {
        res.json({
          ...(cachedData || fallbackData),
          timestamp: now,
          source: cachedData ? 'stale-cache' : 'fallback',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  };

  const eventsHandler = async (req, res) => {
    const now = Date.now();
    console.log(`[Server] Handling events request: ${req.url}`);
    
    const fallbackEvents = {
      upcoming: [
        {
          id: 'f-e-1',
          title: "Realising Libya's Energy Ambitions",
          location: 'London, UK',
          date: 'MAY 13, 2026',
          description: 'The Conference will hear from the Chairman of the National Oil Corporation of Libya and a senior delegation from the NOC and NOC Operating Companies.',
          type: 'Conference',
          image: 'https://picsum.photos/seed/energy1/800/500'
        }
      ],
      past: []
    };

    try {
      const upcomingUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view';
      const pastUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view?listType=past';

      const [upcomingRes, pastRes] = await Promise.all([
        fetchWithRetry(upcomingUrl),
        fetchWithRetry(pastUrl)
      ]);

      if (!upcomingRes.ok || !pastRes.ok) throw new Error(`HTTP error! status: ${upcomingRes.status} / ${pastRes.status}`);
      
      const [upcomingHtml, pastHtml] = await Promise.all([
        upcomingRes.text(),
        pastRes.text()
      ]);

      const $upcoming = cheerio.load(upcomingHtml);
      const $past = cheerio.load(pastHtml);
      
      const upcoming = [];
      const past = [];

      $upcoming('.events-list li').each((i, el) => {
        const title = $upcoming(el).find('h2.content').text().trim();
        const date = $upcoming(el).find('time.content').text().trim();
        const location = $upcoming(el).find('.area.content').text().trim();
        const description = $upcoming(el).find('.description').text().trim() || '';
        const imgStyle = $upcoming(el).find('.event-image').attr('style') || '';
        const imgMatch = imgStyle.match(/url\((.*?)\)/);
        let image = imgMatch ? imgMatch[1].replace(/['"]/g, '').trim() : null;
        
        if (image && !image.startsWith('http')) {
          image = `https://lbbc.glueup.com${image}`;
        }

        const link = $upcoming(el).find('a').attr('href');
        const isPast = $upcoming(el).hasClass('past');

        const event = {
          id: `e-u-${i}`,
          title,
          date,
          location,
          description,
          image,
          link: link ? (link.startsWith('http') ? link : `https://lbbc.glueup.com${link}`) : null,
          type: 'Event'
        };

        if (isPast) past.push(event);
        else upcoming.push(event);
      });

      $past('.events-list li').each((i, el) => {
        const title = $past(el).find('h2.content').text().trim();
        const date = $past(el).find('time.content').text().trim();
        const location = $past(el).find('.area.content').text().trim();
        const description = $past(el).find('.description').text().trim() || '';
        const imgStyle = $past(el).find('.event-image').attr('style') || '';
        const imgMatch = imgStyle.match(/url\((.*?)\)/);
        let image = imgMatch ? imgMatch[1].replace(/['"]/g, '').trim() : null;
        
        if (image && !image.startsWith('http')) {
          image = `https://lbbc.glueup.com${image}`;
        }

        const link = $past(el).find('a').attr('href');

        const event = {
          id: `e-p-${i}`,
          title,
          date,
          location,
          description,
          image,
          link: link ? (link.startsWith('http') ? link : `https://lbbc.glueup.com${link}`) : null,
          type: 'Event'
        };

        if (!past.find(p => p.title === event.title)) {
          past.push(event);
        }
      });

      res.json({ upcoming, past, source: 'glueup' });
    } catch (error) {
      console.error('Error fetching events from GlueUp:', error);
      res.json({ ...fallbackEvents, source: 'fallback', error: String(error) });
    }
  };

  app.get("/api/test", (req, res) => res.send("API is working"));

  app.get(["/api/members", "/api/members/"], membersHandler);
  app.get(["/api/events", "/api/events/"], eventsHandler);
  app.get(["/members", "/members/"], membersHandler);
  app.get(["/events", "/events/"], eventsHandler);

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      dirname: __dirname
    });
  });

  app.use("/*/api/members", membersHandler);
  app.use("/*/api/events", eventsHandler);

  // Serve static files from the dist directory
  const distPath = path.join(__dirname, 'dist');
  console.log(`[Server] Checking for dist at: ${distPath}`);
  
  if (fs.existsSync(distPath)) {
    console.log(`[Server] Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
  } else {
    console.warn(`[Server] WARNING: 'dist' directory not found at ${distPath}`);
  }

  // Catch-all route to serve the frontend
  app.get('*', (req, res) => {
    console.log(`[Server] Catch-all route hit: ${req.url}`);
    const indexPath = path.join(distPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`
        <html>
          <body style="font-family: sans-serif; padding: 2rem; line-height: 1.6;">
            <h1 style="color: #e11d48;">LBBC Server is Running</h1>
            <p>The Node.js server is active, but the frontend build (dist/index.html) was not found.</p>
            <p><strong>Current Directory:</strong> ${process.cwd()}</p>
            <p><strong>Expected Path:</strong> ${indexPath}</p>
            <hr/>
            <p>Please ensure you have run <code>npm run build</code> and uploaded the <code>dist</code> folder.</p>
            <a href="/api/debug-glueup" style="color: #2563eb;">Check Server Diagnostics</a>
          </body>
        </html>
      `);
    }
  });

  app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
}

const PORT = process.env.PORT || 3000;

createServer().then(app => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`--- LBBC SERVER IS LIVE ---`);
    console.log(`Port: ${PORT}`);
    console.log(`Directory: ${__dirname}`);
    console.log(`Time: ${new Date().toISOString()}`);
  });
}).catch(err => {
  console.error('CRITICAL: Failed to start server:', err);
});
