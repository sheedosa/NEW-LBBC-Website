import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  return await res.text();
}

async function scrapeIndividuals() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const allIndividuals = [];

  for (const letter of letters) {
    console.log(`Scraping letter: ${letter}`);
    const url = `https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/ajax/letter/${letter}/`;
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);
      
      $('.BlockRow').each((i, el) => {
        const name = $(el).find('.title').text().trim();
        const company = $(el).find('.description').text().trim();
        if (name) {
          allIndividuals.push({ name, company });
        }
      });
    } catch (e) {
      console.error(`Error for ${letter}:`, e.message);
    }
    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`Total individuals found: ${allIndividuals.length}`);
  return allIndividuals;
}

scrapeIndividuals().then(data => {
  // Group by company
  const byCompany = {};
  data.forEach(p => {
    const co = p.company.toLowerCase().trim();
    if (!byCompany[co]) byCompany[co] = [];
    byCompany[co].push(p.name);
  });
  console.log('Top companies by member count:');
  Object.entries(byCompany)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([co, names]) => console.log(`${co}: ${names.length} members`));
});
