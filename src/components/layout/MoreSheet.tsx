"use client";

// ============================================
// Atlas Munich – "More" sheet
//
// Everything the five tabs don't carry: the secondary routes, language and
// theme. It opens over the page instead of navigating, so dismissing it costs
// a swipe rather than a back-navigation.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Download, HelpCircle, Info, Sparkles, type LucideIcon } from "lucide-react";

import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { LanguageSwitcher, ThemeToggle } from "@/components/shared";
import { useInstallPrompt } from "@/components/pwa/use-install-prompt";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
}

interface MoreLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function MoreSheet({ open, onOpenChange, locale }: MoreSheetProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { canInstall, promptInstall } = useInstallPrompt();

  const links: MoreLink[] = [
    { label: t("tools"), href: "/tools", icon: Sparkles },
    { label: t("faq"), href: "/faq", icon: HelpCircle },
    { label: t("about"), href: "/about", icon: Info },
  ];

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent title={t("moreTitle")}>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3.5 rounded-xl px-4 text-base font-medium transition-colors active:scale-[0.99]",
                  isActive
                    ? "bg-zellige-soft text-zellige"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-foreground/[0.075]"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {canInstall && (
          <div className="mt-5 rounded-2xl bg-tint-green p-4 dark:ring-1 dark:ring-border">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t("installApp")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("installDesc")}
            </p>
            <button
              type="button"
              onClick={() => promptInstall()}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("install")}
            </button>
          </div>
        )}

        <div className="mt-6">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {t("language")}
          </p>
          <div className="mt-2.5">
            <LanguageSwitcher currentLocale={locale} variant="inline" />
          </div>
        </div>

        <div className="mt-6">
          <p className="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {t("appearance")}
          </p>
          <div className="mt-2.5 flex min-h-12 items-center gap-3 rounded-xl bg-zinc-100 px-4 dark:bg-foreground/[0.075]">
            <ThemeToggle />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("toggleTheme")}
            </span>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
