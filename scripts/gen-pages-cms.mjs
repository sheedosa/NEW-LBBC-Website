// Generates .pages.yml for Pages CMS (https://pagescms.org).
// The bilingual UI-copy schema is DERIVED from content/translations/en.json so every key is
// represented (a partial schema could drop un-configured keys on save). Structured collections
// are defined explicitly. Re-run after changing content shapes:
//   npx tsx scripts/gen-pages-cms.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(readFileSync(path.join(root, 'content/translations/en.json'), 'utf8'));

const humanize = (k) =>
  k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase());
const multiline = (s) => s.includes('\n') || s.length > 90;

// Recursively derive a Pages CMS field definition from a sample value.
function genField(key, val) {
  const label = humanize(key);
  if (typeof val === 'string') return { name: key, label, type: multiline(val) ? 'text' : 'string' };
  if (typeof val === 'number') return { name: key, label, type: 'number' };
  if (typeof val === 'boolean') return { name: key, label, type: 'boolean' };
  if (Array.isArray(val)) {
    if (val.length === 0) return { name: key, label, type: 'string', list: true };
    if (typeof val[0] === 'string') return { name: key, label, type: 'string', list: true };
    return { name: key, label, type: 'object', list: true, fields: Object.entries(val[0]).map(([k, v]) => genField(k, v)) };
  }
  if (val && typeof val === 'object') return { name: key, label, type: 'object', fields: Object.entries(val).map(([k, v]) => genField(k, v)) };
  return { name: key, label, type: 'string' };
}

const translationsFields = Object.entries(en).map(([k, v]) => genField(k, v));

const people = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'role', label: 'Role', type: 'string' },
  { name: 'image', label: 'Photo', type: 'image' },
  { name: 'bio', label: 'Biography', type: 'text' },
];
const logo4 = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'url', label: 'Website URL', type: 'string' },
  { name: 'logo', label: 'Logo (PNG)', type: 'image' },
  { name: 'logoWebp', label: 'Logo (WebP)', type: 'image' },
];

