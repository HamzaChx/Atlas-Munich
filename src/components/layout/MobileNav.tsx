"use client";

// ============================================
// Atlas Munich – mobile nav
//
// Not a native tab bar: two flat, floating controls sit in the thumb zone
// instead of a full-width five-icon strip. "Search or ask" opens a real
// search overlay (MobileSearchOverlay) that live-filters guides/places/FAQ;
// asking the assistant is a separate, explicit row inside it, never
// triggered just by opening the overlay. The hamburger opens every other
// destination as a plain full-screen list (MobileMenu), not a drawer.
// ============================================

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Download, Menu, Search, X } from "lucide-react";

import { MobileMenu } from "./MobileMenu";
import { MobileSearchOverlay } from "./MobileSearchOverlay";
import { useInstallPrompt } from "@/components/pwa/use-install-prompt";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

/** A short tap confirmation, where the device offers one. */
function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

const CONTROL =
  "flex h-14 items-center justify-center rounded-full bg-card shadow-[0_2px_16px_-4px_rgb(0_0_0/0.18)] ring-1 ring-border outline-none transition-transform active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-zellige/50";

export function MobileNav({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [installHelpOpen, setInstallHelpOpen] = React.useState(false);
  const { canInstall, promptInstall, isIos, isInstalled } = useInstallPrompt();
  const showInstall = !isInstalled && (canInstall || isIos);
  const overlayOpen = menuOpen || searchOpen || installHelpOpen;

  // The dedicated chat pages own the full viewport and put their composer
  // exactly where this control sits.
  const isChatRoute = /\/chat\/?$/.test(pathname);

  // Close whichever overlay is open on navigation, since the route change
  // happens underneath it.
  React.useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setInstallHelpOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!installHelpOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInstallHelpOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [installHelpOpen]);

  if (isChatRoute) return null;

  return (
    <>
      <div
        aria-hidden={overlayOpen}
        className={cn(
          "fixed inset-x-4 z-[60] flex items-stretch gap-2 md:hidden",
          overlayOpen && "pointer-events-none opacity-0"
        )}
        style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0) + 0.75rem))" }}
      >
        <button
          type="button"
          tabIndex={overlayOpen ? -1 : 0}
          onClick={() => {
            haptic();
            setSearchOpen(true);
          }}
          className={cn(
            CONTROL,
            "flex-1 gap-2.5 px-4 text-[15px] font-medium text-zinc-500 dark:text-zinc-400"
          )}
        >
          <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {t("searchOrAsk")}
        </button>

        {showInstall && (
          <button
            type="button"
            tabIndex={overlayOpen ? -1 : 0}
            onClick={async () => {
              haptic();
              if (canInstall) {
                await promptInstall();
                return;
              }
              setInstallHelpOpen(true);
            }}
            aria-label={t("installApp")}
            className={cn(
              CONTROL,
              "w-14 shrink-0 gap-2 px-0 text-sm font-semibold text-zinc-700 min-[380px]:w-auto min-[380px]:px-4 dark:text-zinc-300"
            )}
          >
            <Download className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span className="hidden min-[380px]:inline">{t("install")}</span>
          </button>
        )}

        <button
          type="button"
          tabIndex={overlayOpen ? -1 : 0}
          onClick={() => {
            haptic();
            setMenuOpen(true);
          }}
          aria-expanded={menuOpen}
          aria-label={t("moreTitle")}
          className={cn(CONTROL, "w-14 shrink-0 text-zinc-700 dark:text-zinc-300")}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} locale={locale} />
      <MobileSearchOverlay open={searchOpen} onOpenChange={setSearchOpen} locale={locale} />

      {installHelpOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/35 backdrop-blur-sm"
            onClick={() => setInstallHelpOpen(false)}
            aria-label={t("installHelpClose")}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-help-title"
            className="absolute inset-x-3 rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
            style={{
              bottom: "max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="install-help-title"
                  className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                >
                  {t("installHelpTitle")}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {t("installDesc")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInstallHelpOpen(false)}
                aria-label={t("installHelpClose")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors active:bg-zinc-100 dark:text-zinc-400 dark:active:bg-foreground/[0.075]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-5 space-y-3">
              {[t("installIosStep1"), t("installIosStep2")].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl bg-zinc-100/70 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-foreground/[0.075] dark:text-zinc-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </>
  );
}
