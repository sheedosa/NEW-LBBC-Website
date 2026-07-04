// Generates public/admin/config.yml for Sveltia CMS.
// The bilingual UI-copy schema is DERIVED from content/translations/en.json so every key is
// represented (a partial schema would make the CMS drop un-configured keys on save).
// Structured collections are defined explicitly below. Re-run after changing content shapes:
//   npx tsx scripts/gen-cms-config.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(readFileSync(path.join(root, 'content/translations/en.json'), 'utf8'));

const humanize = (k) =>
  k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase());
const multiline = (s) => s.includes('\n') || s.length > 90;

// Recursively derive a Sveltia field definition from a sample value.
function genField(key, val) {
  const label = humanize(key);
  if (typeof val === 'string') {
    const f = { name: key, label, widget: multiline(val) ? 'text' : 'string', required: false };
    if (val.includes('{') && val.includes('}')) f.hint = 'Keep the {…} placeholders exactly as written.';
    return f;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return { name: key, label, widget: 'list', required: false };
    if (typeof val[0] === 'string')
      return { name: key, label, widget: 'list', required: false, field: { name: 'item', label: 'Item', widget: 'string' } };
    return { name: key, label, widget: 'list', required: false, fields: Object.entries(val[0]).map(([k, v]) => genField(k, v)) };
  }
  if (val && typeof val === 'object')
    return { name: key, label, widget: 'object', required: false, fields: Object.entries(val).map(([k, v]) => genField(k, v)) };
  return { name: key, label, widget: 'string', required: false };
}

const translationsFields = Object.entries(en).map(([k, v]) => genField(k, v));

// Reusable field groups for structured collections
const people = [
  { name: 'name', label: 'Name', widget: 'string' },
  { name: 'role', label: 'Role', widget: 'string' },
  { name: 'image', label: 'Photo', widget: 'image' },
  { name: 'bio', label: 'Biography', widget: 'text' },
];
const logo4 = [
  { name: 'name', label: 'Name', widget: 'string' },
  { name: 'url', label: 'Website URL', widget: 'string' },
  { name: 'logo', label: 'Logo (PNG)', widget: 'image' },
  { name: 'logoWebp', label: 'Logo (WebP)', widget: 'image' },
];

