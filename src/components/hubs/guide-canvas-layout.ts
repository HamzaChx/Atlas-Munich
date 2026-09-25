// ============================================
// Atlas Munich – geometry of the Lifestyle tree (GuideCanvas)
//
// Pure functions, no React. `growTree` turns the guides into one tree:
//
//   - a trunk with its roots, and one limb per topic, leaving the trunk at
//     staggered heights (the outermost lowest, the most upright carrying on
//     as the leader) and thinning as they rise;
//   - at the end of every limb, a clump of foliage in the topic's colour.
//     The clumps together make the crown, and they are all the tree shows
//     until something is opened;
//   - for every clump, the sprays that can grow out of it: a stem that
//     forks into one twig per row, each ending in a leaf beside its label.
//     A topic with several guides has a spray of guides; every guide has a
//     spray of steps. Only the open one is drawn out, so the tree never
//     holds more than one list of leaves at a time.
//
// Screen work (the camera) is at the bottom.
//
// World units are CSS pixels at zoom 1, y grows downwards and the trunk
// stands on (0, 0). An angle `phi` is in degrees from straight up,
// positive to the right; an SVG `angle` is from +x, clockwise. Everything
// random is seeded from the data, so the same guides always grow the same
// tree, on the server and on every device.
// ============================================

import type { ExplorerTopic } from "@/lib/guide-tree-server";
import type { CategoryKey } from "@/types";

export interface OpenPath {
  topic: CategoryKey | null;
  guide: string | null;
  step: string | null;
}

export const CLOSED: OpenPath = { topic: null, guide: null, step: null };

export interface Pt {
  x: number;
  y: number;
}

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

type Cubic = readonly [Pt, Pt, Pt, Pt];

/* ---------- the tree's proportions ---------- */

const TRUNK_H = 190;
const TRUNK_W0 = 50;
const TRUNK_W1 = 24;
/** Clump centres sit on this ellipse round the crown's heart. */
const HEART: Pt = { x: 0, y: -300 };
const CROWN_RX = 236;
const CROWN_RY = 150;
const SPAN = 64;
const CLUMP_R = 94;
/** A spray's rows, and how far out of its clump it reaches. */
const ROW = 40;
const REACH = 64;
const LEAF_LEN = { guide: 34, step: 29 } as const;

/* ---------- small maths ---------- */

const rad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
/** Unit vector for a heading `phi`. */
const heading = (phi: number): Pt => ({ x: Math.sin(rad(phi)), y: -Math.cos(rad(phi)) });
const phiOf = (v: Pt) => toDeg(Math.atan2(v.x, -v.y));
/** SVG rotation that points +x along v. */
const angleOf = (v: Pt) => Math.round(toDeg(Math.atan2(v.y, v.x)) * 10) / 10;
const move = (a: Pt, v: Pt, k: number): Pt => ({ x: a.x + v.x * k, y: a.y + v.y * k });
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r1 = (v: number) => Math.round(v * 10) / 10;
const fmt = (p: Pt) => `${r1(p.x)} ${r1(p.y)}`;

function point(c: Cubic, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x,
    y: a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y,
  };
}

function tangent(c: Cubic, t: number): Pt {
  const u = 1 - t;
  const x =
    3 * u * u * (c[1].x - c[0].x) + 6 * u * t * (c[2].x - c[1].x) + 3 * t * t * (c[3].x - c[2].x);
  const y =
    3 * u * u * (c[1].y - c[0].y) + 6 * u * t * (c[2].y - c[1].y) + 3 * t * t * (c[3].y - c[2].y);
  const m = Math.hypot(x, y) || 1;
  return { x: x / m, y: y / m };
}

/** From a to b, leaving on heading phiA and arriving on heading phiB. */
function curve(a: Pt, b: Pt, phiA: number, phiB: number, bend = 0.38): Cubic {
  const length = dist(a, b);
  return [a, move(a, heading(phiA), length * bend), move(b, heading(phiB), -length * bend), b];
}

/** Deterministic 0..1 noise, seeded by a string (FNV-1a into mulberry32). */
function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A branch as a filled shape: tapering from w0 to w1 with a collar where it
 * leaves its parent, and a rounded tip.
 */
