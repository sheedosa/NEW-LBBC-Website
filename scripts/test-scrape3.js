import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://lbbc.org.uk/lbbc-memberships/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  $('script').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('glue-up')) {
      console.log('Plugin script:', src);
    }
  });
}
run();
