import * as cheerio from 'cheerio';
import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const members = [];
    $('dt.BlockRow').each((i, el) => {
      members.push($(el).find('.title').text().trim());
    });
    console.log(`Found ${members.length} members in individual directory.`);
    if (members.length > 0) {
        console.log(members.slice(0, 5));
    }
  });
});
