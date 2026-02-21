import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Breadcrumbs, GuideCard, SearchBar, EmptyState } from "@/components/shared";
import { categories, getCategoryByKey } from "@/data/categories";
import { getGuidesByCategory } from "@/data/guides";
import { CategoryKey } from "@/types";
import * as Icons from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Filter,
  Users,
  CheckCircle2,
  Layers,
  Star,
  TrendingUp,
  Target,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

import { getLocale } from "@/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({
    slug: c.key,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryByKey(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  // Attempt to provide localized metadata using the default locale

  const { defaultLocale } = await import("@/i18n");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = (await import(`../../../../messages/${defaultLocale}.json`)).default;

  const localizedTitle = messages?.categories?.[category.key]?.title ?? category.title;
  const localizedDescription =
    messages?.categories?.[category.key]?.description ?? category.description;

  return {
    title: localizedTitle,
    description: localizedDescription,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryByKey(slug);

  if (!category) {
    notFound();
  }

  const locale = await getLocale();
  // Load locale messages and fall back if missing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = (await import(`../../../../messages/${locale}.json`)).default;

  const getMessage = (path: string) => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: any = messages;
    for (const p of parts) {
      res = res?.[p];
      if (res == null) break;
    }
    return res ?? undefined;
  };

  const localizedCategoryTitle = getMessage(`categories.${category.key}.title`) ?? category.title;
  const localizedCategoryDescription =
    getMessage(`categories.${category.key}.description`) ?? category.description;

  const categoryGuides = getGuidesByCategory(category.key as CategoryKey);
  const IconComponent = iconMap[category.icon] || Icons.Folder;

  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Categories", href: "/guides" },
    { label: localizedCategoryTitle },
  ];

  const allTags = Array.from(new Set(categoryGuides.flatMap((g) => g.tags)));
  const featuredGuide = categoryGuides[0];
  const spotlightTags = allTags.slice(0, 5);

  const totalReadingTime = categoryGuides.reduce((acc, g) => acc + g.readingTime, 0);

  // Additional guides after featured (excluding featured from the main list)
  const otherGuides = categoryGuides;

  const themeMap: Record<string, { from: string; to: string; iconShadow: string; badge: string }> =
    {
      "rent-housing": {
        from: "from-blue-500",
        to: "to-cyan-500",
        iconShadow: "shadow-blue-500/25",
        badge:
          "border-blue-300 dark:border-blue-500/30 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
      },
      "kvr-residence": {
        from: "from-emerald-500",
        to: "to-teal-500",
        iconShadow: "shadow-emerald-500/25",
        badge:
          "border-emerald-300 dark:border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      },
      "university-life": {
        from: "from-purple-500",
        to: "to-pink-500",
        iconShadow: "shadow-purple-500/25",
        badge:
          "border-purple-300 dark:border-purple-500/30 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300",
      },
      "halal-food": {
        from: "from-orange-500",
        to: "to-red-500",
        iconShadow: "shadow-orange-500/25",
        badge:
          "border-orange-300 dark:border-orange-500/30 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300",
      },
      career: {
        from: "from-rose-500",
        to: "to-pink-500",
        iconShadow: "shadow-rose-500/25",
        badge:
          "border-rose-300 dark:border-rose-500/30 bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300",
      },
      "useful-apps": {
        from: "from-indigo-500",
        to: "to-violet-500",
        iconShadow: "shadow-indigo-500/25",
        badge:
          "border-indigo-300 dark:border-indigo-500/30 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      },
    };

  const theme = themeMap[category.key] || {
    from: "from-emerald-500",
    to: "to-teal-500",
    iconShadow: "shadow-emerald-500/25",
    badge:
      "border-emerald-300 dark:border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  };

  const bgColorMap: Record<string, string> = {
    "rent-housing": "bg-blue-50/50 dark:bg-blue-950/20",
    "kvr-residence": "bg-emerald-50/50 dark:bg-emerald-950/20",
    "university-life": "bg-purple-50/50 dark:bg-purple-950/20",
    "halal-food": "bg-orange-50/50 dark:bg-orange-950/20",
    career: "bg-rose-50/50 dark:bg-rose-950/20",
    "useful-apps": "bg-indigo-50/50 dark:bg-indigo-950/20",
  };

  const bgColor = bgColorMap[category.key] || "bg-emerald-50/50 dark:bg-emerald-950/20";

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Housing Assistant CTA for rent-housing */}
      {category.key === "rent-housing" && (
        <div className="relative z-20 mx-auto max-w-2xl px-4 pt-8 pb-4 text-center">
          <Link
            href="/housing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all text-lg"
          >
            <span role="img" aria-label="house">
              🏠
            </span>
            Munich Housing Application Assistant
            <span className="ml-2">→</span>
          </Link>
          <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            Paste a WG or apartment listing and get a ready-to-send application message for Munich.
          </p>
        </div>
      )}
      {/* Enhanced Hero Section - Rule 6: Visual hierarchy obvious in 1 second */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 dark:border-white/5">
        {/* Ambient Background Layers - Rule 31: Subtle gradients */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.from}/5 via-transparent ${theme.to}/5 dark:${theme.from}/10 dark:via-transparent dark:${theme.to}/10`}
        />

        {/* Animated Gradient Orbs - Rule 44: Micro-interactions */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className={`absolute -left-[15%] sm:-left-[20%] top-0 h-[280px] w-[280px] sm:h-[520px] sm:w-[520px] animate-pulse rounded-full bg-gradient-to-br ${theme.from}/30 ${theme.to}/30 blur-[80px] sm:blur-[120px]`}
          />
          <div
            className={`absolute -right-[8%] sm:-right-[10%] bottom-0 h-[220px] w-[220px] sm:h-[420px] sm:w-[420px] animate-pulse rounded-full bg-gradient-to-br ${theme.to}/25 ${theme.from}/25 blur-[70px] sm:blur-[110px]`}
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Subtle Pattern Overlay - Rule 13: Whitespace aggressively */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Breadcrumbs - Rule 15: Left alignment */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Left Column - Main Content - Rule 12: Max content width */}
            <div>
              {/* Category Badge & Icon - Rule 6: Visual hierarchy */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div
                  className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${theme.from} ${theme.to} p-4 text-white shadow-2xl ${theme.iconShadow} transition-transform duration-300 hover:scale-105`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {getMessage("categoryPage.categoryLabel") ?? "Category"}
                  </span>
                  <Badge className={`w-fit px-3 py-1 ${theme.badge} font-semibold`}>
                    {categoryGuides.length}{" "}
                    {categoryGuides.length === 1
                      ? (getMessage("categoryPage.guidesSingular") ?? "Guide")
                      : (getMessage("categoryPage.guidesPlural") ?? "Guides")}
                  </Badge>
                </div>
              </div>

              {/* Title - Rule 19: Max 2 font families, Rule 23: Font weight for hierarchy */}
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                {localizedCategoryTitle}
              </h1>

              {/* Description - Rule 21 & 22: 16-18px min, line-height 1.4-1.6 */}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {localizedCategoryDescription}
              </p>

              {/* Stats Grid - Rule 11: 8-point spacing, Rule 16: Group related elements */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/30">
                  <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/20 p-2.5">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {getMessage("categoryPage.guidesPlural") ?? "Guides"}
                    </p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {categoryGuides.length}
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/30">
                  <div className="rounded-xl bg-blue-100 dark:bg-blue-500/20 p-2.5">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {getMessage("categoryPage.reading") ?? "Reading"}
                    </p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {totalReadingTime} min
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500/30">
                  <div className="rounded-xl bg-amber-100 dark:bg-amber-500/20 p-2.5">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {getMessage("categoryPage.status") ?? "Status"}
                    </p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">Verified</p>
                  </div>
                </div>
              </div>

              {/* Search Bar - Rule 4: Reduce cognitive load */}
              <div className="mt-8 max-w-lg">
                <SearchBar
                  placeholder={(
                    getMessage("categoryPage.searchPlaceholder") ?? "Search in {category}..."
                  ).replace("{category}", localizedCategoryTitle)}
                  showButton={false}
                />
              </div>

              {/* Popular Topics - Rule 16: Group related elements visually */}
              {spotlightTags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <Target className="h-3.5 w-3.5" />
                    {getMessage("categoryPage.popularTopics") ?? "Popular Topics"}
                  </span>
                  {spotlightTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      asChild
                      className="border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 capitalize cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-200 hover:scale-105"
                    >
                      <Link href={`/search?q=${encodeURIComponent(tag)}`}>{tag}</Link>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Featured Guide Card - Rule 26: Neutral + accent color */}
            {featuredGuide && (
              <div className="relative">
                {/* Ambient Glow Effects */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-20 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 blur-3xl" />

                <Card className="group relative overflow-hidden border-2 border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-emerald-300 dark:hover:border-emerald-500/30">
                  {/* Gradient Top Bar - Rule 31: Purposeful gradients */}
                  <div className={`h-2 bg-gradient-to-r ${theme.from} ${theme.to}`} />

                  <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                          {getMessage("categoryPage.featuredGuide") ?? "Featured Guide"}
                        </span>
                      </div>
                      <Badge className={`${theme.badge} px-3 py-1 font-semibold`}>
                        {getMessage("categoryPage.spotlight") ?? "Spotlight"}
                      </Badge>
                    </div>

                    {/* Title - Rule 25: Headings communicate meaning */}
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                      {featuredGuide.title}
                    </h3>

                    {/* Summary - Rule 24: Break content every 2-3 lines */}
                    <p className="mt-4 line-clamp-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {featuredGuide.summary}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {featuredGuide.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs capitalize font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta Info Grid */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 px-3.5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {featuredGuide.readingTime}{" "}
                          {getMessage("categoryPage.readingSuffix") ?? "min read"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/80 dark:bg-white/5 px-3.5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">
                          {getMessage("places.card.verified") ?? "Verified"}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button - Rule 17: One primary action, Rule 33: Buttons look clickable */}
                    <Button
                      asChild
                      size="lg"
                      className={`group mt-6 w-full bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200`}
                    >
                      <Link
                        href={`/guides/${featuredGuide.slug}`}
                        className=" inline-flex items-center"
                      >
                        {getMessage("categoryPage.startReading") ?? "Start Reading"}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Guides Section - Rule 13: Aggressive whitespace */}
      <div className="relative">
        {/* Subtle Background Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:from-transparent dark:via-zinc-950/60 dark:to-zinc-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Section Header - Rule 6: Visual hierarchy */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/20 p-2">
                  <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {getMessage("categoryPage.allGuides") ?? "All Guides"}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                {(getMessage("categoryPage.browseGuides") ?? "Browse {count} Guides").replace(
                  "{count}",
                  String(categoryGuides.length)
                )}
              </h2>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                {(getMessage("categoryPage.sectionDescription") ?? "").replace(
                  "{category}",
                  localizedCategoryTitle.toLowerCase()
                )}
              </p>
            </div>

            {/* Quick Filters - Rule 4: Reduce cognitive load */}
            {allTags.length > 0 && (
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Quick Filters</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {allTags.slice(0, 6).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      asChild
                      className="border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 capitalize transition-all duration-200 hover:scale-105"
                    >
                      <Link href={`/search?q=${encodeURIComponent(tag)}`}>{tag}</Link>
                    </Badge>
                  ))}
                  {allTags.length > 6 && (
                    <Badge
                      variant="outline"
                      className="border-zinc-200 dark:border-white/10 text-zinc-400 cursor-default"
                    >
                      +{allTags.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Guides Grid - Rule 18: F-pattern scanning, Rule 43: Avoid layout shifts */}
          {otherGuides.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherGuides.map((guide, index) => (
                <div
                  key={guide.slug}
                  className="relative transform transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 60}ms`,
                    opacity: 1,
                  }}
                >
                  <GuideCard guide={guide} showCategory={false} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="guides"
              title={(
                getMessage("categoryPage.noGuidesTitle") ?? "No guides in {category} yet"
              ).replace("{category}", localizedCategoryTitle)}
              description={
                getMessage("categoryPage.noGuidesDescription") ??
                "We're working on adding content to this category. Check back soon!"
              }
              action={{
                label: getMessage("categoryPage.allGuides") ?? "Browse all guides",
                href: "/guides",
              }}
            />
          )}

          {/* Bottom CTA Section - Rule 45: Empty states guide */}
          <div className="mt-20 rounded-3xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-zinc-50/90 via-white to-zinc-50/90 dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="text-center sm:text-left">
                <div className="mb-2 inline-flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {getMessage("categoryPage.exploreMoreTitle") ?? "Explore More"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  {getMessage("categoryPage.exploreMoreTitle") ?? "Looking for something else?"}
                </h3>
                <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                  {getMessage("categoryPage.exploreMoreDesc") ??
                    "Explore other categories or browse our complete collection of guides"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-zinc-300 dark:border-white/10 font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href="/guides">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {getMessage("categoryPage.allGuides") ?? "All Guides"}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className={`bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all`}
                >
                  <Link href="/search" className="text-white inline-flex items-center">
                    {getMessage("categoryPage.searchEverything") ?? "Search Everything"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
