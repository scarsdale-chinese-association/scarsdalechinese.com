# Handoff: managing scarsdalechinese.com

This is the one document to read when you take over the Scarsdale Chinese Association (SCA) website.
It covers how your Mac is set up, where every account lives, how to do the everyday jobs, and the
prompt to paste into Claude Code to get started. Conventions for code changes are in [`AGENTS.md`](../AGENTS.md);
the history of decisions is in [`site-analysis-and-plan.md`](site-analysis-and-plan.md).

## 1. The 60-second picture

- The site is a **static Astro site**. There is no WordPress, no CMS, no database. Every page, event,
  sponsor and board member is a file in this repository.
- **Publishing = pushing to `main`.** A GitHub Action builds the site and writes the result to the
  `deploy` branch; Hostinger watches that branch and copies it to the web server within a minute or two.
- **Forms** (membership, sponsor, contact, event RSVP) post to a small Google Apps Script that writes a row
  into the **SCA Members** Google Sheet and emails info@scarsdalechinese.com.
- **Money** goes through Stripe Payment Links (membership $40/year, donations) or Zelle. The Sheet is the
  roster; Stripe is the source of truth for card payments.
- **Claude Code** is the way you edit the site. You describe the change in plain English, it edits the
  files, builds, and (when you say so) commits and pushes. You never need to hand-edit HTML.

## 2. One-time setup on your Mac

Chris has already created a Chrome profile named **Scarsdale Chinese Association** that is signed in to
GitHub, Stripe, Hostinger, Google (the Sheet and Apps Script) and Figma. Use that profile for anything
to do with the site so you are never fighting with your personal logins.

1. **Install Node.js** (version 22 or newer): https://nodejs.org → download the LTS installer and run it.
   Check in Terminal: `node -v`.
2. **Install the GitHub CLI** and sign in as the SCA GitHub account:
   ```bash
   brew install gh
   ```
   ```bash
   gh auth login
   ```
   Choose GitHub.com → HTTPS → "Login with a web browser". If the wrong Chrome profile opens, copy the
   URL into the Scarsdale Chinese Association profile instead. This lets `git push` work from Terminal
   and from Claude Code.
3. **Clone the repo** into the folder Chris created (`~/Scarsdale Chinese Association`):
   ```bash
   cd ~/"Scarsdale Chinese Association" && gh repo clone scarsdale-chinese-association/scarsdalechinese.com . && npm install
   ```
4. **Local environment file.** Copy `.env.example` to `.env` and fill in the three values from
   GitHub → repo → Settings → Secrets and variables → Actions → **Variables** (`PUBLIC_FORM_ENDPOINT`,
   `PUBLIC_STRIPE_MEMBERSHIP_LINK`, `PUBLIC_STRIPE_DONATE_LINK`). Without them the local preview still
   works, but forms and payment buttons will not.
5. **Open the folder in Claude Code** (Claude desktop app → Code tab → open folder, or `claude` in
   Terminal from inside the folder). Paste the kickoff prompt from section 7 the first time.
6. **Preview locally** whenever you want to see a change before publishing:
   ```bash
   npm run dev
   ```
   then open http://localhost:4321/. Claude Code can start this for you and show it in its browser pane.

## 3. Where everything lives

| Thing | Where | Notes |
|---|---|---|
| Code and content | https://github.com/scarsdale-chinese-association/scarsdalechinese.com | Public repo, branch `main`. Never edit the `deploy` branch by hand. |
| Build / publish | GitHub → Actions → "Build and deploy" | Runs on every push to `main`; ~1 minute. Green check = published. |
| Hosting | Hostinger hPanel (Business plan) → website scarsdalechinese.com | Git integration auto-deploys the `deploy` branch. If the live site looks stale: Deployments → **Redeploy**, then **Clear cache**. DNS and email records also live here. |
| Email | Google Workspace, info@scarsdalechinese.com | All form notifications go here. MX and SPF are set for Google. |
| Member roster + form inbox | Google Sheet **SCA Members** (owned by scarsdalechineseassociation@gmail.com): https://docs.google.com/spreadsheets/d/1jIr0YMogI2Z0Zmk3AjejhOlHxhrvvDW9KBIrBfMGfJE | Tabs: `membership`, `sponsor`, `contact`, `rsvp`. |
| Form backend | Apps Script project **SCA Forms** (same Google account) | Source is in `scripts/apps-script/Code.gs`; setup and redeploy steps in `scripts/apps-script/README.md`. |
| Payments | Stripe dashboard (SCA account) | Product "SCA Family Membership" $40/yr recurring; donation link "customer chooses amount". Legacy members are still on a $35/yr price. |
| Zelle | scarsdalechinese@yahoo.com, recipient "Scarsdale Chinese Association, Inc." | Shown on the Join and Sponsors pages. Change it in `src/lib/site.ts`. |
| Analytics | Google Analytics 4 (property 453645794) and Search Console (`sc-domain:scarsdalechinese.com`) | Already wired in. Add yourself as a user via the SCA Google account if you want dashboards. |
| Design file | Figma, file `kwew0QXFaDx4rCYSWhaP9F`, pages "02 · Astro site · Desktop" and "03 · Astro site · Mobile" | Optional. Captures of the real pages; refresh them if you redesign a page. |

Site-wide facts (phone, P.O. Box, email, membership price, Zelle details, Senior Club schedule, nav) are
all in one file: `src/lib/site.ts`. Change them there and nowhere else.

