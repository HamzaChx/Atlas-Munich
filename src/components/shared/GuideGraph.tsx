"use client";

// ============================================
// Atlas Munich – the guide graph
//
// GuideTree's disclosure list, reimagined as a branching diagram, without
// giving up the properties that made the list version accessible. Four
// decisions worth not undoing (the first three carried over verbatim from
// GuideTree.tsx, the fourth new to this file):
//
// 1. The row is the link, the chevron is the disclosure, and they are
//    siblings. A button nested inside a link (or the reverse) is a
//    nested-interactive violation that screen readers report inconsistently.
//
// 2. Nested disclosure lists, not `role="tree"`. A static content index does
//    not need roving tabindex, arrow keys, Home/End or type-ahead, and
//    `role="tree"` replaces the `link` role, which is all cost here.
//
// 3. Every node is rendered always; collapsed panels are hidden with the
//    `hidden` attribute rather than by conditional rendering, so every
//    section link stays in the prerendered HTML and reachable to crawlers.
//
// 4. The "graph" is decoration on top of that same real list, not a second
//    structure. There is exactly one copy of each node in the DOM — the
//    branching curves in GuideGraphConnectors.tsx are an absolutely
//    positioned SVG layer, `pointer-events-none` and `aria-hidden`, whose
//    paths are computed from the real, measured positions of the real rows.
//    DOM order (and therefore tab order and reading order) stays the plain
//    depth-first order the list has always had; only where a row happens to
//    sit on screen changes, and that is exactly what a decorative overlay is
//    allowed to depend on.
//
// Bolder pass: every top-level topic gets its own flat accent from the same
// six-colour palette the rest of the site already uses (no new hues
// invented), a neutral trunk line joins the topics into one spine even
// before anything is opened, and expanding a branch cascades its rows in
// with a short stagger instead of popping in as one block. The one-shot ring
// on a just-opened node (`.tree-node-ping` in globals.css) plays once, not
// in a loop — motion that never stops is the kind that needs a pause
// control, and a static tree does not need one.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

import type { TreeNode } from "@/data/guide-tree";
import { cn } from "@/lib/utils";
import { GuideGraphConnectors, type GraphEdge } from "./GuideGraphConnectors";

interface GuideGraphProps {
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

const LEVEL_DOT_SIZE: Record<1 | 2 | 3, string> = {
  1: "h-3 w-3",
  2: "h-2.5 w-2.5",
  3: "h-2 w-2",
};

const LEVEL_DOT_OPACITY: Record<1 | 2 | 3, string> = {
  1: "",
  2: "opacity-80",
  3: "opacity-60",
};

/** One flat hue per top-level topic, cycled — the same tokens the hubs
    already use (see src/data/hubs.ts), so nothing new enters the palette. */
const BRANCH_COLORS = [
  "var(--zellige)",
  "var(--acc-terra)",
  "var(--acc-plum)",
  "var(--acc-saffron)",
  "var(--acc-teal)",
  "var(--acc-blue)",
];

function branchColorFor(index: number): string {
  return BRANCH_COLORS[index % BRANCH_COLORS.length];
}

function edgeKey(parentId: string, childId: string) {
  return `${parentId}::${childId}`;
}

/** Every (parent, child) pair currently on screen, i.e. every ancestor up to
    the root is open, annotated with the colour and weight of the branch it
    belongs to. Mirrors the `hidden`-attribute logic in TreeRow exactly, so a
    connector is only ever drawn into a node a reader can actually see. */
function collectVisibleEdges(
  nodes: TreeNode[]
): (openIds: Set<string>) => { parentId: string; childId: string; color: string; width: number }[] {
  return (openIds) => {
    const edges: { parentId: string; childId: string; color: string; width: number }[] = [];
    nodes.forEach((root, i) => {
      const color = branchColorFor(i);
      const walk = (node: TreeNode, level: 1 | 2) => {
        if (!node.children.length || !openIds.has(node.id)) return;
        for (const child of node.children) {
          edges.push({
            parentId: node.id,
            childId: child.id,
            color,
            width: level === 1 ? 2.5 : 1.75,
          });
        }
        for (const child of node.children) walk(child, 2);
      };
      walk(root, 1);
    });
    return edges;
  };
}

/** Joins consecutive top-level topics into a spine — always present, so the
    shape reads as one tree even before a reader opens anything. */
function collectTrunkEdges(nodes: TreeNode[]): { parentId: string; childId: string }[] {
  const edges: { parentId: string; childId: string }[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ parentId: nodes[i].id, childId: nodes[i + 1].id });
  }
  return edges;
}

