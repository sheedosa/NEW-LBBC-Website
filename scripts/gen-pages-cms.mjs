// Generates .pages.yml for Pages CMS (https://pagescms.org).
// The sidebar mirrors the WEBSITE layout: one entry per page, containing that page's
// images/lists first, then its English text and Arabic text. Text field schemas are DERIVED
// from each page file's `en` subtree so every key is represented (no keys drop on save).
// Re-run after changing content shapes:  npx tsx scripts/gen-pages-cms.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = (name) => JSON.parse(readFileSync(path.join(root, `content/pages/${name}.json`), 'utf8'));

const humanize = (k) =>
  k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase());
const multiline = (s) => s.includes('\n') || s.length > 90;

// Derive a Pages CMS field definition from a sample value.
function genField(key, val) {
  const label = humanize(key);
  if (typeof val === 'string') {
    const f = { name: key, label, type: multiline(val) ? 'text' : 'string' };
    if (val.includes('{') && val.includes('}')) f.description = 'Keep the {…} placeholders exactly as written.';
    return f;
  }
  if (typeof val === 'number') return { name: key, label, type: 'number' };
  if (typeof val === 'boolean') return { name: key, label, type: 'boolean' };
  if (Array.isArray(val)) {
    if (val.length === 0 || typeof val[0] === 'string') return { name: key, label, type: 'string', list: true };
    return { name: key, label, type: 'object', list: true, fields: Object.entries(val[0]).map(([k, v]) => genField(k, v)) };
  }
  if (val && typeof val === 'object') return { name: key, label, type: 'object', fields: Object.entries(val).map(([k, v]) => genField(k, v)) };
  return { name: key, label, type: 'string' };
}

// The bilingual text pair for a page — derived from its actual `en` content.
const textFields = (pageName) => {
  const data = page(pageName);
  const fields = Object.entries(data.en).map(([k, v]) => genField(k, v));
  return [
    { name: 'en', label: '🇬🇧 English Text', type: 'object', fields },
    { name: 'ar', label: '🇱🇾 Arabic Text (العربية)', type: 'object', fields },
  ];
};

const people = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'role', label: 'Role', type: 'string' },
  { name: 'image', label: 'Photo', type: 'image' },
  { name: 'bio', label: 'Biography', type: 'text' },
];
const logoLink = [
  { name: 'name', label: 'Name', type: 'string' },
  { name: 'url', label: 'Website URL', type: 'string' },
  { name: 'logo', label: 'Logo (PNG)', type: 'image' },
  { name: 'logoWebp', label: 'Logo (WebP)', type: 'image' },
];

const pageEntry = (fileName, label, structuredFields = [], description, entryName = fileName) => ({
  name: entryName,
  label,
  type: 'file',
  path: `content/pages/${fileName}.json`,
  ...(description ? { description } : {}),
  fields: [...structuredFields, ...textFields(fileName)],
});

const config = {
  media: { input: 'public/images', output: '/images' },
  content: [
    {
      name: 'news',
      label: '📰 News & Articles',
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
    pageEntry('home', '🏠 Home Page', [
      { name: 'slides', label: 'Hero Slides (images & buttons)', type: 'object', list: true,
        description: 'Slide wording is below under English/Arabic Text → Hero → Slides (keep the same order).',
        fields: [
          { name: 'image', label: 'Image (PNG)', type: 'image' },
          { name: 'imageWebp', label: 'Image (WebP)', type: 'image' },
          { name: 'objectPosition', label: 'Image Position (optional)', type: 'string' },
          { name: 'link1', label: 'Primary Button Link', type: 'string' },
          { name: 'link2', label: 'Secondary Button Link', type: 'string' },
        ] },
    ]),
    pageEntry('about', 'ℹ️ About Page', [
      { name: 'leadership', label: 'Leadership Team', type: 'object', list: true, fields: people },
      { name: 'board', label: 'Board of Directors', type: 'object', list: true, fields: people },
      { name: 'partners', label: 'Partner Logos', type: 'object', list: true, fields: [
        { name: 'name', label: 'Name', type: 'string' },
        { name: 'logo', label: 'Logo', type: 'image' },
        { name: 'url', label: 'Website URL', type: 'string' },
      ] },
    ]),
    pageEntry('events', '📅 Events Page', [
      { name: 'sponsors', label: 'Sponsor Logos', type: 'object', list: true, fields: [
        { name: 'src', label: 'Logo', type: 'image' },
        { name: 'alt', label: 'Name', type: 'string' },
      ] },
    ], 'Event listings sync automatically from GlueUp — only the page wording and sponsors are edited here.'),
    pageEntry('directory', '🔎 Directory Page', [],
      'The member list syncs automatically from GlueUp — only the page wording is edited here.'),
    pageEntry('membership', '💼 Membership Page', [
      { name: 'pricing', label: 'Prices & Apply Links', type: 'object', fields: [
        { name: 'councilUk', label: 'Council price (UK)', type: 'string' },
        { name: 'councilLibya', label: 'Council price (Libya)', type: 'string' },
        { name: 'corporateUk', label: 'Corporate price (UK)', type: 'string' },
        { name: 'corporateLibya', label: 'Corporate price (Libya)', type: 'string' },
        { name: 'soleTrader', label: 'Sole Trader price', type: 'string' },
        { name: 'applyCouncilUk', label: 'Apply link — Council (UK)', type: 'string' },
        { name: 'applyCouncilLibya', label: 'Apply link — Council (Libya)', type: 'string' },
        { name: 'applyCorporateUk', label: 'Apply link — Corporate (UK)', type: 'string' },
        { name: 'applyCorporateLibya', label: 'Apply link — Corporate (Libya)', type: 'string' },
        { name: 'applySoleTrader', label: 'Apply link — Sole Trader', type: 'string' },
      ] },
    ]),
    pageEntry('resources', '📚 Resources Page', [
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
    ]),
    pageEntry('contact', '✉️ Contact Page'),
    pageEntry('spotlight', '⭐ Member Spotlight', [
      { name: 'heroImage', label: 'Hero Image', type: 'image' },
    ]),
    pageEntry('news', '📰 News — Page Headings', [], undefined, 'news-headings'),
    pageEntry('global', '🧭 Menu & Footer', [
      { name: 'footerPartners', label: 'Footer Partner Logos', type: 'object', list: true, fields: logoLink },
      { name: 'footerSponsors', label: 'Footer Sponsor Logos', type: 'object', list: true, fields: logoLink },
    ]),
    {
      name: 'settings',
      label: '⚙️ Site Settings',
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
  ],
};

const header =
  '# AUTO-GENERATED by scripts/gen-pages-cms.mjs — do not edit by hand.\n' +
  '# Re-run: npx tsx scripts/gen-pages-cms.mjs\n' +
  '# Sidebar mirrors the website layout. GlueUp members/events are NOT editable here.\n';

writeFileSync(path.join(root, '.pages.yml'), header + yaml.dump(config, { lineWidth: -1, noRefs: false }));
console.log('Wrote .pages.yml');
