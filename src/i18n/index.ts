// The locale list lives with the routing config now, since the router is what
// resolves it. Re-exported here so existing `@/i18n` imports keep working.
export { locales, defaultLocale, routing, type Locale } from "./routing";

// `getLocale`/`setLocale` are gone: the locale is a URL segment, so it is read
// with `getLocale()` from `next-intl/server` and changed by navigating (see
// LanguageSwitcher) rather than by writing a cookie.
