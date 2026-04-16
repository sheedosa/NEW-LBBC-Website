import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://lbbc.org.uk/lbbc-memberships/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('Any hidden modals?', $('.modal').length, $('.member-modal').length, $('[id*="modal"]').length);
  
  // Let's look for script tags that might contain the data
  $('script').each((i, el) => {
    const text = $(el).html();
    if (text && text.includes('2221887')) {
      console.log('Found ID in script:', text.substring(0, 200) + '...');
    }
  });
  
  // Let's look for any element containing the ID
  $('*').each((i, el) => {
    const text = $(el).text();
    if (text && text.includes('ALFA Holding Group') && !$(el).hasClass('lbbcMemberMoreInfo') && !$(el).parents('.lbbcMemberMoreInfo').length) {
      console.log('Found name in element:', el.tagName, $(el).attr('class'));
    }
  });
}
run();
