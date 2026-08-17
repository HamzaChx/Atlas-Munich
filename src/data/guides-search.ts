// ============================================
// Atlas Munich – guide search
//
// Extracted from GuidesBrowser.tsx so the same fuzzy-match logic can run
// server-side too (Zellija's retrieval tool). Kept translation-agnostic:
// callers attach `topicLabel` themselves, since only they know the reader's
// locale.
// ============================================

import Fuse from "fuse.js";
import type { Guide } from "@/types";

export interface GuideSearchEntry extends Guide {
  topicLabel: string;
}

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 2 },
    { name: "summary", weight: 1 },
    { name: "topicLabel", weight: 1 },
    { name: "tags", weight: 0.5 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

/** Fuzzy-search already-labeled guides. Returns [] for a blank query. */
export function searchGuides<T extends GuideSearchEntry>(guides: T[], query: string): T[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const fuse = new Fuse(guides, FUSE_OPTIONS);
  return fuse.search(trimmed).map((result) => result.item);
}
