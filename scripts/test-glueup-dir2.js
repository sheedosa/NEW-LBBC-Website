import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Look for any embedded json data in the html
  $('script').each((i, el) => {
    const text = $(el).html() || '';
    if (text.includes('EB_WIDGET_CONFIG') || text.includes('__INITIAL_STATE__') || text.includes('members')) {
      if (!text.includes('google-analytics')) {
        console.log(`Script ${i}:`, text.substring(0, 500));
      }
    }
  });

  // What are the class names of the links to the members?
  console.log('Links:');
  $('a').each((i, el) => {
    if (i < 10) console.log($(el).attr('href'));
  });
}
run();
