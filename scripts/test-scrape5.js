import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://lbbc.org.uk/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=lbbc_gu_memberships_ajax_action&membershipID=2221887'
  });
  const text = await res.text();
  console.log(text);
}
run();
