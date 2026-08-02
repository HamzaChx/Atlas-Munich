"use client";

// ============================================
// Atlas Munich – mobile nav
//
// Not a native tab bar: two flat, floating controls sit in the thumb zone
// instead of a full-width five-icon strip. "Search or ask" is one button
// because the assistant already answers questions about places, guides and
// bureaucracy, so it doubles as the site's search; folding it into a menu
// item would bury the thing this site has that a search engine doesn't. The
// hamburger opens every other destination as a plain full-screen list
// (MobileMenu), not a drawer.
// ============================================

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, Search } from "lucide-react";

import { MobileMenu } from "./MobileMenu";
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

  // The dedicated chat pages own the full viewport and put their composer
  // exactly where this control sits.
  const isChatRoute = /\/chat\/?$/.test(pathname);

  // Close the menu on navigation, since the route change happens underneath it.
  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isChatRoute) return null;

  return (
    <>
      <div
        aria-hidden={menuOpen}
        className={cn(
          "fixed inset-x-4 z-[60] flex items-stretch gap-2 md:hidden",
          menuOpen && "pointer-events-none opacity-0"
        )}
        style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0) + 0.75rem))" }}
      >
        <button
          type="button"
          tabIndex={menuOpen ? -1 : 0}
          onClick={() => {
            haptic();
            window.dispatchEvent(new Event("open-chatbot"));
          }}
          className={cn(CONTROL, "flex-1 gap-2.5 px-4 text-[15px] font-medium text-zinc-500 dark:text-zinc-400")}
        >
          <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {t("searchOrAsk")}
        </button>

        <button
          type="button"
          tabIndex={menuOpen ? -1 : 0}
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
    </>
  );
}
