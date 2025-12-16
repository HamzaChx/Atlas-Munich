"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Search,
  Home,
  BookOpen,
  HelpCircle,
  Users,
  MapPin,
  Sparkles,
  Github,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Guides", href: "/guides", icon: BookOpen },
  { label: "Places", href: "/places", icon: MapPin },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "About", href: "/about", icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Check if we're on the home page (dark hero)
  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic styles based on scroll and page
  const headerBg = scrolled
    ? "bg-zinc-950/95 backdrop-blur-xl border-b border-white/10"
    : isHomePage
    ? "bg-transparent"
    : "bg-zinc-950 border-b border-white/10";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        headerBg
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
            <img 
              src="/logo.png" 
              alt="Atlas Munich Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Atlas
            </span>{" "}
            <span className="text-white">Munich</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-zinc-400 hover:bg-white/5 hover:text-white sm:flex"
            asChild
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {/* GitHub Link */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-zinc-400 hover:bg-white/5 hover:text-white sm:flex"
            asChild
          >
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          {/* CTA Button */}
          <Button
            asChild
            size="sm"
            className="hidden bg-emerald-600 text-white hover:bg-emerald-500 sm:flex"
          >
            <Link href="/guides">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Explore
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-zinc-950/98 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile Search */}
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Search className="h-5 w-5" />
              Search
            </Link>

            {/* Mobile CTA */}
            <div className="pt-4">
              <Button
                asChild
                className="w-full bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Link href="/guides" onClick={() => setMobileMenuOpen(false)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore All Guides
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
