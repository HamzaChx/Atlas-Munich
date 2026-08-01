"use client";

// ============================================
// Atlas Munich – mobile tab bar
//
// Five thumb-reachable destinations, always visible, so no journey has to
// start by opening a menu. Mobile only: the desktop header in Header.tsx is
// untouched and this is hidden from `md` up.
//
// "Ask" is centre and elevated because the assistants are the thing this site
// has that a search engine doesn't.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, Home, MapPin, MoreHorizontal, MessageCircle } from "lucide-react";

import { MoreSheet } from "./MoreSheet";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

/** A short tap confirmation on the primary action, where the device offers one. */
function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

const TAB =
  "flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10.5px] font-semibold transition-colors";

export function MobileTabBar({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  // The dedicated chat pages own the full viewport and put their composer
  // exactly where this bar sits.
  const isChatRoute = /\/chat\/?$/.test(pathname);

  // Close the sheet on navigation, since the route change happens underneath it.
  React.useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  if (isChatRoute) return null;

  const tabs = [
    { label: t("home"), href: "/", icon: Home, exact: true },
    { label: t("places"), href: "/places", icon: MapPin, exact: false },
    { label: t("guides"), href: "/guides", icon: BookOpen, exact: false },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <nav
        aria-label={t("moreTitle")}
        className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <div className="mx-auto flex max-w-lg items-stretch gap-1 px-2 pt-1.5 pb-1.5">
          {tabs.map((tab) => {
            const active = isActive(tab.href, tab.exact);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  TAB,
                  active
                    ? "text-zellige"
                    : "text-zinc-500 active:bg-zinc-100 dark:text-zinc-400 dark:active:bg-foreground/[0.075]"
                )}
              >
                <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                {tab.label}
              </Link>
            );
          })}

          {/* Ask — opens the assistant already mounted in the layout, which
              expands to full screen below 640px on its own. */}
          <button
            type="button"
            onClick={() => {
              haptic();
              window.dispatchEvent(new Event("open-chatbot"));
            }}
            className={cn(TAB, "text-zellige")}
          >
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-zellige text-white shadow-[0_6px_16px_-4px_rgb(0_0_0/0.35)] transition-transform active:scale-95 dark:text-zinc-950">
              <MessageCircle className="h-[19px] w-[19px]" aria-hidden="true" />
            </span>
            <span>{t("ask")}</span>
          </button>

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
            className={cn(
              TAB,
              moreOpen
                ? "text-zellige"
                : "text-zinc-500 active:bg-zinc-100 dark:text-zinc-400 dark:active:bg-foreground/[0.075]"
            )}
          >
            <MoreHorizontal className="h-[22px] w-[22px]" aria-hidden="true" />
            {t("more")}
          </button>
        </div>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} locale={locale} />
    </>
  );
}
