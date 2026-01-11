import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard } from "@/components/shared";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { places } from "@/data/places";
import { faqs } from "@/data/faqs";
import { getTranslations } from "next-intl/server";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  MapPin,
  HelpCircle,
  Users,
  CheckCircle2,
  Heart,
  Compass,
  Coffee,
  Home as HomeIcon,
  FileText,
  ArrowRight,
} from "lucide-react";

export default async function Home() {
  const t = await getTranslations("home");

  // Quick links for the hero
  const quickLinks = [
    { label: t("quickLinks.findHousing"), href: "/category/rent-housing", icon: HomeIcon },
    { label: t("quickLinks.kvrRegistration"), href: "/category/kvr-residence", icon: FileText },
    { label: t("quickLinks.halalFood"), href: "/places", icon: Coffee },
    { label: t("quickLinks.allGuides"), href: "/guides", icon: Compass },
  ];

  // Stats
  const stats = [
    { value: guides.length, suffix: "+", label: t("stats.guides"), icon: BookOpen },
    { value: places.length, suffix: "+", label: t("stats.places"), icon: MapPin },
    { value: faqs.length, suffix: "+", label: t("stats.faqsAnswered"), icon: HelpCircle },
    { value: "100", suffix: "%", label: t("stats.freeAndOpen"), icon: Heart },
  ];
  const guideCountByCategory = (key: string) => guides.filter((g) => g.categoryKey === key).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Moroccan-Munich Fusion */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - Morocco & Germany colors */}
        <div className="absolute -left-32 top-1/4 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-red-300/50 to-red-200/30 dark:from-red-600/25 dark:to-red-500/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-300/50 to-emerald-200/30 dark:from-green-600/25 dark:to-emerald-500/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 z-[5] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/20 to-white/30 dark:from-amber-500/10 dark:to-white/5 blur-[100px]" />

        {/* Munich Skyline Silhouette - Bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-52 opacity-[0.12] dark:opacity-[0.15]">
          <svg viewBox="0 0 1440 200" className="h-full w-full" preserveAspectRatio="none">
            {/* Main Munich skyline base */}
            <path
              className="fill-zinc-900 dark:fill-white"
              d="M0,200 L0,175
                L40,175 L40,165 L55,165 L55,175
                
                L80,175 L80,140
                L90,140 L90,70 L95,70 L95,52 Q100,35 105,52 L105,70 L110,70 L110,140
                L120,140 L120,70 L125,70 L125,52 Q130,35 135,52 L135,70 L140,70 L140,140
                L150,140 L150,175
                
                L200,175 L200,160 L220,160 L220,175
                L260,175 L260,155 L280,155 L280,175
                
                L320,175 L320,145 L330,145 L330,130 L340,130 L340,145 L350,145 L350,175
                
                L400,175 L400,140
                L415,140 L415,95 L420,95 L420,75 L425,75 L425,55 L430,40 L435,55 L435,75 L440,75 L440,95 L445,95 L445,140
                L460,140 L460,175
                
                L510,175 L510,160 L530,160 L530,175
                
                L170,175 L170,150 L180,150 L180,135 L190,135 L190,120 L200,100 L210,120 L210,135 L220,135 L220,150 L230,150 L230,175
                
                L680,175 L680,160 L700,160 L700,175
                L740,175 L740,155 L760,155 L760,175
                
                L800,175 L800,145 L815,145 L815,160 L830,160 L830,145 L845,145 L845,175
                
                L890,175 L890,160 L910,160 L910,175
                
                L950,175 L950,160 L970,160 L970,175
                
                L1010,175 L1010,155 L1030,155 L1030,175
                
                L1070,175 L1070,160 L1090,160 L1090,175
                L1130,175 L1130,150 L1150,150 L1150,175
                
                L1200,175 L1200,160 L1220,160 L1220,175
                L1260,175 L1260,150 L1280,150 L1280,175
                
                L1320,175 L1320,165 L1340,165 L1340,175
                
                L1440,175 L1440,200 Z"
            />

            {/* === Hochhaus Uptown München (O2 Tower) - rectangular skyscraper === */}
            <g transform="translate(1060, 35)">
              {/* Main rectangular tower body */}
              <rect
                x="0"
                y="20"
                width="40"
                height="140"
                className="fill-zinc-900 dark:fill-white"
              />
            </g>

            {/* === BMW Vier-Zylinder (4 Cylinders) - accurate representation === */}
            {/* Four connected cylindrical towers in a 2x2 cluster */}
            <g transform="translate(1220, 85)">
              {/* Tower 1 - front left */}
              <ellipse cx="0" cy="0" rx="14" ry="6" className="fill-zinc-900 dark:fill-white" />
              <rect
                x="-14"
                y="0"
                width="28"
                height="90"
                className="fill-zinc-900 dark:fill-white"
              />

              {/* Tower 2 - front right */}
              <ellipse cx="30" cy="5" rx="14" ry="6" className="fill-zinc-900 dark:fill-white" />
              <rect x="16" y="5" width="28" height="85" className="fill-zinc-900 dark:fill-white" />

              {/* Tower 3 - back left */}
              <ellipse cx="8" cy="-8" rx="14" ry="6" className="fill-zinc-900 dark:fill-white" />
              <rect
                x="-6"
                y="-8"
                width="28"
                height="98"
                className="fill-zinc-900 dark:fill-white"
              />

              {/* Tower 4 - back right */}
              <ellipse cx="38" cy="-3" rx="14" ry="6" className="fill-zinc-900 dark:fill-white" />
              <rect
                x="24"
                y="-3"
                width="28"
                height="93"
                className="fill-zinc-900 dark:fill-white"
              />
            </g>

            {/* === Olympiaturm (Olympic Tower) - accurate representation === */}
            {/* Main tower shaft */}
            <rect
              x="1370"
              y="55"
              width="10"
              height="120"
              className="fill-zinc-900 dark:fill-white"
            />

            {/* Observation deck / restaurant pod - distinctive bulge */}
            <ellipse cx="1375" cy="55" rx="25" ry="18" className="fill-zinc-900 dark:fill-white" />
            <ellipse cx="1375" cy="45" rx="20" ry="12" className="fill-zinc-900 dark:fill-white" />

            {/* Lower observation deck */}
            <ellipse cx="1375" cy="85" rx="15" ry="8" className="fill-zinc-900 dark:fill-white" />

            {/* Antenna mast */}
            <rect x="1373" y="5" width="4" height="40" className="fill-zinc-900 dark:fill-white" />

            {/* Antenna top */}
            <polygon points="1375,0 1371,8 1379,8" className="fill-zinc-900 dark:fill-white" />

            {/* Frauenkirche dome crosses */}
            <rect x="99" y="28" width="2" height="12" className="fill-zinc-900 dark:fill-white" />
            <rect x="95" y="32" width="10" height="2" className="fill-zinc-900 dark:fill-white" />
            <rect x="129" y="28" width="2" height="12" className="fill-zinc-900 dark:fill-white" />
            <rect x="125" y="32" width="10" height="2" className="fill-zinc-900 dark:fill-white" />

            {/* Rathaus spire cross */}
            <rect x="429" y="25" width="2" height="18" className="fill-zinc-900 dark:fill-white" />
            <rect x="425" y="30" width="10" height="2" className="fill-zinc-900 dark:fill-white" />

            {/* St. Peter's spire cross */}
            <rect x="199" y="90" width="2" height="14" className="fill-zinc-900 dark:fill-white" />
            <rect x="195" y="95" width="10" height="2" className="fill-zinc-900 dark:fill-white" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          {/* Main Title */}
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-6xl lg:text-7xl mt-6">
            {t("heroTitle")}
            <span className="relative mt-2 block">
              <span className="relative z-10  bg-emerald-600 dark:bg-emerald-400 bg-clip-text text-transparent">
                {t("heroTitleHighlight")}
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-green-500/30 blur-xl" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 px-2">
            {t("heroSubtitle")}{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t("heroCommunity")}
            </span>
            {t("heroSubtitle2")}
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 sm:mt-10 w-full max-w-2xl px-2">
            <div className="relative">
              <SearchBar placeholder={t("searchPlaceholder")} size="lg" showButton={false} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <link.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">{link.label}</span>
                <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Stats Bar - aligned cards */}
          <div className="mt-10 sm:mt-14 grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2 items-stretch">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-xl border border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-white/5 p-3 sm:p-4 shadow-sm dark:shadow-none backdrop-blur-sm transition-all hover:border-emerald-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/10 h-full flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                  {stat.value}
                  <span className="text-emerald-600 dark:text-emerald-400">{stat.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm text-zinc-500 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-12 sm:py-20">
        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center px-2">
            <Badge className="mb-4 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              {t("categories.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {t("categories.title")}
              <span className="block text-emerald-600 dark:text-emerald-400">
                {t("categories.titleHighlight")}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              {t("categories.subtitle")}
            </p>
          </div>

          {/* Categories Grid - Bento Style */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
                    ? "sm:col-span-2 lg:col-span-2"
                    : index <= 2
                      ? "lg:col-span-2"
                      : index === 3
                        ? "sm:col-span-2 lg:col-span-2 lg:col-start-2"
                        : "lg:col-span-2"
                }
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-2 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
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

      {/* Community Mission Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 py-12 sm:py-20">
        {/* Gradient orbs */}
        <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-red-400/15 to-red-500/10 dark:from-red-600/10 dark:to-red-500/5 blur-[100px]" />
        <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-green-400/15 to-emerald-500/10 dark:from-green-600/10 dark:to-emerald-500/5 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-md overflow-hidden rounded-2xl">
                {/* Main gradient background with Moroccan colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-amber-500/20 to-green-600/20" />

                {/* Content - Central gathering metaphor */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="relative mb-5">
                    {/* Community circle - people gathering */}
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/50">
                        <span className="text-3xl">🤝</span>
                      </div>
                      {/* Orbiting community members */}
                      <div className="absolute -right-2 -top-2 h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-amber-500 to-red-600 p-1.5 shadow-lg">
                        <span className="flex h-full w-full items-center justify-center text-lg">
                          🇲🇦
                        </span>
                      </div>
                      <div
                        className="absolute -bottom-2 -left-2 h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-green-600 to-emerald-600 p-1.5 shadow-lg"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <span className="flex h-full w-full items-center justify-center text-lg">
                          🏰
                        </span>
                      </div>
                      <div
                        className="absolute -bottom-1 -right-2 h-8 w-8 animate-pulse rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 p-1.5 shadow-lg"
                        style={{ animationDelay: "1s" }}
                      >
                        <span className="flex h-full w-full items-center justify-center text-sm">
                          💚
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-center text-2xl font-bold text-zinc-900 dark:text-white">
                    {t("builtTogether")}
                  </h3>
                  <p className="mt-1 text-center text-base text-zinc-600 dark:text-white/80">
                    {t("byTheCommunity")}
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-3 -top-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 shadow-lg dark:shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-red-100 dark:bg-red-500/20 p-1.5">
                    <span className="text-xl">🇲🇦</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {t("moroccanRoots")}
                    </div>
                    <div className="text-xs text-zinc-500">{t("authenticGuidance")}</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 shadow-lg dark:shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-100 dark:bg-amber-500/20 p-1.5">
                    <span className="text-xl">🏰</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {t("munichLife")}
                    </div>
                    <div className="text-xs text-zinc-500">{t("localExpertise")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <Badge className="mb-3 border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Heart className="mr-1.5 h-3.5 w-3.5" />
                {t("community.badge")}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                {t("community.title")}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("community.titleHighlight")}
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("community.description1")}
              </p>
              <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("community.description2")}{" "}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {t("community.atlasName")}
                </span>
                {t("community.description3")}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="text-white bg-emerald-600 shadow-lg hover:bg-emerald-500"
                >
                  <Link href="/about">
                    <Users className="mr-2 h-4 w-4" />
                    {t("community.aboutCommunity")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                >
                  <Link href="/faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("community.commonQuestions")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Contribute */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 py-12 sm:py-20">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/40 via-transparent to-green-100/40 dark:from-red-950/30 dark:via-zinc-950 dark:to-green-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 dark:from-amber-500/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-5 border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t("cta.badge")}
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {t("cta.title")}
            <span className="block bg-gradient-to-r from-red-600 via-amber-500 to-green-600 dark:from-red-500 dark:via-amber-400 dark:to-green-500 bg-clip-text text-transparent">
              {t("cta.titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            {t("cta.description")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="text-white bg-emerald-600 px-6 shadow-xl shadow-emerald-500/25 hover:bg-emerald-500"
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
              className="border-2 border-zinc-200 dark:border-zinc-700 px-6 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Link href="/about">
                {t("cta.learnHow")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            {[
              { icon: CheckCircle2, text: t("cta.freeForever") },
              { icon: Users, text: t("cta.communityDriven") },
              { icon: Heart, text: t("cta.madeWithLove") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
