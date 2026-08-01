"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { EmptyState } from "@/components/shared";

import type { Guide } from "@/types";
import { Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/* One hue and numeral per topic, mapped chronologically for the Editorial Journey layout */
const topics: {
  key: string;
  numeral: string;
  tint: string;
  text: string;
  border: string;
  glow: string;
  dot: string;
}[] = [
  {
    key: "rent-housing",
    numeral: "01",
    tint: "bg-tint-terra",
    text: "text-acc-terra",
    border: "border-acc-terra/20",
    glow: "hover:shadow-acc-terra/20",
    dot: "bg-acc-terra",
  },
  {
    key: "kvr-residence",
    numeral: "02",
    tint: "bg-tint-blue",
    text: "text-acc-blue",
    border: "border-acc-blue/20",
    glow: "hover:shadow-acc-blue/20",
    dot: "bg-acc-blue",
  },
  {
    key: "university-life",
    numeral: "03",
    tint: "bg-tint-green",
    text: "text-acc-green",
    border: "border-acc-green/20",
    glow: "hover:shadow-acc-green/20",
    dot: "bg-acc-green",
  },
  {
    key: "career",
    numeral: "04",
    tint: "bg-tint-plum",
    text: "text-acc-plum",
    border: "border-acc-plum/20",
    glow: "hover:shadow-acc-plum/20",
    dot: "bg-acc-plum",
  },
  {
    key: "useful-apps",
    numeral: "05",
    tint: "bg-tint-saffron",
    text: "text-acc-saffron",
    border: "border-acc-saffron/20",
    glow: "hover:shadow-acc-saffron/20",
    dot: "bg-acc-saffron",
  },
];

const topicFor = (categoryKey: string) =>
  topics.find((topic) => topic.key === categoryKey) ?? topics[0];

function GuidesPageContent({ guides }: { guides: Guide[] }) {
  const t = useTranslations("guides");
  const tCat = useTranslations("categories");
  const tHome = useTranslations("home");
  const common = useTranslations("common");
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    const paramQuery = searchParams.get("q") ?? "";
    setSearchQuery((current) => (paramQuery !== current ? paramQuery : current));
  }, [searchParams]);

  const isSearching = searchQuery.trim().length > 0;

  const topicLabel = (key: string) => tCat(`${key}.title`);

  const countByTopic = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((guide) => {
      counts[guide.categoryKey] = (counts[guide.categoryKey] ?? 0) + 1;
    });
    return counts;
  }, [guides]);

  const fuse = useMemo(
    () =>
      new Fuse(
        guides.map((guide) => ({ ...guide, topicLabel: topicLabel(guide.categoryKey) })),
        {
          keys: [
            { name: "title", weight: 2 },
            { name: "summary", weight: 1 },
            { name: "topicLabel", weight: 1 },
            { name: "tags", weight: 0.5 },
          ],
          threshold: 0.35,
          ignoreLocation: true,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guides, t, tCat]
  );

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return fuse.search(searchQuery.trim()).map((result) => result.item);
  }, [searchQuery, isSearching, fuse]);

  const guideNoun = (count: number) => (count === 1 ? common("guide") : common("guides"));

  return (
    <div className="min-h-screen bg-background selection:bg-bloom/20 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[50vh] bg-gradient-to-b from-bloom/5 to-transparent dark:from-bloom/10" />

      {/* Hero */}
      <section className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-12 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {t("subtitleHighlight")}
          </span>
        </p>

        {/* Floating Search Bar */}
        <div className="rise rise-3 sticky top-4 z-50 mt-10 w-full max-w-2xl mx-auto shadow-2xl shadow-zinc-900/5 rounded-full dark:shadow-none">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-full border border-zinc-200/80 bg-white/80 pl-14 pr-12 text-base text-zinc-900 shadow-sm backdrop-blur-xl outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zellige/40 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zellige/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label={t("results.clear")}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        {isSearching ? (
          /* Search Results Grid */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {searchResults.length}
                </span>{" "}
                {guideNoun(searchResults.length)} {t("results.for")} &ldquo;
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{searchQuery}</span>
                &rdquo;
              </p>
            </div>

            {searchResults.length === 0 ? (
              <EmptyState
                type="guides"
                title={t("noResults")}
                description={t("noResultsDescription")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((guide) => {
                  const topic = topicFor(guide.categoryKey);
                  return (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className={cn(
                        "group flex flex-col gap-4 rounded-[2rem] border bg-card/60 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-foreground/[0.03]",
                        topic.border,
                        topic.glow
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("h-1 w-6 rounded-full", topic.dot)} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {topicLabel(guide.categoryKey)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold leading-snug text-zinc-900 transition-colors group-hover:text-zellige dark:text-zinc-50">
                          {guide.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {guide.summary}
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                          {guide.readingTime} {tHome("featured.minRead")}
                        </span>
                        <ArrowRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-zellige dark:text-zinc-600" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* The Atlas Editorial Roadmap */
          <div className="relative mt-12 animate-in fade-in duration-700 lg:mt-24">
            {/* The Vertical Path Line */}
            <div className="absolute bottom-0 left-[21px] top-0 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent dark:via-zinc-800 lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-32 lg:space-y-48">
              {topics.map((topic, index) => {
                const topicGuides = guides.filter((g) => g.categoryKey === topic.key);
                if (topicGuides.length === 0) return null;

                const titleOnLeft = index % 2 === 0;

                return (
                  <div key={topic.key} className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    
                    {/* The Center Timeline Dot (Desktop center, mobile left) */}
                    <div className="absolute left-[21px] top-8 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-background bg-zinc-300 ring-4 ring-background dark:border-zinc-950 dark:bg-zinc-600 dark:ring-background lg:left-1/2 lg:top-12 lg:h-4 lg:w-4 lg:border-[3px]" />

                    {/* Milestone Title & Numeral */}
                    <div
                      className={cn(
                        "relative z-10 w-full pl-14 lg:w-1/2 lg:pl-0",
                        titleOnLeft ? "lg:pr-20 lg:text-right" : "lg:order-last lg:pl-20 lg:text-left"
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-col lg:flex-row lg:items-center",
                          titleOnLeft ? "lg:justify-end" : "lg:justify-start"
                        )}
                      >
                        <span
                          className={cn(
                            "font-display text-[5rem] font-black leading-none tracking-tighter opacity-[0.08] selection:bg-transparent dark:opacity-20 sm:text-[7rem] lg:text-[10rem]",
                            topic.text,
                            titleOnLeft ? "lg:order-last lg:ml-6" : "lg:mr-6"
                          )}
                        >
                          {topic.numeral}
                        </span>
                        <div className={cn("mt-2 lg:mt-0")}>
                          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
                            {topicLabel(topic.key)}
                          </h2>
                          <p
                            className={cn(
                              "mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 lg:max-w-sm",
                              titleOnLeft ? "lg:ml-auto" : "lg:mr-auto"
                            )}
                          >
                            {tCat(`${topic.key}.description`)}
                          </p>
                          <div
                            className={cn(
                              "mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
                              topic.text,
                              titleOnLeft ? "lg:justify-end" : "lg:justify-start"
                            )}
                          >
                            {countByTopic[topic.key]} {guideNoun(countByTopic[topic.key])}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guides for this milestone */}
                    <div
                      className={cn(
                        "relative z-10 mt-12 w-full pl-14 lg:mt-0 lg:w-1/2 lg:pl-0",
                        titleOnLeft ? "lg:pl-20" : "lg:order-first lg:pr-20"
                      )}
                    >
                      <div className="space-y-6 lg:space-y-8">
                        {topicGuides.map((guide) => (
                          <Link
                            key={guide.slug}
                            href={`/guides/${guide.slug}`}
                            className={cn(
                              "group block rounded-[2rem] border bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-foreground/[0.03] sm:p-8",
                              topic.border,
                              topic.glow
                            )}
                          >
                            <div className="mb-4 flex items-center gap-3">
                              <span className={cn("h-1 w-6 rounded-full", topic.dot)} />
                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {guide.readingTime} {tHome("featured.minRead")}
                              </span>
                            </div>
                            <h3
                              className={cn(
                                "font-display text-xl font-bold leading-snug text-zinc-900 transition-colors dark:text-zinc-50 sm:text-2xl",
                                `group-hover:${topic.text}`
                              )}
                            >
                              {guide.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                              {guide.summary}
                            </p>
                            <div className="mt-6 flex items-center gap-2 font-semibold transition-colors">
                              <span className={topic.text}>{common("explore")}</span>
                              <ArrowRight
                                className={cn(
                                  "h-4 w-4 transition-transform group-hover:translate-x-1",
                                  topic.text
                                )}
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== CTA ========== */}
        <div className="reveal mt-20 rounded-[2rem] bg-tint-saffron p-8 text-center sm:mt-32 sm:p-10 dark:ring-1 dark:ring-border">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.browseFaqs")}
            </Link>
            <Link
              href="/about#contribute"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
            >
              {t("cta.contributeGuide")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function GuidesBrowser({ guides }: { guides: Guide[] }) {
  return (
    <Suspense fallback={null}>
      <GuidesPageContent guides={guides} />
    </Suspense>
  );
}
