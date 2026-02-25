"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle, LanguageSwitcher } from "@/components/shared";
import { Locale } from "@/i18n";
import {
  Menu,
  X,
  Home,
  BookOpen,
  HelpCircle,
  Wrench,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";

/**
 * Header component following premium UI principles:
 * - Rule 6: Visual hierarchy obvious in under 1 second
 * - Rule 8: UI feels invisible - users focus on content
 * - Rule 17: One primary action per screen (Explore CTA)
 * - Rule 35: Animations 150-300ms
 */

interface NavTranslations {
  home: string;
  guides: string;
  places: string;
  community: string;
  faq: string;
  about: string;
  search: string;
  explore: string;
  exploreAll: string;
  toggleTheme: string;
  tools: string;
}

interface HeaderProps {
  locale: Locale;
  translations: NavTranslations;
}

export function Header({ locale, translations }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const navItems = [
    { label: translations.home, href: "/", icon: Home },
    { label: translations.guides, href: "/guides", icon: BookOpen },
    { label: translations.places, href: "/places", icon: MapPin },
    { label: translations.tools, href: "/tools", icon: Wrench },
    { label: translations.faq, href: "/faq", icon: HelpCircle },
    { label: translations.about, href: "/about", icon: Info },
  ];

  // Check if we're on the home page (dark hero)
  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic styles based on scroll and page - Rule 35: 150-300ms transitions
  const headerBg = scrolled
    ? "bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-200/80 dark:border-white/8 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.05)] dark:shadow-none"
    : isHomePage
      ? "bg-transparent border-b border-transparent"
      : "bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-white/8";

  return (
    <header
      className={cn("fixed top-0 z-50 w-full transition-all duration-300 safe-area-top", headerBg)}
    >
      {/* Rule 12: Max content width 1100-1280px for readability */}
      <div className="mx-auto flex h-14 sm:h-16 max-w-[1280px] items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo - Rule 34: Hover states required */}
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:shadow-sm group-hover:shadow-emerald-500/10">
            <Image
              src="/logo.png"
              alt="Atlas Munich Logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Atlas
            </span>{" "}
            <span className="text-zinc-900 dark:text-white">Munich</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher currentLocale={locale} className="hidden sm:block" />

          {/* Theme Toggle */}
          <ThemeToggle className="hidden sm:flex" />

          {/* CTA Button - Rule 17: One primary action per screen */}
          <Button
            asChild
            size="sm"
            className="hidden bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/30 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex"
          >
            <Link href="/guides">
              <BookOpen className="mr-1.5 h-4 w-4" />
              {translations.explore}
              <ChevronRight className="ml-0.5 h-3.5 w-3.5 opacity-60" />
            </Link>
          </Button>

          {/* Mobile menu button - larger touch target */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Rule 36: Motion to explain cause and effect */}
      <div
        className={cn(
          "border-t border-zinc-200/80 dark:border-white/8 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] safe-area-x",
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] min-h-[48px]",
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 min-h-[48px]">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 min-h-[48px]">
            <ThemeToggle />
            <span>{translations.toggleTheme}</span>
          </div>

          {/* Mobile CTA */}
          <div className="pt-4 pb-2">
            <Button
              asChild
              className="w-full bg-emerald-600 text-white hover:bg-emerald-500 min-h-[48px]"
            >
              <Link href="/guides" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen className="mr-2 h-4 w-4" />
                {translations.exploreAll}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
