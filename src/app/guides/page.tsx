import { getLocale } from "next-intl/server";

import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";

import { GuidesBrowser } from "./GuidesBrowser";

/**
 * The browser itself is a client component (search, topic filters), so the
 * locale overlay is applied here on the server: the visitor gets guide titles
 * and summaries in their language without the translation files being shipped
 * to the browser.
 */
export default async function GuidesPage() {
  const locale = await getLocale();
  const localizedGuides = await localizeGuides(guides, locale);

  return <GuidesBrowser guides={localizedGuides} />;
}
