const https = require('https');

https.get('https://www.hariramcars.com/', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    // Find the nextjs data script
    const m = html.match(/<script id=\"__NEXT_DATA__\" type=\"application\/json\">(.+?)<\/script>/);
    if(m) {
       console.log('Found NEXT_DATA');
       // But wait, App router doesn't use NEXT_DATA in the same way.
    }
    const apiMatch = html.match(/http[^\"]+api/g);
    console.log("Found API urls:", new Set(apiMatch));
  });
});
