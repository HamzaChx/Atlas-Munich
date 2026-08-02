import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getHub } from "@/data/hubs";
import { getAssistantsForHub, isLive } from "@/data/assistants";
import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { getGuideTree } from "@/lib/guide-tree-server";
import { GuideGraph, FaqTopicGrid } from "@/components/shared";
import { getFaqsByHub } from "@/data/faqs";
import { faqPageJsonLd } from "@/lib/structured-data";
import type { HubKey } from "@/types";

/**
 * The shared body of a journey hub.
 *
 * A hub answers one stage of the move. It gathers the guides, the helpers and
 * (from phase three) the questions that belong to that stage, so a reader
 * never has to work out whether their answer is filed under "Guides", "Tools"
 * or "FAQ".
 */
export async function HubPage({ hubKey, locale }: { hubKey: HubKey; locale: string }) {
  const hub = getHub(hubKey);
  const t = await getTranslations("hubs");
  const tTools = await getTranslations("tools");

  const hubGuides = await localizeGuides(
    guides.filter((guide) => hub.categoryKeys.includes(guide.categoryKey)),
    locale
  );
  const helpers = getAssistantsForHub(hubKey).filter(isLive);
  /* The same tree as /guides, scoped to this hub's guides. */
  const treeNodes = await getGuideTree(locale, hubKey);
  /* The questions that belong to this stage of the move. They used to live on
     a single /faq page where a reader had to know to look for them. */
  const hubFaqs = getFaqsByHub(hubKey);
  const faqSchema = faqPageJsonLd(hubFaqs);

  return (
    <div className="min-h-screen bg-background">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-10 pt-14 text-center sm:pb-14 sm:pt-20 2xl:max-w-3xl">
        <span className="eyebrow">{t(`${hubKey}.badge`)}</span>
        <h1 className="rise rise-1 mt-3 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t(`${hubKey}.title`)} <span className="text-bloom">{t(`${hubKey}.titleHighlight`)}</span>
        </h1>
        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t(`${hubKey}.subtitle`)}
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
        {hubGuides.length > 0 && (
          <section className="reveal">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                {t("guidesTitle")}
              </h2>
              <Link
                href="/guides"
                className={`group flex shrink-0 items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80 ${hub.acc}`}
              >
                {t("allGuides")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* The tree, scoped to this hub. First topic open so the page
                never lands as a wall of closed rows. */}
            <div className="mt-5 rounded-[1.75rem] bg-card p-4 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-6 dark:shadow-none dark:ring-1 dark:ring-border">
              <GuideGraph
                nodes={treeNodes}
                defaultOpenIds={treeNodes[0] ? [treeNodes[0].id] : []}
              />
            </div>
          </section>
        )}

        {helpers.length > 0 && (
          <section className="reveal mt-14">
            <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {t("helpersTitle")}
            </h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {helpers.map((helper) => (
                <Link
                  key={helper.key}
                  href={helper.chatPath!}
                  className="group flex items-center gap-4 rounded-xl bg-card px-4 py-3.5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.1)] dark:shadow-none dark:ring-1 dark:ring-border dark:hover:bg-zinc-800/60"
                >
                  {helper.avatar && (
                    <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm">
                      <Image
                        src={helper.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    {/* Task first, name second. */}
                    <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {tTools(`tools.${helper.key}.title`)}
                    </span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {tTools(`tools.${helper.key}.description`)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {hubFaqs.length > 0 && (
          <section id="questions" className="reveal mt-14 scroll-mt-24">
            <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {t("questionsTitle")}
            </h2>
            <div className="mt-5">
              <FaqTopicGrid faqs={hubFaqs} hub={hub} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
