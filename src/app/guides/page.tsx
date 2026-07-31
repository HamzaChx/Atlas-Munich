"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Callout, EmptyState } from "@/components/shared";

import { guides } from "@/data/guides";
import {
  Search,
  ArrowRight,
  X,
  BookOpen,
  Home,
  FileText,
  GraduationCap,
  Briefcase,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/* One hue and icon per topic, on the landing tint system */
const topics: {
  key: string;
  icon: LucideIcon;
  tint: string;
  text: string;
  dot: string;
}[] = [
  { key: "all", icon: BookOpen, tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  { key: "rent-housing", icon: Home, tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  { key: "kvr-residence", icon: FileText, tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  { key: "university-life", icon: GraduationCap, tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  { key: "career", icon: Briefcase, tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  { key: "useful-apps", icon: Smartphone, tint: "bg-tint-saffron", text: "text-acc-saffron", dot: "bg-acc-saffron" },
];

const topicFor = (categoryKey: string) =>
  topics.find((topic) => topic.key === categoryKey) ?? topics[0];

function GuidesPageContent() {
  const t = useTranslations("guides");
  const tCat = useTranslations("categories");
  const tHome = useTranslations("home");
  const common = useTranslations("common");
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Keep the field in sync if the page is reached with a different ?q= while
  // already mounted (e.g. a second search from the header without a full reload).
  useEffect(() => {
    const paramQuery = searchParams.get("q") ?? "";
    setSearchQuery((current) => (paramQuery !== current ? paramQuery : current));
  }, [searchParams]);

  const isSearching = searchQuery.trim().length > 0;

  const topicLabel = (key: string) => (key === "all" ? t("list.title") : tCat(`${key}.title`));

  const countByTopic = useMemo(() => {
    const counts: Record<string, number> = { all: guides.length };
    guides.forEach((guide) => {
      counts[guide.categoryKey] = (counts[guide.categoryKey] ?? 0) + 1;
    });
    return counts;
  }, []);

  // Indexed with the localized topic label so "housing" matches "logement" in French too.
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
    [t, tCat]
  );

  const visibleGuides = useMemo(() => {
    if (isSearching) {
      return fuse.search(searchQuery.trim()).map((result) => result.item);
    }
    if (selectedTopic === "all") return guides;
    return guides.filter((guide) => guide.categoryKey === selectedTopic);
  }, [searchQuery, selectedTopic, isSearching, fuse]);

  const selectTopic = (key: string) => {
    setSelectedTopic(key);
    setSearchQuery("");
  };

  const activeTopic = topicFor(selectedTopic);
  const guideNoun = (count: number) => (count === 1 ? common("guide") : common("guides"));

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-12 sm:pt-20">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {t("subtitle")}{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {t("subtitleHighlight")}
          </span>
        </p>

        {/* Search: filters the index in place */}
        <div className="rise rise-3 relative mt-8 w-full">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-13 w-full rounded-full bg-card pl-13 pr-12 text-base text-zinc-900 shadow-[0_6px_24px_rgb(0_0_0/0.08)] outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zellige/40 dark:bg-white/5 dark:text-white dark:shadow-none dark:placeholder:text-zinc-500 dark:ring-1 dark:ring-white/10 dark:focus:ring-zellige/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label={t("results.clear")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* ========== MOBILE TOPIC PILLS ========== */}
      {!isSearching && (
        <div className="sticky top-14 z-30 bg-background py-3 shadow-[0_12px_16px_-12px_rgb(0_0_0/0.06)] sm:top-16 lg:hidden">
          <div className="overflow-x-auto px-4 hide-scrollbar-mobile sm:px-6">
            <div className="flex min-w-max items-center gap-1.5">
              {topics.map((topic) => {
                const active = selectedTopic === topic.key;
                return (
                  <button
                    key={topic.key}
                    onClick={() => selectTopic(topic.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                      active
                        ? cn(topic.tint, topic.text, "dark:ring-1 dark:ring-white/10")
                        : "bg-card text-zinc-600 shadow-sm dark:bg-white/5 dark:text-zinc-400 dark:shadow-none"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", topic.dot)} aria-hidden="true" />
                    {topicLabel(topic.key)}
                    <span className="text-xs tabular-nums opacity-60">
                      {countByTopic[topic.key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========== BROWSER ========== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 lg:pt-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Topic cards: filters, each wearing its own hue */}
          <aside className="hidden lg:col-span-4 lg:block">
            <nav className="sticky top-24" aria-label={t("categoriesSection.badge")}>
              <p className="eyebrow mb-4">{t("categoriesSection.badge")}</p>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const active = selectedTopic === topic.key && !isSearching;
                  return (
                    <button
                      key={topic.key}
                      onClick={() => selectTopic(topic.key)}
                      aria-pressed={active}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all duration-200",
                        active
                          ? cn(topic.tint, "dark:ring-1 dark:ring-white/10")
                          : "bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                          active ? "bg-card shadow-sm" : topic.tint
                        )}
                      >
                        <topic.icon className={cn("h-[18px] w-[18px]", topic.text)} />
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm font-semibold",
                          active ? topic.text : "text-zinc-800 dark:text-zinc-100"
                        )}
                      >
                        {topicLabel(topic.key)}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium tabular-nums",
                          active ? topic.text : "text-zinc-400 dark:text-zinc-500"
                        )}
                      >
                        {countByTopic[topic.key] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <Callout variant="warning" title={t("callout.title")}>
                  {t("callout.body")}
                </Callout>
              </div>
            </nav>
          </aside>

          {/* Guides for the selected topic, or search results */}
          <div className="mt-6 lg:col-span-8 lg:mt-0">
            {isSearching ? (
              <div key="search" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="text-base font-bold text-zinc-900 dark:text-white">
                      {visibleGuides.length}
                    </span>{" "}
                    {guideNoun(visibleGuides.length)} {t("results.for")} &ldquo;
                    <span className="font-medium text-zinc-900 dark:text-white">{searchQuery}</span>
                    &rdquo;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 text-sm font-semibold text-zellige hover:underline"
                  >
                    {t("results.clear")}
                  </button>
                </div>

                {visibleGuides.length === 0 && (
                  <EmptyState
                    type="guides"
                    title={t("noResults")}
                    description={t("noResultsDescription")}
                  />
                )}
              </div>
            ) : (
              <div
                key={selectedTopic}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* Topic header */}
                <div className="mb-5 flex items-start gap-3.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:hidden",
                      activeTopic.tint
                    )}
                  >
                    <activeTopic.icon className={cn("h-[18px] w-[18px]", activeTopic.text)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                      {topicLabel(selectedTopic)}{" "}
                      <span className="text-sm font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                        {countByTopic[selectedTopic] ?? 0}
                      </span>
                    </h2>
                    {selectedTopic !== "all" && (
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {tCat(`${selectedTopic}.description`)}
                      </p>
                    )}
                  </div>
                  {selectedTopic !== "all" && (
                    <Link
                      href={`/category/${selectedTopic}`}
                      className={cn(
                        "hidden shrink-0 items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80 sm:inline-flex",
                        activeTopic.text
                      )}
                    >
                      {common("explore")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Guide cards */}
            {visibleGuides.length > 0 && (
              <div className="space-y-2.5">
                {visibleGuides.map((guide) => {
                  const topic = topicFor(guide.categoryKey);
                  return (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10 sm:p-5"
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          topic.tint
                        )}
                      >
                        <topic.icon className={cn("h-[18px] w-[18px]", topic.text)} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-zellige dark:text-white">
                          {guide.title}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                          {guide.summary}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-sm tabular-nums text-zinc-400 dark:text-zinc-500 sm:block">
                        {guide.readingTime} {tHome("featured.minRead")}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-zellige dark:text-zinc-600" />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Callout shown inline on mobile, in the rail on desktop */}
            <div className="mt-6 lg:hidden">
              <Callout variant="warning" title={t("callout.title")}>
                {t("callout.body")}
              </Callout>
            </div>
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="reveal mt-14 rounded-[2rem] bg-tint-saffron p-8 text-center sm:mt-20 sm:p-10 dark:ring-1 dark:ring-white/10">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.browseFaqs")}
            </Link>
            <Link
              href="/about#contribute"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-white/10"
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

export default function GuidesPage() {
  return (
    <Suspense fallback={null}>
      <GuidesPageContent />
    </Suspense>
  );
}
