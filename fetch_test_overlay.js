import https from 'https';

https.get('https://lbbc.glueup.com/ajax/organization/5915/widget/membership-directory/ajax/requestInfoOverlay?type=corporate&id=1670346', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
