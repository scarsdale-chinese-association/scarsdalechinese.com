# SCA form backend (Google Sheet + Apps Script)

Every form on scarsdalechinese.com (membership, sponsor, contact) posts JSON to one Google Apps Script
web app. The script appends a row to the **SCA Members** Google Sheet and emails info@scarsdalechinese.com.
The sheet is the member roster; Stripe is the source of truth for card payments.

## One-time setup (about 10 minutes, do this signed in as the SCA Google account)

1. Create a Google Sheet named **SCA Members**. Copy its ID from the URL
   (`https://docs.google.com/spreadsheets/d/<ID>/edit`).
2. In the sheet: **Extensions → Apps Script**. Delete the default code and paste `Code.gs`.
3. **Project Settings (gear) → Script properties → Add**: `SHEET_ID` = the ID from step 1.
4. Back in the editor, select the `setup` function and **Run** once. Approve the permissions
   (Sheets + send email as you). This creates the `membership`, `sponsor` and `contact` tabs.
5. **Deploy → New deployment → Web app**. Execute as **Me**, Who has access **Anyone**. Deploy.
   Copy the Web app URL (`https://script.google.com/macros/s/.../exec`).
6. Put that URL in the website build: GitHub repo → Settings → Secrets and variables → Actions →
   **Variables** → `PUBLIC_FORM_ENDPOINT`. Re-run the deploy workflow (or push any commit).

To change the notification address later, edit `NOTIFY_EMAIL` at the top of `Code.gs` and
**Deploy → Manage deployments → Edit → New version**. (Moving the sheet to a Google Workspace
account later: share the sheet with the new account, copy the script into a new project under that
account, redeploy, and update `PUBLIC_FORM_ENDPOINT`.)

## Stripe → sheet (optional, phase 2)

In the Stripe dashboard → Developers → Webhooks → Add endpoint with the same Web app URL, events
`checkout.session.completed`. The script marks the matching membership row **Paid (Stripe)** using the
`client_reference_id` the website passes to the Payment Link (our row ID), or the email as a fallback.

Apps Script cannot read request headers, so Stripe's signature cannot be verified there. The webhook
only ever flips a status cell, so the risk is a spoofed "paid" row; the treasurer can always cross-check
in the Stripe dashboard. If stronger verification is wanted later, put a Cloudflare Worker in front.

## Zelle

Zelle rows arrive as **Pending Zelle**. When the treasurer sees the payment in the bank, change the
status to `Paid (Zelle)` and fill in **Paid on**.

## Testing

```bash
curl -L -X POST "$PUBLIC_FORM_ENDPOINT" -H 'Content-Type: text/plain' \
  -d '{"form":"contact","name":"Test","email":"test@example.com","message":"hello","page":"test"}'
```
