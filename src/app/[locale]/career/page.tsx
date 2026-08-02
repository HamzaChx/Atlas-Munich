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

  const title = `${t("career.title")} ${t("career.titleHighlight")}`;
  return {
    title,
    description: t("career.subtitle"),
    alternates: alternatesFor(locale, "/career"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("career.subtitle"),
      url: localizedUrl(locale, "/career"),
    },
  };
}

export default async function CareerPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubPage hubKey="career" locale={locale} />;
}
