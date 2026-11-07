# Notes for AI agents and contributors

- Astro 7 static site, Tailwind v4 (tokens in `src/styles/global.css` under `@theme`), content collections in `src/content.config.ts`.
- Site-wide facts (email, phone, address, membership price, Zelle details, nav) live in `src/lib/site.ts`. Change them there only.
- Forms: every `<form data-sca-form="…">` is handled by `src/components/FormScript.astro`, which posts JSON to the Apps Script endpoint. Keep the honeypot `_gotcha` field.
- Images go in `src/assets/` and are rendered with `<Image>` from `astro:assets` so they are resized and converted at build time. Only put files in `public/` when they must keep their exact bytes (favicon, .htaccess, board headshots).
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds and force-pushes `dist/` to the `deploy` branch, which Hostinger publishes. Never edit the `deploy` branch by hand.
- Run `npm run build` before committing; it type-checks content frontmatter against the schemas.
