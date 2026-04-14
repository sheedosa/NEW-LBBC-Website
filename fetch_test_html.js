import * as cheerio from 'cheerio';
import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    $('dt.BlockRow').each((i, el) => {
      const name = $(el).find('.title').text().trim();
      if (name.startsWith('E')) {
          console.log(`\n--- ${name} ---`);
          console.log($(el).html());
      }
    });
  });
});