const config = {
  media: { input: 'public/images', output: '/images' },
  content: [
    {
      name: 'news',
      label: 'News & Insights',
      type: 'collection',
      path: 'content/news',
      filename: '{fields.title}.md',
      view: { fields: ['title', 'date', 'category'], primary: 'title', sort: ['date'] },
      fields: [
        { name: 'title', label: 'Title', type: 'string' },
        { name: 'date', label: 'Date', type: 'date', options: { format: 'yyyy-MM-dd' } },
        { name: 'category', label: 'Category', type: 'string', description: 'e.g. TRAVEL, ENERGY, PARTNERSHIPS, CSR' },
        { name: 'image', label: 'Main Image', type: 'image' },
        { name: 'imageContain', label: 'Fit image inside frame', type: 'boolean' },
        { name: 'headerImage', label: 'Header Image (optional)', type: 'image' },
        { name: 'body', label: 'Article Body', type: 'rich-text' },
      ],
    },
    { name: 'translations-en', label: 'Website Text — English', type: 'file', path: 'content/translations/en.json', fields: translationsFields },
    { name: 'translations-ar', label: 'Website Text — Arabic', type: 'file', path: 'content/translations/ar.json', fields: translationsFields },
    { name: 'team-leadership', label: 'Team — Leadership', type: 'file', path: 'content/team/leadership.json', fields: [{ name: 'people', label: 'People', type: 'object', list: true, fields: people }] },
    { name: 'team-board', label: 'Team — Board of Directors', type: 'file', path: 'content/team/board.json', fields: [{ name: 'people', label: 'Directors', type: 'object', list: true, fields: people }] },
    {
      name: 'settings',
      label: 'Site Settings',
      type: 'file',
      path: 'content/settings.json',
      fields: [
        { name: 'email', label: 'Contact Email', type: 'string' },
        { name: 'phone', label: 'Main Phone (header/footer)', type: 'string' },
        { name: 'phoneContact', label: 'Contact Page Phone', type: 'string' },
        { name: 'social', label: 'Social Links', type: 'object', fields: [
          { name: 'linkedin', label: 'LinkedIn', type: 'string' },
          { name: 'x', label: 'X (Twitter)', type: 'string' },
          { name: 'facebook', label: 'Facebook', type: 'string' },
        ] },
        { name: 'glueup', label: 'GlueUp Links', type: 'object', fields: [
          { name: 'home', label: 'Member Home', type: 'string' },
          { name: 'login', label: 'Login', type: 'string' },
        ] },
        { name: 'membership', label: 'Membership Prices & Apply Links', type: 'object', fields: [
          { name: 'councilUk', label: 'Council price (UK)', type: 'string' },
          { name: 'councilLibya', label: 'Council price (Libya)', type: 'string' },
          { name: 'corporateUk', label: 'Corporate price (UK)', type: 'string' },
          { name: 'corporateLibya', label: 'Corporate price (Libya)', type: 'string' },
          { name: 'soleTrader', label: 'Sole Trader price', type: 'string' },
          { name: 'applyCouncilUk', label: 'Apply — Council (UK)', type: 'string' },
          { name: 'applyCouncilLibya', label: 'Apply — Council (Libya)', type: 'string' },
          { name: 'applyCorporateUk', label: 'Apply — Corporate (UK)', type: 'string' },
          { name: 'applyCorporateLibya', label: 'Apply — Corporate (Libya)', type: 'string' },
          { name: 'applySoleTrader', label: 'Apply — Sole Trader', type: 'string' },
        ] },
        { name: 'stats', label: 'Homepage Stats', type: 'object', fields: [
          { name: 'years', label: 'Years', type: 'string' },
          { name: 'members', label: 'Members', type: 'string' },
          { name: 'network', label: 'Network', type: 'string' },
        ] },
        { name: 'seo', label: 'SEO Defaults', type: 'object', fields: [
          { name: 'defaultDescription', label: 'Default Description', type: 'text' },
          { name: 'defaultOgImage', label: 'Default Share Image', type: 'image' },
        ] },
        { name: 'web3formsKey', label: 'Contact Form Key (Web3Forms)', type: 'string' },
        { name: 'elfsightAppId', label: 'LinkedIn Feed App ID (Elfsight)', type: 'string' },
      ],
    },
    { name: 'partners', label: 'Partners (About page)', type: 'file', path: 'content/partners.json', fields: [{ name: 'items', label: 'Partners', type: 'object', list: true, fields: [
      { name: 'name', label: 'Name', type: 'string' },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'url', label: 'Website URL', type: 'string' },
    ] }] },
    { name: 'sponsors', label: 'Event Sponsors', type: 'file', path: 'content/sponsors.json', fields: [{ name: 'events', label: 'Sponsors', type: 'object', list: true, fields: [
      { name: 'src', label: 'Logo', type: 'image' },
      { name: 'alt', label: 'Name', type: 'string' },
    ] }] },
    { name: 'footer', label: 'Footer Logos', type: 'file', path: 'content/footer.json', fields: [
      { name: 'partners', label: 'Partners', type: 'object', list: true, fields: logo4 },
      { name: 'sponsors', label: 'Sponsors', type: 'object', list: true, fields: logo4 },
    ] },
    { name: 'resources', label: 'Resources & Gallery', type: 'file', path: 'content/resources.json', fields: [
      { name: 'documents', label: 'Documents / Guides', type: 'object', list: true, fields: [
        { name: 'id', label: 'ID', type: 'number' },
        { name: 'type', label: 'Type (pdf or link)', type: 'string' },
        { name: 'title', label: 'Title', type: 'string' },
        { name: 'category', label: 'Category', type: 'string' },
        { name: 'href', label: 'Link or File', type: 'string' },
        { name: 'btnLabel', label: 'Button Label', type: 'string' },
        { name: 'cover', label: 'Cover Image', type: 'image' },
        { name: 'logo', label: 'Logo', type: 'image' },
      ] },
      { name: 'albums', label: 'Media Gallery Albums', type: 'object', list: true, fields: [
        { name: 'href', label: 'Album Link', type: 'string' },
        { name: 'img', label: 'Thumbnail URL', type: 'string' },
        { name: 'title', label: 'Title', type: 'string' },
        { name: 'label', label: 'Label', type: 'string' },
      ] },
    ] },
    { name: 'hero', label: 'Homepage Hero', type: 'file', path: 'content/hero.json', fields: [{ name: 'slides', label: 'Slides', type: 'object', list: true, description: 'Slide text (title/subtitle/buttons) is under Website Text → hero.', fields: [
      { name: 'image', label: 'Image (PNG)', type: 'image' },
      { name: 'imageWebp', label: 'Image (WebP)', type: 'image' },
      { name: 'objectPosition', label: 'Image Position (optional)', type: 'string' },
      { name: 'link1', label: 'Primary Button Link', type: 'string' },
      { name: 'link2', label: 'Secondary Button Link', type: 'string' },
    ] }] },
    { name: 'spotlight', label: 'Spotlight', type: 'file', path: 'content/spotlight.json', fields: [
      { name: 'heroImage', label: 'Hero Image', type: 'image', description: 'Article text is under Website Text → featured → fullStory.' },
    ] },
  ],
};

const header =
  '# AUTO-GENERATED by scripts/gen-pages-cms.mjs — do not edit by hand.\n' +
  '# Re-run: npx tsx scripts/gen-pages-cms.mjs\n' +
  '# Pages CMS config (https://pagescms.org). GlueUp members/events are NOT editable here.\n';

writeFileSync(path.join(root, '.pages.yml'), header + yaml.dump(config, { lineWidth: -1, noRefs: false }));
console.log('Wrote .pages.yml');
