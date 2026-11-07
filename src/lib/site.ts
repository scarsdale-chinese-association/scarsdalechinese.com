/**
 * Site-wide constants. Edit here, never in individual pages.
 * Values prefixed PUBLIC_ can be overridden with environment variables at build time.
 * Facts that read differently in Chinese have a `…Zh` twin here; all other Chinese text is in src/i18n/ui.ts.
 */
export const site = {
  name: "Scarsdale Chinese Association",
  nameZh: "斯卡斯代尔华人协会",
  shortName: "SCA",
  url: "https://scarsdalechinese.com",
  description:
    "Scarsdale Chinese Association (SCA) is a 501(c)(3) non-profit serving the Chinese community of Scarsdale, NY through cultural, educational and social events.",
  email: "info@scarsdalechinese.com",
  phone: "(703) 798-7886",
  phoneHref: "tel:+17037987886",
  address: "P.O. Box 172, Scarsdale, NY 10583",
  addressZh: "邮政信箱 172 斯卡斯代尔，纽约 10583",
  foundedYear: 2018,
  /** GA4 measurement id (G-XXXXXXX). Set PUBLIC_GA_ID at build time; empty disables the tag. */
  gaId: import.meta.env.PUBLIC_GA_ID ?? "",
  sameAs: [
    "https://github.com/scarsdale-chinese-association",
  ],
};

export const membership = {
  /** Annual family membership fee in US dollars. */
  price: 40,
  priceLabel: "$40 per family, per year",
  priceLabelZh: "每户每年 $40",
  /** Stripe Payment Link for the annual family membership. Set PUBLIC_STRIPE_MEMBERSHIP_LINK at build time. */
  stripeLink: import.meta.env.PUBLIC_STRIPE_MEMBERSHIP_LINK ?? "",
  /** Stripe Payment Link for sponsor donations. Set PUBLIC_STRIPE_DONATE_LINK at build time. */
  stripeDonateLink: import.meta.env.PUBLIC_STRIPE_DONATE_LINK ?? "",
  zelle: {
    recipient: "Scarsdale Chinese Association, Inc.",
    email: "scarsdalechinese@yahoo.com",
  },
};

/**
 * Google Apps Script web-app URL that receives form submissions, writes them to the
 * SCA Google Sheet and emails info@. See scripts/apps-script/README.md.
 */
export const formEndpoint: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? "";

/** Header and footer navigation. `label` is English, `labelZh` is shown on /zh/ pages. */
export const nav = [
  { label: "Events", labelZh: "活动", href: "/events/" },
  { label: "Sponsors", labelZh: "赞助商", href: "/sponsors/" },
  { label: "Senior Club", labelZh: "老年俱乐部", href: "/senior-club/" },
  { label: "Contact", labelZh: "联系我们", href: "/contact/" },
];

export const seniorClub = {
  venue: "Girl Scout House",
  address: "37 Wayside Lane, Scarsdale, NY 10583",
  schedule: "Every Tuesday, 9:30–11:30 AM (September–June)",
  scheduleZh: "每周二上午 9:30–11:30（9 月至次年 6 月）",
  villageFee: 15,
  villageUrl: "https://www.scarsdale.gov",
  /** Same destination as the printed QR code: create a Village of Scarsdale (CivicPlus) account. */
  villageSignupUrl: "https://www.scarsdale.gov/MyAccount/ProfileCreate",
};
