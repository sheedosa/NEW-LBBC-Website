import https from 'https';

https.get('https://lbbc.org.uk/about-us/council-members/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
  });
}).on('error', (e) => {
  console.error(e);
});
