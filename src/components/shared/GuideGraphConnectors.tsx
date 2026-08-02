"use client";

// ============================================
// Atlas Munich – tree connectors
//
// A decorative SVG layer, nothing more: `aria-hidden`, `pointer-events-none`,
// and positioned behind the real nodes it connects. The nodes it draws
// between are the actual `<Link>` rows in GuideGraph.tsx — there is no
// second, decorative copy of the tree here, only lines between real DOM
// positions. That is what keeps this safe to add on top of an already
// accessible list: nothing here is interactive, and nothing here is the
// only place a piece of content lives.
//
// Two kinds of edge:
//   trunk  – always-on lines joining the top-level topics into one spine,
//            neutral colour, so the shape reads as "a tree" even collapsed.
//   branch – lines into a topic's open sections/subsections, coloured per
//            topic (see BRANCH_COLORS in GuideGraph.tsx) and only drawn
//            while their parent is open.
// ============================================

import * as React from "react";

export type GraphEdgeKind = "trunk" | "branch";

export interface GraphEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  open: boolean;
  kind: GraphEdgeKind;
  /** Required for branch edges; ignored (currentColor) for trunk edges. */
  color?: string;
  width: number;
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  /* A clamped bow rather than a raw midpoint split: two rows six pixels
     apart and two rows six hundred pixels apart both read as a deliberate
     branch curve instead of one being a near-straight line and the other an
     elongated flat S. */
  const bow = Math.min(Math.max(Math.abs(y2 - y1) * 0.5, 20), 110);
  return `M ${x1} ${y1} C ${x1} ${y1 + bow}, ${x2} ${y2 - bow}, ${x2} ${y2}`;
}

function ConnectorPath({ edge }: { edge: GraphEdge }) {
  const ref = React.useRef<SVGPathElement>(null);
  /* The classic SVG draw-in: measure the real path length once mounted, then
     flip the dash offset back to 0 a frame later so the CSS transition below
     animates it. Kept in state (not a DOM mutation) so it plays nicely with
     React re-rendering this same element on later opens/closes of the same
     edge — the draw-in only ever runs once, on first mount of this id. */
  const [dash, setDash] = React.useState<{ length: number; revealed: boolean } | null>(null);

  React.useLayoutEffect(() => {
    const path = ref.current;
    if (!path || dash) return;
    setDash({ length: path.getTotalLength(), revealed: false });
  }, [dash]);

  React.useEffect(() => {
    if (!dash || dash.revealed) return;
    const id = requestAnimationFrame(() => setDash((d) => (d ? { ...d, revealed: true } : d)));
    return () => cancelAnimationFrame(id);
  }, [dash]);

  return (
    <path
      ref={ref}
      d={bezierPath(edge.x1, edge.y1, edge.x2, edge.y2)}
      fill="none"
      stroke={edge.kind === "trunk" ? "currentColor" : edge.color}
      strokeWidth={edge.width}
      strokeLinecap="round"
      className="transition-[stroke-dashoffset,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: edge.open ? (edge.kind === "trunk" ? 0.55 : 0.9) : 0,
        strokeDasharray: dash ? dash.length : undefined,
        strokeDashoffset: dash ? (dash.revealed ? 0 : dash.length) : undefined,
      }}
    />
  );
}

export function GuideGraphConnectors({ edges }: { edges: GraphEdge[] }) {
  if (!edges.length) return null;
  const trunk = edges.filter((e) => e.kind === "trunk");
  const branch = edges.filter((e) => e.kind === "branch");

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      {/* Neutral, always drawn first so the coloured branch lines paint over
          it where the two happen to overlap. */}
      <g className="text-zinc-300/80 dark:text-zinc-700/80">
        {trunk.map((edge) => (
          <ConnectorPath key={edge.id} edge={edge} />
        ))}
      </g>
      {branch.map((edge) => (
        <ConnectorPath key={edge.id} edge={edge} />
      ))}
    </svg>
  );
}
