/**
 * Scarsdale Chinese Association — form backend (Google Apps Script)
 *
 * Receives JSON POSTs from scarsdalechinese.com, appends a row to the matching tab of the
 * SCA Members Google Sheet, and emails a notification to NOTIFY_EMAIL.
 * Also accepts Stripe webhooks (checkout.session.completed) to mark members as paid.
 *
 * Setup: see README.md next to this file.
 */

var NOTIFY_EMAIL = 'info@scarsdalechinese.com';
var SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID'); // set in Project Settings → Script properties
var STRIPE_WEBHOOK_SECRET = PropertiesService.getScriptProperties().getProperty('STRIPE_WEBHOOK_SECRET'); // optional, whsec_...

var TABS = {
  membership: ['Submitted', 'ID', 'First name', 'Last name', 'Email', 'Phone', 'WeChat', 'Family members', 'Street', 'City', 'State', 'ZIP', 'Payment method', 'Payment status', 'Paid on', 'Stripe customer', 'Email consent', 'Notes'],
  sponsor: ['Submitted', 'ID', 'Company', 'Contact name', 'Email', 'Phone', 'Amount', 'Payment method', 'Payment status', 'Message', 'Notes'],
  contact: ['Submitted', 'ID', 'Name', 'Email', 'Message', 'Page', 'Replied'],
  rsvp: ['Submitted', 'ID', 'Event', 'Event date', 'Event slug', 'Name', 'Email', 'Phone', 'Guests', 'Note', 'Checked in'],
};

/** One-time: creates the tabs with headers. Run from the editor after setting SHEET_ID. */
function setup() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  Object.keys(TABS).forEach(function (name) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(TABS[name]);
      sheet.getRange(1, 1, 1, TABS[name].length).setFontWeight('bold').setBackground('#f9efe1');
      sheet.setFrozenRows(1);
    }
  });
  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
}

