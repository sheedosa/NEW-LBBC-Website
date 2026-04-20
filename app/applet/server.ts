import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMBERS_FILE = path.join(__dirname, 'src/data/members.json');

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json({ limit: '10mb' }));

  // Helper to load members from the JSON file
  const loadMembers = () => {
    try {
      if (fs.existsSync(MEMBERS_FILE)) {
        return JSON.parse(fs.readFileSync(MEMBERS_FILE, 'utf8'));
      }
    } catch (e) {
      console.error("Error reading members file", e);
    }
    return [];
  };

  // Helper to save members to the JSON file
  const saveMembers = (members: any[]) => {
    try {
      fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2));
      return true;
    } catch (e) {
      console.error("Error saving members file", e);
      return false;
    }
  };

  // Automated Scraping Engine
  const runScraper = async () => {
    try {
      const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate';
      console.log(`[Automation] Syncing directory from Glueup...`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const members: any[] = [];

      // 1. Try to find raw JSON in scripts (Glueup's faster path)
      $('script').each((i, el) => {
        const content = $(el).html() || '';
        if (content.includes('members') || content.includes('initialData')) {
          const match = content.match(/\{"members":\[.*\]\}/) || content.match(/initialData\s*=\s*(\{.*\});/);
          if (match) {
            try {
              const data = JSON.parse(match[1] || match[0]);
              const list = data.members || data.list || [];
              list.forEach((item: any) => {
                members.push({
                  id: `glueup-${item.id || Math.random()}`,
                  name: item.name || item.title,
                  category: item.category || item.industry || 'Corporate Member',
                  location: item.location || 'Lithuania / UK',
                  description: item.description || 'Business Council Member',
                  website: item.website || '#',
                  image: item.logo || item.image || `https://picsum.photos/seed/${item.name}/400/250`
                });
              });
            } catch (e) {}
          }
        }
      });

      // 2. Fallback to DOM Scraping
      if (members.length === 0) {
        $('.directory_list-item, .card, [class*="member"], [class*="item"]').each((i, el) => {
          const name = $(el).find('.name, .title, h3, h4, strong').text().trim();
          if (name) {
            members.push({
              id: `scrape-${i}`,
              name,
              category: $(el).find('.category, .industry, [class*="type"]').text().trim() || 'Corporate Member',
              location: $(el).find('.location, .city, [class*="location"]').text().trim() || 'Lithuania / UK',
              description: $(el).find('.description, .bio, p').text().trim() || 'Business Council Member',
              website: $(el).find('a[href^="http"]').attr('href') || '#',
              image: $(el).find('img').attr('src') || `https://picsum.photos/seed/${name}/400/250`
            });
          }
        });
      }

      if (members.length > 0) {
        saveMembers(members);
        console.log(`[Automation] Successfully synced ${members.length} members.`);
      }
    } catch (e: any) {
      console.error(`[Automation] Sync failed: ${e.message}`);
    }
  };

  // Run scraper on startup and then every 6 hours
  runScraper();
  setInterval(runScraper, 6 * 60 * 60 * 1000);

  // Public API: Get members (always served to visitors)
  app.get('/api/members', (req, res) => {
    res.json(loadMembers());
  });

  // Keep manual sync endpoint just for testing/development (hidden)
  app.post('/api/members/sync', (req, res) => {
    const { members } = req.body;
    if (Array.isArray(members)) {
      saveMembers(members);
      return res.json({ success: true, count: members.length });
    }
    res.status(400).json({ error: 'Invalid data format' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
