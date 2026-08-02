import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HubPage } from "@/components/hubs/HubPage";
import { alternatesFor, localizedUrl } from "@/lib/urls";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hubs" });

  const title = `${t("essentials.title")} ${t("essentials.titleHighlight")}`;
  return {
    title,
    description: t("essentials.subtitle"),
    alternates: alternatesFor(locale, "/essentials"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("essentials.subtitle"),
      url: localizedUrl(locale, "/essentials"),
    },
  };
}

export default async function EssentialsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubPage hubKey="essentials" locale={locale} />;
}
