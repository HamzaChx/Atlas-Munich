import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Guide, ContentTag } from "@/types";
import { fmtUpdated } from "@/lib/date";

/**
 * GuideCard component following premium UI principles:
 */
interface GuideCardProps {
  guide: Guide;
  className?: string;
  showCategory?: boolean;
}

const tagColors: Record<ContentTag, string> = {
  newcomer: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  urgent: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  documents: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  tips: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  official: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "community-verified": "border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "budget-friendly": "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  "time-sensitive": "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function GuideCard({ guide, className, showCategory = true }: GuideCardProps) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn(
        "group block outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl",
        className
      )}
    >
      <div className="relative h-56 sm:h-60 overflow-hidden rounded-2xl border border-zinc-200 dark:border-border bg-white dark:bg-zinc-900/50 p-4 sm:p-6 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col justify-between">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 ease-out group-hover:bg-emerald-500/10" />

        {/* Content */}
        <div className="relative">
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {showCategory && (
              <Badge
                variant="secondary"
                className="border-zinc-200 dark:border-border bg-zinc-100 dark:bg-foreground/[0.075] font-medium capitalize text-zinc-700 dark:text-zinc-300 text-xs"
              >
                {guide.categoryKey.replace(/-/g, " ")}
              </Badge>
            )}
            {guide.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} className={cn("border text-xs font-medium", tagColors[tag])}>
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="line-clamp-2 text-base sm:text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {guide.title}
          </h3>

          <p className="mt-2 sm:mt-3 line-clamp-2 text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {guide.summary}
          </p>

          <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-zinc-100 dark:border-border/70 pt-3 sm:pt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {guide.readingTime} min
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {fmtUpdated(guide.lastUpdated)}
              </span>
            </div>
            <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
              Read
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GuideCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("block", className)}>
      <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-border bg-white dark:bg-zinc-900/50 p-6">
        <div className="space-y-4">
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded-full skeleton" />
            <div className="h-5 w-16 rounded-full skeleton" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded skeleton" />
            <div className="h-5 w-3/4 rounded skeleton" />
          </div>

          {/* Summary skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-5/6 rounded skeleton" />
          </div>

          {/* Footer skeleton */}
          <div className="mt-5 flex items-center justify-between border-t border-zinc-100 dark:border-border/70 pt-4">
            <div className="flex gap-4">
              <div className="h-4 w-16 rounded skeleton" />
              <div className="h-4 w-20 rounded skeleton" />
            </div>
            <div className="h-4 w-12 rounded skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
