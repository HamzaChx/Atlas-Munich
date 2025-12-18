import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard, GuideCard, HeroBadge } from "@/components/shared";
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
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={BookOpen} text={`${guides.length}+ Community Guides`} color="emerald" />

            {/* Title */}
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your Complete
              <span className="mt-2 block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Munich Playbook
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
              From your first day to feeling at home — comprehensive guides written by 
              <span className="font-semibold text-amber-400"> Moroccans who&apos;ve been there</span>
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchBar placeholder="Search for apartment tips, visa info, halal food..." />
            </div>

            {/* Quick Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-base">
              {[
                { label: "Categories", value: categories.length },
                { label: "Total Guides", value: guides.length },
                { label: "Community Verified", value: "100%" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-400">{stat.value}</span>
                  <span className="text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative border-b border-white/10 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Browse by Topic
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
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


      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-900 p-8 text-center backdrop-blur-sm">
            <div className="mb-5 inline-flex rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Can&apos;t Find What You Need?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-base text-zinc-400">
              Our guides are constantly growing. If you have knowledge to share or need help, join our community.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
              >
                Browse FAQs
              </Link>
              <Link
                href="/about#contribute"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                Contribute a Guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
