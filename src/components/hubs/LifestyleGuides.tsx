"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { ExplorerTopic } from "@/lib/guide-tree-server";
import { GuideCanvas } from "./GuideCanvas";
import { GuideExplorer } from "./GuideExplorer";

type View = "tree" | "outline";
const STORAGE_KEY = "atlas:lifestyle-view";

/**
 * Every guide in two views over the same data and the same URL hash: the
 * living tree (default), and the outline for fast scanning and for anyone who
 * would rather read a list. The choice is remembered on this device only.
 *
 * Each view carries its own search, which works in place (the tree opens at
 * the hit, the outline filters itself). `?q=` from the header's search pill or
 * the sitelinks search box seeds whichever view is showing. It is read from
 * `location.search` after mount, because `useSearchParams` would opt /guides
 * out of prerendering.
 */
export function LifestyleGuides({ topics }: { topics: ExplorerTopic[] }) {
  const t = useTranslations("hubs.explorer");
  const [view, setView] = React.useState<View>("tree");
  const [initialQuery, setInitialQuery] = React.useState("");

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "outline") setView("outline");
    } catch {
      /* Storage blocked: stay on the tree. */
    }
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (q) setInitialQuery(q);
  }, []);

  const choose = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Not remembered, still switched. */
    }
  };

  const toggle = (
    <div
      role="group"
      aria-label={t("viewLabel")}
      className="flex h-11 shrink-0 items-center rounded-full bg-muted p-1 text-[13px] font-semibold"
    >
      {(["tree", "outline"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => choose(option)}
          className={cn(
            "h-full rounded-full px-4 outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-zellige/50",
            view === option
              ? "bg-card text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-zinc-700 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          )}
        >
          {option === "tree" ? t("viewTree") : t("viewOutline")}
        </button>
      ))}
    </div>
  );

  return view === "tree" ? (
    <GuideCanvas topics={topics} initialQuery={initialQuery} toolbar={toggle} />
  ) : (
    <GuideExplorer topics={topics} initialQuery={initialQuery} toolbar={toggle} />
  );
}
