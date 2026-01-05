// Re-export constants from request (types and constants)
export const locales = ["en", "fr", "de", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Re-export server actions
export { setLocale, getLocale } from "./actions";

