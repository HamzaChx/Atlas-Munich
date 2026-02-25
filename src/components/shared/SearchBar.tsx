"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";

/**
 * SearchBar component following premium UI principles:
 * - Rule 8: UI feels invisible - users focus on content
 * - Rule 34: Hover states required
 * - Rule 35: Animations 150-300ms
 * - Rule 39: Feedback immediate after user action
 * - Rule 40: Forms should feel like conversations
 */

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
  placeholder = "Search guides, places, FAQs...",
  className,
  size = "default",
  autoFocus = false,
  onSearch,
  defaultValue = "",
  showButton = true,
}: SearchBarProps) {
  const router = useRouter();
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
    if (!query.trim()) return;

    setIsSearching(true);

    if (onSearch) {
      onSearch(query.trim());
      setIsSearching(false);
    } else {
      router.push(`/guides`);
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
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className={cn(
            inputRightPadding,
            "border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:shadow-md focus:shadow-emerald-500/5 focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 hover:border-zinc-300 dark:hover:border-white/15",
            size === "lg"
              ? "h-12 sm:h-14 pl-10 sm:pl-14 text-base sm:text-lg rounded-xl sm:rounded-2xl"
              : "h-11 pl-11 text-sm rounded-xl",
            "border"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 dark:text-zinc-500 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-white active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
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
              "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 dark:shadow-emerald-500/15 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]",
              size === "lg" ? "h-9 sm:h-11 px-4 sm:px-6" : "h-8 px-4"
            )}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className={size === "lg" ? "text-sm sm:text-base" : "text-sm"}>Search</span>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
