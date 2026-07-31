"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "lg";
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  showButton?: boolean;
}

export function SearchBar({
  placeholder,
  className,
  size = "default",
  autoFocus = false,
  onSearch,
  defaultValue = "",
  showButton = true,
}: SearchBarProps) {
  const router = useRouter();
  const common = useTranslations("common");
  const [query, setQuery] = React.useState(defaultValue);
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const inputRightPadding = showButton
    ? size === "lg"
      ? "pr-40"
      : "pr-24"
    : size === "lg"
      ? "pr-12"
      : "pr-10";

  const clearRight = showButton ? (size === "lg" ? "right-28" : "right-20") : "right-3";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    track("search", { query: trimmed.slice(0, 100) });

    if (onSearch) {
      setIsSearching(true);
      onSearch(trimmed);
      setIsSearching(false);
    } else {
      // Navigation unmounts this component, so there's nothing to reset the
      // spinner afterward — only show it for the in-page (onSearch) case.
      router.push(`/guides?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 transition-colors duration-200 pointer-events-none",
            size === "lg" ? "left-3 sm:left-5 h-4 w-4 sm:h-5 sm:w-5" : "left-4 h-4 w-4"
          )}
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder ?? common("searchAction")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className={cn(
            inputRightPadding,
            "border-border bg-card text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-zellige/50 focus:ring-2 focus:ring-zellige/20 focus:shadow-md focus:shadow-zellige/5 focus-visible:border-zellige/50 focus-visible:ring-2 focus-visible:ring-zellige/20 hover:border-zinc-300 dark:hover:border-white/15",
            size === "lg"
              ? "h-12 sm:h-14 pl-10 sm:pl-14 text-base sm:text-lg rounded-full shadow-[0_6px_24px_rgb(0_0_0/0.08)] dark:shadow-none"
              : "h-11 pl-11 text-sm rounded-full",
            "border"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 dark:text-zinc-500 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-white active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
              clearRight
            )}
          >
            <X className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
            <span className="sr-only">Clear search</span>
          </button>
        )}
        {showButton && (
          <Button
            type="submit"
            disabled={isSearching || !query.trim()}
            className={cn(
              "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-zellige text-white dark:text-zinc-950 shadow-md shadow-zellige/25 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 hover:shadow-lg hover:shadow-zellige/30 dark:shadow-zellige/15 focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]",
              size === "lg" ? "h-9 sm:h-11 px-4 sm:px-6" : "h-8 px-4"
            )}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className={size === "lg" ? "text-sm sm:text-base" : "text-sm"}>
                {common("searchAction")}
              </span>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
