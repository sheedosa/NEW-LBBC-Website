import * as cheerio from 'cheerio';
import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const classes = new Set();
    $('dt.BlockRow').each((i, el) => {
      const cls = $(el).attr('class');
      if (cls) classes.add(cls);
      
      // Check for any other interesting attributes or child elements
      const hasFeatured = $(el).find('.featured').length > 0;
      if (hasFeatured) {
          console.log("Featured:", $(el).find('.title').text().trim());
      }
    });
    console.log("Classes found on BlockRow:", Array.from(classes));
  });
});
