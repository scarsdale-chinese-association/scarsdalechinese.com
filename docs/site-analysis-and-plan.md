# Scarsdale Chinese Association — site analysis and rebuild plan

Date: 2026-11-06. Status: proposal, awaiting board/owner decisions (see section 6).

## 1. What the live site is today

Host: Hostinger. Stack: WordPress + Hello Elementor child theme + Elementor Pro.

Public pages (from the WP REST API and sitemap):

| Page | URL | Notes |
|---|---|---|
| Home | / | Hero, membership (2 disconnected forms), About, sponsors, board, contact |
| SCA Events | /events-2/ | One upcoming event (Nov 21 2025 coffee morning), 3 past posts |
| SCA Sponsors | /sponsors/ | Sponsor flyers, donation form (Stripe/Zelle), sponsor contact form, FAQ |
| SCA Senior Club | /senior-club/ | Tuesday club info, Village of Scarsdale registration, FAQ |
| SCA Events_old | /events_old/ | Stale duplicate, still public, has dummy testimonials |
| 3 blog posts | /scarsdale-chinese-spring-festival-gala-2024/ etc. | Jan–Feb 2024, open comment forms, template tags "Outfit, Shopping, Streetstyle" |

Plugins doing real work: Constant Contact Forms (membership step 1), WP Simple Pay Pro (Stripe step 2 and sponsor donations), Contact Form 7 (contact + sponsor contact), The Events Calendar + Event Tickets (installed, 0 events in it), Yoast, MonsterInsights (GA), Team Member addon, ElementsKit, a ZH-CN/EN translate widget.

Brand as built: red #C00000, cream #F9EFE1, gold #F2B400 / #FFBC7D, black; fonts Quicksand (headings + body), some Roboto/Poppins. Logo is a text wordmark; there is a decorative SVG border (fvg.svg) and Chinese knot/lantern PNG ornaments.

### Problems found
1. Membership price is inconsistent: Stripe plan says "$35.00 every 1 year", button says "Pay $35.00", the text says "Total Amount $40.00", Zelle says $40. New price is $40.
2. Membership is two unrelated forms: a Constant Contact newsletter form ("Step 1") and a Stripe form ("Step 2"). Nothing links them, so there is no member roster.
3. Zelle email is scarsdalechinese@yahoo.com; site contact is info@scarsdalechinese.com. Footer phone is (703)-798-7886 and the address line is in Chinese only.
4. Board section shows 9 real names but generic male/female avatar placeholders (uploaded Nov 2026).
5. Several section images are AI-generated stock (file names like gathering_of_chinese_people_in_scarsdale…png) although the media library has plenty of real event photos.
6. "Top sponsors" are full-page flyers at different sizes, not logos.
7. events_old page, the 3 blog posts with comment forms, and template tags are still public.
8. Hero "Learn More" button and the FAQ on Senior Club reference "$30 family fee" (old).
9. Events Calendar plugin is loaded on every page but holds no events (weight for nothing).
10. The translate widget is machine translation. The FAQ content on sponsors/senior pages is Chinese-only.

## 2. What the Figma has today

File: Scarsdale-Chinese-Association (kwew0QXFaDx4rCYSWhaP9F). Page 1 has a "01 · Website pages" section with four 1440-wide desktop frames (Home, Events, Sponsorship, Senior Club) and a "02 · Membership payment" section with a "Pay via Zelle" state. An "Archives" page holds a superseded past-events strip. No mobile frames. No components or variables.

### Drift between Figma and live
| Topic | Figma | Live | Proposed |
|---|---|---|---|
| Membership fee | $30.99/yr | $35 / $40 mixed | $40/yr |
| Membership form | One form (name, email, WeChat, address) then Stripe/Zelle toggle | Two unrelated forms | Figma's one-form flow, add phone + family members |
| Board | Placeholder names (Kim Smith…) | 9 real names, placeholder photos | Real names, real headshots |
| Home sections | Testimonials, Google review QR | Neither exists | Drop testimonials (fake), keep a small "Leave a Google review" block only if the QR is real |
| Events page | FAQ (WeChat group rules) + past events | Upcoming + past | Upcoming + past + FAQ moved to a Join/Membership page |
| Senior Club hero | Copy of Events hero | Weekly club info | Club info (live is right) |
| Footer | P.O. Box 87107, (505) 237-9833, yahoo email | P.O. Box 172, (703) 798-7886, info@ | Confirm correct box, phone, email |
| Sponsors | Logo grid + flyer carousel | Flyers only | Tiered: top sponsors large, others grid, all cropped to one aspect |
| Mobile | none | Elementor responsive | Add 390-wide frames for every page |

## 3. Proposed architecture

