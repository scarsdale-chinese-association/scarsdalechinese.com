# scarsdalechinese.com

Website of the Scarsdale Chinese Association (SCA), built with [Astro](https://astro.build) and Tailwind CSS.
Static HTML, no CMS, no database: content lives in this repo as Markdown and JSON.

## Editing content

| What | Where |
|---|---|
| Events | `src/content/events/*.md` (one file per event; upcoming vs past is computed from `date`) |
| Board members | `src/content/data/board.json` (add `"photo": "/board/<file>.jpg"` once headshots are in `public/board/`) |
| Sponsors | `src/content/data/sponsors.json` + image in `src/assets/sponsors/` |
| FAQ | `src/content/data/faq.json` |
| Contact info, price, Zelle | `src/lib/site.ts` |
| Page copy | `src/pages/*.astro` |

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
