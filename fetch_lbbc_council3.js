import https from 'https';

const options = {
  hostname: 'lbbc.org.uk',
  path: '/council-membership-for-libya-registered/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
req.end();
