"use client";

// ============================================
// Atlas Munich – settings
//
// Language and appearance used to be two separate controls sitting in the
// header next to each other, which spent two slots of a very small bar on
// preferences almost nobody changes twice. They are one dropdown now, so the
// bar can carry the journey instead.
// ============================================

import * as React from "react";
import { useTransition } from "react";
import { Check, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export function SettingsMenu({
  currentLocale,
  className,
}: {
  currentLocale: Locale;
  className?: string;
}) {
  const router = useRouter();
  /* Locale-stripped, so the prefix can be swapped without doubling up. */
  const pathname = usePathname();
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const { setTheme, resolvedTheme } = useTheme();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isOpen) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  /* Switching language is a navigation, not a cookie write: each locale has
     its own URL, so the reader keeps their place and can share the link with
     the language intact. */
  const changeLanguage = (locale: Locale) => {
    if (locale === currentLocale) return setIsOpen(false);
    track("language_switch", { from: currentLocale, to: locale });
    setIsOpen(false);
    startTransition(() => router.replace(pathname, { locale }));
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-label={t("settings")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-zinc-600 shadow-sm transition-colors duration-200",
          "hover:bg-muted hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-300 dark:hover:text-zinc-50",
          isOpen && "border-zellige/50 bg-zellige-soft text-zellige",
          isPending && "cursor-not-allowed opacity-50"
        )}
      >
        {isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <Settings className="h-4.5 w-4.5" aria-hidden="true" />
        )}
      </button>

      <div
        role="menu"
        aria-label={t("settings")}
        className={cn(
          "fixed left-3 right-3 top-(--header-h) z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] dark:border-border dark:bg-zinc-900 dark:shadow-none",
          "sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-56",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="p-1">
          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {common("language")}
          </p>
          {languages.map((language) => {
            const isSelected = language.code === currentLocale;
            return (
              <button
                key={language.code}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => changeLanguage(language.code)}
                disabled={isPending}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  isSelected
                    ? "bg-zellige-soft text-zellige"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                )}
              >
                <span className="w-7 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {language.code}
                </span>
                <span className="flex-1 text-left">{language.label}</span>
                {isSelected && <Check className="h-4 w-4 text-zellige" aria-hidden="true" />}
              </button>
            );
          })}

          <div className="my-1 h-px bg-zinc-100 dark:bg-border" />

          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {t("appearance")}
          </p>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={isDark}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
          >
            <span className="flex w-7 justify-center">
              {isDark ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <span className="flex-1 text-left">{t("toggleTheme")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
