import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, GuideCard, EmptyState } from "@/components/shared";
import { categories, getCategoryByKey } from "@/data/categories";
import { getGuidesByCategory } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { CategoryKey } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { getLocale } from "@/i18n";

const BASE_URL = "https://atlasmunich.de";

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
      url: `https://atlasmunich.de/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedTitle} | Atlas Munich`,
      description: localizedDescription,
    },
  };
}

const categoryNumerals: Record<string, string> = {
  "rent-housing": "01",
  "kvr-residence": "02",
  "university-life": "03",
  career: "04",
  "useful-apps": "05",
};

const categoryStyles: Record<string, string> = {
  "rent-housing": "text-amber-700 dark:text-amber-500",
  "kvr-residence": "text-blue-600 dark:text-blue-400",
  "university-life": "text-emerald-600 dark:text-emerald-400",
  career: "text-purple-600 dark:text-purple-400",
  "useful-apps": "text-rose-600 dark:text-rose-400",
};

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

  const categoryGuides = await localizeGuides(
    getGuidesByCategory(category.key as CategoryKey),
    locale
  );

  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Guides", href: "/guides" },
    { label: localizedCategoryTitle },
  ];

  const categoryUrl = `${BASE_URL}/category/${category.key}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${BASE_URL}${crumb.href}` : categoryUrl,
    })),
  };

  const numeral = categoryNumerals[category.key] || "00";
  const textColor = categoryStyles[category.key] || "text-zinc-900 dark:text-zinc-50";

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ========== EDITORIAL HERO ========== */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-12 flex justify-center">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Numeral & Title */}
            <div className="flex flex-col items-center justify-center mb-6">
              <span
                className={cn(
                  "font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tighter mb-4 opacity-50",
                  textColor
                )}
              >
                {numeral}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {localizedCategoryTitle}
              </h1>
            </div>

            {/* Description */}
            <p className="mx-auto mt-8 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-xl lg:text-2xl max-w-3xl">
              {localizedCategoryDescription}
            </p>

            {/* Minimal Typographic Stats */}
            <div className="mt-12 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              <span>
                {categoryGuides.length}{" "}
                {categoryGuides.length === 1
                  ? (getMessage("categoryPage.guidesSingular") ?? "GUIDE")
                  : (getMessage("categoryPage.guidesPlural") ?? "GUIDES")}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>
                {categoryGuides.reduce((acc, g) => acc + g.readingTime, 0)}{" "}
                MIN READ TOTAL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GUIDES LIST ========== */}
      <section className="relative pb-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {categoryGuides.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
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
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {getMessage("categoryPage.exploreMoreTitle") ?? "Looking for something else?"}
          </h3>
          <p className="mx-auto mt-4 text-base text-zinc-500 dark:text-zinc-400 max-w-md">
            {getMessage("categoryPage.exploreMoreDesc") ??
              "Explore other categories or browse our complete collection of guides."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/guides"
              className={cn(
                "group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors",
                textColor
              )}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {getMessage("categoryPage.allGuides") ?? "All Guides"}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 transition-colors hover:opacity-70"
            >
              Go to Home
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
