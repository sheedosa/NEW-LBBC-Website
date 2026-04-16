import fetch from 'node-fetch';

async function run() {
  const url = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate';
  const res = await fetch(url);
  const text = await res.text();
  
  if (text.includes('window.__INITIAL_STATE__')) {
      console.log('found initial state');
  } else if (text.includes('var data =')) {
      console.log('found data');
  }
}
run();
