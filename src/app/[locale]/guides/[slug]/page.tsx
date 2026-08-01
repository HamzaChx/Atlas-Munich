import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Breadcrumbs,
  TableOfContents,
  FAQAccordion,
  GuideCard,
  ShareButton,
  ReadingProgress,
} from "@/components/shared";
import { guides, getGuideBySlug, getRelatedGuides } from "@/data/guides";
import { localizeGuide, localizeGuides } from "@/data/guides-i18n";
import { getCategoryByKey } from "@/data/categories";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import { fmtUpdated } from "@/lib/date";
import { getLocale } from "next-intl/server";
import { cn } from "@/lib/utils";

const BASE_URL = "https://atlasmunich.de";

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

  const category = getCategoryByKey(guide.categoryKey);

  return {
    title: guide.title,
    description: guide.summary,
    keywords: [
      ...guide.tags,
      guide.categoryKey.replace(/-/g, " "),
      "Munich guide",
      "Atlas Munich",
      ...(category ? [category.title] : []),
    ],
    openGraph: {
      title: `${guide.title} | Atlas Munich`,
      description: guide.summary,
      type: "article",
      url: `https://atlasmunich.de/guides/${guide.slug}`,
      publishedTime: guide.lastUpdated,
      authors: guide.author ? [guide.author] : ["Atlas Munich Team"],
      tags: guide.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | Atlas Munich`,
      description: guide.summary,
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

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const locale = await getLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = (await import(`../../../../../messages/${locale}.json`)).default;
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

  const localizedGuide = await localizeGuide(guide, locale);
  // The related-guide cards at the foot of the page need the overlay too.
  const relatedGuides = await localizeGuides(getRelatedGuides(guide), locale);

  const themeMap: Record<
    string,
    {
      from: string;
      to: string;
      text: string;
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
      from: "from-amber-500",
      to: "to-orange-500",
      text: "text-amber-700 dark:text-amber-500",
      link: "prose-a:text-amber-700 dark:prose-a:text-amber-500",
      linkHover: "hover:prose-a:text-amber-600 dark:hover:prose-a:text-amber-400",
      code: "prose-code:text-amber-800 dark:prose-code:text-amber-300",
      codeBg: "prose-code:bg-amber-50 dark:prose-code:bg-amber-500/10",
      codeBorder: "prose-code:border-amber-100 dark:prose-code:border-amber-500/20",
      hoverText: "group-hover:text-amber-700 dark:group-hover:text-amber-500",
      hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-500/10",
      iconHoverBg: "group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20",
      solidBtn: "bg-amber-600 hover:bg-amber-500 text-white",
      outlineHover:
        "hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300",
    },
    "kvr-residence": {
      from: "from-blue-500",
      to: "to-cyan-500",
      text: "text-blue-600 dark:text-blue-400",
      link: "prose-a:text-blue-600 dark:prose-a:text-blue-400",
      linkHover: "hover:prose-a:text-blue-500 dark:hover:prose-a:text-blue-300",
      code: "prose-code:text-blue-700 dark:prose-code:text-blue-300",
      codeBg: "prose-code:bg-blue-50 dark:prose-code:bg-blue-500/10",
      codeBorder: "prose-code:border-blue-100 dark:prose-code:border-blue-500/20",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
      iconHoverBg: "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
      solidBtn: "bg-blue-600 hover:bg-blue-500 text-white",
      outlineHover:
        "hover:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300",
    },
    "university-life": {
      from: "from-emerald-500",
      to: "to-teal-500",
      text: "text-emerald-600 dark:text-emerald-400",
      link: "prose-a:text-emerald-600 dark:prose-a:text-emerald-400",
      linkHover: "hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300",
      code: "prose-code:text-emerald-700 dark:prose-code:text-emerald-300",
      codeBg: "prose-code:bg-emerald-50 dark:prose-code:bg-emerald-500/10",
      codeBorder: "prose-code:border-emerald-100 dark:prose-code:border-emerald-500/20",
      hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
      iconHoverBg: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20",
      solidBtn: "bg-emerald-600 hover:bg-emerald-500 text-white",
      outlineHover:
        "hover:border-emerald-400/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300",
    },
    career: {
      from: "from-purple-500",
      to: "to-pink-500",
      text: "text-purple-600 dark:text-purple-400",
      link: "prose-a:text-purple-600 dark:prose-a:text-purple-400",
      linkHover: "hover:prose-a:text-purple-500 dark:hover:prose-a:text-purple-300",
      code: "prose-code:text-purple-700 dark:prose-code:text-purple-300",
      codeBg: "prose-code:bg-purple-50 dark:prose-code:bg-purple-500/10",
      codeBorder: "prose-code:border-purple-100 dark:prose-code:border-purple-500/20",
      hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-500/10",
      iconHoverBg: "group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20",
      solidBtn: "bg-purple-600 hover:bg-purple-500 text-white",
      outlineHover:
        "hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300",
    },
    "useful-apps": {
      from: "from-rose-500",
      to: "to-red-500",
      text: "text-rose-600 dark:text-rose-400",
      link: "prose-a:text-rose-600 dark:prose-a:text-rose-400",
      linkHover: "hover:prose-a:text-rose-500 dark:hover:prose-a:text-rose-300",
      code: "prose-code:text-rose-700 dark:prose-code:text-rose-300",
      codeBg: "prose-code:bg-rose-50 dark:prose-code:bg-rose-500/10",
      codeBorder: "prose-code:border-rose-100 dark:prose-code:border-rose-500/20",
      hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
      hoverBg: "hover:bg-rose-50 dark:hover:bg-rose-500/10",
      iconHoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20",
      solidBtn: "bg-rose-600 hover:bg-rose-500 text-white",
      outlineHover:
        "hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300",
    },
  };

  const theme = themeMap[guide.categoryKey] || themeMap["kvr-residence"];
  const numeral = categoryNumerals[guide.categoryKey] || "00";

  const localizedCategoryTitle = category
    ? (getMessage(`categories.${category.key}.title`) ?? category.title)
    : guide.categoryKey;

  const breadcrumbs = [
    { label: getMessage("nav.guides") ?? "Guides", href: "/guides" },
    { label: localizedCategoryTitle, href: `/category/${guide.categoryKey}` },
    { label: localizedGuide.title },
  ];

  const guideUrl = `${BASE_URL}/guides/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${guideUrl}#article`,
        headline: localizedGuide.title,
        description: localizedGuide.summary,
        datePublished: guide.lastUpdated,
        dateModified: guide.lastUpdated,
        inLanguage: locale,
        articleSection: localizedCategoryTitle,
        author: {
          "@type": guide.author ? "Person" : "Organization",
          name: guide.author ?? "Atlas Munich Team",
        },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: guideUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          ...breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: crumb.href ? `${BASE_URL}${crumb.href}` : guideUrl,
          })),
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Reading progress bar */}
      <ReadingProgress fromColor={theme.from} toColor={theme.to} guideSlug={guide.slug} />

      {/* ========== EDITORIAL HERO ========== */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-12 flex justify-center">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Category Pill */}
            <Link
              href={`/category/${guide.categoryKey}`}
              className={cn(
                "mb-8 inline-flex items-center justify-center gap-3 transition-opacity hover:opacity-80",
                theme.text
              )}
            >
              <span className="font-display text-2xl font-black opacity-30">{numeral}</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {localizedCategoryTitle}
              </span>
            </Link>

            {/* Title */}
            <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-7xl leading-[1.1]">
              {localizedGuide.title}
            </h1>

            {/* Summary */}
            <p className="mx-auto mt-8 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-xl lg:text-2xl max-w-3xl">
              {localizedGuide.summary}
            </p>

            {/* Typographic Meta Row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
              <span>
                {guide.readingTime} {getMessage("guidePage.minRead") ?? "min read"}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>
                {getMessage("guidePage.updatedLabel") ?? "Updated"}{" "}
                {fmtUpdated(guide.lastUpdated).toUpperCase()}
              </span>
              {guide.author && (
                <>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span>
                    {getMessage("guidePage.by") ?? "by"}{" "}
                    {(guide.author === "Atlas Munich Team"
                      ? (getMessage("guidePage.atlasMunichTeam") ?? guide.author)
                      : guide.author
                    ).toUpperCase()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:gap-24 lg:grid-cols-[1fr_300px]">
            {/* Main article canvas */}
            <article className="min-w-0">
              {/* Mobile TOC - Borderless */}
              {localizedGuide.sections.length > 0 && (
                <div className="lg:hidden mb-12">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {getMessage("guidePage.tableOfContents") ?? "In this guide"}
                  </h3>
                  <div className="pl-4 border-l border-zinc-100 dark:border-zinc-800">
                    <TableOfContents
                      sections={localizedGuide.sections}
                      label={getMessage("guidePage.onThisPage") ?? "On this page"}
                    />
                  </div>
                </div>
              )}

              {/* Sections rendered with premium prose */}
              <div className="space-y-0">
                {localizedGuide.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    {/* Minimal Divider */}
                    {index !== 0 && (
                      <div className="my-16 flex justify-center">
                        <div className="h-px w-16 bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                    )}

                    {/* Section header */}
                    <div className="mb-8">
                      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section content */}
                    <div>
                      <div
                        className={cn(
                          "prose prose-lg dark:prose-invert max-w-none",
                          "prose-headings:font-display prose-headings:text-zinc-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight",
                          "prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-[1.85] prose-p:text-[1.125rem]",
                          "prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-bold",
                          "prose-li:text-zinc-600 dark:prose-li:text-zinc-300 prose-li:leading-[1.85]",
                          "prose-ul:space-y-2 prose-ol:space-y-2",
                          theme.link,
                          "prose-a:no-underline prose-a:font-semibold prose-a:border-b-2 prose-a:border-transparent",
                          theme.linkHover,
                          "hover:prose-a:border-current prose-a:transition-all",
                          theme.code,
                          theme.codeBg,
                          "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:border",
                          theme.codeBorder,
                          "prose-blockquote:border-l-2 prose-blockquote:border-zinc-900 dark:prose-blockquote:border-zinc-100 prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:text-zinc-900 dark:prose-blockquote:text-zinc-100 prose-blockquote:font-normal prose-blockquote:not-italic",
                          "prose-hr:border-zinc-100 dark:prose-hr:border-zinc-800"
                        )}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                      </div>

                      {/* Subsections */}
                      {section.subsections?.map((sub) => (
                        <div key={sub.id} id={sub.id} className="mt-12 scroll-mt-28">
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-6">
                            {sub.title}
                          </h3>
                          <div
                            className={cn(
                              "prose prose-lg dark:prose-invert max-w-none",
                              "prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-[1.85] prose-p:text-[1.125rem]",
                              "prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100",
                              "prose-li:text-zinc-600 dark:prose-li:text-zinc-300 prose-li:leading-[1.85]",
                              theme.link,
                              "prose-a:no-underline prose-a:font-semibold prose-a:border-b-2 prose-a:border-transparent",
                              theme.linkHover,
                              "hover:prose-a:border-current prose-a:transition-all",
                              "prose-blockquote:border-l-2 prose-blockquote:border-zinc-900 dark:prose-blockquote:border-zinc-100 prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:text-zinc-900 dark:prose-blockquote:text-zinc-100 prose-blockquote:font-normal prose-blockquote:not-italic"
                            )}
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
              <div className="my-16 flex justify-center">
                <div className="h-px w-32 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* FAQ */}
              {localizedGuide.faqs && localizedGuide.faqs.length > 0 && (
                <section className="mb-16">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl mb-8 text-center">
                    {getMessage("guidePage.frequentlyAsked") ?? "Frequently Asked Questions"}
                  </h2>
                  <div className="mx-auto max-w-3xl">
                    <FAQAccordion faqs={localizedGuide.faqs} />
                  </div>
                </section>
              )}

              {/* Mobile Resources - Borderless */}
              {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                <section className="mb-16 lg:hidden">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                    {getMessage("guidePage.helpfulResources") ?? "Helpful Resources"}
                  </h2>
                  <div className="space-y-4 pl-4 border-l border-zinc-100 dark:border-zinc-800">
                    {localizedGuide.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <div className="flex items-baseline gap-2 font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-600 dark:hover:text-zinc-400">
                          <span>{resource.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </div>
                        {resource.description && (
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {resource.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <section className="mt-20">
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl mb-8 text-center">
                    {getMessage("guidePage.continueLearning") ?? "Continue Reading"}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {relatedGuides.slice(0, 4).map((related) => (
                      <GuideCard key={related.slug} guide={related} />
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom CTA - Editorial Minimal */}
              <div className="mt-20 flex flex-col items-center justify-center gap-6 text-center">
                <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  {getMessage("guidePage.bottomCTATitle") ?? "Explore More Guides"}
                </h3>
                <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md">
                  {getMessage("guidePage.bottomCTADesc") ??
                    "Discover more resources in this category or browse the full collection."}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <Link
                    href={`/category/${guide.categoryKey}`}
                    className={cn(
                      "group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors",
                      theme.text
                    )}
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {category?.title || "Category"}
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <Link
                    href="/guides"
                    className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 transition-colors hover:opacity-70"
                  >
                    {getMessage("guidePage.bottomCTAAllGuides") ?? "All Guides"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Desktop Sidebar - Borderless Floating */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-16">
                {/* TOC */}
                {localizedGuide.sections.length > 0 && (
                  <div>
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                      {getMessage("guidePage.tableOfContents") ?? "In this guide"}
                    </h3>
                    <div className="pl-4 border-l border-zinc-100 dark:border-zinc-800">
                      <TableOfContents
                      sections={localizedGuide.sections}
                      label={getMessage("guidePage.onThisPage") ?? "On this page"}
                    />
                    </div>
                  </div>
                )}

                {/* Resources */}
                {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                  <div>
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                      {getMessage("guidePage.resources") ?? "Resources"}
                    </h3>
                    <div className="space-y-6 pl-4 border-l border-zinc-100 dark:border-zinc-800">
                      {localizedGuide.resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <div
                            className={cn(
                              "flex items-baseline gap-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-colors",
                              theme.hoverText
                            )}
                          >
                            <span className="leading-snug">{resource.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
                          </div>
                          {resource.description && (
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                              {resource.description}
                            </p>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share - Text Based Minimal */}
                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    {getMessage("guidePage.shareThisGuide") ?? "Share this guide"}
                  </h3>
                  <ShareButton
                    className={cn(
                      "w-full bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-none rounded-none py-3",
                      theme.hoverText
                    )}
                    text="Copy Link"
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
