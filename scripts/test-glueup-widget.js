import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('Title:', $('title').text());
  
  // Look for member cards
  $('.membership-card, .member-card').each((i, el) => {
    console.log('Member Card:', $(el).text().trim().substring(0, 100));
  });

  // Look for any JSON data in scripts
  $('script').each((i, el) => {
    const text = $(el).html();
    if (text && text.includes('EB_WIDGET_CONFIG')) {
      console.log('Found config');
    }
  });
}
run();
