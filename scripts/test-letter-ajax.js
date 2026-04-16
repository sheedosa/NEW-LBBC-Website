import fetch from 'node-fetch';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/ajax/letter/A/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  const text = await res.text();
  console.log(text.substring(0, 1000));
}
run();