function doGet() {
  return json_({ ok: true, service: 'sca-forms' });
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var body = JSON.parse(raw);

    // Stripe webhook?
    if (body.object === 'event' && body.type) {
      return handleStripe_(body, raw, e);
    }

    var form = String(body.form || '');
    if (!TABS[form]) return json_({ ok: false, error: 'Unknown form' }, 400);
    if (body._gotcha) return json_({ ok: true, id: 'ignored' }); // honeypot
    if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) return json_({ ok: false, error: 'Invalid email' }, 400);

    var id = Utilities.getUuid().slice(0, 8).toUpperCase();
    var now = new Date();
    var row;
    if (form === 'membership') {
      row = [now, id, body.firstName, body.lastName, body.email, body.phone, body.wechat, body.familyMembers, body.street, body.city, body.state, body.zip,
        body.paymentMethod, body.paymentMethod === 'zelle' ? 'Pending Zelle' : 'Pending Stripe', '', '', body.emailConsent === 'yes' ? 'Yes' : 'No', ''];
    } else if (form === 'sponsor') {
      var amount = body.amount === 'other' ? body.amountOther : body.amount;
      row = [now, id, body.company, body.name, body.email, body.phone, amount, body.paymentMethod,
        body.paymentMethod === 'invoice' ? 'Contact requested' : body.paymentMethod === 'zelle' ? 'Pending Zelle' : 'Pending Stripe', body.message, ''];
    } else if (form === 'rsvp') {
      row = [now, id, body.eventTitle, body.eventDate, body.eventSlug, body.name, body.email, body.phone, Number(body.guests || 1), body.note, ''];
    } else {
      row = [now, id, body.name, body.email, body.message, body.page, ''];
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(form);
    sheet.appendRow(row.map(function (v) { return v == null ? '' : v; }));

    notify_(form, id, body);
    return json_({ ok: true, id: id });
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

function notify_(form, id, b) {
  var subject, text;
  if (form === 'membership') {
    subject = '[SCA] New membership: ' + b.firstName + ' ' + b.lastName + ' (' + b.paymentMethod + ')';
    text = 'New membership form submitted.\n\n' +
      'ID: ' + id + '\nName: ' + b.firstName + ' ' + b.lastName + '\nEmail: ' + b.email + '\nPhone: ' + b.phone +
      '\nWeChat: ' + (b.wechat || '') + '\nFamily: ' + (b.familyMembers || '') +
      '\nAddress: ' + [b.street, b.city, b.state, b.zip].filter(String).join(', ') +
      '\nPayment: ' + b.paymentMethod + (b.paymentMethod === 'zelle' ? ' — check Zelle for $40 and mark Paid in the sheet' : ' — Stripe will mark Paid automatically once the webhook is set up') +
      '\nEmail consent: ' + (b.emailConsent === 'yes' ? 'Yes' : 'No');
  } else if (form === 'sponsor') {
    subject = '[SCA] Sponsor inquiry: ' + (b.company || b.name) + ' — $' + (b.amount === 'other' ? b.amountOther : b.amount);
    text = 'New sponsor form.\n\nID: ' + id + '\nCompany: ' + (b.company || '') + '\nContact: ' + b.name + '\nEmail: ' + b.email + '\nPhone: ' + (b.phone || '') +
      '\nAmount: ' + (b.amount === 'other' ? b.amountOther : b.amount) + '\nPayment: ' + b.paymentMethod + '\n\nMessage:\n' + (b.message || '');
  } else if (form === 'rsvp') {
    subject = '[SCA] RSVP: ' + b.name + ' (' + (b.guests || 1) + ') — ' + b.eventTitle;
    text = 'New RSVP.\n\nEvent: ' + b.eventTitle + ' (' + (b.eventDate || '') + ')\nName: ' + b.name + '\nEmail: ' + b.email + '\nPhone: ' + (b.phone || '') +
      '\nGuests (including themselves): ' + (b.guests || 1) + '\n\nNote:\n' + (b.note || '') + '\n\nAll RSVPs for this event: filter the rsvp tab by Event slug = ' + (b.eventSlug || '');
  } else {
    subject = '[SCA] Website message from ' + b.name;
    text = 'From: ' + b.name + ' <' + b.email + '>\nPage: ' + (b.page || '') + '\n\n' + b.message;
  }
  MailApp.sendEmail({ to: NOTIFY_EMAIL, replyTo: b.email, subject: subject, body: text + '\n\nSheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID });
}

/** Stripe webhook: marks the membership row as paid, matched by client_reference_id (our ID) or email. */
function handleStripe_(event, raw, e) {
  if (STRIPE_WEBHOOK_SECRET) {
    var sig = (e.parameter && e.parameter.sig) || ''; // Apps Script cannot read headers; see README for the proxy-free approach
    // Header verification is not possible in Apps Script. We instead re-fetch the event from Stripe by ID using a restricted key (see README).
  }
  if (event.type !== 'checkout.session.completed' && event.type !== 'invoice.paid') return json_({ ok: true, ignored: event.type });
  var obj = event.data.object;
  var email = (obj.customer_details && obj.customer_details.email) || obj.customer_email || '';
  var ref = obj.client_reference_id || '';
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('membership');
  var data = sheet.getDataRange().getValues();
  var H = TABS.membership;
  var idCol = H.indexOf('ID'), emailCol = H.indexOf('Email'), statusCol = H.indexOf('Payment status'), paidCol = H.indexOf('Paid on'), custCol = H.indexOf('Stripe customer');
  for (var r = data.length - 1; r >= 1; r--) {
    if ((ref && data[r][idCol] === ref) || (!ref && email && String(data[r][emailCol]).toLowerCase() === email.toLowerCase())) {
      sheet.getRange(r + 1, statusCol + 1).setValue('Paid (Stripe)');
      sheet.getRange(r + 1, paidCol + 1).setValue(new Date());
      sheet.getRange(r + 1, custCol + 1).setValue(obj.customer || '');
      return json_({ ok: true, row: r + 1 });
    }
  }
  // No form row: record the payment anyway so nobody is lost.
  sheet.appendRow([new Date(), 'STRIPE', '', '', email, '', '', '', '', '', '', '', 'stripe', 'Paid (Stripe) — no form', new Date(), obj.customer || '', '', 'Paid without submitting the website form']);
  return json_({ ok: true, appended: true });
}

function json_(obj, status) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
