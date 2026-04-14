
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

  // API Route to fetch and parse GlueUp members
  const membersHandler = async (req: any, res: any) => {
    const now = Date.now();
    console.log(`[Server] Handling members request: ${req.url}`);
    
    // Fallback data in case GlueUp is down
    const fallbackData = {
      council: [
        { name: 'Bank ABC', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS', id: 'fallback-1' },
        { name: 'BACB', sector: 'Financial Services', logo: 'https://lh3.googleusercontent.com/d/1AncCRiOHV69RThwwxusFjd44kk5Kfm3X', id: 'fallback-2' },
        { name: 'Metlen', sector: 'Energy', logo: 'https://lh3.googleusercontent.com/d/1qZgdrszXG_q9DaIw9Pi15tK-FibGgnZa', id: 'fallback-3' },
        { name: 'Promergon', sector: 'Infrastructure', logo: 'https://lh3.googleusercontent.com/d/1tT9Mi34vXyls13GG54cIzrmBsPls301F', id: 'fallback-4' }
      ],
      corporate: [
        { name: 'Medship Group', sector: 'Logistics', logo: 'https://lh3.googleusercontent.com/d/1x4pHfOpvq7iOxhS_o9FwIZTDIYoxNbaw', id: 'fallback-5' },
        { name: 'Crowd Digital', sector: 'Technology', logo: 'https://lh3.googleusercontent.com/d/1anu1ZRZmC7BDJWW4CTWwB_ZpWtCddibV', id: 'fallback-6' },
        { name: 'Libya Holdings', sector: 'Investment', logo: 'https://lh3.googleusercontent.com/d/1Xs5dfuvlmR6CnN60XJJaMq6_OSOuRUhZ', id: 'fallback-7' }
      ]
    };

    try {
      const fetchCorporate = async () => {
        const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
        const response = await fetchWithRetry(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const members: any[] = [];
        $('dt.BlockRow').each((i, el) => {
          const name = $(el).find('.title').text().trim();
          const sector = $(el).find('.description').text().trim() || 'Other';
          const logoUrl = $(el).find('img').attr('src');
          
          // Resolve logo URL
          let fullLogoUrl = null;
          if (logoUrl) {
            if (logoUrl.startsWith('http')) {
              fullLogoUrl = logoUrl;
            } else {
              // Handle relative paths like /resources/...
              fullLogoUrl = `https://lbbc.glueup.com${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
            }
          }
          
          if (name) {
            members.push({
              name,
              sector,
              logo: fullLogoUrl,
              id: $(el).attr('data-id') || `m-${i}`
            });
          }
        });
        return members;
      };

      const fetchCouncilCompanies = async () => {
        const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/';
        const response = await fetchWithRetry(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const companies = new Set<string>();
        $('dt.BlockRow').each((i, el) => {
          const company = $(el).find('[itemprop="worksFor"]').text().trim();
          if (company) companies.add(company);
          
          // Also check title if worksFor is empty, sometimes the company is in the description or title area
          const description = $(el).find('.description').text().trim();
          if (description && description.includes('at ')) {
            const parts = description.split('at ');
            if (parts.length > 1) companies.add(parts[1].trim());
          }
        });
        return Array.from(companies);
      };

      const [corporate, councilCompanyNames] = await Promise.all([
        fetchCorporate(),
        fetchCouncilCompanies()
      ]);

      if (corporate.length === 0) {
        throw new Error('No members found in GlueUp response');
      }

      // Distinguish council members from corporate members
      const council = corporate.filter(m => 
        councilCompanyNames.some(name => m.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(m.name.toLowerCase()))
      );

      const nonCouncilCorporate = corporate.filter(m => !council.find(c => c.id === m.id));
      
      const result = { 
        council, 
        corporate: nonCouncilCorporate,
        timestamp: now,
        source: 'glueup'
      };

      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('GlueUp fetch timed out after 15s. Using fallback data.');
      } else {
        console.error('Error fetching members from GlueUp:', error);
      }
      
      // Return fallback data if GlueUp fails
      res.json({
        ...fallbackData,
        timestamp: now,
        source: 'fallback',
        error: error instanceof Error ? error.message : String(error)
      });
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
          image: 'https://picsum.photos/seed/energy1/800/500'
        },
        {
          id: 'f-e-2',
          title: 'Libya Energy Transition Summit',
          location: 'London, UK',
          date: 'JUNE 16, 2026',
          description: 'Exploring the strategic shift towards renewable energy and sustainable infrastructure in Libya\'s evolving energy landscape.',
          type: 'Summit',
          image: 'https://picsum.photos/seed/energy2/800/500'
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
          image: 'https://picsum.photos/seed/banking/800/500'
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

  app.get("/api/test", (req, res) => {
    res.send("API is working");
  });

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