## 4. Everyday jobs (say these to Claude Code)

Each of these is a plain-English request. Claude Code knows the repo layout from `AGENTS.md`.

**Add an upcoming event.** "Add an event: Lunar New Year Gala, Saturday Feb 14 2026, 5–9 PM, Scarsdale
High School auditorium, 1057 Post Road. Here is the flyer (attach the image). Summary: …" → it creates
`src/content/events/<slug>.md`, puts the flyer in `src/assets/events/`, and the event appears on the
home page and Events page with an RSVP form. RSVPs land in the `rsvp` tab of the Sheet. If tickets are
sold elsewhere (Eventbrite, a Google Form), say so and it sets `rsvpUrl` instead of showing the RSVP form.

**After an event.** Nothing to do: once the date passes it moves to "Past events" automatically. If you
have photos or a recap, "Add a recap and these three photos to the Lunar New Year Gala event page".

**Add or change a sponsor.** "Add Acme Dental as a sponsor-tier sponsor with this flyer and link to
acmedental.com" → `src/content/data/sponsors.json` + image in `src/assets/sponsors/`. Tiers are `top`,
`sponsor`, `partner`.

**Board changes.** "Replace the treasurer with Jane Lin, Chinese name 林洁" → `src/content/data/board.json`.
Headshots go in `public/board/` as square JPGs; add `"photo": "/board/jane-lin.jpg"`.

**Change copy, price, contact details.** "Change the membership price to $45" → `src/lib/site.ts`
(and you must also change the Stripe price; Claude Code will remind you). "Reword the second paragraph
on the Senior Club page to …" → `src/pages/senior-club.astro`.

**FAQ.** "Add a FAQ to the Join page: Can I pay by check? …" → `src/content/data/faq.json`.

**Publish.** "Build and push." Claude Code runs `npm run build` (this also validates the content files),
commits with a clear message, and pushes to `main`. Check the Actions tab is green, then look at the
live page. Hostinger usually shows the change within two minutes; if not, Redeploy + Clear cache in hPanel.

**Check who signed up.** Open the SCA Members Sheet. New memberships arrive as `Pending Stripe` or
`Pending Zelle`. For Zelle, when the treasurer sees the payment, set Payment status to `Paid (Zelle)` and
fill in Paid on. For Stripe, confirm in the Stripe dashboard (Customers → search the email) and set
`Paid (Stripe)`. Sponsor inquiries and contact messages also arrive in their tabs and in the info@ inbox.

**Change the notification email or the Sheet.** See `scripts/apps-script/README.md`. Any change to
`Code.gs` must be pasted into the Apps Script editor and deployed as a **new version** of the existing
deployment so the URL stays the same.

## 5. Rules that keep the site healthy

- Always let Claude Code run `npm run build` before pushing. A red build means a content file has a typo
  in its front matter; the error names the file and field.
- Images go in `src/assets/` (Astro resizes and compresses them). Only `public/` for files that must stay
  byte-exact (favicon, board headshots, `.htaccess`, `robots.txt`).
- Never put member names, emails or payment details in the repo. It is public. The Sheet is for that.
- Never edit the `deploy` branch, and never upload files by FTP to Hostinger; the next push would erase them.
- Don't remove the hidden `_gotcha` field from forms; it is the spam trap.
- Keep `AGENTS.md` current if you change how something works, so Claude Code keeps doing the right thing.

## 6. Open items handed over

1. Board headshots: collect nine square JPGs, add to `public/board/`, reference them in `board.json`.
2. Confirm the footer phone number, P.O. Box 172, and the Zelle email with the board.
3. Decide whether to move the ~21 legacy $35/year Stripe subscribers to the $40 product (Stripe →
   Subscriptions → update each, or leave them grandfathered).
4. Delete the leftover test rows in the Sheet's `contact` and `rsvp` tabs (labelled as tests).
5. Optional later: Stripe webhook so card payments mark the Sheet row paid automatically
   (`scripts/apps-script/README.md`), a Chinese-language toggle, a browser-based CMS (Decap) if non-technical
   board members want to edit without Claude Code.

## 7. Kickoff prompt for Claude Code

Paste this as your first message in a new Claude Code session in the repo folder. After that, just ask
for what you need.

```text
You are helping me manage scarsdalechinese.com, the Scarsdale Chinese Association website. I am the
site manager, not a developer. Before doing anything, read AGENTS.md and docs/HANDOFF.md in this repo
and follow them.

How I want to work:
- When I ask for a content change (event, sponsor, board member, FAQ, wording, price, contact info),
  make the change in the right file, run `npm run build`, and show me what changed in plain English.
  Start the dev server and show me the page in your browser pane if the change is visual.
- Do not commit or push until I say "publish". When I do, commit with a clear message and push to main,
  then confirm the GitHub Action succeeded and the live page shows the change.
- Never put member names, emails, or payment details into the repo. Never edit the deploy branch.
- If a change also needs something outside the repo (Stripe price, Google Sheet, Apps Script, Hostinger,
  DNS), tell me exactly what to click, step by step, instead of guessing. I will do it in the
  "Scarsdale Chinese Association" Chrome profile, which is signed in to all of those.
- If anything in the request is unclear (date, time, which page, which tier), ask me before editing.
- Keep answers short. I do not need explanations of Astro or Tailwind unless I ask.

First task: confirm the repo builds cleanly (`npm install` if needed, then `npm run build`), tell me
whether .env exists and has the three PUBLIC_ values, and list the upcoming events currently on the site.
```
