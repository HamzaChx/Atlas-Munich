import { getMessages, getTranslations } from "next-intl/server";

import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { buildGuideTree, type ShortLabel, type TreeNode } from "@/data/guide-tree";
import { getHub } from "@/data/hubs";
import { freshnessAt, type Freshness } from "@/lib/date";
import { plainExcerpt } from "@/lib/text";
import { minutesToRead } from "@/lib/reading-time";
import type { CategoryKey, Guide, HubKey } from "@/types";

type TreeMessages = Record<string, Record<string, string> | string>;

/**
 * Labels are read straight off the messages object rather than through `t()`,
 * because a section with no short label yet is a normal state that should fall
 * back to its full heading, not log a missing-message error on every build.
 */
async function getShortLabel(): Promise<ShortLabel> {
  const messages = (await getMessages()) as unknown as { tree?: TreeMessages };
  const tree = messages.tree ?? {};

  return (path: string): string | undefined => {
    const [slug, sectionId] = path.split(".");
    const entry = tree[slug];
    if (!entry || typeof entry === "string") return undefined;
    return sectionId ? entry[sectionId] : entry._;
  };
}

/**
 * Builds the guide tree on the server, so the ~50 KB locale overlays and the
 * label table stay out of the client bundle. The tree component receives
 * finished, already-localized nodes as props.
 */
export async function getGuideTree(locale: string, hub?: HubKey): Promise<TreeNode[]> {
  const shortLabel = await getShortLabel();
  const localized = await localizeGuides(guides, locale);
  return buildGuideTree(localized, shortLabel, { hub });
}

export interface ExplorerSection {
  id: string;
  /** Four words at most, from the `tree` message table. */
  label: string;
  /** The section's real heading, shown in the preview. */
  title: string;
  excerpt: string;
  minutes: number;
  href: string;
  children: { id: string; label: string; href: string }[];
}

export interface ExplorerGuide {
  slug: string;
  title: string;
  /** A few words, from the `tree` message table; the title when missing. */
  label: string;
  summary: string;
  href: string;
  readingTime: number;
  lastVerified: string;
  freshness: Freshness;
  source: { title: string; url: string };
  sections: ExplorerSection[];
}

export interface ExplorerTopic {
  key: CategoryKey;
  title: string;
  description: string;
  guides: ExplorerGuide[];
}

/**
 * A hub's guides grouped into topics (one per category, in the hub's own
 * order), with what the explorer shows on top of the labels: summaries,
 * a plain-text excerpt and reading time per section, and each guide's
 * freshness. Excerpts are cut here so the full prose never reaches the
 * client. Topics with no guides yet are left out rather than shown empty.
 */
export async function getGuideExplorer(locale: string, hubKey: HubKey): Promise<ExplorerTopic[]> {
  const hub = getHub(hubKey);
  const shortLabel = await getShortLabel();
  const tCategories = await getTranslations({ locale, namespace: "categories" });
  const localized = await localizeGuides(
    guides.filter((guide) => hub.categoryKeys.includes(guide.categoryKey)),
    locale
  );

  const toGuide = (guide: Guide): ExplorerGuide => ({
    slug: guide.slug,
    title: guide.title,
    label: shortLabel(guide.slug) ?? guide.title,
    summary: guide.summary,
    href: `/guides/${guide.slug}`,
    readingTime: guide.readingTime,
    lastVerified: guide.lastVerified,
    freshness: freshnessAt(guide.lastVerified),
    source: guide.primarySource,
    sections: guide.sections.map((section) => ({
      id: section.id,
      label: shortLabel(`${guide.slug}.${section.id}`) ?? section.title,
      title: section.title,
      excerpt: plainExcerpt(section.content, 220),
      minutes: minutesToRead(
        section.content,
        ...(section.subsections ?? []).map((sub) => sub.content)
      ),
      href: `/guides/${guide.slug}#${section.id}`,
      children: (section.subsections ?? []).map((sub) => ({
        id: sub.id,
        label: shortLabel(`${guide.slug}.${sub.id}`) ?? sub.title,
        href: `/guides/${guide.slug}#${sub.id}`,
      })),
    })),
  });

  return hub.categoryKeys
    .map((key) => ({
      key,
      title: tCategories(`${key}.title`),
      description: tCategories(`${key}.description`),
      guides: localized.filter((guide) => guide.categoryKey === key).map(toGuide),
    }))
    .filter((topic) => topic.guides.length > 0);
}
