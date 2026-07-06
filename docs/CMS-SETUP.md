# LBBC Website — Editor Handbook (Pages CMS)

The website is edited through **Pages CMS** — no coding needed. Every change you save goes
live on **https://lbbc.org.uk** in about a minute.

## Getting in
1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
2. Pick the **NEW-LBBC-Website** repository.
3. You'll see the sections listed below in the left sidebar.

> New editor? They need a free GitHub account, and the repo owner adds them under
> GitHub → repo → Settings → Collaborators (Write access). Then they sign in the same way.

## What each section edits (matches the website menu)

| Section | What's inside |
|---|---|
| 📰 **News & Articles** | Every news story — title, date, category, images, and the article text (rich editor). Add a new article with **Add entry**. |
| 🏠 **Home Page** | Hero slides (images + button links) and all home hero wording. |
| ℹ️ **About Page** | Leadership team, Board of Directors (photos + bios), partner logos, and all About wording. |
| 📅 **Events Page** | Sponsor logos and the page wording. *Event listings themselves update automatically from GlueUp.* |
| 🔎 **Directory Page** | Page wording only. *The member list updates automatically from GlueUp.* |
| 💼 **Membership Page** | Prices, apply links, tier descriptions, FAQs, and governance policies. |
| 📚 **Resources Page** | Downloadable guides/documents and the photo-album gallery. |
| ✉️ **Contact Page** | Contact page wording and form labels. |
| ⭐ **Member Spotlight** | The Capterio spotlight story and its image. |
| 📰 **News — Page Headings** | The small headings above news sections. |
| 🧭 **Menu & Footer** | Menu labels, footer wording, footer partner/sponsor logos. |
| ⚙️ **Site Settings** | Contact email & phones, social links, homepage statistics, search-engine defaults. |

Inside each page you'll find the pictures/lists first, then **🇬🇧 English Text**, then
**🇱🇾 Arabic Text (العربية)**. Edit both if the change should appear in both languages.

## Golden rules
- **Placeholders:** some sentences contain `{name}`, `{role}` or `{tab}` — leave those exactly
  as written; the website fills them in automatically.
- **Hero slides:** if you add or remove a slide on the Home Page, do it in the slides list AND
  in both English/Arabic "Hero → Slides" lists so the wording stays matched.
- **Images:** use the image picker to upload — files are stored with the website automatically.
- **Members & Events are automatic:** they sync daily from GlueUp and are deliberately not
  editable here. To change a member or event, change it in GlueUp.

## For developers
- Content lives in `content/` (per-page JSON + Markdown news). The app imports it at build time
  (`src/translations.ts`, `src/data/news.ts`, `src/config.ts`).
- The CMS sidebar is defined by `.pages.yml`, **generated** by `scripts/gen-pages-cms.mjs` —
  re-run it after changing content shapes (`npx tsx scripts/gen-pages-cms.mjs`).
- Saving in the CMS commits to `main` → `.github/workflows/deploy.yml` rebuilds and publishes.
  The GlueUp scraper (`scrape-glueup.yml`) writes only `public/data/` and rebases before pushing,
  so it never conflicts with CMS edits.