/** Owns the "just opened" flag that drives the staggered cascade below it —
    a frame after `open` flips true, not in the same paint, so the reveal is
    an actual transition rather than content appearing pre-revealed. */
function RevealPanel({
  open,
  panelId,
  children,
}: {
  open: boolean;
  panelId: string;
  children: (revealed: boolean) => React.ReactNode;
}) {
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setRevealed(false);
      return;
    }
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div
      id={panelId}
      hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        {/* No `border-l` guide line here — the SVG connector layer carries
            that job now, with more spread (ml-6 pl-4) than a plain indent
            needs, so the branch curve has room to actually bow. */}
        <ul className="ml-6 pl-4">{children(revealed)}</ul>
      </div>
    </div>
  );
}

function NodeDot({
  nodeId,
  level,
  color,
  open,
  hasChildren,
  registerNode,
}: {
  nodeId: string;
  level: 1 | 2 | 3;
  color: string;
  open: boolean;
  hasChildren: boolean;
  registerNode: (id: string, el: HTMLElement | null) => void;
}) {
  /* Bumped only on the false -> true edge, so remounting the ring span (via
     the `key`) replays its one-shot animation on every open, but sitting
     open across renders never retriggers it. */
  const [pingKey, setPingKey] = React.useState(0);
  React.useEffect(() => {
    if (open) setPingKey((k) => k + 1);
  }, [open]);

  return (
    <span className="relative inline-flex shrink-0 items-center justify-center">
      {hasChildren && (
        <span
          key={pingKey}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -m-1.5 rounded-full opacity-0",
            open && pingKey > 0 && "tree-node-ping"
          )}
          style={{ backgroundColor: color }}
        />
      )}
      <span
        ref={(el) => registerNode(nodeId, el)}
        aria-hidden="true"
        className={cn(
          "relative shrink-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110",
          LEVEL_DOT_SIZE[level],
          LEVEL_DOT_OPACITY[level],
          open && "scale-110"
        )}
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

interface RowProps {
  node: TreeNode;
  openIds: Set<string>;
  onToggle: (id: string) => void;
  registerNode: (id: string, el: HTMLElement | null) => void;
  minRead: string;
  branchColor: string;
  /** Cascade timing from the parent panel — 0 for top-level rows, which are
      always visible and need no reveal choreography. */
  revealed: boolean;
  staggerIndex: number;
}

function TreeRow({
  node,
  openIds,
  onToggle,
  registerNode,
  minRead,
  branchColor,
  revealed,
  staggerIndex,
}: RowProps) {
  const t = useTranslations("tree");
  const hasChildren = node.children.length > 0;
  const open = openIds.has(node.id);
  const panelId = `tree-panel-${node.id.replace(/\//g, "-")}`;
  const isCascading = node.level > 1;

  return (
    <li
      className={cn(
        isCascading &&
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isCascading && (revealed ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0")
      )}
      style={
        isCascading ? { transitionDelay: revealed ? `${staggerIndex * 45}ms` : "0ms" } : undefined
      }
    >
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
            <NodeDot
              nodeId={node.id}
              level={node.level}
              color={branchColor}
              open={open}
              hasChildren={hasChildren}
              registerNode={registerNode}
            />
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
            aria-label={
              open ? t("_collapse", { label: node.label }) : t("_expand", { label: node.label })
            }
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
        <RevealPanel open={open} panelId={panelId}>
          {(childRevealed) =>
            node.children.map((child, i) => (
              <TreeRow
                key={child.id}
                node={child}
                openIds={openIds}
                onToggle={onToggle}
                registerNode={registerNode}
                minRead={minRead}
                branchColor={branchColor}
                revealed={childRevealed}
                staggerIndex={i}
              />
            ))
          }
        </RevealPanel>
      )}
    </li>
  );
}

