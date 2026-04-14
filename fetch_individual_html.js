import https from 'https';
import fs from 'fs';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('individual_dir.html', data);
    console.log('Saved individual_dir.html, length:', data.length);
  });
});
