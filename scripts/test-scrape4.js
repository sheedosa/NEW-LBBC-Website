import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://lbbc.org.uk/wp-content/plugins/glue-up-integration-dh/assets/js/script.js?ver=1.0');
  const text = await res.text();
  console.log(text);
}
run();
