// ============================================
// Guide locale overlay
//
// `guides.ts` is the English source of truth and owns every non-text field
// (slug, category, tags, reading time). `guides.fr.ts` / `guides.de.ts` carry
// only the prose, keyed by slug, and are laid over it here.
//
// The import is dynamic so a locale's translations, ~50KB each, load on the
// server for the request that needs them and never reach the client bundle.
// Anything the overlay is missing falls back to English rather than blanking.
// ============================================

import type { Guide, GuideTranslation } from "@/types";

type Overlay = Record<string, GuideTranslation>;

async function loadOverlay(locale: string): Promise<Overlay | null> {
  if (locale === "en") return null;
  try {
    const mod = await import(`./guides.${locale}`);
    return (mod.guideTranslations as Overlay) ?? null;
  } catch {
    // No translation file for this locale: English stands.
    return null;
  }
}

function applyOverlay(guide: Guide, translation?: GuideTranslation): Guide {
  if (!translation) return guide;

  return {
    ...guide,
    title: translation.title ?? guide.title,
    summary: translation.summary ?? guide.summary,
    // Sections are matched by position, the shape both files are written in.
    sections: guide.sections.map((section, i) => ({
      ...section,
      title: translation.sections?.[i]?.title ?? section.title,
      content: translation.sections?.[i]?.content ?? section.content,
      subsections: section.subsections?.map((sub, j) => ({
        ...sub,
        title: translation.sections?.[i]?.subsections?.[j]?.title ?? sub.title,
        content: translation.sections?.[i]?.subsections?.[j]?.content ?? sub.content,
      })),
    })),
    faqs: guide.faqs?.map((faq, i) => ({
      ...faq,
      question: translation.faqs?.[i]?.question ?? faq.question,
      answer: translation.faqs?.[i]?.answer ?? faq.answer,
    })),
    resources: guide.resources?.map((resource, i) => ({
      ...resource,
      title: translation.resources?.[i]?.title ?? resource.title,
      description: translation.resources?.[i]?.description ?? resource.description,
    })),
  };
}

export async function localizeGuide(guide: Guide, locale: string): Promise<Guide> {
  const overlay = await loadOverlay(locale);
  return applyOverlay(guide, overlay?.[guide.slug]);
}

export async function localizeGuides(guides: Guide[], locale: string): Promise<Guide[]> {
  const overlay = await loadOverlay(locale);
  if (!overlay) return guides;
  return guides.map((guide) => applyOverlay(guide, overlay[guide.slug]));
}
