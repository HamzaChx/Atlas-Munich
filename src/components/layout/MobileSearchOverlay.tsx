"use client";

// ============================================
// Atlas Munich – mobile search overlay
//
// Opened by MobileNav's "Search or ask" control. A real search: it live
// filters guides, places and FAQ by title/name as the visitor types, hitting
// /api/search so the (sizeable) content data files never reach the client
// bundle. Asking the assistant is a separate, explicit row at the bottom,
// never triggered automatically by opening this overlay.
// ============================================

import * as React from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { BookOpen, HelpCircle, MapPin, MessageCircle, Search, X, type LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

interface SearchResults {
  guides: { slug: string; title: string; summary: string }[];
  places: { slug: string; name: string; district?: string }[];
  faqs: { id: string; question: string }[];
}

const EMPTY_RESULTS: SearchResults = { guides: [], places: [], faqs: [] };

const ROW =
  "flex min-h-14 flex-col justify-center gap-0.5 rounded-xl px-3 py-2 text-zinc-800 transition-colors active:bg-zinc-100 dark:text-zinc-200 dark:active:bg-foreground/[0.075]";

function ResultGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-1">
      <div className="flex items-center gap-2 px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface MobileSearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
}

export function MobileSearchOverlay({ open, onOpenChange, locale }: MobileSearchOverlayProps) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset and refocus each time the overlay opens, and lock the page behind it.
  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults(EMPTY_RESULTS);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Debounced fetch against the server-side index.
  React.useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: SearchResults) => setResults(data))
        .catch((err: unknown) => {
          if (!(err instanceof DOMException && err.name === "AbortError")) setResults(EMPTY_RESULTS);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open, locale]);

  if (!open || typeof document === "undefined") return null;

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= 2;
  const hasResults = results.guides.length + results.places.length + results.faqs.length > 0;

  const askAtlas = () => {
    onOpenChange(false);
    window.dispatchEvent(new Event("open-chatbot"));
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("searchOrAsk")}
      className="fixed inset-0 z-[70] flex flex-col bg-background animate-in fade-in duration-200 md:hidden"
    >
      <div
        className="flex items-center gap-2 px-3 pb-2"
        style={{ paddingTop: "max(1rem, calc(env(safe-area-inset-top, 0) + 0.75rem))" }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-full bg-zinc-100 pl-10 pr-4 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:bg-foreground/[0.075] dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={t("closeSearch")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 outline-none transition-colors active:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-400 dark:active:bg-foreground/[0.075]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-1 safe-area-bottom">
        {hasQuery && !loading && !hasResults && (
          <p className="px-2 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {t("noResultsFor", { query: trimmed })}
          </p>
        )}

        {hasQuery && loading && (
          <p className="px-2 pt-8 text-center text-sm text-zinc-400 dark:text-zinc-500">{common("loading")}</p>
        )}

        {hasQuery && !loading && results.guides.length > 0 && (
          <ResultGroup label={t("guides")} icon={BookOpen}>
            {results.guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                onClick={() => onOpenChange(false)}
                className={ROW}
              >
                <span className="line-clamp-1 text-[15px] font-semibold">{guide.title}</span>
                <span className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">{guide.summary}</span>
              </Link>
            ))}
          </ResultGroup>
        )}

        {hasQuery && !loading && results.places.length > 0 && (
          <ResultGroup label={t("places")} icon={MapPin}>
            {results.places.map((place) => (
              <Link
                key={place.slug}
                href={`/places?q=${encodeURIComponent(place.name)}`}
                onClick={() => onOpenChange(false)}
                className={ROW}
              >
                <span className="line-clamp-1 text-[15px] font-semibold">{place.name}</span>
                {place.district && (
                  <span className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">{place.district}</span>
                )}
              </Link>
            ))}
          </ResultGroup>
        )}

        {hasQuery && !loading && results.faqs.length > 0 && (
          <ResultGroup label={t("faq")} icon={HelpCircle}>
            {results.faqs.map((faq) => (
              <Link key={faq.id} href={`/faq#${faq.id}`} onClick={() => onOpenChange(false)} className={ROW}>
                <span className="line-clamp-2 text-[15px] font-semibold">{faq.question}</span>
              </Link>
            ))}
          </ResultGroup>
        )}

        <button
          type="button"
          onClick={askAtlas}
          className={cn(
            "mb-6 flex w-full items-center gap-3.5 rounded-2xl bg-zellige-soft px-4 py-4 text-left transition-transform active:scale-[0.99]",
            hasQuery ? "mt-5" : "mt-2"
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zellige text-white dark:text-zinc-950">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-zellige">{t("askAtlasAi")}</span>
            <span className="block text-[13px] text-zinc-600 dark:text-zinc-400">{t("askAtlasAiDesc")}</span>
          </span>
        </button>
      </div>
    </div>,
    document.body
  );
}
