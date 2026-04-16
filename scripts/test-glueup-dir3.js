import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate';
  const res = await fetch(url);
  const html = await res.text();
  fs.writeFileSync('glueup-corporate.html', html);
  console.log('Saved to glueup-corporate.html');
}
run();
