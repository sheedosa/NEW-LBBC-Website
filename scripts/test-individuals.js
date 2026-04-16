import fetch from 'node-fetch';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    }
  });
  const html = await res.text();
  console.log('HTML Length:', html.length);
  // process.stdout.write(html);
  
  // Look for member names and their companies
  const $ = (await import('cheerio')).load(html);
  $('.BlockRow').each((i, el) => {
    if (i === 0) {
      console.log('--- FIRST MEMBER HTML ---');
      console.log($(el).html());
    }
    const name = $(el).find('.title').text().trim();
    const company = $(el).find('.description').text().trim();
    console.log(`Person: ${name}, Company: ${company}`);
  });
}
run();
