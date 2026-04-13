
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = 3000;

  const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout to stay under Vercel's 10s limit

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        clearTimeout(timeoutId);
        
        if (response.ok) return response;
        
        // If we get a gateway error, retry or move on
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
            continue;
          }
        }
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  };

  // API Route to fetch and parse GlueUp members
  app.get("/api/members", async (req, res) => {
    const now = Date.now();
    
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
  });

  app.get("/api/events", async (req, res) => {
    const now = Date.now();
    
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
      // Using the full-view widget URL as requested for more complete data
      const url = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view';
      const response = await fetchWithRetry(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const upcoming: any[] = [];
      const past: any[] = [];

      $('.events-list li').each((i, el) => {
        const title = $(el).find('h2.content').text().trim();
        const date = $(el).find('time.content').text().trim();
        const location = $(el).find('.area.content').text().trim();
        const description = $(el).find('.description').text().trim() || '';
        const imgStyle = $(el).find('.event-image').attr('style') || '';
        const imgMatch = imgStyle.match(/url\((.*?)\)/);
        let image = imgMatch ? imgMatch[1].replace(/['"]/g, '').trim() : null;
        
        if (image && !image.startsWith('http')) {
          image = `https://lbbc.glueup.com${image}`;
        }

        const link = $(el).find('a').attr('href');
        const isPast = $(el).hasClass('past');

        const event = {
          id: `e-${i}`,
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

      // If we found nothing, use fallback
      if (upcoming.length === 0 && past.length === 0) {
        return res.json({ ...fallbackEvents, source: 'fallback-empty' });
      }

      res.json({ upcoming, past, source: 'glueup' });
    } catch (error) {
      console.error('Error fetching events from GlueUp:', error);
      res.json({ ...fallbackEvents, source: 'fallback', error: String(error) });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
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
    const distPath = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distPath)) {
      console.error(`ERROR: 'dist' directory not found at ${distPath}. Ensure 'npm run build' is executed.`);
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please ensure "npm run build" has completed successfully.');
      }
    });
  }

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
