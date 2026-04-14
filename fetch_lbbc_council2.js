import https from 'https';

const options = {
  hostname: 'lbbc.org.uk',
  path: '/about-us/council-members/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
req.end();
