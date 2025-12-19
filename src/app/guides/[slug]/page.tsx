import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Breadcrumbs, 
  TableOfContents, 
  FAQAccordion, 
  GuideCard,
  ShareButton
} from "@/components/shared";
import { guides, getGuideBySlug, getRelatedGuides } from "@/data/guides";
import { getCategoryByKey } from "@/data/categories";
import * as Icons from "lucide-react";
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  FileText,
  Video,
  Link as LinkIcon,
  ChevronRight,
  BookOpen,
  Sparkles,
  Users,
  Calendar,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { fmtUpdated } from "@/lib/date";
import { ContentTag } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: guide.title,
    description: guide.summary,
  };
}

const tagColors: Record<ContentTag, string> = {
  newcomer: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30",
  urgent: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30",
  documents: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30",
  tips: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
  official: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30",
  "community-verified": "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30",
  "budget-friendly": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500/30",
  "time-sensitive": "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-500/30",
};

const resourceIcons = {
  official: FileText,
  document: FileText,
  tool: LinkIcon,
  community: BookOpen,
  video: Video,
};

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const category = getCategoryByKey(guide.categoryKey);
  const relatedGuides = getRelatedGuides(guide);
  const CategoryIcon = category ? iconMap[category.icon] || Icons.Folder : Icons.Folder;

  // Get gradient colors based on category
  const gradientMap: Record<string, { from: string; to: string; accent: string }> = {
    "rent-housing": { from: "from-blue-500", to: "to-cyan-500", accent: "blue" },
    "kvr-residence": { from: "from-emerald-500", to: "to-teal-500", accent: "emerald" },
    "university-life": { from: "from-purple-500", to: "to-pink-500", accent: "purple" },
    "halal-food": { from: "from-orange-500", to: "to-red-500", accent: "orange" },
    "career": { from: "from-rose-500", to: "to-pink-500", accent: "rose" },
    "useful-apps": { from: "from-indigo-500", to: "to-violet-500", accent: "indigo" },
  };

  const gradient = gradientMap[guide.categoryKey] || { from: "from-emerald-500", to: "to-teal-500", accent: "emerald" };

  // Background color classes based on category
  const bgColorMap: Record<string, string> = {
    "rent-housing": "bg-blue-50/30 dark:bg-blue-950/10",
    "kvr-residence": "bg-emerald-50/30 dark:bg-emerald-950/10",
    "university-life": "bg-purple-50/30 dark:bg-purple-950/10",
    "halal-food": "bg-orange-50/30 dark:bg-orange-950/10",
    "career": "bg-rose-50/30 dark:bg-rose-950/10",
    "useful-apps": "bg-indigo-50/30 dark:bg-indigo-950/10",
  };

  const bgColor = bgColorMap[guide.categoryKey] || "bg-emerald-50/30 dark:bg-emerald-950/10";

  const breadcrumbs = [
    { label: "Guides", href: "/guides" },
    { label: category?.title || guide.categoryKey, href: `/category/${guide.categoryKey}` },
    { label: guide.title },
  ];

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Premium Hero Header */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/5">
        {/* Dynamic gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/5 via-transparent ${gradient.to}/5 dark:${gradient.from}/10 dark:via-transparent dark:${gradient.to}/10`} />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <div className={`absolute -left-[15%] top-0 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br ${gradient.from}/40 ${gradient.to}/40 blur-[100px]`} />
          <div className={`absolute -right-[10%] bottom-0 h-[350px] w-[350px] animate-pulse rounded-full bg-gradient-to-br ${gradient.to}/30 ${gradient.from}/30 blur-[80px]`} style={{ animationDelay: "1s" }} />
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="guide-detail-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#guide-detail-pattern)"/>
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            {/* Left column - Main content */}
            <div>
              {/* Category badge with icon */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Link 
                  href={`/category/${guide.categoryKey}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 py-2 shadow-sm transition-all hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-md"
                >
                  <div className={`rounded-lg bg-gradient-to-br ${gradient.from} ${gradient.to} p-1.5 text-white`}>
                    <CategoryIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {guide.categoryKey.replace(/-/g, " ")}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                </Link>
                
                {/* Tags */}
                {guide.tags.map((tag) => (
                  <Badge key={tag} className={`${tagColors[tag]} border`}>
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title with gradient accent */}
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                {guide.title}
              </h1>

              {/* Summary */}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {guide.summary}
              </p>

              {/* Meta stats row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-zinc-200 dark:border-white/10">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{guide.readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-zinc-200 dark:border-white/10">
                  <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Updated {fmtUpdated(guide.lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 shadow-sm border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Community verified</span>
                </div>
              </div>

              {/* Author info if exists */}
              {guide.author && (
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Written by {guide.author}</p>
                    <p className="text-xs text-zinc-500">Atlas Munich Contributor</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Quick action card */}
            <Card className="hidden lg:block relative overflow-hidden border-2 border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-xl">
              {/* Gradient top border */}
              <div className={`h-1.5 bg-gradient-to-r ${gradient.from} ${gradient.to}`} />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Quick Overview</span>
                </div>

                <div className="space-y-4">
                  {/* Sections count */}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Sections</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{guide.sections.length}</span>
                  </div>

                  {/* Reading time */}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Reading time</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{guide.readingTime} min</span>
                  </div>

                  {/* Resources count */}
                  {guide.resources && (
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Resources</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">{guide.resources.length} links</span>
                    </div>
                  )}

                  {/* FAQs count */}
                  {guide.faqs && guide.faqs.length > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">FAQs</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">{guide.faqs.length} questions</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-6">
                  <ShareButton 
                    className={`w-full bg-gradient-to-r ${gradient.from} ${gradient.to} hover:opacity-90 transition-opacity border-0 text-white`}
                    variant="default"
                    text="Share this guide"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative">
        {/* Subtle background that blends with page color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:from-transparent dark:via-zinc-950/50 dark:to-zinc-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <article className="min-w-0">
              {/* Sections */}
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-white prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300 prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400 prose-ol:text-zinc-600 dark:prose-ol:text-zinc-400">
                {guide.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                    {/* Section with enhanced styling */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`hidden sm:flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient.from} ${gradient.to} text-white font-bold shadow-lg`}>
                        {index + 1}
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:mt-1.5">{section.title}</h2>
                    </div>
                    <div className="sm:ml-14 mt-4 whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {section.content}
                      </ReactMarkdown>
                    </div>

                    {/* Subsections */}
                    {section.subsections?.map((sub) => (
                      <div key={sub.id} id={sub.id} className="mt-8 scroll-mt-24 sm:ml-14">
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{sub.title}</h3>
                        <div className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {sub.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>

              {/* FAQs */}
              {guide.faqs && guide.faqs.length > 0 && (
                <section className="mt-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-sm text-zinc-500">{guide.faqs.length} common questions answered</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-6 shadow-sm">
                    <FAQAccordion faqs={guide.faqs} />
                  </div>
                </section>
              )}

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <section className="mt-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Related Guides
                      </h2>
                      <p className="text-sm text-zinc-500">Continue your learning journey</p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {relatedGuides.slice(0, 4).map((related) => (
                      <div 
                        key={related.slug}
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        <GuideCard guide={related} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Explore more CTA */}
              <div className="mt-16 rounded-3xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-8 sm:p-10">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
                      Found this helpful?
                    </h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      Explore more guides in this category or browse our full collection
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="lg" className="border-2">
                      <Link href={`/category/${guide.categoryKey}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {category?.title || "Category"}
                      </Link>
                    </Button>
                    <Button asChild size="lg" className={`bg-gradient-to-r ${gradient.from} ${gradient.to} hover:opacity-90`}>
                      <Link href="/guides">
                        <BookOpen className="mr-2 h-4 w-4" />
                        All Guides
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 overflow-hidden shadow-sm">
                  <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-4 bg-white/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">On this page</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <TableOfContents sections={guide.sections} />
                  </div>
                </div>

                {/* Resources */}
                {guide.resources && guide.resources.length > 0 && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 overflow-hidden shadow-sm">
                    <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-4 bg-white/50 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Resources</h3>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{guide.resources.length} helpful links</p>
                    </div>
                    <div className="p-4 space-y-2">
                      {guide.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type] || LinkIcon;
                        return (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-xl p-3 text-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 hover:shadow-sm"
                          >
                            <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/10 transition-colors">
                              <Icon className="h-4 w-4 text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {resource.title}
                                <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                              </div>
                              {resource.description && (
                                <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
                                  {resource.description}
                                </p>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-5 shadow-sm space-y-3">
                  <ShareButton 
                    className="w-full border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white justify-start"
                    text="Share this guide"
                  />
                  <Button variant="outline" className="w-full border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white justify-start" size="lg">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Was this helpful?
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
