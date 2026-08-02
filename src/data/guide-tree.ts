// ============================================
// Atlas Munich – the guide tree
//
// The guides index used to be a numbered editorial roadmap: five milestones
// down a vertical line, each listing its guides in full. Scanning it meant
// reading a paragraph of summary per entry before you could tell whether any
// of it was for you, which is a lot of reading effort spent on navigation
// rather than on the actual documents.
//
// This derives a three-level tree instead, where every node is at most four
// words. Levels map onto content that already exists:
//
//   L1  guide      -> /guides/<slug>
//   L2  section    -> /guides/<slug>#<section.id>
//   L3  subsection -> /guides/<slug>#<sub.id>
//
// Those anchors already resolve: the guide page renders `id={section.id}` on
// every section and subsection, so nothing about the article template has to
// change for a tree node to land in the right place.
//
// Derived, not authored: there is no second data file to keep in step with
// guides.ts. Only the short labels are authored, and they live in the message
// files where translators already work.
// ============================================

import type { Guide, HubKey } from "@/types";
import { getHubForCategory } from "./hubs";

export interface TreeNode {
  /** Unique within the tree, e.g. "find-werkstudent-job/where-to-find-jobs". */
  id: string;
  /** Four words at most. Falls back to the full heading when unlabelled. */
  label: string;
  href: string;
  level: 1 | 2 | 3;
  children: TreeNode[];
  /** L1 only: what the reader is committing to by opening it. */
  readingTime?: number;
}

/**
 * Looks up a short label. `path` is either "<slug>" for a guide or
 * "<slug>.<sectionId>" for anything below it.
 */
export type ShortLabel = (path: string) => string | undefined;

interface BuildOptions {
  /** Restrict to the guides belonging to one journey hub. */
  hub?: HubKey;
}

/**
 * Guides must already be localized (run through `localizeGuides`), so section
 * headings are in the reader's language when no short label exists for them.
 */
export function buildGuideTree(
  guides: Guide[],
  shortLabel: ShortLabel,
  options: BuildOptions = {}
): TreeNode[] {
  const scoped = options.hub
    ? guides.filter((guide) => getHubForCategory(guide.categoryKey)?.key === options.hub)
    : guides;

  return scoped.map((guide) => ({
    id: guide.slug,
    label: shortLabel(guide.slug) ?? guide.title,
    href: `/guides/${guide.slug}`,
    level: 1 as const,
    readingTime: guide.readingTime,
    children: guide.sections.map((section) => ({
      id: `${guide.slug}/${section.id}`,
      label: shortLabel(`${guide.slug}.${section.id}`) ?? section.title,
      href: `/guides/${guide.slug}#${section.id}`,
      level: 2 as const,
      children: (section.subsections ?? []).map((sub) => ({
        id: `${guide.slug}/${section.id}/${sub.id}`,
        label: shortLabel(`${guide.slug}.${sub.id}`) ?? sub.title,
        href: `/guides/${guide.slug}#${sub.id}`,
        level: 3 as const,
        children: [],
      })),
    })),
  }));
}

/** Every link in the tree, flattened. Used for the ItemList structured data. */
export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children)]);
}
