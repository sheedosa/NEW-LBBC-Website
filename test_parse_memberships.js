import * as cheerio from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('lbbc_memberships.html', 'utf8');
const $ = cheerio.load(html);

const council = [];
const corporate = [];

let currentList = council;

// Find all headings and members
$('h3.team-title, .members-con').each((i, el) => {
  const $el = $(el);
  
  if ($el.is('h3.team-title')) {
    const text = $el.text().trim();
    if (text.includes('Council Members')) {
      currentList = council;
    } else if (text.includes('Corporate Members')) {
      currentList = corporate;
    }
  } else {
    // It's a member container
    $el.find('a.lbbcMemberMoreInfo').each((j, a) => {
      const $a = $(a);
      const name = $a.find('strong').text().trim();
      const sector = $a.find('.company-sectors').text().trim() || 'Other';
      const logo = $a.find('img').attr('src');
      const id = $a.attr('data-membershipid') || $a.attr('data-membershipID');
      
      if (name) {
        currentList.push({ name, sector, logo, id });
      }
    });
  }
});

console.log('Council count:', council.length);
console.log('Corporate count:', corporate.length);
console.log('First council member:', council[0]);
console.log('Bank ABC in council?', council.some(m => m.name === 'Bank ABC'));
console.log('Bank ABC in corporate?', corporate.some(m => m.name === 'Bank ABC'));
