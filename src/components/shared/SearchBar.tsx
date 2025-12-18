"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    if (onSearch) {
      onSearch(query.trim());
      setIsSearching(false);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
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
            "absolute left-3 text-zinc-400",
            size === "lg" ? "h-5 w-5" : "h-4 w-4"
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
            "pr-20 border-zinc-200 dark:border-white/20 bg-white dark:bg-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 shadow-lg dark:shadow-2xl shadow-zinc-200/50 dark:shadow-emerald-500/10 backdrop-blur-xl focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 focus-visible:shadow-emerald-200 dark:focus-visible:shadow-emerald-500/20",
            size === "lg"
              ? "h-14 pl-12 text-lg"
              : "h-10 pl-10 text-sm",
            "rounded-full border-2"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-white",
              showButton ? "right-24" : "right-3",
              size === "lg" ? "right-28" : ""
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
              "absolute right-1 rounded-full bg-emerald-600 hover:bg-emerald-500",
              size === "lg" ? "h-12 px-6" : "h-8 px-4"
            )}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className={size === "lg" ? "text-base" : "text-sm"}>
                Search
              </span>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
