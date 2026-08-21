"use client";

// ============================================
// Atlas Munich – header
//
// The bar used to be a directory: Home, Guides, Places, Tools, FAQ, About.
// Six destinations named after kinds of page, which asked the reader to work
// out which kind held their answer before they could go anywhere.
//
// It tells the journey now: Map, Studies, Career, Community. Four stages of
// actually moving here. "Home" is gone because the logo has always done that
// job, and About and settings sit apart from the story as chrome.
// ============================================

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { SettingsMenu } from "@/components/shared";
import { Locale } from "@/i18n";

interface NavTranslations {
  map: string;
  ask: string;
  career: string;
  community: string;
  about: string;
  aboutAria: string;
}

interface HeaderProps {
  locale: Locale;
  translations: NavTranslations;
}

export function Header({ locale, translations }: HeaderProps) {
  /* From @/i18n/navigation, so the path arrives locale-stripped. The previous
     import from next/navigation meant `/fr/chat` never matched `/chat`
     and no nav item ever highlighted outside English. */
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: translations.ask, href: "/chat" },
    { label: translations.map, href: "/map" },
    { label: translations.career, href: "/career" },
    { label: translations.community, href: "/community" },
  ];

  /* The homepage starts on a quiet, header-safe surface, so the bar can stay
     transparent there. As soon as the reader scrolls—or on any other page—
     the regular theme surface gives the navigation a stable backdrop. */
  const overHomeHero = pathname === "/" && !scrolled;
  const headerBg = overHomeHero
    ? "bg-transparent border-b border-transparent"
    : "bg-background border-b border-border shadow-[0_1px_3px_0_rgb(0_0_0_/_0.05)] dark:shadow-none";

  return (
    <header
      className={cn(
        "safe-area-top fixed top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-500",
        headerBg
      )}
    >
      {/* Three tracks with equal-weight sides, so the nav sits on the page's
          centre line rather than wherever justify-between leaves it. */}
      <div className="mx-auto grid h-14 sm:h-16 max-w-[1280px] 2xl:max-w-[96rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-3 sm:px-6 lg:px-8 2xl:px-12">
        <Link
          href="/"
          className="group flex w-fit items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-2.5"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9 shadow-sm"
          />
          <span className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl">
            <span className="text-zellige">Atlas</span> Munich
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-foreground/10 dark:text-zinc-50"
                    : "text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Chrome, not journey: what the site is, and how you like it served.
            Desktop only; on mobile both live in the More sheet. */}
        <div className="col-start-3 flex items-center justify-self-end gap-1 sm:gap-2">
          <Link
            href="/about"
            aria-label={translations.aboutAria}
            title={translations.about}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card text-zinc-600 shadow-sm transition-colors duration-200 hover:bg-muted hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 md:flex dark:text-zinc-300 dark:hover:text-zinc-50",
              pathname.startsWith("/about") && "border-zellige/50 bg-zellige-soft text-zellige"
            )}
          >
            <HelpCircle className="h-4.5 w-4.5" aria-hidden="true" />
          </Link>
          <SettingsMenu currentLocale={locale} className="hidden md:block" />
        </div>
      </div>
    </header>
  );
}
