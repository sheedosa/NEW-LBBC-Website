import fetch from 'node-fetch';

async function testId(id) {
  const res = await fetch('https://lbbc.org.uk/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `action=lbbc_gu_memberships_ajax_action&membershipID=${id}`
  });
  const text = await res.text();
  console.log(`ID ${id}:`, text);
}

async function run() {
  await testId(1667701); // BACB
  await testId(1667702); // Bank ABC
}
run();
