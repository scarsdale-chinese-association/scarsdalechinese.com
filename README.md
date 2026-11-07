# scarsdalechinese.com

Website of the Scarsdale Chinese Association (SCA), built with [Astro](https://astro.build) and Tailwind CSS.
Static HTML, no CMS, no database: content lives in this repo as Markdown and JSON.

New to managing this site? Start with [`docs/HANDOFF.md`](docs/HANDOFF.md).

## Editing content

| What | Where |
|---|---|
| Events | `src/content/events/*.md` (one file per event; upcoming vs past is computed from `date`). Upcoming events get an RSVP form automatically unless `rsvpUrl` points to an external ticket page. RSVPs land in the `rsvp` tab of the Sheet. |
| Board members | `src/content/data/board.json` (`"avatar": "female"` or `"male"` picks the silhouette; add `"photo": "/board/<file>.jpg"` once headshots are in `public/board/`) |
| Sponsors | `src/content/data/sponsors.json` + image in `src/assets/sponsors/` |
| FAQ | `src/content/data/faq.json` |
| Contact info, price, Zelle | `src/lib/site.ts` (Chinese twins: `nameZh`, `addressZh`, `priceLabelZh`, `scheduleZh`, nav `labelZh`) |
| Page copy, buttons, form labels (English **and** Chinese) | `src/i18n/ui.ts`: one `en` block and one `zh` block with the same keys |
| Page layout | `src/pages/[...locale]/*.astro` (each file renders both `/…` and `/zh/…`) |
| Chinese version of an event | `src/content/events-zh/<same-slug>.md` (title, summary, Chinese body) |
| Chinese FAQ | `questionZh` / `answerZh` fields in `src/content/data/faq.json` |

### Languages

Every page exists in English (default, no prefix) and Simplified Chinese under `/zh/`. The header has a
toggle ("中文" / "English") that jumps to the same page in the other language. To change a Chinese
sentence, find its key in `src/i18n/ui.ts` and edit the `zh` value; to add a new string, add the key to
both blocks. `npm run build` fails if a key is missing from `zh`.

Push to `main` and the site deploys itself (GitHub Actions builds, Hostinger publishes the `deploy` branch).

## Local development

```bash
npm install
npm run dev
```

## Forms and payments

Forms post to a Google Apps Script that writes to the SCA Members Google Sheet and emails info@.
See [`scripts/apps-script/README.md`](scripts/apps-script/README.md). Payments use Stripe Payment Links
(`PUBLIC_STRIPE_MEMBERSHIP_LINK`, `PUBLIC_STRIPE_DONATE_LINK`) or Zelle.

Build-time variables are set in GitHub → Settings → Secrets and variables → Actions → Variables.
For local testing, copy `.env.example` to `.env`.
