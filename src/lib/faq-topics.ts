// ============================================
// Atlas Munich – FAQ topics
//
// Grouping data for the topic-card view of a hub's questions. `FAQ.categoryKey`
// already carries this grouping (see src/data/faqs.ts), FaqTopicGrid just
// wasn't reading it before now — this is the lookup that turns a category key
// into an icon, plus the "general" catch-all for the handful of questions
// (first-week newcomer tips, halal food spots) that never had a category at
// all and still need somewhere to land.
// ============================================

import { Home, FileText, GraduationCap, Briefcase, Smartphone, HelpCircle, type LucideIcon } from "lucide-react";

import type { CategoryKey, FAQ } from "@/types";

export type FaqTopicKey = CategoryKey | "general";

export interface FaqTopic {
  key: FaqTopicKey;
  icon: LucideIcon;
}

export interface FaqTopicGroup {
  topic: FaqTopic;
  faqs: FAQ[];
}

const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  "rent-housing": Home,
  "kvr-residence": FileText,
  "university-life": GraduationCap,
  career: Briefcase,
  "useful-apps": Smartphone,
  "halal-food": HelpCircle,
};

/**
 * Groups preserve first-appearance order, e.g. if a hub's first FAQ is
 * `kvr-residence`, that card leads. The `general` catch-all always reads
 * last regardless of where its questions fall in the source array, since
 * it is a fallback bucket rather than a real topic.
 */
export function groupFaqsByTopic(faqs: FAQ[]): FaqTopicGroup[] {
  const order: FaqTopicKey[] = [];
  const buckets = new Map<FaqTopicKey, FAQ[]>();

  for (const faq of faqs) {
    const key: FaqTopicKey = faq.categoryKey ?? "general";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(faq);
  }

  const sortedKeys: FaqTopicKey[] = order.filter((key) => key !== "general");
  if (buckets.has("general")) sortedKeys.push("general");

  return sortedKeys.map((key) => ({
    topic: { key, icon: key === "general" ? HelpCircle : CATEGORY_ICONS[key] },
    faqs: buckets.get(key)!,
  }));
}
