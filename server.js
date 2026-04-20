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

  // Diagnostic endpoint
  app.get("/api/debug-glueup", async (req, res) => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      dirname: __dirname,
      nodeVersion: process.version,
      platform: process.platform,
      dns: {},
      fetch: {}
    };

    try {
      const glueupHost = 'lbbc.glueup.com';
      const addr = await lookup(glueupHost);
      diagnostics.dns[glueupHost] = addr;
    } catch (err) {
      diagnostics.dns.error = String(err);
    }

    try {
      const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      diagnostics.fetch = {
        status: response.status,
        ok: response.ok,
        headers: response.headers.raw ? response.headers.raw() : {}
      };
    } catch (err) {
      diagnostics.fetch.error = String(err);
    }

    res.json(diagnostics);
  });

  // Simple debug endpoint for members
  app.get("/api/debug-members", (req, res) => {
    const cachePaths = [
      path.join(__dirname, 'public', 'data', 'members.json'),
      path.join(__dirname, 'dist', 'data', 'members.json'),
      path.join(__dirname, 'data', 'members.json')
    ];
    
    const results = cachePaths.map(p => ({
      path: p,
      exists: fs.existsSync(p),
      size: fs.existsSync(p) ? fs.statSync(p).size : 0,
      mtime: fs.existsSync(p) ? fs.statSync(p).mtime : null
    }));
    
    res.json({
      timestamp: new Date().toISOString(),
      cachePaths: results,
      cwd: process.cwd(),
      __dirname: __dirname
    });
  });

  // API Route to fetch and parse GlueUp members
  const membersHandler = async (req, res) => {
    const now = Date.now();
    console.log(`[Server] Handling members request: ${req.url}`);

    // Try to serve from local cache first if it exists and is less than 24 hours old
    // We check both public/data/members.json and data/members.json (relative to dist)
    const cachePaths = [
      path.join(__dirname, 'public', 'data', 'members.json'),
      path.join(__dirname, 'dist', 'data', 'members.json'),
      path.join(__dirname, 'data', 'members.json')
    ];

    for (const cachePath of cachePaths) {
      if (fs.existsSync(cachePath)) {
        try {
          const stats = fs.statSync(cachePath);
          const age = now - stats.mtimeMs;
          // Refresh every 12 hours
          if (age < 12 * 60 * 60 * 1000) {
            console.log(`[Server] Serving members from cache: ${cachePath}`);
            const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            return res.json({ ...data, source: 'cache', age: Math.round(age / 1000 / 60) + ' min' });
          }
        } catch (e) {
          console.warn(`[Server] Error reading cache file ${cachePath}:`, e);
        }
      }
    }
    
    const fallbackData = {
      council: [
        { name: 'Bank ABC', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS', id: 'fallback-1' },
        { name: 'BACB', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/1AncCRiOHV69RThwwxusFjd44kk5Kfm3X', id: 'fallback-2' },
        { name: 'ALFA Holding Group', sector: 'Healthcare', logo: 'https://lbbc.glueup.com/resources/public/images/logo/400x200/216c1dba-14ec-45ec-85e0-11fd4db01608.png', id: 'fallback-3' },
        { name: 'ALMARAJ Company for Oil and Gas', sector: 'Energy', logo: 'https://lbbc.glueup.com/resources/public/images/logo/400x200/9806499a-9764-468a-8610-811656885662.png', id: 'fallback-4' },
        { name: 'Metlen', sector: 'Energy', logo: 'https://lh3.googleusercontent.com/d/1qZgdrszXG_q9DaIw9Pi15tK-FibGgnZa', id: 'fallback-5' },
        { name: 'Promergon', sector: 'Infrastructure', logo: 'https://lh3.googleusercontent.com/d/1tT9Mi34vXyls13GG54cIzrmBsPls301F', id: 'fallback-6' }
      ],
      corporate: [
        { name: 'Medship Group', sector: 'Logistics', logo: 'https://lh3.googleusercontent.com/d/1x4pHfOpvq7iOxhS_o9FwIZTDIYoxNbaw', id: 'fallback-7' },
        { name: 'Crowd Digital', sector: 'Technology', logo: 'https://lh3.googleusercontent.com/d/1anu1ZRZmC7BDJWW4CTWwB_ZpWtCddibV', id: 'fallback-8' },
        { name: 'Libya Holdings', sector: 'Investment', logo: 'https://lh3.googleusercontent.com/d/1Xs5dfuvlmR6CnN60XJJaMq6_OSOuRUhZ', id: 'fallback-9' }
      ]
    };

    try {
      // Scraper function
      const fetchFromGlueUp = async () => {
        const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
        const councilUrl = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/';
        
        const [corpRes, councilRes] = await Promise.all([
          fetchWithRetry(url),
          fetchWithRetry(councilUrl)
        ]);

        if (!corpRes.ok) throw new Error(`Corp Fetch failed: ${corpRes.status}`);
        
        const html = await corpRes.text();
        const $ = cheerio.load(html);
        const corporate = [];
        
        $('dt.BlockRow').each((i, el) => {
          const name = $(el).find('.title').text().trim();
          const sector = $(el).find('.description').text().trim() || 'Other';
          const logoUrl = $(el).find('img').attr('src');
          if (name) {
            corporate.push({
              name,
              sector,
              logo: logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `https://lbbc.glueup.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`) : null,
              id: $(el).attr('data-id') || `m-${i}`
            });
          }
        });

        const councilHtml = await councilRes.text();
        const $c = cheerio.load(councilHtml);
        const councilNames = new Set();
        $c('dt.BlockRow').each((i, el) => {
          const company = $c(el).find('[itemprop="worksFor"]').text().trim();
          if (company) councilNames.add(company.toLowerCase());
        });

        const council = corporate.filter(m => councilNames.has(m.name.toLowerCase()));
        const cleanCorporate = corporate.filter(m => !councilNames.has(m.name.toLowerCase()));

        return { council, corporate: cleanCorporate };
      };

      const result = await fetchFromGlueUp();
      
      if (result.council.length === 0 && result.corporate.length === 0) {
        throw new Error('Parsed empty member list');
      }

      const responseData = { ...result, timestamp: now, source: 'live' };

      // Try to update cache
      try {
        const cacheFile = cachePaths[0]; // Save to public/data/members.json
        if (!fs.existsSync(path.dirname(cacheFile))) {
          fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
        }
        fs.writeFileSync(cacheFile, JSON.stringify(responseData, null, 2));
        console.log(`[Server] Updated cache: ${cacheFile}`);
      } catch (e) {
        console.warn('[Server] Could not update cache:', e);
      }

      res.json(responseData);
    } catch (error) {
      console.error('Error fetching members live:', error);
      
      // If live fails, try to return STALE cache of ANY age
      for (const cachePath of cachePaths) {
        if (fs.existsSync(cachePath)) {
          try {
            console.log(`[Server] Fetch failed, serving STALE cache: ${cachePath}`);
            const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            return res.json({ ...data, source: 'stale-cache', error: String(error) });
          } catch (e) {}
        }
      }

      res.json({
        ...fallbackData,
        timestamp: now,
        source: 'fallback',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const eventsHandler = async (req, res) => {
    const now = Date.now();
    console.log(`[Server] Handling events request: ${req.url}`);
    
    // Try cache first
    const cachePaths = [
      path.join(__dirname, 'public', 'data', 'events.json'),
      path.join(__dirname, 'dist', 'data', 'events.json'),
      path.join(__dirname, 'data', 'events.json')
    ];

    for (const cachePath of cachePaths) {
      if (fs.existsSync(cachePath)) {
        try {
          const stats = fs.statSync(cachePath);
          const age = now - stats.mtimeMs;
          if (age < 12 * 60 * 60 * 1000) {
            console.log(`[Server] Serving events from cache: ${cachePath}`);
            const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            return res.json({ ...data, source: 'cache', age: Math.round(age / 1000 / 60) + ' min' });
          }
        } catch (e) {}
      }
    }

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
      const fetchEventsFromGlueUp = async () => {
        const upcomingUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view';
        const pastUrl = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view?listType=past';

        const [upcomingRes, pastRes] = await Promise.all([
          fetchWithRetry(upcomingUrl),
          fetchWithRetry(pastUrl)
        ]);

        if (!upcomingRes.ok) throw new Error(`Events Fetch failed: ${upcomingRes.status}`);
        
        const [upcomingHtml, pastHtml] = await Promise.all([
          upcomingRes.text(),
          pastRes.text()
        ]);

        const parseEvents = (html) => {
          const $ = cheerio.load(html);
          const events = [];
          $('.events-list li').each((i, el) => {
            const title = $(el).find('h2.content').text().trim();
            const date = $(el).find('time.content').text().trim();
            const location = $(el).find('.area.content').text().trim();
            const description = $(el).find('.description').text().trim() || '';
            const imgStyle = $(el).find('.event-image').attr('style') || '';
            const imgMatch = imgStyle.match(/url\((.*?)\)/);
            let image = imgMatch ? imgMatch[1].replace(/['"]/g, '').trim() : null;
            if (image && !image.startsWith('http')) image = `https://lbbc.glueup.com${image}`;
            
            const link = $(el).find('a').attr('href');
            if (title) {
              events.push({
                id: `e-${i}-${Math.random()}`,
                title, date, location, description, image,
                link: link ? (link.startsWith('http') ? link : `https://lbbc.glueup.com${link}`) : null,
                type: 'Event'
              });
            }
          });
          return events;
        };

        return { 
          upcoming: parseEvents(upcomingHtml),
          past: parseEvents(pastHtml)
        };
      };

      const result = await fetchEventsFromGlueUp();
      const responseData = { ...result, timestamp: now, source: 'live' };

      // Update cache
      try {
        const cacheFile = cachePaths[0];
        if (!fs.existsSync(path.dirname(cacheFile))) {
          fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
        }
        fs.writeFileSync(cacheFile, JSON.stringify(responseData, null, 2));
      } catch (e) {}

      res.json(responseData);
    } catch (error) {
      console.error('Error fetching events live:', error);
      
      // Try stale cache
      for (const cachePath of cachePaths) {
        if (fs.existsSync(cachePath)) {
          try {
            const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            return res.json({ ...data, source: 'stale-cache' });
          } catch (e) {}
        }
      }
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
