import https from 'https';
import fs from 'fs';

const urls = [
  { name: 'corporate', url: 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate' },
  { name: 'council', url: 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/council/' },
  { name: 'individual', url: 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/individual/' }
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'X-Requested-With': 'XMLHttpRequest'
};

async function fetchUrl({ name, url }) {
  console.log(`Fetching ${name} from ${url}...`);
  
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const reqOptions = {
      hostname: options.hostname,
      path: options.pathname + options.search,
      method: 'GET',
      headers: headers
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      
      if (res.statusCode !== 200) {
        console.error(`Error: ${name} returned status code ${res.statusCode}`);
        if (res.statusCode === 301 || res.statusCode === 302) {
            console.log(`Redirecting to: ${res.headers.location}`);
        }
        res.resume();
        return resolve(null);
      }

      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const fileName = `${name}_directory.html`;
        fs.writeFileSync(fileName, data);
        console.log(`Successfully saved ${fileName} (${data.length} bytes)`);
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request for ${name}: ${e.message}`);
      resolve(null);
    });

    req.end();
  });
}

async function run() {
  for (const item of urls) {
    await fetchUrl(item);
  }
}

run();
