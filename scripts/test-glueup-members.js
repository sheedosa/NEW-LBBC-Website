import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://lbbc.org.uk/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=lbbc_gu_memberships_ajax_action&membershipID=2221887' // Used ALFA Holding Group id from earlier maybe? Wait earlier ID was 2721886. Wait, I used 2221887 in my previous test but the output was id: 2721886. Wait, the parameter was membershipID.
  });
  const text = await res.text();
  console.log(text);
}
run();
