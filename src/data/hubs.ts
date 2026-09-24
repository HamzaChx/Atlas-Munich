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
  /**
   * How the hub draws its guides. "graph" is the collapsible index shared with
   * /guides; "explorer" is a topic tree beside a detail pane, built to stay
   * calm as a broad hub collects many guides.
   */
  guidesLayout?: "graph" | "explorer";
  /** Flat brand tokens, no gradients. */
  tint: string;
  acc: string;
  dot: string;
}

export const hubs: Hub[] = [
  {
    key: "map",
    route: "/map",
    /* The map answers "where" (districts, rent, distance from campus) and
       Riad lives here, but the housing guide is read in the Lifestyle tree
       with every other guide: this page never listed it. */
    categoryKeys: [],
    assistants: ["riad"],
    tint: "bg-tint-terra",
    acc: "text-acc-terra",
    dot: "bg-acc-terra",
  },
  {
    key: "guide",
    route: "/chat",
    /* Chat-first: the helpers answer here, the guides are browsed in the
       Lifestyle tree. */
    categoryKeys: [],
    assistants: ["dalilah", "ilham", "loubna"],
    tint: "bg-tint-blue",
    acc: "text-acc-blue",
    dot: "bg-acc-blue",
  },
  {
    /* Was "career". Now the home of every guide: each category is a topic
       in the tree on this page, in the order a newcomer meets them. A new
       category added here grows a new branch, nothing else to wire up. */
    key: "lifestyle",
    route: "/lifestyle",
    categoryKeys: ["rent-housing", "kvr-residence", "university-life", "career", "useful-apps"],
    assistants: [],
    guidesLayout: "explorer",
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

/**
 * Where to browse a category's guides: the owning hub, opened on that topic
 * when the hub draws the explorer tree (`/lifestyle#kvr-residence`). For
 * visible links; structured data wants the plain route without the hash.
 */
export function categoryHref(categoryKey: CategoryKey): string {
  const hub = getHubForCategory(categoryKey);
  if (!hub) return "/guides";
  return hub.guidesLayout === "explorer" ? `${hub.route}#${categoryKey}` : hub.route;
}
