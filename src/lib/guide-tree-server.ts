import { getMessages } from "next-intl/server";

import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { buildGuideTree, type TreeNode } from "@/data/guide-tree";
import type { HubKey } from "@/types";

type TreeMessages = Record<string, Record<string, string> | string>;

/**
 * Builds the guide tree on the server, so the ~50 KB locale overlays and the
 * label table stay out of the client bundle. The tree component receives
 * finished, already-localized nodes as props.
 *
 * Labels are read straight off the messages object rather than through `t()`,
 * because a section with no short label yet is a normal state that should fall
 * back to its full heading, not log a missing-message error on every build.
 */
export async function getGuideTree(locale: string, hub?: HubKey): Promise<TreeNode[]> {
  const messages = (await getMessages()) as unknown as { tree?: TreeMessages };
  const tree = messages.tree ?? {};

  const shortLabel = (path: string): string | undefined => {
    const [slug, sectionId] = path.split(".");
    const entry = tree[slug];
    if (!entry || typeof entry === "string") return undefined;
    return sectionId ? entry[sectionId] : entry._;
  };

  const localized = await localizeGuides(guides, locale);
  return buildGuideTree(localized, shortLabel, { hub });
}
