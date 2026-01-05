import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

/**
 * CategoryCard component following premium UI principles:
 * - Rule 6: Visual hierarchy obvious in under 1 second
 * - Rule 17: One primary action per screen
 * - Rule 34: Hover states required on desktop
 * - Rule 35: Animations 150-300ms
 * - Rule 44: Micro-interactions sparingly but intentionally
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  count?: number | string;
  className?: string;
}

export function CategoryCard({
  title,
  description,
  href,
  icon,
  color,
  count,
  className,
}: CategoryCardProps) {
  // Dynamically get icon component
  const IconComponent = iconMap[icon] || Icons.Folder;

  return (
    <Link 
      href={href} 
      className={cn(
        "group block outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl", 
        className
      )}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-white/20 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none">
        {/* Gradient glow on hover - Rule 44: Micro-interactions */}
        <div className={cn(
          "absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-all duration-500 ease-out group-hover:opacity-30",
          color.includes("blue") ? "bg-blue-500" :
          color.includes("emerald") || color.includes("teal") ? "bg-emerald-500" :
          color.includes("purple") || color.includes("pink") ? "bg-purple-500" :
          color.includes("orange") || color.includes("red") ? "bg-orange-500" :
          color.includes("rose") ? "bg-rose-500" :
          color.includes("indigo") || color.includes("violet") ? "bg-indigo-500" :
          "bg-emerald-500"
        )} />

        {/* Content */}
        <div className="relative">
          {/* Header - Rule 6: Visual hierarchy */}
          <div className="mb-5 flex items-start justify-between">
            <div
              className={cn(
                "rounded-xl bg-gradient-to-br p-3.5 text-white shadow-lg transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105",
                color
              )}
            >
              <IconComponent className="h-6 w-6" />
            </div>
            {count !== undefined && (
              <Badge 
                variant="secondary" 
                className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                {count} {typeof count === "number" && count === 1 ? "guide" : "guides"}
              </Badge>
            )}
          </div>

          {/* Title - Rule 25: Headings communicate meaning */}
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {title}
          </h3>

          {/* Description - Rule 24: Break content */}
          <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>

          {/* CTA - Rule 17: Clear action */}
          <div className="mt-5 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Explore
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
