import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export const locales = ["en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  // Get locale from headers (set by middleware)
  const headersList = await headers();
  const localeHeader = headersList.get("x-next-intl-locale");
  const locale = (locales.includes(localeHeader as Locale) 
    ? localeHeader 
    : defaultLocale) as Locale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
