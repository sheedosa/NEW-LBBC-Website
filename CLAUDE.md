# LBBC website — working notes

## UX rule
No UI change on taste alone. Each change names a published standard or a measurement taken on this site.

## 2026-11-19 — home page section links
Measured at 320, 390 and 1280px wide:
- "View all" links in the Members, Events, Partners and News headers were four different styles:
  10px grey text (15px tall) on two, 12–14px green text on one, and a white pill on Events.
- The Events pill had no label at all (`t.events.viewAll` did not exist), so the link had no
  accessible name (WCAG 2.4.4, 4.1.2).
- Tap targets were 15–16px tall; WCAG 2.5.8 asks for at least 24px, and 44px is the common target.

Changed: all four now use `src/components/SectionLink.tsx` — 14px brand green (#40774f, 5.4:1 on
white), 44px tall, same arrow. Events link reads "View All Events". The green buttons under the
Members and News sections now share one shape and are at least 44px tall.

Use `SectionLink` for any new section header link.

## 2026-11-19 — council logo ticker size
Owner's request: council member circles on the home page about 15–20% bigger.
Changed in `MemberDirectory` only: 96px → 112px on phones (+17%), 128px → 152px on desktop (+19%).
Animation time per logo scaled 2s → 2.35s so the scroll speed stays the same.
No horizontal overflow at 320, 390 or 1280px. The partners ticker is unchanged (still 96/128px).

## Waiting on the owner
- Arabic text for labels added in November 2026 (they show in English for now).
- Member data is a snapshot from 3 July 2026 (`public/data/members.json`); GlueUp blocks the scraper.
- Not yet tested with real users.
