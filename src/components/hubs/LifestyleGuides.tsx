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
 * The Lifestyle guides in two views over the same data and the same URL
 * hash: the living tree (default), and the outline for fast scanning and
 * for anyone who would rather read a list. The choice is remembered on
 * this device only.
 */
export function LifestyleGuides({ topics }: { topics: ExplorerTopic[] }) {
  const t = useTranslations("hubs.explorer");
  const [view, setView] = React.useState<View>("tree");

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "outline") setView("outline");
    } catch {
      /* Storage blocked: stay on the tree. */
    }
  }, []);

  const choose = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Not remembered, still switched. */
    }
  };

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {view === "tree" ? t("treeHint") : t("hint")}
        </p>
        <div
          role="group"
          aria-label={t("viewLabel")}
          className="flex shrink-0 rounded-full bg-muted p-1 text-[13px] font-semibold"
        >
          {(["tree", "outline"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => choose(option)}
              className={cn(
                "rounded-full px-4 py-1.5 outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-zellige/50",
                view === option
                  ? "bg-card text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {option === "tree" ? t("viewTree") : t("viewOutline")}
            </button>
          ))}
        </div>
      </div>

      {view === "tree" ? <GuideCanvas topics={topics} /> : <GuideExplorer topics={topics} />}
    </div>
  );
}
