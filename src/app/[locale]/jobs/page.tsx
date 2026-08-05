import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JobsBoard } from "@/components/jobs/JobsBoard";
import { isDatabaseConfigured } from "@/db";
import { getPublishedJobs } from "@/db/jobs";
import { alternatesFor, localizedUrl } from "@/lib/urls";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const translate = await getTranslations({ locale, namespace: "jobs" });

  return {
    title: translate("metadataTitle"),
    description: translate("metadataDescription"),
    alternates: alternatesFor(locale, "/jobs"),
    openGraph: {
      title: `${translate("metadataTitle")} | Atlas Munich`,
      description: translate("metadataDescription"),
      url: localizedUrl(locale, "/jobs"),
    },
  };
}

export default async function JobsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [translate, jobs] = await Promise.all([
    getTranslations({ locale, namespace: "jobs" }),
    getPublishedJobs(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <span className="eyebrow">{translate("badge")}</span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {translate("title")} <span className="text-bloom">{translate("titleHighlight")}</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {translate("subtitle")}
        </p>
      </section>

      <section
        className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8"
        aria-label={translate("title")}
      >
        <JobsBoard
          databaseConfigured={isDatabaseConfigured()}
          jobs={jobs}
          locale={locale}
          translate={translate}
        />
      </section>
    </main>
  );
}
