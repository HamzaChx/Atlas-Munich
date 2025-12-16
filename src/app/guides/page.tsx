import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard, GuideCard } from "@/components/shared";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { 
  BookOpen, 
  ChevronRight, 
  Compass, 
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

export const metadata: Metadata = {
  title: "All Guides",
  description: "Comprehensive guides to help you navigate life in Munich as a Moroccan student or professional.",
};

export default function GuidesPage() {
  const guideCountByCategory = (key: string) =>
    guides.filter((g) => g.categoryKey === key).length;

  // Group guides by category
  const guidesByCategory = categories.map((category) => ({
    category,
    guides: guides.filter((g) => g.categoryKey === category.key),
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section - Matching Home Page Style */}
      <section className="relative overflow-hidden border-b border-white/10 pt-16">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="guides-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#guides-pattern)"/>
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">{guides.length}+ Community Guides</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Complete
              <span className="mt-2 block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Munich Playbook
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              From your first day to feeling at home — comprehensive guides written by 
              <span className="text-amber-400"> Moroccans who&apos;ve been there</span>
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-xl">
              <SearchBar placeholder="Search for apartment tips, visa info, halal food..." />
            </div>

            {/* Quick Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              {[
                { label: "Categories", value: categories.length },
                { label: "Total Guides", value: guides.length },
                { label: "Community Verified", value: "100%" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative border-b border-white/10 bg-zinc-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Browse by Topic
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Explore Categories
              </h2>
            </div>
            <Button asChild variant="outline" className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
              <Link href="/search">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Search
              </Link>
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.key}
                title={category.title}
                description={category.description}
                href={`/category/${category.key}`}
                icon={category.icon}
                color={category.color}
                count={guideCountByCategory(category.key) || "New"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Guides by Category */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {guidesByCategory.map(({ category, guides: categoryGuides }) => (
            categoryGuides.length > 0 && (
              <div key={category.key} className="mb-16 last:mb-0">
                {/* Category Header */}
                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-gradient-to-br p-2 ${category.color}`}>
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        {category.title}
                      </h2>
                      <p className="text-sm text-zinc-500">
                        {categoryGuides.length} {categoryGuides.length === 1 ? "guide" : "guides"} available
                      </p>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm"
                    className="text-zinc-400 hover:bg-white/5 hover:text-emerald-400"
                  >
                    <Link href={`/category/${category.key}`}>
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Guides Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryGuides.slice(0, 3).map((guide) => (
                    <GuideCard key={guide.slug} guide={guide} showCategory={false} />
                  ))}
                </div>

                {/* Show more hint if there are more guides */}
                {categoryGuides.length > 3 && (
                  <div className="mt-6 text-center">
                    <Link
                      href={`/category/${category.key}`}
                      className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-emerald-400"
                    >
                      +{categoryGuides.length - 3} more guides in this category
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-gradient-to-br from-emerald-950/50 via-zinc-950 to-teal-950/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Community Knowledge
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Can&apos;t Find What You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Our guides are constantly growing. If you have knowledge to share or need help with something specific, 
            join our community.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500">
              <Link href="/faq">
                Browse FAQs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <Link href="/about">
                Contribute a Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
