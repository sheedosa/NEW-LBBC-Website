import https from 'https';

const options = {
  hostname: 'lbbc.glueup.com',
  path: '/organization/5915/widget/membership-directory/ajax/requestInfoOverlay?type=corporate&id=1667702',
  method: 'GET',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
