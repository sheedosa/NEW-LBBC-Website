import https from 'https';

https.get('https://lbbc.org.uk/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/href="([^"]+)"/g);
    if (matches) {
      const links = matches.map(m => m.substring(6, m.length - 1)).filter(l => l.includes('council') || l.includes('member'));
      console.log(Array.from(new Set(links)).join('\n'));
    }
  });
});
