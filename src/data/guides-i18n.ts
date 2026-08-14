// ============================================
// Guide locale overlay
//
// `guides.ts` is the English source of truth and owns every non-text field
// (slug, category, tags, reading time). `guides.fr.ts` / `guides.de.ts` carry
// only the prose, keyed by slug and then by section/faq/resource id, and are
// laid over it here.
//
// The import is dynamic so a locale's translations, ~50KB each, load on the
// server for the request that needs them and never reach the client bundle.
// Anything the overlay is missing falls back to English rather than blanking.
// ============================================

import type { Guide, GuideTranslation } from "@/types";
import { withReadingTime } from "@/lib/reading-time";

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

function byId<T extends { id: string }>(entries: readonly T[] | undefined): Map<string, T> {
  return new Map((entries ?? []).map((entry) => [entry.id, entry]));
}

/* An overlay id with no English counterpart means that translation is being
   dropped on the floor, which is exactly what happens when a section id is
   renamed in guides.ts and the locale files are not followed up. Silent in
   production, loud in development. */
function warnOrphans(
  slug: string,
  kind: string,
  overlay: Map<string, unknown>,
  sourceIds: string[]
) {
  if (process.env.NODE_ENV === "production") return;
  for (const id of overlay.keys()) {
    if (!sourceIds.includes(id)) {
      console.warn(
        `[guides-i18n] ${slug}: translated ${kind} "${id}" matches nothing in guides.ts`
      );
    }
  }
}

function applyOverlay(guide: Guide, translation?: GuideTranslation): Guide {
  if (!translation) return guide;

  // Matched on id rather than array position. Position matching used to mean
  // that inserting one section into guides.ts silently shifted every later
  // French and German section onto the wrong heading, with no type or runtime
  // error to catch it. An id that has no counterpart just falls back to English.
  const sections = byId(translation.sections);
  const faqs = byId(translation.faqs);
  const resources = byId(translation.resources);

  warnOrphans(
    guide.slug,
    "section",
    sections,
    guide.sections.map((s) => s.id)
  );
  warnOrphans(guide.slug, "faq", faqs, guide.faqs?.map((f) => f.id) ?? []);
  warnOrphans(guide.slug, "resource", resources, guide.resources?.map((r) => r.id) ?? []);

  return {
    ...guide,
    title: translation.title ?? guide.title,
    summary: translation.summary ?? guide.summary,
    sections: guide.sections.map((section) => {
      const t = sections.get(section.id);
      const subs = byId(t?.subsections);
      return {
        ...section,
        title: t?.title ?? section.title,
        content: t?.content ?? section.content,
        subsections: section.subsections?.map((sub) => ({
          ...sub,
          title: subs.get(sub.id)?.title ?? sub.title,
          content: subs.get(sub.id)?.content ?? sub.content,
        })),
      };
    }),
    faqs: guide.faqs?.map((faq) => ({
      ...faq,
      question: faqs.get(faq.id)?.question ?? faq.question,
      answer: faqs.get(faq.id)?.answer ?? faq.answer,
    })),
    resources: guide.resources?.map((resource) => ({
      ...resource,
      title: resources.get(resource.id)?.title ?? resource.title,
      description: resources.get(resource.id)?.description ?? resource.description,
    })),
  };
}

/* Reading time is computed here rather than authored, so it is measured
   against the prose the reader is actually getting. The hardcoded values in
   guides.ts were English-only, which meant French and German pages quoted the
   English figure for 15 to 20 percent more text. */
export async function localizeGuide(guide: Guide, locale: string): Promise<Guide> {
  const overlay = await loadOverlay(locale);
  return withReadingTime(applyOverlay(guide, overlay?.[guide.slug]));
}

export async function localizeGuides(guides: Guide[], locale: string): Promise<Guide[]> {
  const overlay = await loadOverlay(locale);
  if (!overlay) return guides.map(withReadingTime);
  return guides.map((guide) => withReadingTime(applyOverlay(guide, overlay[guide.slug])));
}
