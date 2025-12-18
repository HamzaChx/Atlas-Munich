import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, GuideCard, SearchBar, EmptyState } from "@/components/shared";
import { categories, getCategoryByKey } from "@/data/categories";
import { getGuidesByCategory } from "@/data/guides";
import { CategoryKey } from "@/types";
import * as Icons from "lucide-react";
import { ArrowLeft, Filter } from "lucide-react";

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

  const breadcrumbs = [
    { label: "Categories", href: "/guides" },
    { label: category.title },
  ];

  // Get unique tags from guides
  const allTags = Array.from(
    new Set(categoryGuides.flatMap((g) => g.tags))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10">
        {/* Moroccan pattern overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg shadow-emerald-500/20">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                  {category.title}
                </h1>
                <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="border-emerald-300 dark:border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    {categoryGuides.length} {categoryGuides.length === 1 ? "guide" : "guides"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search within category */}
          <div className="mt-8 max-w-xl">
            <SearchBar placeholder={`Search in ${category.title}...`} showButton={false} />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
              <Filter className="h-4 w-4" />
              <span>Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 dark:hover:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 capitalize transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Guides grid */}
        {categoryGuides.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} showCategory={false} />
            ))}
          </div>
        ) : (
          <EmptyState 
            type="guides"
            title={`No guides in ${category.title} yet`}
            description="We're working on adding content to this category. Check back soon!"
            action={{ label: "Browse all guides", href: "/guides" }}
          />
        )}

        {/* Back link */}
        <div className="mt-12">
          <Button asChild variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Link href="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all guides
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
