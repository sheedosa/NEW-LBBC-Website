import https from 'https';

https.get('https://lbbc.org.uk/lbbc-memberships/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
