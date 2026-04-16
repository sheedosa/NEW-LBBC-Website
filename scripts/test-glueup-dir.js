import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const scripts = [];
  $('script').each((i, el) => {
    scripts.push($(el).html());
  });
  
  for (const script of scripts) {
    if (script && script.includes('window.EB_WIDGET_CONFIG')) {
      console.log('Found widget config:', script.substring(0, 500));
    }
    if (script && script.includes('{')) {
      // console.log('Script snippet:', script.substring(0, 100));
    }
  }

  // Look for API endpoints in the HTML
  $('a, form, script, iframe').each((i, el) => {
    // console.log($(el).attr('src') || $(el).attr('href'));
  });
}
run();
