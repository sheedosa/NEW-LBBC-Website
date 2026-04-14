import https from 'https';
import fs from 'fs';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('corporate_dir.html', data);
    console.log("Saved to corporate_dir.html");
  });
});
