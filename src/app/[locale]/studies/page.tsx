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

  const title = `${t("studies.title")} ${t("studies.titleHighlight")}`;
  return {
    title,
    description: t("studies.subtitle"),
    alternates: alternatesFor(locale, "/studies"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("studies.subtitle"),
      url: localizedUrl(locale, "/studies"),
    },
  };
}

export default async function StudiesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubPage hubKey="studies" locale={locale} />;
}
