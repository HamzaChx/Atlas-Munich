import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { Breadcrumb } from "@/types";

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-zinc-900 dark:text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
