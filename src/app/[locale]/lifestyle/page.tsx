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

  const title = `${t("lifestyle.title")} ${t("lifestyle.titleHighlight")}`;
  return {
    title,
    description: t("lifestyle.subtitle"),
    alternates: alternatesFor(locale, "/lifestyle"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("lifestyle.subtitle"),
      url: localizedUrl(locale, "/lifestyle"),
    },
  };
}

export default async function LifestylePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubPage hubKey="lifestyle" locale={locale} />;
}
