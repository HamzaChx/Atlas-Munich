import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,

  /* `as-needed` keeps English on its existing unprefixed URLs — /guides/x
     stays /guides/x — so nothing that already ranks moves. French and German
     become /fr/... and /de/..., which is what finally makes guides.fr.ts and
     guides.de.ts indexable. Requests to /en/... redirect to the unprefixed
     form, so a page is never reachable at two addresses. */
  localePrefix: "as-needed",

  /* Worth being deliberate about: this sends a browser advertising fr or de
     to the matching locale on first visit, which is right for an audience
     arriving from Morocco. It's a 307 with `Vary: Accept-Language`, so
     crawlers (which advertise en) still land on and index the English URLs. */
  localeDetection: true,
});
