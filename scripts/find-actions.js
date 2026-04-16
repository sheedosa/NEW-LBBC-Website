import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://lbbc.org.uk/lbbc-memberships/');
  const html = await res.text();
  
  // Look for "action" in scripts
  const actions = html.match(/action['"]?\s*:\s*['"]([^'"]+)['"]/g);
  console.log('Found actions:', actions);
  
  // Look for any other clues
  const ajaxUrls = html.match(/ajaxurl['"]?\s*:\s*['"]([^'"]+)['"]/g);
  console.log('Ajax URLs:', ajaxUrls);
}
run();
