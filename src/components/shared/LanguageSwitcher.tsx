"use client";

import * as React from "react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n";
import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
  /** "inline" lays the locales out as tappable pills, for the mobile menu */
  variant?: "dropdown" | "inline";
}

export function LanguageSwitcher({
  currentLocale,
  className,
  variant = "dropdown",
}: LanguageSwitcherProps) {
  const router = useRouter();
  /* The locale-aware pathname: locale prefix stripped, so it can be re-added
     for whichever language is picked. */
  const pathname = usePathname();
  const common = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0];

  /* Switching language is a navigation now, not a cookie write plus a refresh:
     each locale has its own URL, so the reader stays on the page they were on
     and can share the link with the language intact. */
  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) {
      setIsOpen(false);
      return;
    }

    track("language_switch", { from: currentLocale, to: locale });
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (variant === "inline") {
    return (
      <div
        className={cn("flex items-center gap-1.5", className)}
        role="group"
        aria-label={common("language")}
      >
        {languages.map((language) => {
          const isSelected = language.code === currentLocale;
          return (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              disabled={isPending}
              aria-pressed={isSelected}
              className={cn(
                "min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold transition-colors duration-200",
                isSelected
                  ? "bg-zellige-soft text-zellige"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-foreground/[0.075] dark:text-zinc-400 dark:hover:bg-foreground/10",
                isPending && "opacity-50"
              )}
            >
              {language.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger Button - Shows current language code */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold uppercase tracking-wide transition-all duration-300",
          "border border-border/50 bg-card/80 backdrop-blur-md text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-muted hover:text-zinc-900 dark:hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
          isOpen && "border-zellige/50 bg-zellige-soft text-zellige",
          isPending && "opacity-50 cursor-not-allowed"
        )}
        aria-label={common("language")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <>
            <Languages className="h-4 w-4" />
            {currentLanguage.code}
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          // Mobile: fixed panel near top with horizontal padding
          // Desktop (sm and up): absolute dropdown positioned to the right
          "fixed left-3 right-3 top-(--header-h) z-50 overflow-hidden rounded-xl border border-zinc-200 dark:border-border bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:min-w-[160px] sm:fixed-none sm:absolute",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        role="listbox"
        aria-label="Select language"
      >
        <div className="p-1">
          {languages.map((language) => {
            const isSelected = language.code === currentLocale;
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isPending}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isSelected
                    ? "bg-zellige-soft text-zellige"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-foreground/[0.075] hover:text-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                <span className="w-7 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {language.code}
                </span>
                <span className="flex-1 text-left">{language.label}</span>
                {isSelected && <Check className="h-4 w-4 text-zellige" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
