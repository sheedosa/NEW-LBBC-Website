import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('glueup-corporate.html', 'utf8');
const $ = cheerio.load(html);

console.log('Title:', $('title').text());

const items = $('.member-item, .card, .item');
console.log('Items match:', items.length);

$('div').each((i, el) => {
    const cls = $(el).attr('class');
    if (cls && cls.includes('member')) {
        console.log(cls, $(el).text().substring(0, 50));
    }
});