const config = {
  backend: {
    name: 'github',
    repo: 'sheedosa/NEW-LBBC-Website',
    branch: 'main',
    // Replace with your deployed sveltia-cms-auth Worker origin (see docs/CMS-SETUP.md).
    base_url: 'https://REPLACE-WITH-YOUR-AUTH-WORKER.workers.dev',
  },
  site_url: 'https://lbbc.org.uk',
  media_folder: 'public/images',
  public_folder: '/images',
  collections: [
    {
      name: 'news',
      label: 'News & Insights',
      label_singular: 'Article',
      folder: 'content/news',
      create: true,
      slug: '{{slug}}',
      extension: 'md',
      format: 'frontmatter',
      identifier_field: 'title',
      summary: '{{title}} — {{date}}',
      sortable_fields: ['date', 'title'],
      fields: [
        { name: 'title', label: 'Title', widget: 'string' },
        { name: 'date', label: 'Date', widget: 'datetime', date_format: 'YYYY-MM-DD', time_format: false, picker_utc: true },
        { name: 'category', label: 'Category', widget: 'string', hint: 'e.g. TRAVEL, ENERGY, PARTNERSHIPS, CSR' },
        { name: 'image', label: 'Main Image', widget: 'image' },
        { name: 'imageContain', label: 'Fit image inside frame (contain)', widget: 'boolean', required: false, default: false },
        { name: 'headerImage', label: 'Header Image (optional)', widget: 'image', required: false },
        { name: 'body', label: 'Article Body', widget: 'markdown' },
      ],
    },
    {
      name: 'translations',
      label: 'Website Text (English & Arabic)',
      files: [
        { name: 'en', label: 'English Website Text', file: 'content/translations/en.json', fields: translationsFields },
        { name: 'ar', label: 'Arabic Website Text', file: 'content/translations/ar.json', fields: translationsFields },
      ],
    },
    {
      name: 'team',
      label: 'Team',
      files: [
        { name: 'leadership', label: 'Leadership', file: 'content/team/leadership.json', fields: [{ name: 'people', label: 'People', widget: 'list', fields: people }] },
        { name: 'board', label: 'Board of Directors', file: 'content/team/board.json', fields: [{ name: 'people', label: 'Directors', widget: 'list', fields: people }] },
      ],
    },
    {
      name: 'settings',
      label: 'Site Settings',
      files: [
        {
          name: 'global',
          label: 'Global Settings',
          file: 'content/settings.json',
          fields: [
            { name: 'email', label: 'Contact Email', widget: 'string' },
            { name: 'phone', label: 'Main Phone (header/footer)', widget: 'string' },
            { name: 'phoneContact', label: 'Contact Page Phone', widget: 'string' },
            { name: 'social', label: 'Social Links', widget: 'object', fields: [
              { name: 'linkedin', label: 'LinkedIn', widget: 'string' },
              { name: 'x', label: 'X (Twitter)', widget: 'string' },
              { name: 'facebook', label: 'Facebook', widget: 'string' },
            ] },
            { name: 'glueup', label: 'GlueUp Links', widget: 'object', fields: [
              { name: 'home', label: 'Member Home', widget: 'string' },
              { name: 'login', label: 'Login', widget: 'string' },
            ] },
            { name: 'membership', label: 'Membership Prices & Apply Links', widget: 'object', fields: [
              { name: 'councilUk', label: 'Council price (UK)', widget: 'string' },
              { name: 'councilLibya', label: 'Council price (Libya)', widget: 'string' },
              { name: 'corporateUk', label: 'Corporate price (UK)', widget: 'string' },
              { name: 'corporateLibya', label: 'Corporate price (Libya)', widget: 'string' },
              { name: 'soleTrader', label: 'Sole Trader price', widget: 'string' },
              { name: 'applyCouncilUk', label: 'Apply — Council (UK)', widget: 'string' },
              { name: 'applyCouncilLibya', label: 'Apply — Council (Libya)', widget: 'string' },
              { name: 'applyCorporateUk', label: 'Apply — Corporate (UK)', widget: 'string' },
              { name: 'applyCorporateLibya', label: 'Apply — Corporate (Libya)', widget: 'string' },
              { name: 'applySoleTrader', label: 'Apply — Sole Trader', widget: 'string' },
            ] },
            { name: 'stats', label: 'Homepage Stats', widget: 'object', fields: [
              { name: 'years', label: 'Years', widget: 'string' },
              { name: 'members', label: 'Members', widget: 'string' },
              { name: 'network', label: 'Network', widget: 'string' },
            ] },
            { name: 'seo', label: 'SEO Defaults', widget: 'object', fields: [
              { name: 'defaultDescription', label: 'Default Description', widget: 'text' },
              { name: 'defaultOgImage', label: 'Default Share Image', widget: 'image' },
            ] },
            { name: 'web3formsKey', label: 'Contact Form Key (Web3Forms)', widget: 'string' },
            { name: 'elfsightAppId', label: 'LinkedIn Feed App ID (Elfsight)', widget: 'string' },
          ],
        },
      ],
    },
    {
      name: 'partners',
      label: 'Partners (About page)',
      files: [{ name: 'partners', label: 'Strategic Partners', file: 'content/partners.json', fields: [{ name: 'items', label: 'Partners', widget: 'list', fields: [
        { name: 'name', label: 'Name', widget: 'string' },
        { name: 'logo', label: 'Logo', widget: 'image' },
        { name: 'url', label: 'Website URL', widget: 'string' },
      ] }] }],
    },
    {
      name: 'sponsors',
      label: 'Event Sponsors',
      files: [{ name: 'events', label: 'Event Sponsor Logos', file: 'content/sponsors.json', fields: [{ name: 'events', label: 'Sponsors', widget: 'list', fields: [
        { name: 'src', label: 'Logo', widget: 'image' },
        { name: 'alt', label: 'Name', widget: 'string' },
      ] }] }],
    },
    {
      name: 'footer',
      label: 'Footer Logos',
      files: [{ name: 'footer', label: 'Footer Partner & Sponsor Logos', file: 'content/footer.json', fields: [
        { name: 'partners', label: 'Partners', widget: 'list', fields: logo4 },
        { name: 'sponsors', label: 'Sponsors', widget: 'list', fields: logo4 },
      ] }],
    },
    {
      name: 'resources',
      label: 'Resources & Gallery',
      files: [{ name: 'resources', label: 'Documents & Albums', file: 'content/resources.json', fields: [
        { name: 'documents', label: 'Documents / Guides', widget: 'list', fields: [
          { name: 'id', label: 'ID', widget: 'number', value_type: 'int' },
          { name: 'type', label: 'Type', widget: 'select', options: ['pdf', 'link'], required: false },
          { name: 'title', label: 'Title', widget: 'string' },
          { name: 'category', label: 'Category', widget: 'string' },
          { name: 'href', label: 'Link or File', widget: 'string', required: false },
          { name: 'btnLabel', label: 'Button Label', widget: 'string', required: false },
          { name: 'cover', label: 'Cover Image', widget: 'image', required: false },
          { name: 'logo', label: 'Logo', widget: 'image', required: false },
        ] },
        { name: 'albums', label: 'Media Gallery Albums', widget: 'list', fields: [
          { name: 'href', label: 'Album Link', widget: 'string' },
          { name: 'img', label: 'Thumbnail URL', widget: 'string' },
          { name: 'title', label: 'Title', widget: 'string' },
          { name: 'label', label: 'Label', widget: 'string' },
        ] },
      ] }],
    },
    {
      name: 'hero',
      label: 'Homepage Hero',
      files: [{ name: 'hero', label: 'Hero Slides', file: 'content/hero.json', fields: [{ name: 'slides', label: 'Slides', widget: 'list', hint: 'Slide text (title/subtitle/buttons) is edited under Website Text → hero.', fields: [
        { name: 'image', label: 'Image (PNG)', widget: 'image' },
        { name: 'imageWebp', label: 'Image (WebP)', widget: 'image' },
        { name: 'objectPosition', label: 'Image Position (optional)', widget: 'string', required: false },
        { name: 'link1', label: 'Primary Button Link', widget: 'string' },
        { name: 'link2', label: 'Secondary Button Link', widget: 'string' },
      ] }] }],
    },
    {
      name: 'spotlight',
      label: 'Spotlight',
      files: [{ name: 'spotlight', label: 'Capterio Spotlight', file: 'content/spotlight.json', fields: [
        { name: 'heroImage', label: 'Hero Image', widget: 'image', hint: 'Article text is edited under Website Text → featured → fullStory.' },
      ] }],
    },
  ],
};

const header =
  '# AUTO-GENERATED by scripts/gen-cms-config.mjs — do not edit by hand.\n' +
  '# Re-run: npx tsx scripts/gen-cms-config.mjs\n' +
  '# GlueUp-driven data (members/events) is intentionally NOT editable here.\n';

mkdirSync(path.join(root, 'public/admin'), { recursive: true });
writeFileSync(
  path.join(root, 'public/admin/config.yml'),
  header + yaml.dump(config, { lineWidth: -1, noRefs: false })
);
console.log('Wrote public/admin/config.yml');
