"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { setLocale, type Locale } from "@/i18n";
import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, className }: LanguageSwitcherProps) {
  const router = useRouter();
  const common = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0];

  const handleLanguageChange = async (locale: Locale) => {
    if (locale === currentLocale) {
      setIsOpen(false);
      return;
    }

    await setLocale(locale);
    setIsOpen(false);
    startTransition(() => {
      router.refresh();
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

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger Button - Shows current language flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
          "fixed left-3 right-3 top-14 z-50 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
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
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
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
