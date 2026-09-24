"use client";

// ============================================
// Atlas Munich – FAQ directory
//
// Every question on the site in one place. The first render shows all
// topics with every answer in the markup, and that render is what gets
// prerendered, so a crawler (or a reader without JavaScript) receives the
// full text. The filter pills and search only narrow what is already there.
//
// Questions are native <details>, so they open and close without script,
// and `/faq#faq-kvr-3` deep links open their question once mounted.
//
// No icons on this page (a standing design rule): topic chips are a tint
// square holding the topic's accent dot, and the disclosure marker is a
// `+` that turns 45 degrees.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { FaqTopicKey } from "@/lib/faq-topics";

export interface FaqTopicView {
  key: FaqTopicKey;
  title: string;
  description: string;
  /** Hub that covers this topic in depth, with its label. */
  hubHref: string;
  hubLabel: string;
  faqs: { id: string; question: string; answer: string }[];
}

/** Literal classes, including the open-state variants, so Tailwind can see them. */
export const TOPIC_ACCENTS: Record<
  FaqTopicKey,
  { tint: string; acc: string; dot: string; openTint: string; openAcc: string }
> = {
  general: {
    tint: "bg-tint-green",
    acc: "text-acc-green",
    dot: "bg-acc-green",
    openTint: "group-open:bg-tint-green",
    openAcc: "group-open:text-acc-green",
  },
  "rent-housing": {
    tint: "bg-tint-terra",
    acc: "text-acc-terra",
    dot: "bg-acc-terra",
    openTint: "group-open:bg-tint-terra",
    openAcc: "group-open:text-acc-terra",
  },
  "kvr-residence": {
    tint: "bg-tint-blue",
    acc: "text-acc-blue",
    dot: "bg-acc-blue",
    openTint: "group-open:bg-tint-blue",
    openAcc: "group-open:text-acc-blue",
  },
  "university-life": {
    tint: "bg-tint-teal",
    acc: "text-acc-teal",
    dot: "bg-acc-teal",
    openTint: "group-open:bg-tint-teal",
    openAcc: "group-open:text-acc-teal",
  },
  career: {
    tint: "bg-tint-plum",
    acc: "text-acc-plum",
    dot: "bg-acc-plum",
    openTint: "group-open:bg-tint-plum",
    openAcc: "group-open:text-acc-plum",
  },
  "useful-apps": {
    tint: "bg-tint-saffron",
    acc: "text-acc-saffron",
    dot: "bg-acc-saffron",
    openTint: "group-open:bg-tint-saffron",
    openAcc: "group-open:text-acc-saffron",
  },
  "halal-food": {
    tint: "bg-tint-green",
    acc: "text-acc-green",
    dot: "bg-acc-green",
    openTint: "group-open:bg-tint-green",
    openAcc: "group-open:text-acc-green",
  },
};

type Filter = FaqTopicKey | "all";

export function FaqDirectory({ topics }: { topics: FaqTopicView[] }) {
  const t = useTranslations("faq");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  /* Open the question a deep link points at. Runs on mount and on later
     in-page hash changes (the mobile search overlay links here). */
  React.useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith("faq-")) return;
      const el = document.getElementById(id);
      if (!(el instanceof HTMLDetailsElement)) return;
      setFilter("all");
      setQuery("");
      el.open = true;
      requestAnimationFrame(() => el.scrollIntoView({ block: "center" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (faq: { question: string; answer: string }) =>
    !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);

  const visibleTopics = topics
    .filter((topic) => filter === "all" || topic.key === filter)
    .map((topic) => ({ ...topic, visible: topic.faqs.filter(matches) }))
    .filter((topic) => topic.visible.length > 0);

  const total = topics.reduce((sum, topic) => sum + topic.faqs.length, 0);
  const shown = visibleTopics.reduce((sum, topic) => sum + topic.visible.length, 0);

  return (
    <div>
      {/* Filters and search */}
      <div className="sticky top-(--header-h) z-20 -mx-4 bg-background px-4 pb-4 pt-3 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="h-11 w-full rounded-full bg-card px-5 text-sm text-zinc-900 shadow-[0_1px_8px_rgb(0_0_0/0.06)] outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zellige/50 sm:max-w-md dark:text-zinc-50 dark:shadow-none dark:ring-1 dark:ring-border"
          />
          <div
            role="group"
            aria-label={t("topics")}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={t("filters.all")}
              count={total}
              tint="bg-tint-green"
              acc="text-acc-green"
            />
            {topics.map((topic) => {
              const accent = TOPIC_ACCENTS[topic.key];
              return (
                <FilterPill
                  key={topic.key}
                  active={filter === topic.key}
                  onClick={() => setFilter(filter === topic.key ? "all" : topic.key)}
                  label={topic.title}
                  count={topic.faqs.length}
                  tint={accent.tint}
                  acc={accent.acc}
                  dot={accent.dot}
                />
              );
            })}
          </div>
        </div>
      </div>

      {q && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
          {shown} {shown === 1 ? t("results.result") : t("results.results")} {t("results.for")}{" "}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">“{query.trim()}”</span>
        </p>
      )}

      {visibleTopics.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] bg-card px-6 py-12 text-center dark:ring-1 dark:ring-border">
          <p className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {t("noResults")}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("noResultsDescription")}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-12">
          {visibleTopics.map((topic) => {
            const accent = TOPIC_ACCENTS[topic.key];
            return (
              <section key={topic.key} aria-labelledby={`topic-${topic.key}`}>
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      accent.tint
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", accent.dot)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2
                      id={`topic-${topic.key}`}
                      className="font-display text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50"
                    >
                      {topic.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {topic.description}{" "}
                      <Link
                        href={topic.hubHref}
                        className={cn(
                          "whitespace-nowrap font-semibold underline-offset-4 hover:underline",
                          accent.acc
                        )}
                      >
                        {topic.hubLabel}
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {topic.visible.map((faq) => (
                    <details
                      key={faq.id}
                      id={faq.id}
                      className="group scroll-mt-40 rounded-2xl bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] transition-colors dark:shadow-none dark:ring-1 dark:ring-border"
                    >
                      <summary
                        className={cn(
                          "flex cursor-pointer list-none items-start gap-4 rounded-2xl px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 [&::-webkit-details-marker]:hidden",
                          "group-open:rounded-b-none",
                          accent.openTint
                        )}
                      >
                        <span
                          className={cn(
                            "flex-1 text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-50",
                            accent.openAcc
                          )}
                        >
                          {faq.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-px text-xl leading-none text-zinc-400 transition-transform duration-300 group-open:rotate-45",
                            accent.openAcc
                          )}
                        >
                          +
                        </span>
                      </summary>
                      <p className="px-5 pb-5 pt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  tint,
  acc,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tint: string;
  acc: string;
  dot?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zellige/50",
        active
          ? cn(tint, acc, "dark:ring-1 dark:ring-border")
          : "bg-card text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:ring-1 dark:ring-border dark:hover:text-zinc-50"
      )}
    >
      {dot && <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {label}
      <span className={cn("tabular-nums", active ? "opacity-80" : "text-zinc-400")}>{count}</span>
    </button>
  );
}