- **Astro (static output) + Tailwind**, content as collections: `events/*.md`, `sponsors.json`, `board.json`, `faq.md`. Anyone (or Claude Code) edits a Markdown file; no CMS needed. Decap CMS can be added later if the board wants a web editor.
- **Repo**: github.com/scarsdale-chinese-association/scarsdalechinese.com (public), `main` branch.
- **Deploy to Hostinger**: Hostinger's Git integration only copies files (no build step), so a GitHub Action builds on push to `main` and pushes `dist/` to a `deploy` branch; Hostinger auto-deploys that branch into `public_html`. The Hostinger GitHub App is already installed on the org (repository selection: all). Fallback: FTP deploy from the same Action. The Node.js app hosting path is not needed for a static site.
- **Forms** (static site has no server): one small Google Apps Script web app owned by the SCA Google account receives every form POST, appends a row to a Google Sheet ("SCA Members", "Sponsors", "Contact" tabs), and emails info@scarsdalechinese.com. Free, no vendor, the sheet is the roster the board already understands. Alternatives if preferred: Web3Forms/Formspree (email only, no roster) or a Cloudflare Worker.
- **Payments**: Stripe Payment Links (no Stripe code on the site, PCI handled by Stripe). "SCA Family Membership $40/year" and a donation link with preset amounts. The membership form redirects to the Payment Link with the email prefilled. Zelle: show the QR/instructions and record the row as "Zelle – pending" until the treasurer marks it paid. Phase 2: Stripe webhook to the same Apps Script marks "Paid via Stripe" automatically.
- **Member tracking**: Stripe is the source of truth for card payments (customers, receipts, renewals); the Google Sheet is the full roster (Stripe + Zelle + family/WeChat details). Yearly renewal: either a recurring Stripe subscription (auto-renew, Stripe emails receipts and handles failed cards) or a one-time $40 and a reminder email each fall. Recommendation: recurring annual subscription, cancel anytime.
- **Email**: Apps Script sends from the SCA Gmail to info@. Confirm where info@ lives (Hostinger mailbox vs Google Workspace).
- **Analytics**: keep GA4 (MonsterInsights property id to copy over).
- **Redirects**: /events-2/ → /events/, /senior-club/ kept, old post slugs → /events/<slug>.

## 4. Improvements to run by the board
1. Single Join page (and section on Home): one form, $40, Stripe or Zelle, clear "what membership includes".
2. Real headshots for the 9 board members (ask each for a square photo; placeholder until then). I will not pull photos from LinkedIn: it violates LinkedIn's terms and the members have not consented.
3. Replace AI stock images with real event photos already in the media library.
4. Sponsor tiers with logos, plus a flyer gallery if sponsors want flyers shown.
5. Remove fake testimonials, events_old, blog comment forms, template tags.
6. Events as Markdown with date, location, RSVP link; upcoming/past computed automatically; optional .ics download.
7. Proper English/Chinese toggle later (Astro i18n) instead of machine translation; phase 1 ships English with the existing Chinese FAQ.
8. Consistent contact info everywhere; a Contact page.
9. Performance: static HTML, optimized images, no page builder JS. Target Lighthouse 95+ mobile.

## 5. Figma work
1. True-up the four desktop frames to the agreed content (price, board, footer, sections).
2. Add a Join/Membership page frame and a Contact section.
3. Add mobile (390 wide) frames for Home, Events, Sponsors, Senior Club, Join.
4. Build light components: header, footer, button, form field, event card, sponsor card, board card; colour and type variables.

## 6. Decisions needed
1. Roster: Google Sheet via Apps Script (recommended) vs Stripe only vs a paid form service.
2. Stripe membership: recurring annual subscription (recommended) vs one-time payment.
3. Which Hostinger plan the site is on (I could not log in to hPanel). Any plan supports the static deploy.
4. Where info@scarsdalechinese.com is hosted.
5. Correct P.O. Box and phone for the footer.
6. Board headshots: ask members directly (recommended).
7. Keep the Chinese/English toggle in phase 1 (machine translated) or ship English first.
8. Repo name and visibility: scarsdalechinese.com, public (recommended).

## 7. Build order once approved
1. Scaffold Astro repo, push to GitHub, GitHub Action → deploy branch, connect in hPanel to a staging subdomain first.
2. Layout, header/footer, design tokens from Figma.
3. Home, Events, Sponsors, Senior Club, Join, Contact pages with migrated content and photos.
4. Apps Script endpoint + Google Sheet + email to info@; Stripe Payment Links; Zelle block.
5. Redirects, GA4, sitemap, favicon, OG images.
6. Figma true-up and mobile frames.
7. Switch DNS/public_html from WordPress to the new site; keep a WP export as backup.

---

## 8. Status · 2026-11-06 (end of build session)

