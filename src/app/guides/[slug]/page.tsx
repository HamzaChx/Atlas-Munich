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
  ShareButton,
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
  Star,
  Eye,
  Award,
  Target,
  Layers,
  Download,
} from "lucide-react";
import { fmtUpdated } from "@/lib/date";
import { ContentTag } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = Icons as any;

import { getLocale } from "@/i18n";

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

// Rule 27: Color must convey meaning
const tagColors: Record<ContentTag, string> = {
  newcomer:
    "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30",
  urgent:
    "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30",
  documents:
    "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30",
  tips: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
  official:
    "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30",
  "community-verified":
    "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-500/30",
  "budget-friendly":
    "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500/30",
  "time-sensitive":
    "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-500/30",
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

  const category = getCategoryByKey(guide.categoryKey);
  const relatedGuides = getRelatedGuides(guide);
  const CategoryIcon = category ? iconMap[category.icon] || Icons.Folder : Icons.Folder;
  const firstSectionId = guide.sections[0]?.id;
  const resourceCount = guide.resources?.length ?? 0;
  const faqCount = guide.faqs?.length ?? 0;

  // Rule 26: Neutral base + accent color
  const gradientMap: Record<string, { from: string; to: string; accent: string }> = {
    "rent-housing": { from: "from-blue-500", to: "to-cyan-500", accent: "blue" },
    "kvr-residence": { from: "from-emerald-500", to: "to-teal-500", accent: "emerald" },
    "university-life": { from: "from-purple-500", to: "to-pink-500", accent: "purple" },
    "halal-food": { from: "from-orange-500", to: "to-red-500", accent: "orange" },
    career: { from: "from-rose-500", to: "to-pink-500", accent: "rose" },
    "useful-apps": { from: "from-indigo-500", to: "to-violet-500", accent: "indigo" },
  };

  const gradient = gradientMap[guide.categoryKey] || {
    from: "from-emerald-500",
    to: "to-teal-500",
    accent: "emerald",
  };

  const bgColorMap: Record<string, string> = {
    "rent-housing": "bg-blue-50/30 dark:bg-blue-950/10",
    "kvr-residence": "bg-emerald-50/30 dark:bg-emerald-950/10",
    "university-life": "bg-purple-50/30 dark:bg-purple-950/10",
    "halal-food": "bg-orange-50/30 dark:bg-orange-950/10",
    career: "bg-rose-50/30 dark:bg-rose-950/10",
    "useful-apps": "bg-indigo-50/30 dark:bg-indigo-950/10",
  };

  const bgColor = bgColorMap[guide.categoryKey] || "bg-emerald-50/30 dark:bg-emerald-950/10";

  const localizedCategoryTitle = category
    ? (getMessage(`categories.${category.key}.title`) ?? category.title)
    : guide.categoryKey;
  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Guides", href: "/guides" },
    { label: localizedCategoryTitle, href: `/category/${guide.categoryKey}` },
    { label: guide.title },
  ];

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Enhanced Hero Section - Rule 6: Visual hierarchy in 1 second */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 dark:border-white/5">
        {/* Ambient Background - Rule 31: Subtle gradients */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/5 via-transparent ${gradient.to}/5 dark:${gradient.from}/10 dark:via-transparent dark:${gradient.to}/10`}
        />

        {/* Animated Orbs - Rule 35: Animations 150-300ms */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <div
            className={`absolute -left-[15%] top-0 h-[420px] w-[420px] animate-pulse rounded-full bg-gradient-to-br ${gradient.from}/40 ${gradient.to}/40 blur-[110px]`}
          />
          <div
            className={`absolute -right-[10%] bottom-0 h-[360px] w-[360px] animate-pulse rounded-full bg-gradient-to-br ${gradient.to}/30 ${gradient.from}/30 blur-[90px]`}
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Pattern removed: simple clean hero background */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          {/* Breadcrumbs - Rule 15: Left alignment */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left Column - Main Content */}
            <div>
              {/* Category Badge & Tags - Rule 16: Group related elements */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/category/${guide.categoryKey}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border-2 border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2.5 shadow-sm transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-md hover:scale-105"
                >
                  <div
                    className={`rounded-lg bg-gradient-to-br ${gradient.from} ${gradient.to} p-2 text-white`}
                  >
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 capitalize group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {localizedCategoryTitle}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                </Link>

                {guide.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} className={`${tagColors[tag]} border font-semibold px-3 py-1`}>
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title - Consistent with category/detail headings */}
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                {guide.title}
              </h1>

              {/* Summary - Rule 21 & 22: 16-18px, line-height 1.4-1.6 */}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {guide.summary}
              </p>

              {/* Meta Stats Grid - Rule 11: 8-point spacing */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/30">
                  <div className="rounded-xl bg-blue-100 dark:bg-blue-500/20 p-2.5">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {getMessage("guidePage.readingLabel") ?? "Reading"}
                    </p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {guide.readingTime} min
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/70 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500/30">
                  <div className="rounded-xl bg-amber-100 dark:bg-amber-500/20 p-2.5">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {getMessage("guidePage.updatedLabel") ?? "Updated"}
                    </p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {fmtUpdated(guide.lastUpdated)}
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border-2 border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-500/10 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
                  <div className="rounded-xl bg-emerald-200 dark:bg-emerald-500/30 p-2.5">
                    <Award className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-emerald-600/90 dark:text-emerald-400">
                      {getMessage("guidePage.verifiedLabel") ?? "Verified"}
                    </p>
                    <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      Community
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 lg:hidden">
                {firstSectionId && (
                  <ShareButton
                    size="lg"
                    text={getMessage("guidePage.shareGuide") ?? "Share guide"}
                    className={`bg-gradient-to-r ${gradient.from} ${gradient.to} text-white font-semibold shadow-lg`}
                  />
                )}
              </div>

              {/* Author Info - Rule 16: Visual grouping */}
              {guide.author && (
                <div className="mt-8 flex items-center gap-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 p-4 backdrop-blur-sm">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      Written by {guide.author}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      Atlas Munich Contributor
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Guide Snapshot Card - Rule 33: Buttons look clickable */}
            <Card className="hidden lg:block relative overflow-hidden border-2 border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl">
              <div className={`h-2 bg-gradient-to-r ${gradient.from} ${gradient.to}`} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 p-2">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    {getMessage("guidePage.quickOverview") ?? "Quick Overview"}
                  </span>
                </div>

                {/* Stats List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-white/5">
                    <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Layers className="h-4 w-4" />
                      {getMessage("guidePage.sections") ?? "Sections"}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {guide.sections.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-white/5">
                    <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Clock className="h-4 w-4" />
                      {getMessage("guidePage.readingTime") ?? "Reading time"}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {guide.readingTime} min
                    </span>
                  </div>
                  {resourceCount > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-white/5">
                      <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <LinkIcon className="h-4 w-4" />
                        {getMessage("guidePage.resources") ?? "Resources"}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {(getMessage("guidePage.resourcesLinks") ?? "{count} links").replace(
                          "{count}",
                          String(resourceCount)
                        )}
                      </span>
                    </div>
                  )}
                  {faqCount > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-white/5">
                      <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <MessageCircle className="h-4 w-4" />
                        {getMessage("guidePage.faqs") ?? "FAQs"}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {(getMessage("guidePage.faqsAnswered") ?? "{count} answered").replace(
                          "{count}",
                          String(faqCount)
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Eye className="h-4 w-4" />
                      {getMessage("guidePage.difficulty") ?? "Difficulty"}
                    </span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 font-semibold">
                      Beginner
                    </Badge>
                  </div>
                </div>

                {/* CTA Button */}
                {firstSectionId && (
                  <ShareButton
                    size="lg"
                    text={getMessage("guidePage.shareGuide") ?? "Share guide"}
                    className={`group mt-6 w-full border-2 border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 font-semibold hover:border-emerald-300 dark:hover:border-emerald-500/30`}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Area - Rule 12: Max content width 1100-1280px */}
      <div className="relative">
        {/* Background Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:from-transparent dark:via-zinc-950/60 dark:to-zinc-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Article Column */}
            <article className="min-w-0">
              {/* Mobile TOC - Rule 7: Mobile-first */}
              {guide.sections.length > 0 && (
                <div className="lg:hidden mb-10 rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 overflow-hidden shadow-lg backdrop-blur-sm">
                  <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-4 bg-white/60 dark:bg-zinc-900/60">
                    <div className="flex items-center gap-2.5">
                      <Target className="h-5 w-5 text-amber-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                        {getMessage("guidePage.tableOfContents") ?? "Contents"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <TableOfContents sections={guide.sections} />
                  </div>
                </div>
              )}

              {/* Content Sections - Rule 21 & 22: Typography rules */}
              <div className="space-y-10">
                {guide.sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="group rounded-3xl border-2 border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/80 p-6 sm:p-8 lg:p-10 shadow-lg scroll-mt-24 transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-xl backdrop-blur-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient.from} ${gradient.to} text-white font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        {index + 1}
                      </div>
                      <h2 className="flex-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:mt-2 leading-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section Content - Rule 24: Break content every 2-3 lines */}
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:text-zinc-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                      prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
                      prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                      prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline prose-a:font-semibold hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300 prose-a:transition-colors
                      prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400
                      prose-ol:text-zinc-600 dark:prose-ol:text-zinc-400
                      prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium
                      sm:ml-16"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                    </div>

                    {/* Subsections */}
                    {section.subsections?.map((sub) => (
                      <div key={sub.id} id={sub.id} className="mt-8 sm:ml-16 scroll-mt-24">
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          {sub.title}
                        </h3>
                        <div
                          className="mt-4 prose prose-base dark:prose-invert max-w-none 
                          prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
                          prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6"
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>

              {/* FAQ Section - Rule 40: Forms feel like conversations */}
              {guide.faqs && guide.faqs.length > 0 && (
                <section className="mt-16">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {getMessage("guidePage.frequentlyAsked") ?? "Frequently Asked Questions"}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {(
                          getMessage("guidePage.faqsAnswered") ??
                          "{count} common questions answered"
                        ).replace("{count}", String(guide.faqs.length))}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 p-6 shadow-lg backdrop-blur-sm">
                    <FAQAccordion faqs={guide.faqs} />
                  </div>
                </section>
              )}

              {/* Mobile Resources */}
              {guide.resources && guide.resources.length > 0 && (
                <section className="mt-16 lg:hidden">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {getMessage("guidePage.helpfulResources") ?? "Helpful Resources"}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {(
                          getMessage("guidePage.resourcesCount") ?? "{count} curated links"
                        ).replace("{count}", String(guide.resources.length))}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 overflow-hidden shadow-lg backdrop-blur-sm">
                    <div className="p-4 space-y-2">
                      {guide.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type] || LinkIcon;
                        return (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-xl p-3.5 text-sm transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:shadow-md"
                          >
                            <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                              <Icon className="h-4 w-4 text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {resource.title}
                                <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                              </div>
                              {resource.description && (
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                  {resource.description}
                                </p>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* Related Guides - Rule 36: Motion explains cause/effect */}
              {relatedGuides.length > 0 && (
                <section className="mt-20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {getMessage("guidePage.continueLearning") ?? "Continue Learning"}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {getMessage("guidePage.relatedGuidesDesc") ??
                          "Related guides you might find helpful"}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedGuides.slice(0, 4).map((related, idx) => (
                      <div
                        key={related.slug}
                        className="transform transition-all duration-300 hover:scale-[1.03]"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <GuideCard guide={related} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom Navigation CTA */}
              <div className="mt-20 rounded-3xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 p-8 sm:p-10 lg:p-12 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <div className="text-center sm:text-left">
                    <div className="mb-2 inline-flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        {getMessage("guidePage.helpfulResourceLabel") ?? "Helpful Resource?"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                      {getMessage("guidePage.bottomCTATitle") ?? "Explore More Guides"}
                    </h3>
                    <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                      {getMessage("guidePage.bottomCTADesc") ??
                        "Discover more resources in this category or browse our full collection"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-2 border-zinc-300 dark:border-white/10 font-semibold shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Link href={`/category/${guide.categoryKey}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {(getMessage("guidePage.bottomCTABrowseCategory") ?? "{category}").replace(
                          "{category}",
                          category?.title || "Category"
                        )}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className={`bg-gradient-to-r ${gradient.from} ${gradient.to} text-white font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all`}
                    >
                      <Link href="/guides" className="text-white inline-flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {getMessage("guidePage.bottomCTAAllGuides") ?? "All Guides"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Desktop Sidebar - Rule 41: Speed is UX */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* TOC */}
                <div className="rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 overflow-hidden shadow-lg backdrop-blur-sm">
                  <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-4 bg-white/60 dark:bg-zinc-900/60">
                    <div className="flex items-center gap-2.5">
                      <Target className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                        {getMessage("guidePage.tableOfContents") ?? "Contents"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <TableOfContents sections={guide.sections} />
                  </div>
                </div>

                {/* Resources */}
                {guide.resources && guide.resources.length > 0 && (
                  <div className="rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 overflow-hidden shadow-lg backdrop-blur-sm">
                    <div className="border-b border-zinc-200 dark:border-white/10 px-6 py-4 bg-white/60 dark:bg-zinc-900/60">
                      <div className="flex items-center gap-2.5">
                        <Download className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                          {getMessage("guidePage.resources") ?? "Resources"}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {(
                          getMessage("guidePage.resourcesCount") ?? "{count} helpful links"
                        ).replace("{count}", String(guide.resources.length))}
                      </p>
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
                            className="group flex items-start gap-3 rounded-xl p-3 text-sm transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:shadow-md"
                          >
                            <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                              <Icon className="h-4 w-4 text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                <span className="line-clamp-1">{resource.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                              </div>
                              {resource.description && (
                                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
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
                <div className="rounded-2xl border-2 border-zinc-200/80 dark:border-white/10 bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900/70 dark:via-zinc-900/50 dark:to-zinc-950/70 p-5 shadow-lg space-y-3 backdrop-blur-sm">
                  <ShareButton
                    className={`w-full bg-gradient-to-r ${gradient.from} ${gradient.to} text-white font-semibold justify-start shadow-lg`}
                    text={getMessage("guidePage.shareThisGuide") ?? "Share this guide"}
                  />
                  <Button
                    variant="outline"
                    className="w-full border-2 border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30 hover:text-blue-700 dark:hover:text-blue-300 justify-start font-semibold transition-all"
                    size="lg"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {getMessage("guidePage.wasHelpful") ?? "Was this helpful?"}
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
