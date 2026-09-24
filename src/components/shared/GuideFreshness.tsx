"use client";

// ============================================
// Atlas Munich – guide freshness
//
// Every guide says when its facts were last checked and which official page
// they rest on. Visa and work rules change (the Werkstudent limit moved from
// 120 to 140 days in 2024 and sat unflagged here for over a year), so a
// reader deserves to know how old the check is before relying on it.
//
// Pages are prerendered, so "is this stale?" answered at build time would go
// quietly wrong on a site that is not rebuilt for months. The server's answer
// is used for the first paint (and for crawlers), then recomputed in the
// browser against the reader's own clock.
// ============================================

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { fmtLongDate, freshnessAt, type Freshness } from "@/lib/date";

/** Server value first, then the reader's clock once mounted. */
export function useFreshness(verifiedAt: string, initial: Freshness): Freshness {
  const [freshness, setFreshness] = React.useState(initial);
  React.useEffect(() => {
    setFreshness(freshnessAt(verifiedAt));
  }, [verifiedAt]);
  return freshness;
}

interface GuideFreshnessProps {
  verifiedAt: string;
  source: { title: string; url: string };
  initial: Freshness;
  className?: string;
}

/** The full block for the top of a guide: date, source, and a warning once stale. */
export function GuideFreshness({ verifiedAt, source, initial, className }: GuideFreshnessProps) {
  const t = useTranslations("guidePage");
  const locale = useLocale();
  const { stale, months } = useFreshness(verifiedAt, initial);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("h-2 w-2 rounded-full", stale ? "bg-acc-saffron" : "bg-acc-green")}
          />
          <time dateTime={verifiedAt}>
            {t("lastVerified", { date: fmtLongDate(verifiedAt, locale) })}
          </time>
        </span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <span>
          {t("officialSource")}:{" "}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-current dark:text-zinc-200 dark:decoration-zinc-600"
          >
            {source.title}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </span>
      </p>

      {stale && (
        <div
          role="note"
          className="w-full max-w-2xl rounded-2xl bg-tint-saffron px-5 py-4 text-left dark:ring-1 dark:ring-border"
        >
          <p className="font-display text-[15px] font-bold text-zinc-900 dark:text-zinc-50">
            {t("staleTitle", { months })}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {t("staleBody")}{" "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-acc-saffron underline underline-offset-4"
            >
              {t("checkSource")}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

/** One line for cards: coloured dot plus either the date or the age. */
export function FreshnessBadge({
  verifiedAt,
  initial,
  className,
}: {
  verifiedAt: string;
  initial: Freshness;
  className?: string;
}) {
  const t = useTranslations("guidePage");
  const locale = useLocale();
  const { stale, months } = useFreshness(verifiedAt, initial);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", stale ? "bg-acc-saffron" : "bg-acc-green")}
      />
      <time dateTime={verifiedAt}>
        {stale
          ? t("checkedAgo", { months })
          : t("lastVerified", { date: fmtLongDate(verifiedAt, locale) })}
      </time>
    </span>
  );
}
