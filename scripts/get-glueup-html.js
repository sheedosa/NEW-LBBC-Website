import fetch from 'node-fetch';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    }
  });
  const html = await res.text();
  process.stdout.write(html);
}
run();
