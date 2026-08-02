"use client";

// ============================================
// Atlas Munich – mobile menu
//
// The full destination list plus language/theme/install, opened by the
// hamburger button in MobileNav. Deliberately a plain full-screen page
// overlay rather than a bottom sheet: no drag handle, no rubber-band
// physics, nothing borrowed from native app chrome, just a view that
// replaces the current one and a close button that brings it back.
// ============================================

import * as React from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Download,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Wrench,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

import { LanguageSwitcher, ThemeToggle } from "@/components/shared";
import { useInstallPrompt } from "@/components/pwa/use-install-prompt";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
}

interface MenuLink {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function MobileMenu({ open, onOpenChange, locale }: MobileMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { canInstall, promptInstall } = useInstallPrompt();

  React.useEffect(() => {
    if (!open) return;
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
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

  if (!open || typeof document === "undefined") return null;

  /* The same four journey steps as the desktop bar, then About as chrome.
     "Home" is gone: the wordmark at the top of this sheet does that job. */
  const links: MenuLink[] = [
    { label: t("map"), href: "/map", icon: MapPin },
    { label: t("studies"), href: "/studies", icon: GraduationCap },
    { label: t("career"), href: "/career", icon: Briefcase },
    { label: t("community"), href: "/community", icon: Users },
    { label: t("tools"), href: "/tools", icon: Wrench },
    { label: t("about"), href: "/about", icon: Info },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("moreTitle")}
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-background animate-in fade-in duration-200 md:hidden"
    >
      <div
        className="flex items-center justify-between px-5 pb-2"
        style={{ paddingTop: "max(1rem, calc(env(safe-area-inset-top, 0) + 0.75rem))" }}
      >
        <Link
          href="/"
          onClick={() => onOpenChange(false)}
          className="font-display text-lg font-bold tracking-tight text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-50"
        >
          <span className="text-zellige dark:text-zellige">Atlas</span> Munich
        </Link>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={t("closeMenu")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 outline-none transition-colors active:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-400 dark:active:bg-foreground/[0.075]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-2 safe-area-bottom">
        {links.map((link) => {
          const active = isActive(link.href, link.exact);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex min-h-14 items-center gap-4 rounded-xl px-4 text-[17px] font-semibold transition-colors active:scale-[0.99]",
                active
                  ? "bg-zellige-soft text-zellige"
                  : "text-zinc-800 active:bg-zinc-100 dark:text-zinc-200 dark:active:bg-foreground/[0.075]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}

        {canInstall && (
          <div className="mx-1 mt-5 rounded-2xl bg-tint-green p-4 dark:ring-1 dark:ring-border">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("installApp")}</p>
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

        <div className="mx-1 mt-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {t("language")}
          </p>
          <div className="mt-2.5">
            <LanguageSwitcher currentLocale={locale} variant="inline" />
          </div>
        </div>

        <div className="mx-1 mt-6 mb-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            {t("appearance")}
          </p>
          <div className="mt-2.5 flex min-h-12 items-center gap-3 rounded-xl bg-zinc-100 px-4 dark:bg-foreground/[0.075]">
            <ThemeToggle />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("toggleTheme")}</span>
          </div>
        </div>
      </nav>
    </div>,
    document.body
  );
}
