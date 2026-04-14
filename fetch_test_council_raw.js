import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Data length:", data.length);
    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('BlockRow')) {
            console.log(lines[i].trim().substring(0, 200));
        }
    }
  });
});
