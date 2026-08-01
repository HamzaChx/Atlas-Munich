import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

/**
 * The locale now comes from the `[locale]` route segment rather than from a
 * cookie read through `headers()`. That difference is the whole point of the
 * migration: reading headers here opted every route in the app out of static
 * generation, so no page HTML was ever prerendered.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
