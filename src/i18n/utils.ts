/**
 * Locale helpers. The site is English by default (no URL prefix) with a Simplified Chinese
 * twin of every page under /zh/. Pages live once in `src/pages/[...locale]/` and read the
 * locale from the route param; components receive it as a `locale` prop.
 */
import { ui, type UIKey } from "./ui";

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** BCP 47 tag for <html lang>, hreflang and JSON-LD. */
export const htmlLang: Record<Locale, string> = { en: "en", zh: "zh-CN" };
/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = { en: "en_US", zh: "zh_CN" };

/**
 * `getStaticPaths()` entries for a page that exists in every locale.
 * A function, not a constant: Astro attaches a per-route lookup map to the returned array,
 * so each page must get its own array.
 */
export function localeStaticPaths() {
  return [{ params: { locale: undefined } }, { params: { locale: "zh" } }];
}

/** Resolve the locale from `Astro.params` of a `[...locale]` route. */
export function getLocale(params: { locale?: string | undefined }): Locale {
  return params.locale === "zh" ? "zh" : "en";
}

/** Prefix a site-relative path (`/events/`) for the given locale. English paths are unchanged. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === "en") return path;
  if (path === "/") return "/zh/";
  return path.startsWith("/zh/") ? path : `/zh${path}`;
}

/** The same page in the other locale, for the language toggle. */
export function switchLocalePath(pathname: string, current: Locale): string {
  if (current === "zh") {
    const stripped = pathname.replace(/^\/zh(\/|$)/, "/");
    return stripped || "/";
  }
  return localizePath(pathname, "zh");
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}

/**
 * Returns `t(key, vars?)`. Keys are the flat dotted names in `src/i18n/ui.ts`; `{name}`
 * placeholders are replaced from `vars`. Missing Chinese strings fall back to English.
 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let s: string = ui[locale][key] ?? ui.en[key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Look up a key that may not exist (e.g. `board.role.<Role>`), falling back to a literal. */
export function tOptional(locale: Locale, key: string, fallback: string): string {
  const dict = ui[locale] as Record<string, string>;
  return dict[key] ?? (ui.en as Record<string, string>)[key] ?? fallback;
}

/** Date formatter for event dates (stored as UTC midnight). */
export function eventDateFormatter(locale: Locale, style: "short" | "long") {
  const tag = locale === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(tag, {
    weekday: style === "long" ? "long" : "short",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
