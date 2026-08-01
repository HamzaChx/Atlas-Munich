import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  count?: number | string;
  className?: string;
  categoryKey?: string;
}

export function CategoryCard({
  title,
  description,
  href,
  icon,
  count,
  className,
  categoryKey,
}: CategoryCardProps) {
  const t = useTranslations("categories");
  const common = useTranslations("common");

  const displayTitle = categoryKey ? t(`${categoryKey}.title`) : title;
  const displayDescription = categoryKey ? t(`${categoryKey}.description`) : description;
  const IconComponent = iconMap[icon] || Icons.Folder;

  const countLabel =
    typeof count === "number"
      ? `${count} ${count === 1 ? common("guide") : common("guides")}`
      : count !== undefined
        ? common("new")
        : null;

  return (
    <Link
      href={href}
      className={cn(
        "group block outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl",
        className
      )}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm dark:shadow-none transition-all duration-200 hover:-translate-y-1 hover:border-zellige/40 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none">
        <div className="relative">
          <div className="mb-4 sm:mb-5 flex items-start justify-between gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zellige-soft transition-colors duration-300 group-hover:bg-zellige sm:h-12 sm:w-12">
              <IconComponent className="h-5 w-5 text-zellige transition-colors duration-300 group-hover:text-white dark:group-hover:text-zinc-950" />
            </div>
            {countLabel && (
              <span className="rounded-full border border-border bg-zinc-100 dark:bg-foreground/[0.075] px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {countLabel}
              </span>
            )}
          </div>

          <h3 className="font-display text-base sm:text-lg font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors duration-200 group-hover:text-zellige">
            {displayTitle}
          </h3>

          <p className="mt-2 sm:mt-2.5 line-clamp-2 text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {displayDescription}
          </p>

          <div className="mt-5 flex items-center text-sm font-medium text-zellige">
            {common("explore")}
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
