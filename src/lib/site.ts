/**
 * Site-wide constants. Edit here, never in individual pages.
 * Values prefixed PUBLIC_ can be overridden with environment variables at build time.
 */
export const site = {
  name: "Scarsdale Chinese Association",
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

export const nav = [
  { label: "Events", href: "/events/" },
  { label: "Sponsors", href: "/sponsors/" },
  { label: "Senior Club", href: "/senior-club/" },
  { label: "Contact", href: "/contact/" },
];

export const seniorClub = {
  venue: "Girl Scout House",
  address: "37 Wayside Lane, Scarsdale, NY 10583",
  schedule: "Every Tuesday, 9:30–11:30 AM (September–June)",
  villageFee: 15,
  villageUrl: "https://www.scarsdale.gov",
  /** Same destination as the printed QR code: create a Village of Scarsdale (CivicPlus) account. */
  villageSignupUrl: "https://www.scarsdale.gov/MyAccount/ProfileCreate",
};
