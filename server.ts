
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import https from "https";
import dns from "dns";
import { promisify } from "util";

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

  const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Sometimes needed on shared hosting with outdated CA bundles
      keepAlive: true
    });

    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      try {
        console.log(`[Scraper] Attempt ${i + 1} fetching: ${url}`);
        const response = await fetch(url, {
          signal: controller.signal as any,
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
    const diagnostics: any = {
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
        signal: controller.signal as any
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

    try {
      const distPath = path.join(__dirname, 'dist');
      diagnostics.dist = {
        exists: fs.existsSync(distPath),
        path: distPath,
        files: fs.existsSync(distPath) ? fs.readdirSync(distPath).slice(0, 10) : []
      };
    } catch (err) {
      diagnostics.distError = String(err);
    }

    res.json(diagnostics);
  });

  async function fetchMemberDetails(id: string) {
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

  // API Route to fetch and parse GlueUp members
  const membersHandler = async (req: any, res: any) => {
    const now = Date.now();
    const CACHE_DIR = path.join(__dirname, 'public', 'data');
    const cachePath = path.join(CACHE_DIR, 'members.json');

    console.log(`[Server] Handling members request: ${req.url}`);

    // Try to serve from local cache first
    let cachedData: any = null;
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
        const council: any[] = [];
        const corporate: any[] = [];
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
      const enrichList = async (list: any[]) => {
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

  const eventsHandler = async (req: any, res: any) => {
    const now = Date.now();
    console.log(`[Server] Handling events request: ${req.url}`);
    
    // Fallback events in case GlueUp is down
    const fallbackEvents = {
      upcoming: [
        {
          id: 'f-e-1',
          title: "Realising Libya's Energy Ambitions",
          location: 'London, UK',
          date: 'MAY 13, 2026',
          description: 'The Conference will hear from the Chairman of the National Oil Corporation of Libya and a senior delegation from the NOC and NOC Operating Companies.',
          type: 'Conference',
          image: 'https://picsum.photos/seed/energy1/800/500',
          link: 'https://lbbc.glueup.com/event/realising-libyas-energy-ambitions-173494/'
        },
        {
          id: 'f-e-2',
          title: 'Libya Energy Transition Summit',
          location: 'London, UK',
          date: 'JUNE 16, 2026',
          description: 'Exploring the strategic shift towards renewable energy and sustainable infrastructure in Libya\'s evolving energy landscape.',
          type: 'Summit',
          image: 'https://picsum.photos/seed/energy2/800/500',
          link: 'https://lbbc.glueup.com/organization/5915/events/'
        }
      ],
      past: [
        {
          id: 'f-p-1',
          title: 'LBBC Webinar: Understanding Libya\'s Banking Landscape',
          location: 'Online Webinar',
          date: 'MARCH 25, 2026',
          description: 'A deep dive into LCs, payment systems, and best practices for financial transactions in the Libyan market.',
          type: 'Webinar',
          image: 'https://picsum.photos/seed/banking/800/500',
          link: 'https://lbbc.glueup.com/organization/5915/events/'
        }
      ]
    };

    try {
      // Fetch upcoming and past events in parallel for better performance
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
      
      const upcoming: any[] = [];
      const past: any[] = [];

      // Parse upcoming events
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

        const link = $upcoming(el).find('h2.content a').attr('href') || 
                     $upcoming(el).find('a').attr('href');
        const isPast = $upcoming(el).hasClass('past');

        const event = {
          id: `e-u-${i}`,
          title,
          date,
          location,
          description,
          image,
          link: link ? (
            link.startsWith('http') ? link : 
            link.startsWith('//') ? `https:${link}` :
            link.startsWith('/') ? `https://lbbc.glueup.com${link}` : 
            `https://lbbc.glueup.com/${link}`
          ) : null,
          type: 'Event'
        };

        if (isPast) past.push(event);
        else upcoming.push(event);
      });

      // Parse past events from the specific past widget
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

        const link = $past(el).find('h2.content a').attr('href') || 
                     $past(el).find('a').attr('href');

        const event = {
          id: `e-p-${i}`,
          title,
          date,
          location,
          description,
          image,
          link: link ? (
            link.startsWith('http') ? link : 
            link.startsWith('//') ? `https:${link}` :
            link.startsWith('/') ? `https://lbbc.glueup.com${link}` : 
            `https://lbbc.glueup.com/${link}`
          ) : null,
          type: 'Event'
        };

        // Avoid duplicates if any past events were already caught in the upcoming list
        if (!past.find(p => p.title === event.title)) {
          past.push(event);
        }
      });

      // If we found nothing, use fallback
      if (upcoming.length === 0 && past.length === 0) {
        return res.json({ ...fallbackEvents, source: 'fallback-empty' });
      }

      res.json({ upcoming, past, source: 'glueup' });
    } catch (error) {
      console.error('Error fetching events from GlueUp:', error);
      res.json({ ...fallbackEvents, source: 'fallback', error: String(error) });
    }
  };

  app.get("/api/test", (req, res) => res.send("API is working"));
  app.get("/node-check", (req, res) => res.send("Node.js server is ALIVE and handling requests at " + new Date().toISOString()));

  // Direct routes on app for maximum compatibility
  app.get(["/api/members", "/api/members/"], membersHandler);
  app.get(["/api/events", "/api/events/"], eventsHandler);
  
  // Also support routes without /api prefix just in case normalization fails
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

  // Mount the API router with flexibility for subfolders
  // (Keeping these as backups, but direct routes above are primary)
  app.use("/*/api/members", membersHandler);
  app.use("/*/api/events", eventsHandler);

  // Specific 404 for API routes to distinguish from frontend 404s
  app.use("/api/*", (req, res) => {
    console.warn(`[Server] API Route not found: ${req.originalUrl}`);
    res.status(404).json({ 
      error: "API route not found", 
      path: req.originalUrl,
      method: req.method
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Use __dirname instead of process.cwd() for more reliable path resolution on Hostinger
    const distPath = path.join(__dirname, 'dist');
    console.log(`[Server] Serving static files from: ${distPath}`);
    
    if (!fs.existsSync(distPath)) {
      console.error(`ERROR: 'dist' directory not found at ${distPath}.`);
      // Try fallback to process.cwd() if __dirname fails
      const fallbackPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(fallbackPath)) {
        console.log(`[Server] Found dist at fallback path: ${fallbackPath}`);
      }
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      console.log(`[Server] Catch-all route hit: ${req.url} (Original: ${req.originalUrl})`);
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        // Try fallback index path
        const fallbackIndex = path.join(process.cwd(), 'dist', 'index.html');
        if (fs.existsSync(fallbackIndex)) {
          res.sendFile(fallbackIndex);
        } else {
          res.status(404).send('Application build not found. Please ensure "npm run build" has completed successfully.');
        }
      }
    });
  }

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('[Server Error]', err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Log all registered routes for debugging
  console.log('[Server] Registering routes...');
  app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(`[Server] Registered route: ${r.route.path}`);
    }
  });

  return app;
}

const appPromise = createServer();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  appPromise.then(app => {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