function outline(c: Cubic, w0: number, w1: number, collar = 0.5): string {
  const steps = clamp(Math.round(dist(c[0], c[3]) / 16), 6, 18);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = point(c, t);
    const d = tangent(c, t);
    const flare = 1 + collar * Math.max(0, 1 - t / 0.16) ** 2;
    const half = ((w1 + (w0 - w1) * (1 - t) ** 1.15) * flare) / 2;
    left.push(fmt({ x: p.x - d.y * half, y: p.y + d.x * half }));
    right.push(fmt({ x: p.x + d.y * half, y: p.y - d.x * half }));
  }
  const tip = r1(Math.max(w1 / 2, 0.4));
  return `M${left.join("L")}A${tip} ${tip} 0 0 0 ${right[steps]}L${right.reverse().slice(1).join("L")}Z`;
}

/** A curve as a stroke, for shoots that draw themselves along their length. */
const strokeOf = (c: Cubic) => `M${fmt(c[0])}C${fmt(c[1])} ${fmt(c[2])} ${fmt(c[3])}`;

const emptyBox = (): Box => ({ minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

function grow(box: Box, p: Pt, pad = 0) {
  box.minX = Math.min(box.minX, p.x - pad);
  box.maxX = Math.max(box.maxX, p.x + pad);
  box.minY = Math.min(box.minY, p.y - pad);
  box.maxY = Math.max(box.maxY, p.y + pad);
}

/* ---------- the model ---------- */

export interface Wood {
  id: string;
  topic: CategoryKey | null;
  d: string;
  /** Growth pivot: where it leaves its parent. */
  base: Pt;
  delay: number;
  kids: Wood[];
}

/** One flat tone of a clump: its body, its shadow (lower right, away
    from the light) and its lit side (upper left). */
export type MassTone = "base" | "shade" | "light";

export interface Mass {
  tone: MassTone;
  cx: number;
  cy: number;
  r: number;
}

export interface Leaf {
  x: number;
  y: number;
  angle: number;
  /** Scale on the 20-unit blade. */
  s: number;
  tone: 0 | 1 | 2;
}

/** A topic's foliage at the end of its limb. */
export interface Clump {
  topic: CategoryKey;
  index: number;
  phi: number;
  side: -1 | 1;
  center: Pt;
  radius: number;
  /** Where the limb arrives, which the clump sways about. */
  stalk: Pt;
  masses: Mass[];
  leaves: Leaf[];
  delay: number;
  /** Negative animation delay, so neighbours never sway in step. */
  phase: number;
}

export interface Row {
  id: string;
  kind: "guide" | "step";
  topic: CategoryKey;
  guide: string;
  step: string | null;
  index: number;
  count: number;
  label: string;
  /** Twig from the stem to the leaf's stalk, drawn as a stroke. */
  twig: string;
  at: Pt;
  angle: number;
  len: number;
  tip: Pt;
  /** Growth delay within the spray, in seconds. */
  delay: number;
}

/** What grows out of a clump when it opens: a stem, and a row per child. */
export interface Spray {
  /** `t:<topic>` for a topic's guides, `g:<slug>` for a guide's steps. */
  key: string;
  topic: CategoryKey;
  side: -1 | 1;
  stem: string;
  rows: Row[];
  box: Box;
}

export interface TreeModel {
  trunk: Wood;
  roots: string[];
  grain: string[];
  shade: string;
  ground: { cx: number; cy: number; rx: number; ry: number };
  clumps: Clump[];
  sprays: Spray[];
  bounds: Box;
  /** When the first growth has settled, in seconds. */
  settled: number;
}

export const sprayKey = (open: OpenPath) =>
  open.guide ? `g:${open.guide}` : open.topic ? `t:${open.topic}` : null;

/** A clump of overlapping rounds in three flat tones, with a few leaves
    breaking its outline. Coordinates are absolute. */
function foliage(center: Pt, R: number, rand: () => number) {
  const bodies: { c: Pt; r: number }[] = [{ c: center, r: R * 0.62 }];
  const turn = rand() * 50;
  for (let i = 0; i < 7; i++) {
    const a = rad(turn + i * (360 / 7) + (rand() - 0.5) * 18);
    const reach = R * (0.46 + rand() * 0.1);
    bodies.push({
      c: { x: center.x + Math.cos(a) * reach, y: center.y + Math.sin(a) * reach * 0.86 },
      r: R * (0.4 + rand() * 0.1),
    });
  }
  const masses: Mass[] = [];
  const put = (tone: MassTone, c: Pt, r: number) =>
    masses.push({ tone, cx: r1(c.x), cy: r1(c.y), r: r1(r) });
  for (const b of bodies) put("shade", { x: b.c.x + 5, y: b.c.y + 7 }, b.r);
  for (const b of bodies) put("base", b.c, b.r);
  for (const b of bodies)
    if (b.c.y < center.y - R * 0.1 && b.c !== center)
      put("light", { x: b.c.x - b.r * 0.22, y: b.c.y - b.r * 0.26 }, b.r * 0.5);

  /* Leaves round the upper rim, pointing out, a few hanging below. */
  const leaves: Leaf[] = [];
  const count = 11;
  for (let i = 0; i < count; i++) {
    const a = -200 + (220 * (i + 0.5 + (rand() - 0.5) * 0.5)) / count;
    const base = {
      x: center.x + Math.cos(rad(a)) * R * 0.9,
      y: center.y + Math.sin(rad(a)) * R * 0.8,
    };
    leaves.push({
      x: r1(base.x),
      y: r1(base.y),
      angle: r1(a + (rand() - 0.5) * 50),
      s: r1((13 + rand() * 6) / 2) / 10,
      tone: rand() < 0.3 ? 0 : rand() < 0.7 ? 1 : 2,
    });
  }
  return { masses, leaves };
}

/**
 * The spray a clump grows for these rows: a stem leaving the clump on its
 * outer side and rising a little, then a twig per row, the outer rows
 * forking off first, each ending in a leaf that points out to its label.
 * Upright clumps lift their spray above their neighbours.
 */
function sprayFor(
  clump: Clump,
  key: string,
  rows: Omit<Row, "twig" | "at" | "angle" | "len" | "tip" | "delay" | "index" | "count">[]
): Spray {
  const { center, radius: R, phi, side } = clump;
  const n = rows.length;
  const mid = (n - 1) / 2;
  /* Lifted clear of the neighbouring clumps: most for the upright ones,
     whose neighbours sit either side of them. */
  const lift = R * 0.3 + (1 - Math.abs(Math.sin(rad(phi)))) * 56;
  const col = { x: center.x + side * (R * 0.72 + REACH), y: center.y - lift };
  const start = { x: center.x + side * R * 0.42, y: center.y - R * 0.18 };
  const stemEnd = { x: col.x - side * 34, y: col.y };
  const stem = curve(start, stemEnd, side * 62 - (lift > 60 ? side * 24 : 0), side * 90, 0.4);
  const box = emptyBox();
  grow(box, center, R);

  const out: Row[] = rows.map((row, i) => {
    const u = n > 1 ? (i - mid) / mid : 0;
    const at = {
      x: col.x + side * 12 * (1 - u * u),
      y: col.y + (i - mid) * ROW,
    };
    const from = point(stem, clamp(0.5 + 0.5 * (1 - Math.abs(u)), 0.5, 0.96));
    const twig = curve(from, at, phiOf(tangent(stem, 0.7)), side * (90 - u * 12), 0.42);
    const dir = { x: side, y: -0.12 };
    const m = Math.hypot(dir.x, dir.y);
    const len = LEAF_LEN[row.kind];
    const unit = { x: dir.x / m, y: dir.y / m };
    const tip = move(at, unit, len);
    grow(box, tip, 4);
    grow(box, at, 4);
    return {
      ...row,
      index: i,
      count: n,
      twig: strokeOf(twig),
      at,
      angle: angleOf(unit),
      len,
      tip,
      delay: r1((0.22 + i * 0.07) * 100) / 100,
    };
  });
  grow(box, start);
  return { key, topic: clump.topic, side, stem: strokeOf(stem), rows: out, box };
}

/**
 * Grows the whole tree for these topics. Wide stages get a broad crown,
 * the clumps on an arc; narrow ones (`columnar`) a tall tree whose clumps
 * climb a leader, left and right in turn, so each card has a clump of its
 * own at phone width.
 */
export function growTree(topics: ExplorerTopic[], columnar = false): TreeModel {
  const rand = seeded(topics.map((t) => t.guides.map((g) => g.slug).join()).join("|"));
  const bounds = emptyBox();
  const n = topics.length;
  const span = Math.min(SPAN, 16 * Math.max(n - 1, 0));

  const place = (index: number) => {
    if (columnar) {
      const top = index === n - 1;
      const side = index % 2 === 0 ? -1 : 1;
      return {
        phi: top ? side * 8 : side * 50,
        center: { x: top ? 0 : side * 64, y: -250 - index * 92 },
      };
    }
    const phi = n === 1 ? 0 : -span + (2 * span * index) / (n - 1);
    return {
      phi,
      center: {
        x: HEART.x + Math.sin(rad(phi)) * CROWN_RX,
        y: HEART.y - Math.cos(rad(phi)) * CROWN_RY,
      },
    };
  };

  const clumps: Clump[] = topics.map((topic, index) => {
    const { phi, center } = place(index);
    const { masses, leaves } = foliage(center, CLUMP_R, rand);
    for (const m of masses) grow(bounds, { x: m.cx, y: m.cy }, m.r);
    for (const leaf of leaves) grow(bounds, leaf, 14);
    return {
      topic: topic.key,
      index,
      phi,
      side: phi < 0 ? -1 : 1,
      center,
      radius: CLUMP_R,
      stalk: center,
      masses,
      leaves,
      delay: 0,
      phase: r1(-rand() * 8),
    };
  });

  /* The order limbs leave the trunk: the outermost lowest, the most
     upright carrying on as the leader. */
  const byReach = [...clumps].sort((a, b) => Math.abs(b.phi) - Math.abs(a.phi));
  const leader = byReach[byReach.length - 1];

  /* ---------- trunk ---------- */

  const lean = Math.sin(rad(leader.phi)) * 16;
  const trunkCurve: Cubic = [
    { x: 0, y: 0 },
    { x: -8, y: -TRUNK_H * 0.36 },
    { x: lean * 0.35 + 7, y: -TRUNK_H * 0.7 },
    { x: lean, y: -TRUNK_H },
  ];
  const trunkWidth = (t: number) => TRUNK_W0 + (TRUNK_W1 - TRUNK_W0) * t;
  const trunk: Wood = {
    id: "trunk",
    topic: null,
    d: outline(trunkCurve, TRUNK_W0, TRUNK_W1, 0.42),
    base: { x: 0, y: 0 },
    delay: 0,
    kids: [],
  };
  for (let i = 0; i <= 8; i++) grow(bounds, point(trunkCurve, i / 8), TRUNK_W0 * 0.7);

  /* Bark: a shaded side and a few lines of grain, all following the trunk. */
  const along = (k: number, t0: number, t1: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = t0 + ((t1 - t0) * i) / 10;
      const p = point(trunkCurve, t);
      const d = tangent(trunkCurve, t);
      const half = trunkWidth(t) / 2;
      pts.push(fmt({ x: p.x - d.y * half * k, y: p.y + d.x * half * k }));
    }
    return pts;
  };
  const grain = [along(-0.42, 0.04, 0.62), along(0.12, 0.16, 0.94), along(0.55, 0.02, 0.4)].map(
    (pts) => `M${pts.join("L")}`
  );
  const shade = `M${along(0.98, 0, 1).join("L")}L${along(0.4, 0, 1).reverse().join("L")}Z`;

  /* Roots flaring into the ground. */
  const roots = (
    [
      [-1, 102, 80, 19],
      [-1, 126, 48, 14],
      [1, 98, 88, 19],
      [1, 122, 52, 14],
    ] as const
  ).map(([side, phi, length, width]) => {
    const start = { x: side * 14, y: -16 };
    const end = move(start, heading(side * phi), length);
    end.y = Math.min(end.y, 12);
    grow(bounds, end, 4);
    return outline(curve(start, end, side * (phi - 36), side * phi, 0.42), width, 2, 0);
  });

  /* ---------- limbs ---------- */

  const others = byReach.filter((c) => c !== leader);
  clumps.forEach((clump) => {
    const isLeader = clump === leader;
    const rank = others.indexOf(clump);
    const t = isLeader ? 1 : 0.62 + (0.3 * rank) / Math.max(others.length - 1, 1);
    const trunkAt = point(trunkCurve, t);
    const start = isLeader
      ? trunkAt
      : { x: trunkAt.x + clump.side * trunkWidth(t) * 0.18, y: trunkAt.y };
    /* Into the lower part of the clump, so the foliage hides the tip. */
    const end = { x: clump.center.x - clump.side * 6, y: clump.center.y + CLUMP_R * 0.28 };
    const chord = phiOf(sub(end, start));
    const phiA = isLeader
      ? phiOf(tangent(trunkCurve, 1))
      : clump.side * clamp(Math.abs(chord) + 24, 30, 84);
    const limb = curve(start, end, phiA, chord * 0.7, 0.4);
    const delay = isLeader ? 0.55 : 0.3 + t * 0.3;
    const steps = topics[clump.index].guides.reduce((sum, g) => sum + g.sections.length, 0);
    trunk.kids.push({
      id: `limb:${clump.topic}`,
      topic: clump.topic,
      d: outline(
        limb,
        isLeader ? TRUNK_W1 : Math.min(trunkWidth(t) * 0.62, 9 + steps * 0.6),
        6,
        isLeader ? 0 : 0.55
      ),
      base: start,
      delay,
      kids: [],
    });
    clump.stalk = end;
    clump.delay = delay + 0.55;
  });

  /* ---------- sprays ---------- */

  const sprays: Spray[] = [];
  topics.forEach((topic, i) => {
    const clump = clumps[i];
    if (topic.guides.length > 1)
      sprays.push(
        sprayFor(
          clump,
          `t:${topic.key}`,
          topic.guides.map((g) => ({
            id: `row:${g.slug}`,
            kind: "guide" as const,
            topic: topic.key,
            guide: g.slug,
            step: null,
            label: g.label,
          }))
        )
      );
    for (const g of topic.guides)
      sprays.push(
        sprayFor(
          clump,
          `g:${g.slug}`,
          g.sections.map((s) => ({
            id: `row:${g.slug}:${s.id}`,
            kind: "step" as const,
            topic: topic.key,
            guide: g.slug,
            step: s.id,
            label: s.label,
          }))
        )
      );
  });

  const ground = { cx: 0, cy: 6, rx: 176, ry: 14 };
  grow(bounds, { x: ground.cx - ground.rx, y: ground.cy + ground.ry });
  grow(bounds, { x: ground.cx + ground.rx, y: ground.cy + ground.ry });

  const settled = Math.max(...clumps.map((c) => c.delay + 1.2)) + 0.1;

  return { trunk, roots, grain, shade, ground, clumps, sprays, bounds, settled };
}

/* ---------- screen: the camera ---------- */

export interface Camera {
  /** Screen position of world (0, 0), and the zoom. */
  x: number;
  y: number;
  s: number;
}

export interface Size {
  w: number;
  h: number;
}

export const project = (cam: Camera, p: Pt): Pt => ({
  x: cam.x + p.x * cam.s,
  y: cam.y + p.y * cam.s,
});

/** A world point that must be on screen, with a label hanging off it by
    so many screen px on each side. */
export interface Reach {
  p: Pt;
  l?: number;
  r?: number;
  t?: number;
  b?: number;
}

function extent(items: Reach[], s: number) {
  const e = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const { p, l = 0, r = 0, t = 0, b = 0 } of items) {
    e.minX = Math.min(e.minX, p.x * s - l);
    e.maxX = Math.max(e.maxX, p.x * s + r);
    e.minY = Math.min(e.minY, p.y * s - t);
    e.maxY = Math.max(e.maxY, p.y * s + b);
  }
  return e;
}

/** The largest zoom (up to maxS) at which every item fits the stage. */
export function fitZoom(items: Reach[], size: Size, pad: number, maxS: number) {
  const fits = (s: number) => {
    const e = extent(items, s);
    return e.maxX - e.minX <= size.w - 2 * pad && e.maxY - e.minY <= size.h - 2 * pad;
  };
  if (fits(maxS)) return maxS;
  let lo = 0.1;
  let hi = maxS;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** The camera that centres these items at zoom s. */
export function centre(items: Reach[], size: Size, s: number): Camera {
  const e = extent(items, s);
  return { s, x: size.w / 2 - (e.minX + e.maxX) / 2, y: size.h / 2 - (e.minY + e.maxY) / 2 };
}

/** The tree's own outline as points to keep on screen. */
export const treeReach = (model: TreeModel): Reach[] => [
  { p: { x: model.bounds.minX, y: model.bounds.minY } },
  { p: { x: model.bounds.maxX, y: model.bounds.maxY } },
];
