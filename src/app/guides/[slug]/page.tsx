import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Breadcrumbs,
  TableOfContents,
  FAQAccordion,
  GuideCard,
  ShareButton,
  ReadingProgress,
} from "@/components/shared";
import { guides, getGuideBySlug, getRelatedGuides } from "@/data/guides";
import { getCategoryByKey } from "@/data/categories";
import * as Icons from "lucide-react";
import {
  Clock,
  ArrowLeft,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  BookOpen,
  Users,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { fmtUpdated } from "@/lib/date";

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

  // Apply locale translation overlay
  let localizedGuide = guide;
  if (locale !== "en") {
    try {
      const mod = await import(`@/data/guides.${locale}`);
      const t = mod.guideTranslations?.[guide.slug];
      if (t) {
        localizedGuide = {
          ...guide,
          title: t.title,
          summary: t.summary,
          sections: localizedGuide.sections.map((s, i) => ({
            ...s,
            title: t.sections[i]?.title ?? s.title,
            content: t.sections[i]?.content ?? s.content,
            subsections: s.subsections?.map((sub, j) => ({
              ...sub,
              title: t.sections[i]?.subsections?.[j]?.title ?? sub.title,
              content: t.sections[i]?.subsections?.[j]?.content ?? sub.content,
            })),
          })),
          faqs: localizedGuide.faqs?.map((faq, i) => ({
            ...faq,
            question: t.faqs?.[i]?.question ?? faq.question,
            answer: t.faqs?.[i]?.answer ?? faq.answer,
          })),
          resources: localizedGuide.resources?.map((res, i) => ({
            ...res,
            title: t.resources?.[i]?.title ?? res.title,
            description: t.resources?.[i]?.description ?? res.description,
          })),
        };
      }
    } catch {
      // fallback to English if translation file not found
    }
  }

  const themeMap: Record<
    string,
    {
      from: string;
      to: string;
      link: string;
      linkHover: string;
      code: string;
      codeBg: string;
      codeBorder: string;
      hoverText: string;
      hoverBg: string;
      iconHoverBg: string;
      solidBtn: string;
      outlineHover: string;
    }
  > = {
    "rent-housing": {
      from: "from-blue-500",
      to: "to-cyan-500",
      link: "prose-a:text-blue-600 dark:prose-a:text-blue-400",
      linkHover: "hover:prose-a:text-blue-500 dark:hover:prose-a:text-blue-300",
      code: "prose-code:text-blue-700 dark:prose-code:text-blue-300",
      codeBg: "prose-code:bg-blue-50 dark:prose-code:bg-blue-500/10",
      codeBorder: "prose-code:border-blue-100 dark:prose-code:border-blue-500/20",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
      iconHoverBg: "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
      solidBtn: "bg-blue-600 hover:bg-blue-500",
      outlineHover: "hover:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300",
    },
    "kvr-residence": {
      from: "from-emerald-500",
      to: "to-teal-500",
      link: "prose-a:text-emerald-600 dark:prose-a:text-emerald-400",
      linkHover: "hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300",
      code: "prose-code:text-emerald-700 dark:prose-code:text-emerald-300",
      codeBg: "prose-code:bg-emerald-50 dark:prose-code:bg-emerald-500/10",
      codeBorder: "prose-code:border-emerald-100 dark:prose-code:border-emerald-500/20",
      hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
      iconHoverBg: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20",
      solidBtn: "bg-emerald-600 hover:bg-emerald-500",
      outlineHover: "hover:border-emerald-400/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300",
    },
    "university-life": {
      from: "from-purple-500",
      to: "to-pink-500",
      link: "prose-a:text-purple-600 dark:prose-a:text-purple-400",
      linkHover: "hover:prose-a:text-purple-500 dark:hover:prose-a:text-purple-300",
      code: "prose-code:text-purple-700 dark:prose-code:text-purple-300",
      codeBg: "prose-code:bg-purple-50 dark:prose-code:bg-purple-500/10",
      codeBorder: "prose-code:border-purple-100 dark:prose-code:border-purple-500/20",
      hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-500/10",
      iconHoverBg: "group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20",
      solidBtn: "bg-purple-600 hover:bg-purple-500",
      outlineHover: "hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300",
    },
    "halal-food": {
      from: "from-orange-500",
      to: "to-red-500",
      link: "prose-a:text-orange-600 dark:prose-a:text-orange-400",
      linkHover: "hover:prose-a:text-orange-500 dark:hover:prose-a:text-orange-300",
      code: "prose-code:text-orange-700 dark:prose-code:text-orange-300",
      codeBg: "prose-code:bg-orange-50 dark:prose-code:bg-orange-500/10",
      codeBorder: "prose-code:border-orange-100 dark:prose-code:border-orange-500/20",
      hoverText: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
      hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-500/10",
      iconHoverBg: "group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20",
      solidBtn: "bg-orange-600 hover:bg-orange-500",
      outlineHover: "hover:border-orange-400/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-700 dark:hover:text-orange-300",
    },
    career: {
      from: "from-rose-500",
      to: "to-pink-500",
      link: "prose-a:text-rose-600 dark:prose-a:text-rose-400",
      linkHover: "hover:prose-a:text-rose-500 dark:hover:prose-a:text-rose-300",
      code: "prose-code:text-rose-700 dark:prose-code:text-rose-300",
      codeBg: "prose-code:bg-rose-50 dark:prose-code:bg-rose-500/10",
      codeBorder: "prose-code:border-rose-100 dark:prose-code:border-rose-500/20",
      hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
      hoverBg: "hover:bg-rose-50 dark:hover:bg-rose-500/10",
      iconHoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20",
      solidBtn: "bg-rose-600 hover:bg-rose-500",
      outlineHover: "hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300",
    },
    "useful-apps": {
      from: "from-indigo-500",
      to: "to-violet-500",
      link: "prose-a:text-indigo-600 dark:prose-a:text-indigo-400",
      linkHover: "hover:prose-a:text-indigo-500 dark:hover:prose-a:text-indigo-300",
      code: "prose-code:text-indigo-700 dark:prose-code:text-indigo-300",
      codeBg: "prose-code:bg-indigo-50 dark:prose-code:bg-indigo-500/10",
      codeBorder: "prose-code:border-indigo-100 dark:prose-code:border-indigo-500/20",
      hoverText: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
      hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
      iconHoverBg: "group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20",
      solidBtn: "bg-indigo-600 hover:bg-indigo-500",
      outlineHover: "hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300",
    },
  };

  const theme = themeMap[guide.categoryKey] || themeMap["kvr-residence"];

  const localizedCategoryTitle = category
    ? (getMessage(`categories.${category.key}.title`) ?? category.title)
    : guide.categoryKey;

  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Guides", href: "/guides" },
    { label: localizedCategoryTitle, href: `/category/${guide.categoryKey}` },
    { label: localizedGuide.title },
  ];

  return (
    <div className="min-h-screen">
      {/* Reading progress bar */}
      <ReadingProgress fromColor={theme.from} toColor={theme.to} />

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-white/10">
        {/* Ambient gradient orbs */}
        <div
          className={`pointer-events-none absolute -left-32 top-0 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-gradient-to-br ${theme.from}/15 ${theme.to}/8 blur-[120px]`}
        />
        <div
          className={`pointer-events-none absolute -right-32 bottom-0 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-br ${theme.to}/15 ${theme.from}/8 blur-[120px]`}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14 lg:px-8 lg:pt-10 lg:pb-16">
          {/* Breadcrumbs */}
          <div className="mb-7 sm:mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="max-w-3xl">
            {/* Category pill */}
            <Link
              href={`/category/${guide.categoryKey}`}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-all hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:text-zinc-900 dark:hover:text-white"
            >
              <span
                className={`rounded-md bg-gradient-to-br ${theme.from} ${theme.to} p-1 text-white`}
              >
                <CategoryIcon className="h-3 w-3" />
              </span>
              <span className="capitalize">{localizedCategoryTitle}</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Link>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl lg:text-[2.25rem] leading-tight">
              {localizedGuide.title}
            </h1>

            {/* Summary */}
            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg max-w-2xl">
              {localizedGuide.summary}
            </p>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {guide.readingTime} min read
              </span>
              <span className="hidden sm:block w-px h-3.5 bg-zinc-300 dark:bg-zinc-700" />
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Updated {fmtUpdated(guide.lastUpdated)}
              </span>
              {guide.author && (
                <>
                  <span className="hidden sm:block w-px h-3.5 bg-zinc-300 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {guide.author}
                  </span>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="relative bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Main article */}
            <article className="min-w-0">
              {/* Mobile TOC */}
              {localizedGuide.sections.length > 0 && (
                <div className="lg:hidden mb-8 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {getMessage("guidePage.tableOfContents") ?? "In this guide"}
                    </h3>
                  </div>
                  <div className="p-3">
                    <TableOfContents sections={localizedGuide.sections} />
                  </div>
                </div>
              )}

              {/* Sections rendered as blog-style editorial content */}
              <div className="space-y-0">
                {localizedGuide.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    {/* Divider between sections (not first) */}
                    {index !== 0 && (
                      <div className="my-12">
                        <div className="h-px bg-zinc-100 dark:bg-white/5" />
                      </div>
                    )}

                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`h-6 w-1 rounded-full bg-gradient-to-b ${theme.from} ${theme.to}`} />
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section content */}
                    <div>
                      <div
                        className={`
                          prose prose-base sm:prose-lg dark:prose-invert max-w-none
                          prose-headings:text-zinc-900 dark:prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
                          prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-[1.8] prose-p:text-base sm:prose-p:text-[1.05rem]
                          prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-semibold
                          prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:leading-[1.75]
                          prose-ul:space-y-1 prose-ol:space-y-1
                          ${theme.link} prose-a:no-underline prose-a:font-semibold ${theme.linkHover} prose-a:transition-colors
                          ${theme.code} ${theme.codeBg} prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-medium prose-code:border ${theme.codeBorder}
                          prose-blockquote:border-l-4 prose-blockquote:border-amber-400 dark:prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 dark:prose-blockquote:bg-amber-500/10 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-amber-900 dark:prose-blockquote:text-amber-200 prose-blockquote:font-normal
                          [&_blockquote_p]:text-amber-800 dark:[&_blockquote_p]:text-amber-200 [&_blockquote_p]:!m-0 [&_blockquote_p]:leading-relaxed
                          prose-hr:border-zinc-100 dark:prose-hr:border-white/5
                        `}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                      </div>

                      {/* Subsections */}
                      {section.subsections?.map((sub) => (
                        <div key={sub.id} id={sub.id} className="mt-8 scroll-mt-28">
                          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white tracking-tight mb-4">
                            {sub.title}
                          </h3>
                          <div
                            className={`prose prose-base dark:prose-invert max-w-none
                              prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-[1.8] prose-p:text-base
                              prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
                              prose-li:text-zinc-600 dark:prose-li:text-zinc-300 prose-li:leading-[1.75]
                              ${theme.link} prose-a:no-underline hover:prose-a:underline
                              prose-blockquote:border-l-4 prose-blockquote:border-amber-400 dark:prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 dark:prose-blockquote:bg-amber-500/10 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic
                              [&_blockquote_p]:!m-0
                            `}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* End-of-article divider */}
              <div className="mt-14">
                <div className="h-px bg-zinc-100 dark:bg-white/5" />
              </div>

              {/* FAQ */}
              {localizedGuide.faqs && localizedGuide.faqs.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl mb-6">
                    {getMessage("guidePage.frequentlyAsked") ?? "Frequently Asked Questions"}
                  </h2>
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 p-4 sm:p-5">
                    <FAQAccordion faqs={localizedGuide.faqs} />
                  </div>
                </section>
              )}

              {/* Mobile Resources */}
              {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                <section className="mt-12 lg:hidden">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
                    {getMessage("guidePage.helpfulResources") ?? "Helpful Resources"}
                  </h2>
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 overflow-hidden">
                    <div className="p-3 space-y-1">
                      {localizedGuide.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type] || LinkIcon;
                        return (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl p-3 text-sm transition-all hover:bg-white dark:hover:bg-zinc-800"
                          >
                            <div className={`h-9 w-9 shrink-0 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center ${theme.iconHoverBg} transition-colors`}>
                              <Icon className={`h-4 w-4 text-zinc-500 ${theme.hoverText} transition-colors`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300 ${theme.hoverText} transition-colors`}>
                                <span className="truncate">{resource.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400" />
                              </div>
                              {resource.description && (
                                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
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

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl mb-6">
                    {getMessage("guidePage.continueLearning") ?? "Continue Reading"}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relatedGuides.slice(0, 4).map((related) => (
                      <GuideCard key={related.slug} guide={related} />
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom CTA */}
              <div className="mt-14 rounded-2xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/80 dark:to-zinc-900/40 p-6 sm:p-8">
                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
                      {getMessage("guidePage.bottomCTATitle") ?? "Explore More Guides"}
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                      {getMessage("guidePage.bottomCTADesc") ??
                        "Discover more resources in this category or browse the full collection."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className={`border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 ${theme.outlineHover}`}
                    >
                      <Link href={`/category/${guide.categoryKey}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {category?.title || "Category"}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className={`${theme.solidBtn} text-white shadow-sm`}
                    >
                      <Link href="/guides">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {getMessage("guidePage.bottomCTAAllGuides") ?? "All Guides"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                {/* TOC */}
                {localizedGuide.sections.length > 0 && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 overflow-hidden">
                    <div className="border-b border-zinc-200 dark:border-white/5 px-5 py-3.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {getMessage("guidePage.tableOfContents") ?? "In this guide"}
                      </h3>
                    </div>
                    <div className="p-4">
                      <TableOfContents sections={localizedGuide.sections} />
                    </div>
                  </div>
                )}

                {/* Resources */}
                {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 overflow-hidden">
                    <div className="border-b border-zinc-200 dark:border-white/5 px-5 py-3.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {getMessage("guidePage.resources") ?? "Resources"}
                      </h3>
                    </div>
                    <div className="p-3 space-y-1">
                      {localizedGuide.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type] || LinkIcon;
                        return (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2.5 rounded-xl p-2.5 text-sm transition-all hover:bg-white dark:hover:bg-zinc-800"
                          >
                            <div className={`h-8 w-8 shrink-0 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center ${theme.iconHoverBg} transition-colors`}>
                              <Icon className={`h-3.5 w-3.5 text-zinc-500 ${theme.hoverText} transition-colors`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300 ${theme.hoverText} transition-colors text-xs leading-snug`}>
                                <span className="truncate">{resource.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 text-zinc-400" />
                              </div>
                              {resource.description && (
                                <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500 truncate leading-snug">
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
                <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 p-4">
                  <ShareButton
                    className={`w-full bg-gradient-to-r ${theme.from} ${theme.to} text-white font-medium justify-center hover:opacity-90 transition-opacity`}
                    text={getMessage("guidePage.shareThisGuide") ?? "Share this guide"}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
