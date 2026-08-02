"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Guide } from "@/types";

const categoryStyles: Record<string, string> = {
  "rent-housing": "group-hover:text-amber-700 dark:group-hover:text-amber-500",
  "kvr-residence": "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  "university-life": "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  career: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
  "useful-apps": "group-hover:text-rose-600 dark:group-hover:text-rose-400",
};

interface GuideCardProps {
  guide: Guide;
  className?: string;
  showCategory?: boolean;
}

export function GuideCard({ guide, className, showCategory = true }: GuideCardProps) {
  const t = useTranslations("guidePage");
  const hoverColor =
    categoryStyles[guide.categoryKey] || "group-hover:text-zinc-600 dark:group-hover:text-zinc-300";

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn("group block py-6 sm:py-8 outline-none", className)}
    >
      <div className="flex flex-col h-full transition-transform duration-500 group-hover:-translate-y-1">
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          {showCategory && (
            <>
              <span className="text-zinc-500 dark:text-zinc-300">
                {guide.categoryKey.replace(/-/g, " ")}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </>
          )}
          <span>
            {guide.readingTime} {t("minRead")}
          </span>
        </div>

        {/* Separator Line */}
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800 mb-6 transition-colors group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700" />

        {/* Title */}
        <h3
          className={cn(
            "font-display text-xl sm:text-2xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors duration-300",
            hoverColor
          )}
        >
          {guide.title}
        </h3>

        {/* Summary */}
        <p className="mt-4 line-clamp-3 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 flex-grow">
          {guide.summary}
        </p>

        {/* Read More */}
        <div className="mt-8 flex items-center font-bold uppercase tracking-widest text-[11px] text-zinc-900 dark:text-zinc-50 transition-all duration-300 opacity-50 group-hover:opacity-100">
          EXPLORE
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function GuideCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("block py-6 sm:py-8", className)}>
      <div className="flex flex-col h-full">
        <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-4 animate-pulse" />
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800 mb-6" />
        <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800 mb-2 animate-pulse" />
        <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 mb-6 animate-pulse" />
        <div className="space-y-2 mb-8">
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
        </div>
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    </div>
  );
}
