"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAllFaqs } from "@/data/faqs";
import { FAQ } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/* One hue per topic, on the landing tint system. Colour alone carries the
   topic, no icons: a tint chip with the topic's accent dot. */
const topics: {
  key: string;
  tint: string;
  text: string;
  dot: string;
}[] = [
  { key: "general", tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  { key: "rent-housing", tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  { key: "kvr-residence", tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  { key: "university-life", tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  { key: "career", tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  { key: "useful-apps", tint: "bg-tint-saffron", text: "text-acc-saffron", dot: "bg-acc-saffron" },
];

const topicOf = (faq: FAQ) =>
  topics.find((topic) => topic.key === (faq.categoryKey ?? "general")) ?? topics[0];

/* A single question card: closed = quiet white card, open = washed in its topic tint */
function QuestionCard({
  faq,
  open,
  onToggle,
  topicTag,
}: {
  faq: FAQ;
  open: boolean;
  onToggle: () => void;
  topicTag?: string;
}) {
  const topic = topicOf(faq);

  return (
    <div
      id={faq.id}
      className={cn(
        "scroll-mt-32 rounded-2xl transition-colors duration-200",
        open
          ? cn(topic.tint, "dark:ring-1 dark:ring-border")
          : "bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] dark:bg-foreground/[0.075] dark:shadow-none"
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${faq.id}-answer`}
        className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left"
      >
        <span className="min-w-0">
          {topicTag && (
            <span
              className={cn(
                "mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                open ? "bg-card/80" : topic.tint,
                topic.text
              )}
            >
              {topicTag}
            </span>
          )}
          <span
            className={cn(
              "block text-[15px] font-semibold leading-snug transition-colors duration-200",
              open ? topic.text : "text-zinc-900 dark:text-zinc-50"
            )}
          >
            {faq.question}
          </span>
        </span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
            open ? cn("bg-card", topic.text) : "bg-zinc-100 text-zinc-500 dark:bg-foreground/10 dark:text-zinc-400"
          )}
        >
          <span
            className={cn(
              "block text-lg font-light leading-none transition-transform duration-300",
              open && "rotate-45"
            )}
            aria-hidden="true"
          >
            +
          </span>
        </span>
      </button>

      {open && (
        <div
          id={`${faq.id}-answer`}
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="prose prose-sm max-w-none px-5 pb-5 text-zinc-700 dark:prose-invert dark:text-zinc-200 prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-zellige prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations("faq");
  const tc = useTranslations("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [openId, setOpenId] = useState<string | null>(null);

  const allFaqs = getAllFaqs();
  const isSearching = searchQuery.trim().length > 0;

  const topicLabel = (key: string) => (key === "general" ? t("general") : tc(`${key}.title`));
  const topicDescription = (key: string) =>
    key === "general" ? t("generalDescription") : tc(`${key}.description`);

  const countByTopic = useMemo(() => {
    const counts: Record<string, number> = {};
    allFaqs.forEach((faq) => {
      const key = faq.categoryKey ?? "general";
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, [allFaqs]);

  const visibleFaqs = useMemo(() => {
    if (isSearching) {
      const query = searchQuery.toLowerCase();
      return allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      );
    }
    return allFaqs.filter((faq) => (faq.categoryKey ?? "general") === selectedTopic);
  }, [allFaqs, searchQuery, selectedTopic, isSearching]);

  // Deep links like /faq#faq-kvr-3 select the topic and open the question
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash.startsWith("faq-")) return;
    const faq = allFaqs.find((item) => item.id === hash);
    if (!faq) return;
    setSelectedTopic(faq.categoryKey ?? "general");
    setOpenId(hash);
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "center" });
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTopic = (key: string) => {
    setSelectedTopic(key);
    setSearchQuery("");
    setOpenId(null);
  };

  const activeTopic = topics.find((topic) => topic.key === selectedTopic) ?? topics[0];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-12 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>

        {/* Search: looks across every topic at once */}
        <div className="rise rise-3 relative mt-8 w-full">
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenId(null);
            }}
            className="h-13 w-full rounded-full bg-card px-6 text-base text-zinc-900 shadow-[0_6px_24px_rgb(0_0_0/0.08)] outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zellige/40 dark:bg-foreground/[0.075] dark:text-zinc-50 dark:shadow-none dark:placeholder:text-zinc-500 dark:ring-1 dark:ring-border dark:focus:ring-zellige/40"
          />
          {/* No clear button here: the results row above the list already has one,
              and it only ever shows while a search is active. */}
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
                        ? cn(topic.tint, topic.text, "dark:ring-1 dark:ring-border")
                        : "bg-card text-zinc-600 shadow-sm dark:bg-foreground/[0.075] dark:text-zinc-400 dark:shadow-none"
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
      <section className="mx-auto max-w-6xl 2xl:max-w-[96rem] px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 lg:pt-4 2xl:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 2xl:gap-12">
          {/* Topic cards: filters, each wearing its own hue */}
          <aside className="hidden lg:col-span-4 lg:block">
            <nav className="sticky top-24" aria-label={t("topics")}>
              <p className="eyebrow mb-4">{t("topics")}</p>
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
                          ? cn(topic.tint, "dark:ring-1 dark:ring-border")
                          : "bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] hover:-translate-y-0.5 hover:shadow-md dark:bg-foreground/[0.075] dark:shadow-none dark:hover:bg-foreground/10"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                          active ? "bg-card shadow-sm" : topic.tint
                        )}
                      >
                        <span className={cn("h-2.5 w-2.5 rounded-full", topic.dot)} aria-hidden="true" />
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
            </nav>
          </aside>

          {/* Questions for the selected topic, or search results */}
          <div className="mt-6 lg:col-span-8 lg:mt-0">
            {isSearching ? (
              <div key="search" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {visibleFaqs.length}
                    </span>{" "}
                    {visibleFaqs.length === 1 ? t("results.result") : t("results.results")}{" "}
                    {t("results.for")} &ldquo;
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">{searchQuery}</span>
                    &rdquo;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 text-sm font-semibold text-zellige hover:underline"
                  >
                    {t("results.clearFilters")}
                  </button>
                </div>

                {visibleFaqs.length > 0 ? (
                  <div className="space-y-2.5">
                    {visibleFaqs.map((faq) => (
                      <QuestionCard
                        key={faq.id}
                        faq={faq}
                        open={openId === faq.id}
                        onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                        topicTag={topicLabel(faq.categoryKey ?? "general")}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-card px-6 py-14 text-center shadow-[0_1px_8px_rgb(0_0_0/0.05)] dark:bg-foreground/[0.075] dark:shadow-none">
                    <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {t("noResults")}
                    </p>
                    <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {t("noResultsDescription")}
                    </p>
                  </div>
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
                    <span className={cn("h-2.5 w-2.5 rounded-full", activeTopic.dot)} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                      {topicLabel(selectedTopic)}{" "}
                      <span className="text-sm font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                        {countByTopic[selectedTopic] ?? 0}
                      </span>
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {topicDescription(selectedTopic)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {visibleFaqs.map((faq) => (
                    <QuestionCard
                      key={faq.id}
                      faq={faq}
                      open={openId === faq.id}
                      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== CTA ========== */}
        <div className="reveal mt-14 rounded-[2rem] bg-tint-green p-8 text-center sm:mt-20 sm:p-10 dark:ring-1 dark:ring-border">
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {t("cta.title")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-base text-zinc-600 dark:text-zinc-300">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides"
              className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              {t("cta.browseGuides")}
            </Link>
            <Link
              href="/about#contact"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
            >
              {t("cta.contactUs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
