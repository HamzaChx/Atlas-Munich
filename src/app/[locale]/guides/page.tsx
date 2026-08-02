import { setRequestLocale } from "next-intl/server";

import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { getGuideTree } from "@/lib/guide-tree-server";

import { GuidesBrowser } from "./GuidesBrowser";

/**
 * The browser itself is a client component (search, topic filters), so the
 * locale overlay is applied here on the server: the visitor gets guide titles
 * and summaries in their language without the translation files being shipped
 * to the browser.
 */
export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const localizedGuides = await localizeGuides(guides, locale);
  const treeNodes = await getGuideTree(locale);

  return <GuidesBrowser guides={localizedGuides} treeNodes={treeNodes} />;
}
