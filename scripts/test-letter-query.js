import fetch from 'node-fetch';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/?letter=A';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    }
  });
  const html = await res.text();
  const $ = (await import('cheerio')).load(html);
  console.log('Members found:', $('.BlockRow').length);
}
run();
