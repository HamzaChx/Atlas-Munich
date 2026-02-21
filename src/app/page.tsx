import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard } from "@/components/shared";
import { MunichSkyline, MoroccanCorner, ZelligeBorder, MashrabiyaPattern } from "@/components/home";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { places } from "@/data/places";
import { faqs } from "@/data/faqs";
import { getTranslations } from "next-intl/server";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Users,
  CheckCircle2,
  Heart,
  Compass,
  Coffee,
  Home as HomeIcon,
  FileText,
  ArrowRight,
  Wrench,
  CalendarDays,
} from "lucide-react";

export default async function Home() {
  const t = await getTranslations("home");

  const guideCountByCategory = (key: string) => guides.filter((g) => g.categoryKey === key).length;

  return (
    <div className="min-h-screen">
      {/* ========== HERO ========== */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Moroccan-flag gradient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-red-200/30 to-red-100/10 dark:from-red-700/15 dark:to-red-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br from-green-200/30 to-emerald-100/10 dark:from-green-700/15 dark:to-emerald-600/5 blur-[100px]" />

        {/* Moroccan corner ornaments — desktop only */}
        <MoroccanCorner
          position="top-left"
          className="pointer-events-none absolute left-0 top-0 h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 opacity-60"
        />
        <MoroccanCorner
          position="top-right"
          className="pointer-events-none absolute right-0 top-0 h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 opacity-60"
        />

        {/* Munich Skyline at bottom */}
        <MunichSkyline className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-14 sm:h-20 md:h-28 lg:h-36 opacity-[0.06] sm:opacity-[0.09] lg:opacity-[0.12]" />

        {/* Content */}
        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-22 text-center">
          {/* Flag-colored accent line */}
          <div className="mb-6 flex items-center gap-1">
            <span className="h-1 w-6 rounded-full bg-red-500/60" />
            <span className="h-1 w-6 rounded-full bg-amber-500/60" />
            <span className="h-1 w-6 rounded-full bg-green-500/60" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
            <span className="mt-1 block bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t("heroTitleHighlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {t("heroSubtitle")}{" "}
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {t("heroCommunity")}
            </span>
            {t("heroSubtitle2")}
          </p>

          {/* Search Bar */}
          <div className="mt-7 w-full max-w-lg sm:mt-8">
            <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
          </div>

          {/* Quick Links — horizontal scroll on mobile, grid on sm+ */}
          <div className="mt-5 w-full max-w-lg sm:mt-6">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible hide-scrollbar-mobile">
              {[
                {
                  label: t("quickLinks.findHousing"),
                  href: "/housing",
                  icon: HomeIcon,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-500/10",
                },
                {
                  label: t("quickLinks.halalFood"),
                  href: "/places",
                  icon: Coffee,
                  color: "text-emerald-600 dark:text-emerald-400",
                  bg: "bg-emerald-50 dark:bg-emerald-500/10",
                },
                {
                  label: t("quickLinks.allGuides"),
                  href: "/guides",
                  icon: Compass,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-50 dark:bg-purple-500/10",
                },
                {
                  label: t("quickLinks.aiTools"),
                  href: "/tools",
                  icon: Wrench,
                  color: "text-violet-600 dark:text-violet-400",
                  bg: "bg-violet-50 dark:bg-violet-500/10",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex shrink-0 items-center gap-2 rounded-full ${link.bg} px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all hover:shadow-sm active:scale-[0.97]`}
                >
                  <link.icon className={`h-4 w-4 ${link.color}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400 sm:mt-8">
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">{guides.length}+</span>{" "}
              {t("stats.guides")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">{places.length}+</span>{" "}
              {t("stats.places")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">{faqs.length}+</span>{" "}
              {t("stats.faqsAnswered")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>
              <span className="font-semibold text-zinc-800 dark:text-white">100%</span>{" "}
              {t("stats.free")}
            </span>
          </div>

          {/* Creator credit */}
          <div className="mt-5 flex items-center gap-2.5 justify-center">
            <Image
              src="/hamza.jpeg"
              alt="Hamza Chaouki"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-white/10"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Created by
              <a
                href="https://hamzachaouki.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-semibold text-zinc-900 dark:text-white hover:underline"
              >
                Hamza Chaouki
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-10 sm:py-16">
        {/* Zellige-inspired top border — Moroccan flag colors */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 opacity-80" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 sm:mb-10 text-center">
            <Badge className="mb-3 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              {t("categories.badge")}
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("categories.title")}{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {t("categories.titleHighlight")}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {t("categories.subtitle")}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.key}
                categoryKey={category.key}
                title={category.title}
                description={category.description}
                href={`/category/${category.key}`}
                icon={category.icon}
                color={category.color}
                count={guideCountByCategory(category.key) || "New"}
                className={
                  index === 0
                    ? "col-span-2 lg:col-span-2"
                    : index <= 2
                      ? "lg:col-span-2"
                      : index === 3
                        ? "col-span-2 lg:col-span-2 lg:col-start-2"
                        : "lg:col-span-2"
                }
              />
            ))}
          </div>

          {/* View All */}
          <div className="mt-8 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <Link href="/guides">
                <BookOpen className="mr-2 h-4 w-4" />
                {t("categories.browseAll")}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== AI TOOLS ========== */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-900/50 py-10 sm:py-14 overflow-hidden">
        {/* Subtle mashrabiya lattice background */}
        <MashrabiyaPattern className="pointer-events-none absolute inset-0 text-zinc-400/[0.04] dark:text-white/[0.03]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {/* Text */}
            <div className="max-w-md shrink-0">
              <Badge className="mb-3 border-violet-500/30 bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t("toolsSpotlight.badge")}
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {t("toolsSpotlight.title")}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
                {t("toolsSpotlight.subtitle")}
              </p>
              <Link
                href="/tools"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <Wrench className="h-4 w-4" />
                {t("toolsSpotlight.cta")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Tool cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[480px]">
              <Link
                href="/housing"
                className="group flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3.5 transition-all hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                  <HomeIcon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {t("toolsSpotlight.housingTool")}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.housingToolDesc")}
                  </div>
                </div>
              </Link>

              <a
                href="https://hiro-easier-hiring.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3.5 transition-all hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {t("toolsSpotlight.cvTool")}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.cvToolDesc")}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-3.5 opacity-60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                  <CalendarDays className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {t("toolsSpotlight.eventTool")}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t("toolsSpotlight.eventToolDesc")}
                  </div>
                </div>
                <Badge className="shrink-0 text-[10px] border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  {t("toolsSpotlight.eventToolStatus")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY ========== */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-10 sm:py-16 overflow-hidden">
        {/* Moroccan corner ornaments */}
        <MoroccanCorner
          position="bottom-right"
          className="pointer-events-none absolute right-0 bottom-0 h-28 w-28 sm:h-36 sm:w-36 opacity-40"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-5">
            {/* Content */}
            <div className="lg:col-span-3">
              <Badge className="mb-3 border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Heart className="mr-1.5 h-3.5 w-3.5" />
                {t("community.badge")}
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {t("community.title")}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("community.titleHighlight")}
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("community.description1")}
              </p>
              <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("community.description2")}{" "}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {t("community.atlasName")}
                </span>
                {t("community.description3")}
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button asChild className="text-white bg-emerald-600 hover:bg-emerald-500">
                  <Link href="/about">
                    <Users className="mr-2 h-4 w-4" />
                    {t("community.aboutCommunity")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                >
                  <Link href="/faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("community.commonQuestions")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual card — desktop only */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
              <div className="relative flex flex-col items-center rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800/80 p-10 shadow-sm">
                {/* Moroccan-inspired 8-pointed star as background watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] dark:opacity-[0.06]">
                  <svg viewBox="0 0 100 100" className="h-48 w-48">
                    <g transform="translate(50, 50)">
                      <rect x="-25" y="-25" width="50" height="50" className="fill-emerald-600" />
                      <rect
                        x="-25"
                        y="-25"
                        width="50"
                        height="50"
                        transform="rotate(45)"
                        className="fill-emerald-600"
                      />
                    </g>
                  </svg>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
                  {t("builtTogether")}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {t("byTheCommunity")}
                </p>
                {/* Moroccan flag accent */}
                <div className="mt-4 flex gap-1.5">
                  <span className="h-1.5 w-5 rounded-full bg-red-500/70" />
                  <span className="h-1.5 w-5 rounded-full bg-amber-500/70" />
                  <span className="h-1.5 w-5 rounded-full bg-green-500/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 py-10 sm:py-14">
        {/* Zellige border at top */}
        <ZelligeBorder className="absolute left-0 top-0 h-3 w-full text-emerald-600/10 dark:text-emerald-400/10" />

        {/* Subtle background orb */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-amber-200/15 to-green-200/10 dark:from-amber-800/10 dark:to-green-800/5 blur-[80px]" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Badge className="mb-4 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t("cta.badge")}
          </Badge>

          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {t("cta.title")}
            <span className="block bg-gradient-to-r from-red-600 via-amber-500 to-green-600 dark:from-red-400 dark:via-amber-400 dark:to-green-400 bg-clip-text text-transparent">
              {t("cta.titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            {t("cta.description")}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
            <Button
              asChild
              className="w-full sm:w-auto text-white bg-emerald-600 px-5 hover:bg-emerald-500"
            >
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t("cta.contributeGithub")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border border-zinc-200 dark:border-zinc-700 px-5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Link href="/about">
                {t("cta.learnHow")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 sm:text-sm">
            {[
              { icon: CheckCircle2, text: t("cta.freeForever") },
              { icon: Users, text: t("cta.communityDriven") },
              { icon: Heart, text: t("cta.madeWithLove") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <item.icon className="h-3.5 w-3.5 text-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
