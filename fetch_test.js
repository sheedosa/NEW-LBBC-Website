import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Look for any mention of council in the HTML
    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('council')) {
            console.log(`Line ${i}: ${lines[i].trim()}`);
        }
    }
    
    // Also let's check the structure of a single member item
    const match = data.match(/<dt class="BlockRow[^>]*>[\s\S]*?<\/dt>/);
    if (match) {
        console.log('\nSample member HTML:');
        console.log(match[0]);
    }
  });
});
