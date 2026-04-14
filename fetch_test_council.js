import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
