import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    let inE = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('letter-E')) {
            console.log("Found letter-E");
            inE = true;
        }
        if (inE && lines[i].includes('company-representation')) {
            const match = lines[i].match(/title="([^"]+)"/);
            if (match) {
                console.log("Company:", match[1]);
            }
        }
        if (inE && lines[i].includes('letter-F')) {
            break;
        }
    }
  });
});
