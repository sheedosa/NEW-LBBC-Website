// One-off migration: reorganize content/ from data-type files into PAGE-based files so the
// CMS sidebar mirrors the website layout. Run once with:  npx tsx scripts/restructure-content.mjs
// Each content/pages/<page>.json holds that page's structured data (images/lists) plus its
// bilingual text as `en:{...}` / `ar:{...}` (sections copied verbatim from translations).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));
const write = (p, obj) => writeFileSync(path.join(root, p), JSON.stringify(obj, null, 2) + '\n');

const en = read('content/translations/en.json');
const ar = read('content/translations/ar.json');
const hero = read('content/hero.json');
const leadership = read('content/team/leadership.json');
const board = read('content/team/board.json');
const partners = read('content/partners.json');
const sponsors = read('content/sponsors.json');
const footer = read('content/footer.json');
const resources = read('content/resources.json');
const spotlight = read('content/spotlight.json');
const settings = read('content/settings.json');

// Page -> translation sections. Every translations section must appear exactly once.
const PAGE_SECTIONS = {
  home: ['hero'],
  about: ['about', 'council', 'board', 'partners'],
  events: ['events'],
  directory: ['directory'],
  news: ['news'],
  resources: ['resources', 'gallery'],
  membership: ['membership'],
  contact: ['contact'],
  spotlight: ['featured'],
  global: ['nav', 'footer'],
};

// Coverage assertion — refuse to run if any section would be dropped or duplicated.
const mapped = Object.values(PAGE_SECTIONS).flat().sort();
const actual = Object.keys(en).sort();
if (JSON.stringify(mapped) !== JSON.stringify(actual)) {
  throw new Error(`Section mapping mismatch.\nmapped: ${mapped}\nactual: ${actual}`);
}
if (new Set(mapped).size !== mapped.length) throw new Error('Duplicate section in mapping');

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));
const text = (page) => ({ en: pick(en, PAGE_SECTIONS[page]), ar: pick(ar, PAGE_SECTIONS[page]) });

mkdirSync(path.join(root, 'content/pages'), { recursive: true });
write('content/pages/home.json', { slides: hero.slides, ...text('home') });
write('content/pages/about.json', {
  leadership: leadership.people, board: board.people, partners: partners.items, ...text('about'),
});
write('content/pages/events.json', { sponsors: sponsors.events, ...text('events') });
write('content/pages/directory.json', text('directory'));
write('content/pages/news.json', text('news'));
write('content/pages/resources.json', {
  documents: resources.documents, albums: resources.albums, ...text('resources'),
});
write('content/pages/membership.json', { pricing: settings.membership, ...text('membership') });
write('content/pages/contact.json', text('contact'));
write('content/pages/spotlight.json', { heroImage: spotlight.heroImage, ...text('spotlight') });
write('content/pages/global.json', {
  footerPartners: footer.partners, footerSponsors: footer.sponsors, ...text('global'),
});

// Slim settings: membership pricing moved to pages/membership.json.
const { membership: _moved, ...slimSettings } = settings;
write('content/settings.json', slimSettings);

console.log('Wrote content/pages/*.json (10 files) and slimmed settings.json');
console.log('Now remove the superseded files:');
console.log('  git rm -r content/translations content/team content/hero.json content/partners.json \\');
console.log('    content/sponsors.json content/footer.json content/resources.json content/spotlight.json');
