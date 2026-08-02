"use client";

// ============================================
// Atlas Munich – the expanding guide tree
//
// Three decisions worth not undoing:
//
// 1. The row is the link, the chevron is the disclosure, and they are
//    siblings. A button nested inside a link (or the reverse) is a
//    nested-interactive violation that screen readers report inconsistently.
//    Keeping them apart also means opening a topic and going to it are two
//    separate targets, so neither costs a click spent on nothing.
//
// 2. Nested disclosure lists, not `role="tree"`. Tree roles oblige us to own
//    roving tabindex, arrow keys, Home/End and type-ahead, and they replace
//    the `link` role so screen readers stop announcing these as links. For a
//    static content index that is all cost. Native Tab order is already right.
//
// 3. Every node is rendered always; collapsed panels are hidden with the
//    `hidden` attribute rather than by conditional rendering. Otherwise the
//    36 section links never reach the prerendered HTML and are never crawled.
//    Same convention the /tools dossiers already use.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

import type { TreeNode } from "@/data/guide-tree";
import { cn } from "@/lib/utils";

interface GuideTreeProps {
  nodes: TreeNode[];
  /** Ids open on first paint, so the page never lands as a wall of closed rows. */
  defaultOpenIds?: string[];
  className?: string;
}

const LEVEL_STYLES: Record<1 | 2 | 3, string> = {
  1: "text-[15px] font-bold text-zinc-900 dark:text-zinc-50",
  2: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
  3: "text-[13px] font-medium text-zinc-500 dark:text-zinc-400",
};

function TreeRow({
  node,
  open,
  onToggle,
  minRead,
}: {
  node: TreeNode;
  open: boolean;
  onToggle: (id: string) => void;
  minRead: string;
}) {
  const t = useTranslations("tree");
  const hasChildren = node.children.length > 0;
  const panelId = `tree-panel-${node.id.replace(/\//g, "-")}`;

  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-xl transition-colors",
          "hover:bg-zinc-100/70 dark:hover:bg-foreground/[0.06]"
        )}
      >
        <Link
          href={node.href}
          className={cn(
            "min-w-0 flex-1 rounded-xl px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
            LEVEL_STYLES[node.level]
          )}
        >
          <span className="flex items-baseline gap-2.5">
            <span className="truncate">{node.label}</span>
            {node.readingTime !== undefined && (
              <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {node.readingTime} {minRead}
              </span>
            )}
          </span>
        </Link>

        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? t("_collapse", { label: node.label }) : t("_expand", { label: node.label })}
            className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 outline-none transition-colors hover:bg-card hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:hover:bg-foreground/10 dark:hover:text-zinc-200"
          >
            <ChevronRight
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-90")}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {hasChildren && (
        /* grid-template-rows 0fr -> 1fr animates to the content's real height
           without measuring it, and without a blur or gradient. */
        <div
          id={panelId}
          hidden={!open}
          className={cn("grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        >
          <div className="overflow-hidden">
            <ul className="ml-4 border-l border-border pl-2">
              {node.children.map((child) => (
                <TreeBranch key={child.id} node={child} minRead={minRead} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

/** Each branch owns its own open state, so a deep node stays put when a sibling moves. */
function TreeBranch({ node, minRead }: { node: TreeNode; minRead: string }) {
  const [open, setOpen] = React.useState(false);
  return <TreeRow node={node} open={open} onToggle={() => setOpen((o) => !o)} minRead={minRead} />;
}

export function GuideTree({ nodes, defaultOpenIds = [], className }: GuideTreeProps) {
  const t = useTranslations("tree");
  const tGuide = useTranslations("guidePage");
  const [openIds, setOpenIds] = React.useState<Set<string>>(() => new Set(defaultOpenIds));

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={className}>
      <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">{t("_hint")}</p>
      <ul className="space-y-0.5">
        {nodes.map((node) => (
          <TreeRow
            key={node.id}
            node={node}
            open={openIds.has(node.id)}
            onToggle={toggle}
            minRead={tGuide("minRead")}
          />
        ))}
      </ul>
    </div>
  );
}
