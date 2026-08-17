// ============================================
// Atlas Munich – journey hubs
//
// The top bar used to be a directory: Home, Guides, Places, Tools, FAQ, About.
// That grouping asked the reader to work out which kind of page held their
// answer. These four hubs are the stages of actually moving here instead, so
// the choice is about where you are in your move, not about our file layout.
//
// Single source of truth for the mapping. Categories, guides and helpers each
// belong to exactly one hub; nav, breadcrumbs and the guide tree all read it
// from here.
// ============================================

import type { CategoryKey, HubKey } from "@/types";
import type { ChatbotType } from "@/chatbot/types";

export interface Hub {
  key: HubKey;
  route: string;
  /** Categories whose guides surface on this hub. */
  categoryKeys: CategoryKey[];
  /** Helpers offered here. */
  assistants: ChatbotType[];
  /** Flat brand tokens, no gradients. */
  tint: string;
  acc: string;
  dot: string;
}

export const hubs: Hub[] = [
  {
    key: "map",
    route: "/map",
    /* Housing sits here rather than under Studies because it is a "where"
       question first: which district, what rent, how far from campus. The map
       already answers that, and Riad belongs on the same page as it. */
    categoryKeys: ["rent-housing"],
    assistants: ["riad"],
    tint: "bg-tint-terra",
    acc: "text-acc-terra",
    dot: "bg-acc-terra",
  },
  {
    key: "guide",
    route: "/chat",
    categoryKeys: ["kvr-residence", "university-life"],
    assistants: ["dalilah", "ilham", "loubna"],
    tint: "bg-tint-blue",
    acc: "text-acc-blue",
    dot: "bg-acc-blue",
  },
  {
    key: "career",
    route: "/career",
    categoryKeys: ["career", "useful-apps"],
    assistants: [],
    tint: "bg-tint-plum",
    acc: "text-acc-plum",
    dot: "bg-acc-plum",
  },
  {
    key: "community",
    route: "/community",
    // Deliberately holds no guides. It is where people are, not where
    // instructions are, and its page is shaped differently because of it.
    categoryKeys: [],
    assistants: [],
    tint: "bg-tint-green",
    acc: "text-acc-green",
    dot: "bg-acc-green",
  },
];

export const hubOrder: HubKey[] = hubs.map((hub) => hub.key);

export function getHub(key: HubKey): Hub {
  const hub = hubs.find((h) => h.key === key);
  if (!hub) throw new Error(`Unknown hub: ${key}`);
  return hub;
}

export function getHubForCategory(categoryKey: CategoryKey): Hub | undefined {
  return hubs.find((hub) => hub.categoryKeys.includes(categoryKey));
}

/** Where a category's old /category/<key> page now lives. */
export function hubRouteForCategory(categoryKey: CategoryKey): string {
  return getHubForCategory(categoryKey)?.route ?? "/guides";
}
