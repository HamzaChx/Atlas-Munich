// ============================================
// Atlas Munich – the drawn parts of the Lifestyle tree
//
// Trunk, crown, roots, boughs and leaves for GuideExplorer. All of it is
// decoration (aria-hidden) laid behind the real rows, sized in CSS (`.vt-*`
// in globals.css), and every shape is a fixed literal, so server and client
// render the same markup.
//
// Wood is one flat bark tone; leaves wear their topic's accent in two flat
// tones (`data-tone`), which is what gives the foliage depth without a
// gradient. Each leaf is three nested groups: placement (SVG transform),
// `.vt-leaf` (pops in from its stem) and `.vt-blade` (sways while its topic
// is open). They are separate because a CSS transform on an SVG element
// replaces its transform attribute.
// ============================================

import * as React from "react";

/** [x, y, rotation in degrees, length in px, tone] */
type LeafSpec = readonly [number, number, number, number, "a" | "b"];

/* One leaf, 20px long, stem at the origin, pointing along +x. */
export const BLADE = "M0 0C4-5.5 12-7.5 20 0C12 7.5 4 5.5 0 0Z";
export const RIB = "M1.5 0Q10-.8 17 0";

function Leaves({ leaves, delay = 0 }: { leaves: readonly LeafSpec[]; delay?: number }) {
  return (
    <>
      {leaves.map(([x, y, rotate, length, tone], k) => (
        <g key={k} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${length / 20})`}>
          <g className="vt-leaf" style={{ "--k": k + delay } as React.CSSProperties}>
            <g className="vt-blade" data-tone={tone}>
              <path d={BLADE} />
              <path d={RIB} />
            </g>
          </g>
        </g>
      ))}
    </>
  );
}

/* ---------- boughs: trunk to topic card ---------- */

interface BoughShape {
  width: number;
  height: number;
  wood: string;
  leaves: readonly LeafSpec[];
}

/* Drawn growing to the right, trunk centre at x = 0; the left column mirrors
   them in CSS. On wide screens the tip passes the card's edge at (88, 76),
   level with the topic chip, then tucks under the card. Two shapes, so
   neighbouring branches never look stamped. */
const WIDE: readonly BoughShape[] = [
  {
    width: 124,
    height: 128,
    wood:
      "M0 104C30 102 60 86 124 72L124 76C62 92 32 113 0 115Z" +
      "M36 101C42 86 47 68 60 50L62 51C52 68 49 86 45 99Z",
    leaves: [
      [22, 108, 40, 19, "b"],
      [48, 78, -162, 17, "b"],
      [52, 68, -18, 15, "a"],
      [61, 50, -126, 18, "b"],
      [61, 50, -80, 25, "a"],
      [61, 50, -32, 21, "b"],
      [74, 85, -52, 21, "a"],
      [84, 82, 36, 17, "b"],
    ],
  },
  {
    width: 124,
    height: 128,
    wood:
      "M0 106C34 100 64 86 124 72L124 76C66 92 36 114 0 117Z" +
      "M50 94C58 101 66 108 80 112L79 114C64 112 55 105 46 97Z",
    leaves: [
      [26, 103, -66, 21, "a"],
      [40, 98, -122, 16, "b"],
      [62, 105, 140, 14, "b"],
      [80, 113, -22, 16, "b"],
      [80, 113, 20, 22, "a"],
      [80, 113, 66, 17, "b"],
      [68, 87, -42, 22, "a"],
      [84, 81, -88, 16, "b"],
    ],
  },
];

/* Phones: the trunk hugs the left edge, so the gap to the card is ~30px. */
const SHORT: BoughShape = {
  width: 48,
  height: 60,
  wood: "M0 45C12 44 24 38 48 29L48 32C26 41 14 51 0 54Z",
  leaves: [
    [8, 47, -118, 12, "b"],
    [15, 44, -76, 17, "a"],
    [23, 41, 40, 14, "b"],
  ],
};

function BoughSvg({ shape, className }: { shape: BoughShape; className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width={shape.width}
      height={shape.height}
      viewBox={`0 0 ${shape.width} ${shape.height}`}
    >
      <path className="vt-wood" d={shape.wood} />
      <Leaves leaves={shape.leaves} />
    </svg>
  );
}

/** The branch that carries one topic card: a long one for the two-sided
    tree on wide screens, a short one for the single-sided tree on phones. */
export function Bough({ index }: { index: number }) {
  return (
    <>
      <BoughSvg shape={WIDE[index % WIDE.length]} className="vt-bough vt-bough-wide" />
      <BoughSvg shape={SHORT} className="vt-bough vt-bough-short" />
    </>
  );
}

/* ---------- trunk, crown, roots ---------- */

/** Stretched to the tree's height (preserveAspectRatio none), so it tapers
    from the roots to the crown however many branches are open. The grain
    keeps its width while the shape stretches. */
export function Trunk() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="vt-trunk"
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
    >
      <path
        className="vt-wood"
        d="M15 0C14 180 18 360 14 540C11 700 10 860 4 1000L36 1000C30 860 29 700 27 540C24 360 27 180 25 0Z"
      />
      <path
        className="vt-grain"
        d="M20 40C19 250 22 480 19 700C18 820 17 920 15 996M25 420C24 580 26 780 29 996M13 640C12 780 11 890 9 996"
      />
    </svg>
  );
}

/* One leaf per topic colour, so the crown quietly names the palette the
   branches below it use. */
const CROWN_LEAVES: readonly (readonly [...LeafSpec, string])[] = [
  [31, 30, -150, 21, "a", "var(--acc-terra)"],
  [31, 30, -106, 24, "a", "var(--acc-blue)"],
  [45, 44, -90, 26, "a", "var(--acc-plum)"],
  [61, 32, -74, 24, "a", "var(--acc-green)"],
  [61, 32, -28, 21, "a", "var(--acc-saffron)"],
];

export function Crown() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="vt-crown"
      width="92"
      height="68"
      viewBox="0 0 92 68"
    >
      <path
        className="vt-wood"
        d="M41 68C40 56 37 42 30 30L32 29C41 41 44 55 46 68ZM44 68C46 54 52 42 60 32L62 33C55 44 50 56 49 68Z"
      />
      {CROWN_LEAVES.map(([x, y, rotate, length, tone, colour], k) => (
        <g key={k} style={{ "--vt-leaf-a": colour } as React.CSSProperties}>
          <Leaves leaves={[[x, y, rotate, length, tone]]} delay={k} />
        </g>
      ))}
    </svg>
  );
}

/** Roots flaring from a 28px trunk whose centre is x = 84, top edge y = 0. */
export const ROOTS_PATH =
  "M70 0L98 0C99 10 104 18 118 24C132 29 146 30 156 31C140 33 124 33 110 30C102 28 97 25 94 22C94 27 97 31 102 35C94 35 88 31 86 25C84 31 78 35 68 36C74 31 76 27 76 22C71 26 62 30 50 32C38 34 24 33 12 31C26 29 42 27 54 22C64 18 69 10 70 0Z";

export function Roots() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="vt-roots"
      width="168"
      height="40"
      viewBox="0 0 168 40"
    >
      <ellipse className="vt-ground" cx="84" cy="30" rx="80" ry="7" />
      <path className="vt-wood" d={ROOTS_PATH} />
    </svg>
  );
}

/** The small leaf mark used on topic chips and guide nodes. */
export function LeafGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path d="M5 19C5 10.5 10.5 5 19 5C19 13.5 13.5 19 5 19Z" fill="currentColor" />
      <path className="vt-glyph-rib" d="M3.5 20.5L14 10" />
    </svg>
  );
}

/** A pair of leaves on the shoot beside a guide card, where it runs on
    down to the next guide. */
export function Sprig() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="vt-sprig"
      width="40"
      height="32"
      viewBox="0 0 40 32"
    >
      <Leaves
        leaves={[
          [37, 14, -152, 19, "b"],
          [37, 18, 162, 14, "a"],
        ]}
      />
    </svg>
  );
}
