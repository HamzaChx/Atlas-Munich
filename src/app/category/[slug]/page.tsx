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
  Sparkles,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

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

  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryByKey(slug);

  if (!category) {
    notFound();
  }

  const categoryGuides = getGuidesByCategory(category.key as CategoryKey);
  const IconComponent = iconMap[category.icon] || Icons.Folder;

  const breadcrumbs = [{ label: "Categories", href: "/guides" }, { label: category.title }];

  // Get unique tags from guides
  const allTags = Array.from(new Set(categoryGuides.flatMap((g) => g.tags)));

  // Get featured guide (first one or one with most reading time/content)
  const featuredGuide = categoryGuides[0];
  const remainingGuides = categoryGuides.slice(1);

  // Calculate total reading time
  const totalReadingTime = categoryGuides.reduce((acc, g) => acc + g.readingTime, 0);

  // Get gradient colors based on category
  const gradientMap: Record<string, { from: string; to: string; accent: string }> = {
    "rent-housing": { from: "from-blue-500", to: "to-cyan-500", accent: "blue" },
    "kvr-residence": { from: "from-emerald-500", to: "to-teal-500", accent: "emerald" },
    "university-life": { from: "from-purple-500", to: "to-pink-500", accent: "purple" },
    "halal-food": { from: "from-orange-500", to: "to-red-500", accent: "orange" },
    career: { from: "from-rose-500", to: "to-pink-500", accent: "rose" },
    "useful-apps": { from: "from-indigo-500", to: "to-violet-500", accent: "indigo" },
  };

  const gradient = gradientMap[category.key] || {
    from: "from-emerald-500",
    to: "to-teal-500",
    accent: "emerald",
  };

  // Background color classes based on category
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
    <div className={`min-h-screen ${bgColor}`}>
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10">
        {/* Dynamic gradient background based on category */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/5 via-transparent ${gradient.to}/5 dark:${gradient.from}/10 dark:via-transparent dark:${gradient.to}/10`}
        />

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className={`absolute -left-[20%] top-0 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br ${gradient.from}/30 ${gradient.to}/30 blur-[120px]`}
          />
          <div
            className={`absolute -right-[10%] bottom-0 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br ${gradient.to}/25 ${gradient.from}/25 blur-[100px]`}
            style={{ animationDelay: "1s" }}
          />
          <div
            className={`absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-br ${gradient.from}/20 ${gradient.to}/20 blur-[80px]`}
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Main hero content */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left column - Text content */}
            <div>
              {/* Category badge with icon */}
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient.from} ${gradient.to} p-4 text-white shadow-xl shadow-${gradient.accent}-500/25`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Category
                  </span>
                  <Badge
                    className={`w-fit border-${gradient.accent}-300 dark:border-${gradient.accent}-500/30 bg-${gradient.accent}-100 dark:bg-${gradient.accent}-500/10 text-${gradient.accent}-700 dark:text-${gradient.accent}-300`}
                  >
                    {categoryGuides.length} {categoryGuides.length === 1 ? "guide" : "guides"}{" "}
                    available
                  </Badge>
                </div>
              </div>

              {/* Title with gradient */}
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                {category.title}
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {category.description}
              </p>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-zinc-200 dark:border-white/10">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {categoryGuides.length} Guides
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-zinc-200 dark:border-white/10">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {totalReadingTime} min read
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-zinc-200 dark:border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Community verified
                  </span>
                </div>
              </div>

              {/* Search bar */}
              <div className="mt-8 max-w-md">
                <SearchBar placeholder={`Search in ${category.title}...`} showButton={false} />
              </div>
            </div>

            {/* Right column - Featured guide preview (if exists) */}
            {featuredGuide && (
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-20 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 blur-2xl" />

                <Card className="relative overflow-hidden border-2 border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-2xl">
                  {/* Featured label */}
                  <div
                    className={`absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r ${gradient.from} ${gradient.to} px-3 py-1 text-xs font-semibold text-white shadow-lg`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </div>

                  {/* Gradient top border */}
                  <div className={`h-1.5 bg-gradient-to-r ${gradient.from} ${gradient.to}`} />

                  <div className="p-6 sm:p-8">
                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {featuredGuide.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {featuredGuide.title}
                    </h3>

                    {/* Summary */}
                    <p className="mt-3 line-clamp-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {featuredGuide.summary}
                    </p>

                    {/* Meta info */}
                    <div className="mt-6 flex items-center gap-4 border-t border-zinc-100 dark:border-white/10 pt-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredGuide.readingTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Community verified
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Button
                      asChild
                      size="lg"
                      className={`mt-6 w-full bg-gradient-to-r ${gradient.from} ${gradient.to} hover:opacity-90 transition-opacity`}
                    >
                      <Link href={`/guides/${featuredGuide.slug}`}>
                        Start Reading
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative">
        {/* Subtle background that blends with page color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:from-transparent dark:via-zinc-950/50 dark:to-zinc-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  All Guides
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {featuredGuide ? "More Guides" : "Browse Guides"}
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {featuredGuide
                  ? `Explore ${remainingGuides.length} more guides in this category`
                  : `Explore all guides in ${category.title}`}
              </p>
            </div>

            {/* Tags filter */}
            {allTags.length > 0 && (
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Quick filters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 5).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 capitalize transition-all hover:scale-105"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {allTags.length > 5 && (
                    <Badge
                      variant="outline"
                      className="border-zinc-200 dark:border-white/10 text-zinc-400"
                    >
                      +{allTags.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Guides grid */}
          {(featuredGuide ? remainingGuides : categoryGuides).length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(featuredGuide ? remainingGuides : categoryGuides).map((guide, index) => (
                <div
                  key={guide.slug}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GuideCard guide={guide} showCategory={false} />
                </div>
              ))}
            </div>
          ) : !featuredGuide ? (
            <EmptyState
              type="guides"
              title={`No guides in ${category.title} yet`}
              description="We're working on adding content to this category. Check back soon!"
              action={{ label: "Browse all guides", href: "/guides" }}
            />
          ) : null}

          {/* Explore other categories CTA */}
          <div className="mt-16 rounded-3xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-8 sm:p-12">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
                  Looking for something else?
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Explore other categories or browse all our community guides
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="lg" className="border-2">
                  <Link href="/guides">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Guides
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className={`bg-gradient-to-r ${gradient.from} ${gradient.to} hover:opacity-90`}
                >
                  <Link href="/search">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Search Everything
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
