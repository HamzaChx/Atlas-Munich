"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";
const locales = ["en", "fr", "de"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "en";

export async function setLocale(locale: string) {
  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value;
  return locales.includes(locale as Locale) ? locale! : defaultLocale;
}
