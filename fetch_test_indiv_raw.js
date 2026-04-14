import * as cheerio from 'cheerio';
import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Data length:", data.length);
    const $ = cheerio.load(data);
    $('dt.BlockRow').each((i, el) => {
      console.log($(el).text().trim().replace(/\s+/g, ' '));
    });
  });
});
