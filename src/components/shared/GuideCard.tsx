import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Guide, ContentTag } from "@/types";
import { fmtUpdated } from "@/lib/date";

interface GuideCardProps {
  guide: Guide;
  className?: string;
  showCategory?: boolean;
}

const tagColors: Record<ContentTag, string> = {
  newcomer: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  urgent: "border-red-500/30 bg-red-500/10 text-red-400",
  documents: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  tips: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  official: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  "community-verified": "border-teal-500/30 bg-teal-500/10 text-teal-400",
  "budget-friendly": "border-green-500/30 bg-green-500/10 text-green-400",
  "time-sensitive": "border-orange-500/30 bg-orange-500/10 text-orange-400",
};

export function GuideCard({ guide, className, showCategory = true }: GuideCardProps) {
  return (
    <Link href={`/guides/${guide.slug}`} className={cn("group block", className)}>
      <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:shadow-md dark:hover:shadow-none">
        {/* Subtle gradient on hover */}
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/0 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/10" />

        {/* Content */}
        <div className="relative">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {showCategory && (
              <Badge 
                variant="secondary" 
                className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 font-medium capitalize text-zinc-700 dark:text-zinc-300"
              >
                {guide.categoryKey.replace(/-/g, " ")}
              </Badge>
            )}
            {guide.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                className={cn("border text-xs", tagColors[tag])}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {guide.title}
          </h3>

          {/* Summary */}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {guide.summary}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {guide.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {fmtUpdated(guide.lastUpdated)}
              </span>
            </div>
            <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400 transition-transform group-hover:translate-x-0.5">
              Read
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
