import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HubPage } from "@/components/hubs/HubPage";
import { alternatesFor, localizedUrl } from "@/lib/urls";

/**
 * The one home for every guide: search on top, the living tree below.
 *
 * This used to be two pages for the same six guides: a search-plus-outline
 * index here and the tree at /lifestyle, which the nav called "Lifestyle"
 * even though its branches are housing, KVR and residence permits. The tree
 * moved here, /lifestyle redirects (next.config.ts), and the hub keeps its
 * internal key "lifestyle" so FAQ and message keys did not have to move.
 */

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hubs" });

  const title = `${t("lifestyle.title")} ${t("lifestyle.titleHighlight")}`;
  return {
    title,
    description: t("lifestyle.subtitle"),
    alternates: alternatesFor(locale, "/guides"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("lifestyle.subtitle"),
      url: localizedUrl(locale, "/guides"),
    },
  };
}

export default async function GuidesPage({ params }: PageProps) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubPage hubKey="lifestyle" locale={locale} />;
}