export function GuideGraph({ nodes, defaultOpenIds = [], className }: GuideGraphProps) {
  const t = useTranslations("tree");
  const tGuide = useTranslations("guidePage");
  const [openIds, setOpenIds] = React.useState<Set<string>>(() => new Set(defaultOpenIds));
  const [edges, setEdges] = React.useState<Map<string, GraphEdge>>(new Map());

  const containerRef = React.useRef<HTMLDivElement>(null);
  /* Every node's dot registers here once, on mount, and stays registered —
     every row exists in the DOM from first paint (see decision #3 above), so
     there is nothing to re-register when a branch opens or closes. */
  const nodeRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  const getVisibleBranchEdges = React.useMemo(() => collectVisibleEdges(nodes), [nodes]);
  const trunkPairs = React.useMemo(() => collectTrunkEdges(nodes), [nodes]);

  const registerNode = React.useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const toggle = React.useCallback((id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const positionOf = (id: string) => {
      const el = nodeRefs.current.get(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - containerRect.left,
        y: r.top + r.height / 2 - containerRect.top,
      };
    };

    const pairs = [
      ...trunkPairs.map((p) => ({ ...p, kind: "trunk" as const, color: undefined, width: 1.25 })),
      ...getVisibleBranchEdges(openIds).map((p) => ({ ...p, kind: "branch" as const })),
    ];
    const visibleKeys = new Set(pairs.map((p) => edgeKey(p.parentId, p.childId)));

    setEdges((prev) => {
      const next = new Map(prev);
      for (const pair of pairs) {
        const key = edgeKey(pair.parentId, pair.childId);
        const from = positionOf(pair.parentId);
        const to = positionOf(pair.childId);
        if (!from || !to) continue;
        next.set(key, {
          id: key,
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          open: true,
          kind: pair.kind,
          color: pair.color,
          width: pair.width,
        });
      }
      /* Kept in the map rather than deleted, so re-opening the same branch
         later reuses this <path> instead of remounting it and replaying the
         draw-in animation for a connector the reader has already seen.
         Trunk edges are always in `visibleKeys`, so they never hit this. */
      for (const [key, edge] of next) {
        if (!visibleKeys.has(key) && edge.open) next.set(key, { ...edge, open: false });
      }
      return next;
    });
  }, [trunkPairs, getVisibleBranchEdges, openIds]);

  // Recompute the instant a toggle changes which rows are visible — a layout
  // effect, not a plain one, so positions are read after the `hidden`
  // attribute flip has landed and before the browser paints.
  React.useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Recompute on reflow too (viewport resize, font swap, orientation change)
  // so a branch left open across a breakpoint change doesn't end up with
  // connectors pointing at stale coordinates.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame: number;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [measure]);

  return (
    <div className={className}>
      <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">{t("_hint")}</p>
      <div ref={containerRef} className="relative">
        <GuideGraphConnectors edges={Array.from(edges.values())} />
        <ul className="relative space-y-0.5">
          {nodes.map((node, i) => (
            <TreeRow
              key={node.id}
              node={node}
              openIds={openIds}
              onToggle={toggle}
              registerNode={registerNode}
              minRead={tGuide("minRead")}
              branchColor={branchColorFor(i)}
              revealed
              staggerIndex={0}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
