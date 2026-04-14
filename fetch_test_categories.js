import https from 'https';

https.get('https://lbbc.glueup.com/organization/5915/widget/membership-directory/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/<div class="CategorySidebar[^>]*>[\s\S]*?<\/ol><\/div>/);
    if (match) {
        console.log('\nCategories:');
        console.log(match[0]);
    } else {
        console.log("No categories found");
    }
  });
});
