
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = 3000;

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

    const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
      for (let i = 0; i < retries; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
          const fullLogoUrl = logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `https://lbbc.glueup.com${logoUrl}`) : null;
          
          if (name) {
            members.push({
              name,
              sector,
              logo: fullLogoUrl,
              id: $(el).attr('data-id') || `m-${i}`,
              event: $(el).attr('data-event')
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

const appPromise = createServer();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  appPromise.then(app => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
