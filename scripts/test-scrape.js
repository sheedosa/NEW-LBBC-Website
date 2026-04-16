import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://lbbc.org.uk/lbbc-memberships/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const firstMember = $('a.lbbcMemberMoreInfo').first();
  console.log('Attributes:', firstMember.attr());
  console.log('HTML content:', firstMember.html());
  
  // Also check if there's a hidden div with more info
  const id = firstMember.attr('data-membershipid');
  if (id) {
    console.log('Hidden info for ID', id, ':', $('#member-info-' + id).html() || $('[data-id="' + id + '"]').html() || 'Not found');
  }
}
run();
