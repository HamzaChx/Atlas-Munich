"use client";

// ============================================
// Atlas Munich – header
//
// The bar used to be a directory: Home, Guides, Places, Tools, FAQ, About.
// Six destinations named after kinds of page, which asked the reader to work
// out which kind held their answer before they could go anywhere.
//
// Four destinations now: Ask, Map, Guides, Community. "Home" is gone because
// the logo has always done that job. On the right, only chrome a reader
// actually uses: the language, visible rather than buried in a gear menu (a
// newcomer reading French should see FR without hunting for it), and the
// theme. About lives in the footer and the mobile menu.
// ============================================

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LanguageSwitcher, ThemeToggle } from "@/components/shared";
import { Locale } from "@/i18n";

interface NavTranslations {
  map: string;
  ask: string;
  guides: string;
  community: string;
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
    { label: translations.guides, href: "/guides" },
    { label: translations.community, href: "/community" },
  ];

  /* The homepage opens on a dark film, so the bar stays transparent there and
     its text turns white. As soon as the reader scrolls (or on any other page)
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
            // Next's image optimizer re-encodes this as an indexed PNG,
            // which some browsers render with the transparent corners
            // filled in solid white. The source is already a small, alpha
            // PNG, so serving it as-is avoids the bug outright.
            unoptimized
            className="h-8 w-8 rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9 shadow-sm"
          />
          <span
            className={cn(
              "font-display text-lg font-bold tracking-tight transition-colors duration-500 sm:text-xl",
              overHomeHero ? "text-hero-cream" : "text-zinc-900 dark:text-zinc-50"
            )}
          >
            <span className={overHomeHero ? "text-hero-cream" : "text-zellige"}>Atlas</span> Munich
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
                  overHomeHero
                    ? "text-hero-cream/85 hover:bg-hero-cream/12 hover:text-hero-cream"
                    : isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-foreground/10 dark:text-zinc-50"
                      : "text-zinc-500 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Chrome, not journey. Desktop only; on mobile both live in the menu sheet. */}
        <div className="col-start-3 hidden items-center justify-self-end gap-2 md:flex">
          <LanguageSwitcher
            currentLocale={locale}
            variant="segmented"
            tone={overHomeHero ? "hero" : "default"}
          />
          <ThemeToggle tone={overHomeHero ? "hero" : "default"} />
        </div>
      </div>
    </header>
  );
}
