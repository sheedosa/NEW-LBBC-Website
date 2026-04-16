import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://lbbc.org.uk/wp-content/plugins/glue-up-integration-dh/assets/js/script.js');
  const text = await res.text();
  console.log(text);
}
run();
