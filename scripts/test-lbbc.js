import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://lbbc.org.uk/lbbc-memberships/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('Title:', $('title').text());
  console.log('Member containers:', $('.members-con').length);
  console.log('Member links:', $('a.lbbcMemberMoreInfo').length);
  
  if ($('a.lbbcMemberMoreInfo').length === 0) {
      console.log('No members found directly. Checking for widget scripts...');
      $('script').each((i, el) => {
          const src = $(el).attr('src');
          if (src && src.includes('glueup')) console.log('Widget script:', src);
      });
  }
}
run();
