import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, GuideCard, EmptyState } from "@/components/shared";
import { categories, getCategoryByKey } from "@/data/categories";
import { getGuidesByCategory } from "@/data/guides";
import { CategoryKey } from "@/types";
import * as Icons from "lucide-react";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

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

  const { defaultLocale } = await import("@/i18n");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = (await import(`../../../../messages/${defaultLocale}.json`)).default;

  const localizedTitle = messages?.categories?.[category.key]?.title ?? category.title;
  const localizedDescription =
    messages?.categories?.[category.key]?.description ?? category.description;

  return {
    title: localizedTitle,
    description: localizedDescription,
    keywords: [
      localizedTitle,
      `${localizedTitle} Munich`,
      `${localizedTitle} guide`,
      "Munich guide",
      "Atlas Munich",
      "Moroccan students Munich",
    ],
    openGraph: {
      title: `${localizedTitle} | Atlas Munich`,
      description: localizedDescription,
      type: "website",
      url: `https://atlas-munich.de/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedTitle} | Atlas Munich`,
      description: localizedDescription,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryByKey(slug);

  if (!category) {
    notFound();
  }

  const locale = await getLocale();
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

  const rawCategoryGuides = getGuidesByCategory(category.key as CategoryKey);
  const IconComponent = iconMap[category.icon] || Icons.Folder;

  // Apply locale translation overlay to guide cards
  let categoryGuides = rawCategoryGuides;
  if (locale !== "en") {
    try {
      const mod = await import(`@/data/guides.${locale}`);
      const translations = mod.guideTranslations;
      if (translations) {
        categoryGuides = rawCategoryGuides.map((guide) => {
          const t = translations[guide.slug];
          if (!t) return guide;
          return { ...guide, title: t.title ?? guide.title, summary: t.summary ?? guide.summary };
        });
      }
    } catch {
      // fallback to English
    }
  }

  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Guides", href: "/guides" },
    { label: localizedCategoryTitle },
  ];

  const themeMap: Record<string, { from: string; to: string; text: string }> = {
    "rent-housing": {
      from: "from-blue-500",
      to: "to-cyan-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    "kvr-residence": {
      from: "from-emerald-500",
      to: "to-teal-500",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    "university-life": {
      from: "from-purple-500",
      to: "to-pink-500",
      text: "text-purple-600 dark:text-purple-400",
    },
    "halal-food": {
      from: "from-orange-500",
      to: "to-red-500",
      text: "text-orange-600 dark:text-orange-400",
    },
    career: { from: "from-rose-500", to: "to-pink-500", text: "text-rose-600 dark:text-rose-400" },
    "useful-apps": {
      from: "from-indigo-500",
      to: "to-violet-500",
      text: "text-indigo-600 dark:text-indigo-400",
    },
  };

  const theme = themeMap[category.key] || {
    from: "from-emerald-500",
    to: "to-teal-500",
    text: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="min-h-screen">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-white/10">
        {/* Ambient gradient orbs */}
        <div
          className={`pointer-events-none absolute -left-20 top-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br ${theme.from}/20 ${theme.to}/10 blur-[100px]`}
        />
        <div
          className={`pointer-events-none absolute -right-20 bottom-1/4 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] rounded-full bg-gradient-to-br ${theme.to}/20 ${theme.from}/10 blur-[100px]`}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Content */}
          <div className="max-w-2xl">
            {/* Category icon */}
            <div className="mb-6">
              <div
                className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${theme.from} ${theme.to} p-3.5 text-white shadow-lg`}
              >
                <IconComponent className="h-7 w-7" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              {localizedCategoryTitle}
            </h1>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {localizedCategoryDescription}
            </p>

            {/* Minimal inline stats */}
            <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span>
                <span className="font-semibold text-zinc-800 dark:text-white">
                  {categoryGuides.length}
                </span>{" "}
                {categoryGuides.length === 1
                  ? (getMessage("categoryPage.guidesSingular") ?? "guide")
                  : (getMessage("categoryPage.guidesPlural") ?? "guides")}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span>
                <span className="font-semibold text-zinc-800 dark:text-white">
                  {categoryGuides.reduce((acc, g) => acc + g.readingTime, 0)}
                </span>{" "}
                {getMessage("categoryPage.readingSuffix") ?? "min read"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GUIDES GRID ========== */}
      <section className="relative border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 py-12 sm:py-16 lg:py-20">
        {/* Category-themed separator line */}
        <div
          className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${theme.from} ${theme.to} opacity-80`}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className={`h-4 w-4 ${theme.text}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {localizedCategoryTitle}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {(getMessage("categoryPage.browseGuides") ?? "Browse {count} Guides").replace(
                "{count}",
                String(categoryGuides.length)
              )}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {(getMessage("categoryPage.sectionDescription") ?? "").replace(
                "{category}",
                localizedCategoryTitle.toLowerCase()
              )}
            </p>
          </div>

          {/* Grid */}
          {categoryGuides.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {categoryGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} showCategory={false} />
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
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200/60 dark:border-white/10 bg-gradient-to-br from-zinc-50/80 via-white to-zinc-50/50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 p-6 sm:p-8 text-center shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
              {getMessage("categoryPage.exploreMoreTitle") ?? "Looking for something else?"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {getMessage("categoryPage.exploreMoreDesc") ??
                "Explore other categories or browse our complete collection of guides."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                variant="outline"
                className="border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              >
                <Link href="/guides">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getMessage("categoryPage.allGuides") ?? "All Guides"}
                </Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <Link href="/guides">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {getMessage("categoryPage.searchEverything") ?? "Browse All Guides"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
