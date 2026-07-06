// UI copy lives in per-page JSON files under content/pages/ (managed by the CMS — each file
// holds one page's structured data plus its bilingual text as `en`/`ar` objects).
// This module reassembles the original `translations[language]` tree so LanguageContext and
// every `t.section.key` consumer keep working unchanged. Sections are disjoint across pages.
import home from '../content/pages/home.json';
import about from '../content/pages/about.json';
import events from '../content/pages/events.json';
import directory from '../content/pages/directory.json';
import news from '../content/pages/news.json';
import resources from '../content/pages/resources.json';
import membership from '../content/pages/membership.json';
import contact from '../content/pages/contact.json';
import spotlight from '../content/pages/spotlight.json';
import global from '../content/pages/global.json';

const pages = [home, about, events, directory, news, resources, membership, contact, spotlight, global];

const merge = (lang: 'en' | 'ar') =>
  Object.assign({}, ...pages.map((p) => (p as Record<string, unknown>)[lang]));

export const translations = { en: merge('en'), ar: merge('ar') };