**Done**
- Astro site built and pushed: https://github.com/scarsdale-chinese-association/scarsdalechinese.com (public, `main`).
- GitHub Action builds on every push and publishes `dist/` to the `deploy` branch; Hostinger auto-deploys that branch to **https://new.scarsdalechinese.com** (Business plan, Git integration, site type PHP/HTML). The live WordPress site at scarsdalechinese.com is untouched.
- Stripe (SCA account): product **SCA Family Membership** $40/year recurring, Payment Link `https://buy.stripe.com/28EeVddvLg8I2an2hZe3e00`; donation link (customer chooses amount, $25–$10,000, preset $250) `https://donate.stripe.com/aFa6oH0IZ9KkbKXg8Pe3e01`. Both redirect to the site's thank-you page and are set as GitHub build variables. Tax collection is off (membership dues / donations).
- Google Sheet **SCA Members** (owned by scarsdalechineseassociation@gmail.com): https://docs.google.com/spreadsheets/d/1jIr0YMogI2Z0Zmk3AjejhOlHxhrvvDW9KBIrBfMGfJE
- Apps Script project **SCA Forms** created with `Code.gs` pasted and `SHEET_ID` set: https://script.google.com/home/projects/1kzA-ixxnJoYIabtR2l5W7r1jIn7NEbXAMko4qjX3GuJ0u0GjrPG9e2VN/edit
- Figma: pages `02 · Astro site · Desktop` and `03 · Astro site · Mobile` hold DOM captures of all six pages (editable layers, Quicksand fonts). The 2024 section on Page 1 is marked superseded and a true-up note lists every content change.

**Forms backend: live.** Apps Script web app deployed (`PUBLIC_FORM_ENDPOINT` set in GitHub Variables). Verified end to end on 2026-11-06: a browser submission on new.scarsdalechinese.com/contact/ landed in the `contact` tab of the SCA Members sheet and redirected to the thank-you page; info@ received the notification. Two test rows ("Website test (Claude)", "Browser test (Claude)") are in the contact tab and can be deleted.

**Member roster seeded from Stripe (2026-11-06).** 24 rows pasted into the `membership` tab of the private SCA Members sheet (ID column `STRIPE-IMPORT`): 21 active legacy $35/yr subscriptions, 1 canceled, 2 Stripe customers with no payment. Test customers and blank test subscriptions from Nov 2024 were excluded. One email has two active subscriptions (possible duplicate charge) and is flagged in the Notes column. Existing subscribers stay on the old $35 price until the board decides whether to migrate them to the $40 product. No member data is stored in this repo.

**RSVP (2026-11-06).** Upcoming events without an external `rsvpUrl` show an "I'll be there" form (name, email, phone, party size, note). Submissions go to the `rsvp` tab of the SCA Members sheet (one row per RSVP, with the event slug for filtering) and email info@. Apps Script is at deployment version 2; the web-app URL is unchanged. Verified end to end with a temporary test event; one test row remains in the rsvp tab and can be deleted.

**Senior Club page (2026-11-06, later).** Real member photos replaced the stock collage. The Village QR code now has a caption ("Village of Scarsdale account sign-up") and a "Create your Village account" button for people reading on a phone, pointing at `https://www.scarsdale.gov/MyAccount/ProfileCreate` — the same CivicPlus registration page the printed QR code resolves to (scarsdale.com now redirects to scarsdale.gov, so `seniorClub.villageUrl` / `villageSignupUrl` in `src/lib/site.ts` use the .gov host). Figma desktop + mobile frames for Home and Senior Club were recaptured.

**Analytics, Search Console, SEO (2026-11-06).** GA4 property 453645794 (stream G-B23GBN9ML9) is wired in via `PUBLIC_GA_ID`; chris@firstratetechcorp.com is a GA account Administrator and a Search Console Owner on the `sc-domain:scarsdalechinese.com` property. The site now ships Organization/NGO + WebSite JSON-LD on every page, FAQPage on Join/Sponsors/Senior Club, Event on event pages, a default Open Graph image, `noindex` on thank-you/404, explicit allow rules for AI crawlers in robots.txt, and `/llms.txt`. After cutover: submit `https://scarsdalechinese.com/sitemap-index.xml` in Search Console and fix the SPF record to include Google (`v=spf1 include:_spf.google.com ~all`) since mail is on Google Workspace.

**Cutover done (2026-11-06, evening).** The WordPress sites (scarsdalechinese.com and its staging subdomain) were deleted in hPanel and the Astro site's domain was changed from new.scarsdalechinese.com to **scarsdalechinese.com**. The Git auto-deployment stayed attached; a manual Redeploy plus Clear cache was needed once after the rename. https://scarsdalechinese.com, www → apex, and the old WordPress URL redirects all verified. MX stayed on Google. The new.scarsdalechinese.com subdomain no longer exists.

**Still to do (needs a human)**
1. Collect 9 board headshots (square JPG) → `public/board/` and add `"photo"` in `src/content/data/board.json`.
2. Confirm footer phone / P.O. Box, and the Zelle email (currently scarsdalechinese@yahoo.com).
3. ~~Senior Club photos~~ Done 2026-11-06: 12 member photos in `src/assets/photos/seniors/` (fan-dance hero, group photo, "Club life" gallery); the choir photo is also on the home page.
4. Optional phase 2: Stripe webhook → Sheet (see scripts/apps-script/README.md), Chinese/English toggle, Decap CMS.
