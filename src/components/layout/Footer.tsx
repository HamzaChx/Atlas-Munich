import Link from "next/link";
import { Sparkles, Github, Mail, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Footer component following premium UI principles:
 * - Rule 11: 8-point spacing system
 * - Rule 13: Use whitespace aggressively (luxury brands)
 * - Rule 14: Align everything
 * - Rule 34: Hover states required
 * - Rule 35: Animations 150-300ms
 */

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative overflow-hidden bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      {/* Simple subtle gradient background (replaces decorative SVG pattern) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <div className="h-full w-full bg-gradient-to-t from-emerald-50/60 to-transparent dark:from-emerald-900/30" />
      </div>

      {/* Top gradient line - Moroccan colors */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Rule 11: 8-point spacing system - py-20 = 80px */}
      <div className="relative mx-auto max-w-[1280px] px-3 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-5">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            >
              <div className="flex items-center justify-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-2 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-emerald-500/30 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:shadow-md group-hover:shadow-emerald-500/5">
                <span className="text-lg" role="img" aria-label="Morocco flag">
                  🇲🇦
                </span>
                <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                <span className="text-lg" role="img" aria-label="Germany flag">
                  🇩🇪
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Atlas
                </span>{" "}
                <span className="text-zinc-900 dark:text-white">Munich</span>
              </span>
            </Link>

            <p className="mt-5 sm:mt-6 max-w-sm text-sm sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p>

            {/* Social Links - Rule 34: Hover states required */}
            <div className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3">
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md hover:shadow-emerald-500/5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 active:scale-95"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="mailto:hello@atlas-munich.de"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 shadow-sm dark:shadow-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md hover:shadow-emerald-500/5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 active:scale-95"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              {t("guides")}
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/category/rent-housing"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.housingRent")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/kvr-residence"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.kvrResidence")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/university-life"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.universityLife")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/career"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.careerJobs")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              {t("resources")}
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/places"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.halalPlaces")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.faq")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/category/useful-apps"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.usefulApps")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.search")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              {t("community")}
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.aboutUs")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about#contribute"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.contribute")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about#contact"
                  className="group inline-flex items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-emerald-600 dark:hover:text-emerald-400 outline-none focus-visible:text-emerald-600 dark:focus-visible:text-emerald-400"
                >
                  {t("links.contact")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Rule 14: Align everything */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-zinc-200/80 dark:border-white/8 pt-10 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Atlas Munich. {t("rights")} Hamza Chaouki
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
