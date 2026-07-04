// News articles now live as editable Markdown files under content/news/ (managed by the CMS).
// This loader rebuilds the original `newsData` array shape (including the display date format
// like "JUNE 17, 2026") so every consumer keeps importing `newsData` unchanged.
import yaml from 'js-yaml';

export interface NewsItem {
  id: string;
  image: string;
  category: string;
  title: string;
  date: string;
  content: string;
  imageContain?: boolean;
  headerImage?: string;
}

const files = import.meta.glob('/content/news/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const toDisplay = (d: Date) =>
  d
    .toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();

const parse = (path: string, raw: string): NewsItem & { _iso: string } => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  const fm = (m ? yaml.load(m[1]) : {}) as Record<string, any>;
  const body = (m ? m[2] : raw).trim();
  const dateVal = fm.date instanceof Date ? fm.date : new Date(`${fm.date}T00:00:00Z`);
  const id = path.split('/').pop()!.replace(/\.md$/, '');
  const item: NewsItem & { _iso: string } = {
    id,
    image: fm.image,
    category: fm.category,
    title: fm.title,
    date: toDisplay(dateVal),
    content: body,
    _iso: dateVal.toISOString().slice(0, 10),
  };
  if (fm.imageContain) item.imageContain = true;
  if (fm.headerImage) item.headerImage = fm.headerImage;
  return item;
};

export const newsData: NewsItem[] = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => (a._iso < b._iso ? 1 : a._iso > b._iso ? -1 : 0))
  .map(({ _iso, ...rest }) => rest);
