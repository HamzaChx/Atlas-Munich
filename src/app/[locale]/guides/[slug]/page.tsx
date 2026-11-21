import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeTermLists } from "@/lib/rehype-term-lists";
import {
  Breadcrumbs,
  TableOfContents,
  GuideFaqEntry,
  GuideCard,
  ShareButton,
  ReadingProgress,
} from "@/components/shared";
import { GuideFreshness } from "@/components/shared/GuideFreshness";
import { GuideDossier } from "@/components/shared/GuideDossier";
import { GuideStepPrompt } from "@/components/shared/GuideStepPrompt";
import { personaForCategory } from "@/lib/guide-personas";
import { freshnessAt } from "@/lib/date";
import { guides, getGuideBySlug, getRelatedGuides } from "@/data/guides";
import { localizeGuide, localizeGuides } from "@/data/guides-i18n";
import { getCategoryByKey } from "@/data/categories";
import { categoryHref } from "@/data/hubs";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cn } from "@/lib/utils";
import { BASE_URL, localizedUrl, alternatesFor } from "@/lib/urls";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  // The overlay has to be applied here too. Without it the French and German
  // pages carried English titles and descriptions, which is what a crawler and
  // a link preview both read first.
  const localized = await localizeGuide(guide, locale);
  const category = getCategoryByKey(guide.categoryKey);
  const path = `/guides/${guide.slug}`;

  return {
    title: localized.title,
    description: localized.summary,
    alternates: alternatesFor(locale, path),
    keywords: [
      ...guide.tags,
      guide.categoryKey.replace(/-/g, " "),
      "Munich guide",
      "Atlas Munich",
      ...(category ? [category.title] : []),
    ],
    openGraph: {
      title: `${localized.title} | Atlas Munich`,
      description: localized.summary,
      type: "article",
      url: localizedUrl(locale, path),
      publishedTime: guide.lastUpdated,
      authors: guide.author ? [guide.author] : ["Atlas Munich Team"],
      tags: guide.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${localized.title} | Atlas Munich`,
      description: localized.summary,
    },
  };
}

/* Label role for this page: sidebar group headings and the meta row. Kept at
   zinc-600 so 12px uppercase clears 4.5:1 on plaster (zinc-400 sat near 2.6:1). */
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400";

export default async function GuidePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  /* Three scoped namespaces rather than a `messages/${locale}.json` import.
     The template-literal import matched all three locale files, so every one
     of them (~150 KB each) was pulled into this route's bundle to read a
     handful of nav and guidePage strings. */
  const t = await getTranslations("guidePage");
  const tNav = await getTranslations("nav");
  const tCategories = await getTranslations("categories");
  const tStep = await getTranslations("guidePage.stepPrompt");

  const category = getCategoryByKey(guide.categoryKey);
  // The assistant who owns this topic: tints the dossier, answers the prompts.
  const persona = personaForCategory(guide.categoryKey);

  const localizedGuide = await localizeGuide(guide, locale);
  // The related-guide cards at the foot of the page need the overlay too.
  const relatedGuides = await localizeGuides(getRelatedGuides(guide), locale);

  const themeMap: Record<
    string,
    {
      from: string;
      to: string;
      text: string;
      /** Sets --guide-accent for list markers and links in the article body. */
      accent: string;
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
      accent: "[--guide-accent:var(--color-amber-700)] dark:[--guide-accent:var(--color-amber-500)]",
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
      accent: "[--guide-accent:var(--color-blue-600)] dark:[--guide-accent:var(--color-blue-400)]",
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
      accent: "[--guide-accent:var(--color-emerald-600)] dark:[--guide-accent:var(--color-emerald-400)]",
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
      accent: "[--guide-accent:var(--color-purple-600)] dark:[--guide-accent:var(--color-purple-400)]",
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
      accent: "[--guide-accent:var(--color-rose-600)] dark:[--guide-accent:var(--color-rose-400)]",
      hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
      hoverBg: "hover:bg-rose-50 dark:hover:bg-rose-500/10",
      iconHoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20",
      solidBtn: "bg-rose-600 hover:bg-rose-500 text-white",
      outlineHover:
        "hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300",
    },
  };

  const theme = themeMap[guide.categoryKey] || themeMap["kvr-residence"];
  // The FAQ entry card's tinted plate: the same flat tint `theme.hoverBg`
  // already defines for hover states, just always-on rather than triggered.
  const faqPlate = theme.hoverBg.replace(/hover:/g, "");

  const localizedCategoryTitle = category
    ? tCategories(`${category.key}.title`)
    : guide.categoryKey;

  const breadcrumbs = [
    { label: tNav("guides"), href: "/guides" },
    { label: localizedCategoryTitle, href: categoryHref(guide.categoryKey) },
    { label: localizedGuide.title },
  ];

  /* Locale-aware, so the French page does not declare the English URL as its
     own main entity. */
  const guideUrl = localizedUrl(locale, `/guides/${guide.slug}`);
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
        isBasedOn: guide.primarySource.url,
        // The per-guide OG route already renders this; the Article schema was
        // the one place not pointing at it.
        image: `${guideUrl}/opengraph-image`,
      },
      /* The guide's own questions were rendered but never marked up. */
      ...(localizedGuide.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: localizedGuide.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          ...breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            // Visible crumbs may open a topic via the hash; the schema wants
            // the page itself.
            item: crumb.href ? localizedUrl(locale, crumb.href.split("#")[0]) : guideUrl,
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

          {/* The category already sits in the breadcrumb above, so the title
              opens the page on its own, without a kicker restating it. */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-7xl leading-[1.08]">
              {localizedGuide.title}
            </h1>

            {/* Summary */}
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-balance text-zinc-600 dark:text-zinc-400 sm:text-xl lg:text-[1.375rem]">
              {localizedGuide.summary}
            </p>

            {/* Meta row */}
            <div
              className={cn(
                "mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1",
                labelClass
              )}
            >
              <span>
                {localizedGuide.readingTime} {t("minRead")}
              </span>
              {guide.author && (
                <>
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                  />
                  <span>
                    {t("by")}{" "}
                    {(guide.author === "Atlas Munich Team"
                      ? (t("atlasMunichTeam") ?? guide.author)
                      : guide.author
                    ).toUpperCase()}
                  </span>
                </>
              )}
            </div>

            {/* When the facts were last checked, and against what. */}
            <GuideFreshness
              className="mt-6"
              verifiedAt={guide.lastVerified}
              source={guide.primarySource}
              initial={freshnessAt(guide.lastVerified)}
            />
          </div>
        </div>
      </section>

      {/* ========== CONTENT ========== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:gap-24 lg:grid-cols-[1fr_300px]">
            {/* Main article canvas */}
            <article className="min-w-0">
              {/* Before you go: the panic question first, the explanation below */}
              {localizedGuide.dossier && (
                <GuideDossier
                  className="mb-14 lg:mb-20"
                  slug={guide.slug}
                  guideTitle={localizedGuide.title}
                  dossier={localizedGuide.dossier}
                  persona={persona}
                  verifiedAt={guide.lastVerified}
                  source={guide.primarySource}
                />
              )}

              {/* Mobile TOC - Borderless */}
              {localizedGuide.sections.length > 0 && (
                <div className="lg:hidden mb-12">
                  <h3 className={cn("mb-4", labelClass)}>
                    {t("onThisPage")}
                  </h3>
                  <div className="pl-4 border-l border-zinc-100 dark:border-zinc-800">
                    <TableOfContents sections={localizedGuide.sections} label="" />
                  </div>
                </div>
              )}

              {/* Sections rendered with premium prose */}
              <div className="space-y-0">
                {localizedGuide.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    {/* Divider, aligned with the text column it separates */}
                    {index !== 0 && <div className="my-14 h-px w-16 bg-zinc-200 dark:bg-zinc-800" />}

                    {/* Section header */}
                    <h2 className="mb-5 max-w-[68ch] font-display text-2xl font-bold leading-tight tracking-tight text-balance text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                      {section.title}
                    </h2>

                    {/* Section content */}
                    <div className={cn("guide-prose", theme.accent)}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeTermLists]}>
                        {section.content}
                      </ReactMarkdown>
                    </div>

                    {/* Subsections */}
                    {section.subsections?.map((sub) => (
                      <div key={sub.id} id={sub.id} className="mt-11 scroll-mt-28">
                        <h3 className="mb-4 max-w-[68ch] font-display text-xl font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-50 sm:text-[1.375rem]">
                          {sub.title}
                        </h3>
                        <div className={cn("guide-prose", theme.accent)}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeTermLists]}>
                            {sub.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}

                    {persona && (
                      <GuideStepPrompt
                        className="mt-7"
                        persona={persona}
                        question={tStep("question", {
                          guide: localizedGuide.title,
                          step: section.title,
                        })}
                        stuckLabel={tStep("stuck")}
                        askLabel={tStep("ask", { name: persona.name })}
                      />
                    )}
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
                    {t("frequentlyAsked")}
                  </h2>
                  <div className="mx-auto max-w-3xl">
                    <GuideFaqEntry
                      faqs={localizedGuide.faqs}
                      guideSlug={guide.slug}
                      title={localizedCategoryTitle}
                      accentText={theme.text}
                      accentPlate={faqPlate}
                    />
                  </div>
                </section>
              )}

              {/* Mobile Resources - Borderless */}
              {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                <section className="mb-16 lg:hidden">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                    {t("helpfulResources")}
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
                    {t("continueLearning")}
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
                  {t("bottomCTATitle")}
                </h3>
                <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md">
                  {t("bottomCTADesc")}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <Link
                    href={categoryHref(guide.categoryKey)}
                    className={cn(
                      "group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors",
                      theme.text
                    )}
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {localizedCategoryTitle}
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <Link
                    href="/guides"
                    className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 transition-colors hover:opacity-70"
                  >
                    {t("bottomCTAAllGuides")}
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
                    <h3 className={cn("mb-5", labelClass)}>
                      {t("onThisPage")}
                    </h3>
                    <div className="pl-4 border-l border-zinc-100 dark:border-zinc-800">
                      <TableOfContents sections={localizedGuide.sections} label="" />
                    </div>
                  </div>
                )}

                {/* Resources */}
                {localizedGuide.resources && localizedGuide.resources.length > 0 && (
                  <div>
                    <h3 className={cn("mb-5", labelClass)}>
                      {t("resources")}
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
                  <h3 className={cn("mb-4", labelClass)}>
                    {t("shareThisGuide")}
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
