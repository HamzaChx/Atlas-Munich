import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Breadcrumbs, 
  TableOfContents, 
  FAQAccordion, 
  GuideCard 
} from "@/components/shared";
import { guides, getGuideBySlug, getRelatedGuides } from "@/data/guides";
import { getCategoryByKey } from "@/data/categories";
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  FileText,
  Video,
  Link as LinkIcon,
  Share2,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { fmtUpdated } from "@/lib/date";
import { ContentTag } from "@/types";

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
  newcomer: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  urgent: "bg-red-500/20 text-red-300 border-red-500/30",
  documents: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  tips: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  official: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "community-verified": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "budget-friendly": "bg-green-500/20 text-green-300 border-green-500/30",
  "time-sensitive": "bg-orange-500/20 text-orange-300 border-orange-500/30",
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

  const breadcrumbs = [
    { label: "Guides", href: "/guides" },
    { label: category?.title || guide.categoryKey, href: `/category/${guide.categoryKey}` },
    { label: guide.title },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="guide-detail-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#guide-detail-pattern)"/>
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="mt-6">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 capitalize">
                {guide.categoryKey.replace(/-/g, " ")}
              </Badge>
              {guide.tags.map((tag) => (
                <Badge key={tag} className={`${tagColors[tag]} border-white/10`}>
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {guide.title}
            </h1>

            {/* Summary */}
            <p className="mt-4 max-w-3xl text-lg text-zinc-400">
              {guide.summary}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{guide.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Updated {fmtUpdated(guide.lastUpdated)}</span>
              </div>
              {guide.author && (
                <div className="flex items-center gap-1.5">
                  <span>By {guide.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <article className="min-w-0">
            {/* Sections */}
            <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-strong:text-white prose-li:text-zinc-400">
              {guide.sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold tracking-tight text-white">{section.title}</h2>
                  <div className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-400">
                    {section.content}
                  </div>

                  {/* Subsections */}
                  {section.subsections?.map((sub) => (
                    <div key={sub.id} id={sub.id} className="mt-8 scroll-mt-24">
                      <h3 className="text-xl font-semibold text-white">{sub.title}</h3>
                      <div className="mt-3 whitespace-pre-wrap leading-relaxed text-zinc-400">
                        {sub.content}
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            </div>

            {/* FAQs */}
            {guide.faqs && guide.faqs.length > 0 && (
              <section className="mt-16">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Frequently Asked Questions
                </h2>
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                  <FAQAccordion faqs={guide.faqs} />
                </div>
              </section>
            )}

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <section className="mt-16">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Related Guides
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {relatedGuides.slice(0, 4).map((related) => (
                    <GuideCard key={related.slug} guide={related} />
                  ))}
                </div>
              </section>
            )}

            {/* Back navigation */}
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Button asChild variant="outline" className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
                <Link href={`/category/${guide.categoryKey}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {category?.title || "Category"}
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-zinc-400 hover:bg-white/5 hover:text-white">
                <Link href="/guides">
                  View all guides
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                <TableOfContents sections={guide.sections} />
              </div>

              {/* Resources */}
              {guide.resources && guide.resources.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 overflow-hidden">
                  <div className="border-b border-white/10 px-6 py-4">
                    <h3 className="text-sm font-semibold text-white">Resources</h3>
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
                          className="flex items-start gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-white/5"
                        >
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 font-medium text-zinc-300">
                              {resource.title}
                              <ExternalLink className="h-3 w-3 text-zinc-500" />
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

              {/* Share */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share this guide
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
