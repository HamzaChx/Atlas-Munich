import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAllFaqs } from "@/data/faqs";
import { categoryHref, getHub } from "@/data/hubs";
import { groupFaqsByTopic } from "@/lib/faq-topics";
import { alternatesFor, localizedUrl } from "@/lib/urls";
import type { CategoryKey } from "@/types";
import { FaqDirectory, type FaqTopicView } from "./FaqDirectory";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Every question on the site, server-rendered and indexable.
 *
 * This route used to be a client-only forwarder marked `noindex`, which meant
 * a crawler requesting /faq received an empty shell. The questions still
 * appear on the hub each one belongs to; this page is the one place that
 * lists them all, and its anchors (`/faq#faq-kvr-3`) resolve on the page
 * itself rather than through a client redirect.
 *
 * No `FAQPage` markup here on purpose: the hubs already mark up the same
 * questions, and Google asks for a repeated FAQ to be marked up only once.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const title = `${t("title")} ${t("titleHighlight")}`;

  return {
    title,
    description: t("subtitle"),
    alternates: alternatesFor(locale, "/faq"),
    openGraph: {
      title: `${title} | Atlas Munich`,
      description: t("subtitle"),
      url: localizedUrl(locale, "/faq"),
    },
  };
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const tCategories = await getTranslations("categories");
  const tHubs = await getTranslations("hubs");

  const topics: FaqTopicView[] = groupFaqsByTopic(getAllFaqs()).map(({ topic, faqs }) => {
    const isGeneral = topic.key === "general";
    /* A category's questions point at its branch of the guide tree; the
       uncategorised ones (first week, food) at the community. */
    const community = getHub("community");
    return {
      key: topic.key,
      title: isGeneral ? t("general") : tCategories(`${topic.key}.title`),
      description: isGeneral ? t("generalDescription") : tCategories(`${topic.key}.description`),
      hubHref: isGeneral ? `${community.route}#questions` : categoryHref(topic.key as CategoryKey),
      hubLabel: isGeneral
        ? `${tHubs("community.title")} ${tHubs("community.titleHighlight")}`
        : t("openGuides"),
      faqs: faqs.map(({ id, question, answer }) => ({ id, question, answer })),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-10 sm:pt-20">
        <span className="eyebrow">{t("badge")}</span>
        <h1 className="rise rise-1 mt-3 font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>
        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400">
          {t("subtitle")}
        </p>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <FaqDirectory topics={topics} />
      </div>
    </div>
  );
}
