"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle, LanguageSwitcher } from "@/components/shared";
import { Locale } from "@/i18n";

interface NavTranslations {
  home: string;
  guides: string;
  places: string;
  community: string;
  faq: string;
  about: string;
  search: string;
  toggleTheme: string;
  tools: string;
}

interface HeaderProps {
  locale: Locale;
  translations: NavTranslations;
}

export function Header({ locale, translations }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  const navItems = [
    { label: translations.home, href: "/" },
    { label: translations.guides, href: "/guides" },
    { label: translations.places, href: "/places" },
    { label: translations.tools, href: "/tools" },
    { label: translations.faq, href: "/faq" },
    { label: translations.about, href: "/about" },
  ];

  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = scrolled
    ? "bg-background border-b border-border shadow-[0_1px_3px_0_rgb(0_0_0_/_0.05)] dark:shadow-none"
    : isHomePage
      ? "bg-transparent border-b border-transparent"
      : "bg-background border-b border-border";

  return (
    <header
      className={cn("fixed top-0 z-50 w-full transition-all duration-300 safe-area-top", headerBg)}
    >
      {/* Three tracks with equal-weight sides, so the nav sits on the page's
          centre line rather than wherever justify-between leaves it. */}
      <div className="mx-auto grid h-14 sm:h-16 max-w-[1280px] 2xl:max-w-[96rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-3 sm:px-6 lg:px-8 2xl:px-12">
        <Link
          href="/"
          className="group flex w-fit items-center gap-2 sm:gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9"
          />
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            <span className="text-zellige dark:text-zellige">Atlas</span> Munich
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-foreground/10 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/70 hover:text-zinc-900 dark:hover:bg-foreground/[0.075] dark:hover:text-zinc-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions — desktop only. On mobile, language and theme
            live in the tab bar's More sheet, so the header carries no menu. */}
        <div className="col-start-3 flex items-center justify-self-end gap-1 sm:gap-2">
          <LanguageSwitcher currentLocale={locale} className="hidden md:block" />
          <ThemeToggle className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
