// One-off migration: export in-code content into the new `content/` directory that
// Sveltia CMS edits. Run once with:  npx tsx scripts/export-content.mjs
// Safe to delete afterwards. Reads the CURRENT src/translations.ts and src/data/news.ts
// (run BEFORE those files are refactored into thin loaders).
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { translations } from '../src/translations.ts';
import { newsData } from '../src/data/news.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const C = (p) => path.join(root, 'content', p);

// Extract a `const NAME = [ ... \n  ];` array literal from a source file and eval it
// (guarantees exact bio text / special characters round-trip). The arrays end with a
// dedented `\n  ];`, which never appears inside the string contents.
const extractArray = (file, name) => {
  const src = readFileSync(path.join(root, file), 'utf8');
  const re = new RegExp(`const ${name}(?:: [^=]+)? = (\\[[\\s\\S]*?\\n  \\]);`);
  const m = re.exec(src);
  if (!m) throw new Error(`Could not extract ${name} from ${file}`);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${m[1]}`)();
};

// --- Bilingual UI copy → content/translations/{en,ar}.json (byte-structure preserved) ---
mkdirSync(C('translations'), { recursive: true });
writeFileSync(C('translations/en.json'), JSON.stringify(translations.en, null, 2) + '\n');
writeFileSync(C('translations/ar.json'), JSON.stringify(translations.ar, null, 2) + '\n');

// --- News → content/news/<id>.md (frontmatter + markdown body) ---
mkdirSync(C('news'), { recursive: true });
const toIso = (d) => new Date(d + ' UTC').toISOString().slice(0, 10); // 'JUNE 17, 2026' -> '2026-06-17'
for (const n of newsData) {
  const fm = { title: n.title, date: toIso(n.date), category: n.category, image: n.image };
  if (n.imageContain) fm.imageContain = true;
  if (n.headerImage) fm.headerImage = n.headerImage;
  const front = yaml.dump(fm, { lineWidth: -1, quotingType: '"' }).trimEnd();
  writeFileSync(C(`news/${n.id}.md`), `---\n${front}\n---\n\n${n.content.trim()}\n`);
}

// --- Team + partners (long bios): extract exact literals from AboutPage.tsx ---
mkdirSync(C('team'), { recursive: true });
const leadership = extractArray('src/pages/AboutPage.tsx', 'leadership');
const board = extractArray('src/pages/AboutPage.tsx', 'board');
const partners = extractArray('src/pages/AboutPage.tsx', 'partners');
writeFileSync(C('team/leadership.json'), JSON.stringify({ people: leadership }, null, 2) + '\n');
writeFileSync(C('team/board.json'), JSON.stringify({ people: board }, null, 2) + '\n');
writeFileSync(C('partners.json'), JSON.stringify({ items: partners }, null, 2) + '\n');

console.log(
  `Exported translations (en/ar), ${newsData.length} news articles, ` +
  `${leadership.length} leadership, ${board.length} board, ${partners.length} partners to content/`
);
