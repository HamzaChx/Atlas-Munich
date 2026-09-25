"use client";

// ============================================
// Atlas Munich – the Lifestyle tree (the "Tree" view)
//
// A calm tree that grows what you ask for. At rest it is a trunk, a limb
// per topic and a clump of foliage at the end of each, named by a card:
// five things to read. Clicking a clump grows it: a stem shoots out of it
// and forks into a twig per step (per guide, for a topic that has several),
// each drawing itself along its length and ending in a leaf beside its
// name. The other clumps soften and settle back rather than vanish, so any
// topic is one click away, and any step two. The panel beside the tree
// (below it on phones) is the index and the reading pane.
//
// Decisions worth keeping:
//
// 1. Geometry is pure and seeded (guide-canvas-layout.ts), computed once,
//    sprays included. Opening something only changes which spray is out.
//
// 2. All motion is CSS, both ways: shoots are strokes whose dash offset
//    runs out as they open and back in as they close, leaves unfurl after
//    their twig, labels after their leaf. The first time the tree scrolls
//    into view it grows from the ground: trunk, limbs, then the clumps.
//
// 3. One zoom for every state on wide screens, the one that fits the tree
//    with its widest spray, so opening only pans the camera a little and
//    the whole tree always stays in view. Phones zoom into the open spray
//    instead, with a way back out.
//
// 4. The SVG is decoration (aria-hidden) and renders on the client only.
//    The controls are HTML over it: a card per topic, a chip per row.
//    Pointer users can also click a clump or a leaf.
//
// 5. What is open lives in the URL hash exactly as in the outline view
//    (`#<topic>` or `#<guide-slug>`), so links into the tree keep working.
// ============================================

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { CATEGORY_ACCENTS } from "@/lib/category-accents";
import type { ExplorerTopic } from "@/lib/guide-tree-server";
import type { CategoryKey } from "@/types";
import { fold, Highlight, writeHash } from "./GuideExplorer";
import { BLADE, LeafGlyph, RIB } from "./tree-art";
import { CanvasPanel } from "./GuideCanvasPanel";
import {
  CLOSED,
  centre,
  fitZoom,
  growTree,
  project,
  sprayKey,
  treeReach,
  type Clump,
  type OpenPath,
  type Reach,
  type Row,
  type Size,
  type Spray,
  type TreeModel,
  type Wood,
} from "./guide-canvas-layout";

/** What the pointer (or keyboard focus) is on, in the tree or the panel. */
export interface Hover {
  topic: CategoryKey | null;
  guide: string | null;
  step: string | null;
}

export const NO_HOVER: Hover = { topic: null, guide: null, step: null };

/* ---------- the stateful shell: open path, hash, search, panel ---------- */

export function GuideCanvas({ topics }: { topics: ExplorerTopic[] }) {
  const t = useTranslations("hubs.explorer");
  const [open, setOpen] = React.useState<OpenPath>(CLOSED);
  const [hover, setHover] = React.useState<Hover>(NO_HOVER);
  const stageRef = React.useRef<HTMLDivElement>(null);

  /** Opens a path and records it. A topic with a single guide opens
      straight onto that guide: an extra click would only repeat it. */
  const go = React.useCallback(
    (next: OpenPath) => {
      const topic = topics.find((tp) => tp.key === next.topic);
      const path =
        topic && !next.guide && topic.guides.length === 1
          ? { ...next, guide: topic.guides[0].slug }
          : next;
      setOpen(path);
      writeHash(path.guide ?? path.topic);
    },
    [topics]
  );

  /* One level back up: step, then guide (to its topic when it shares one),
     then everything closed. */
  const up = React.useCallback(() => {
    setOpen((current) => {
      const topic = topics.find((tp) => tp.key === current.topic);
      const next = current.step
        ? { ...current, step: null }
        : current.guide && topic && topic.guides.length > 1
          ? { ...current, guide: null }
          : CLOSED;
      writeHash(next.guide ?? next.topic);
      return next;
    });
  }, [topics]);

  React.useEffect(() => {
    const fromHash = () => {
      const key = decodeURIComponent(window.location.hash.slice(1));
      if (!key) return;
      const topic = topics.find((tp) => tp.key === key);
      const owner = topics.find((tp) => tp.guides.some((guide) => guide.slug === key));
      if (topic) go({ topic: topic.key, guide: null, step: null });
      else if (owner) go({ topic: owner.key, guide: key, step: null });
      else return;
      requestAnimationFrame(() =>
        stageRef.current?.scrollIntoView({ block: "center", behavior: "auto" })
      );
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [topics, go]);

  const ownerOf = React.useCallback(
    (slug: string) => topics.find((tp) => tp.guides.some((g) => g.slug === slug))!.key,
    [topics]
  );

  const pickGuide = (slug: string) => {
    if (open.guide === slug && !open.step) return up();
    go({ topic: ownerOf(slug), guide: slug, step: null });
  };

  const pickStep = (slug: string, step: string) =>
    go({
      topic: ownerOf(slug),
      guide: slug,
      step: open.guide === slug && open.step === step ? null : step,
    });

  /* A topic's clump or card: opens it, or, when it is already open,
     closes it (back to its guides first, for a topic with several). */
  const pickTopic = (key: CategoryKey) => {
    if (open.topic !== key) return go({ topic: key, guide: null, step: null });
    const shared = (topics.find((tp) => tp.key === key)?.guides.length ?? 0) > 1;
    go(shared && open.guide ? { topic: key, guide: null, step: null } : CLOSED);
  };

  const guideCount = topics.reduce((sum, topic) => sum + topic.guides.length, 0);
  const stepCount = topics.reduce(
    (sum, topic) => sum + topic.guides.reduce((n, guide) => n + guide.sections.length, 0),
    0
  );
  const minuteCount = topics.reduce(
    (sum, topic) => sum + topic.guides.reduce((m, guide) => m + guide.readingTime, 0),
    0
  );

  return (
    <nav aria-label={t("label")} className="gc">
      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-10 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-green text-acc-green">
            <LeafGlyph className="h-[18px] w-[18px]" />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-base font-bold leading-5 text-zinc-900 dark:text-zinc-50">
              {t("root")}
            </span>
            <span className="text-xs leading-4 text-zinc-500 dark:text-zinc-400">
              {`${t("guides", { count: guideCount })} · ${t("steps", { count: stepCount })} · ${t("minutes", { count: minuteCount })}`}
            </span>
          </span>
        </div>
        <CanvasSearch
          topics={topics}
          onPick={(path) => {
            go(path);
            stageRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
          }}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-5">
        <TreeStage
          ref={stageRef}
          topics={topics}
          open={open}
          hover={hover}
          onHover={setHover}
          onGuide={pickGuide}
          onStep={pickStep}
          onTopic={pickTopic}
          onUp={up}
        />
        <CanvasPanel
          topics={topics}
          open={open}
          hover={hover}
          onGo={go}
          onUp={up}
          onHover={setHover}
        />
      </div>
    </nav>
  );
}

/* ---------- search: pick a result and the tree opens there ---------- */

interface Hit {
  key: string;
  label: string;
  context: string;
  path: OpenPath;
  accent: string;
}

function CanvasSearch({
  topics,
  onPick,
}: {
  topics: ExplorerTopic[];
  onPick: (path: OpenPath) => void;
}) {
  const t = useTranslations("hubs.explorer");
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const trimmed = query.trim();

  const hits = React.useMemo<Hit[]>(() => {
    if (!trimmed) return [];
    const q = fold(trimmed);
    const has = (...fields: string[]) => fields.some((field) => fold(field).includes(q));
    const out: Hit[] = [];
    for (const topic of topics) {
      const accent = CATEGORY_ACCENTS[topic.key].dot;
      if (has(topic.title, topic.description))
        out.push({
          key: topic.key,
          label: topic.title,
          context: topic.description,
          path: { topic: topic.key, guide: null, step: null },
          accent,
        });
      for (const guide of topic.guides) {
        if (has(guide.title, guide.label, guide.summary))
          out.push({
            key: guide.slug,
            label: guide.title,
            context: topic.title,
            path: { topic: topic.key, guide: guide.slug, step: null },
            accent,
          });
        for (const section of guide.sections)
          if (has(section.label, section.title, section.excerpt))
            out.push({
              key: `${guide.slug}.${section.id}`,
              label: section.label,
              context: `${topic.title} · ${guide.label}`,
              path: { topic: topic.key, guide: guide.slug, step: section.id },
              accent,
            });
      }
    }
    return out.slice(0, 8);
  }, [topics, trimmed]);

  const pick = (hit: Hit | undefined) => {
    if (!hit) return;
    setQuery("");
    onPick(hit.path);
  };

  return (
    <div className="relative sm:w-72">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        role="combobox"
        aria-expanded={trimmed.length > 0}
        aria-controls="gc-search-results"
        aria-activedescendant={hits[active] ? `gc-hit-${active}` : undefined}
        aria-label={t("search")}
        placeholder={t("search")}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => Math.min(i + 1, hits.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            pick(hits[active]);
          } else if (event.key === "Escape" && query) {
            event.preventDefault();
            setQuery("");
          }
        }}
        className="h-11 w-full rounded-full bg-card pl-11 pr-10 text-base text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_14px_-6px_rgb(0_0_0/0.1)] outline-none ring-1 ring-zinc-900/[0.04] placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zellige/50 sm:text-sm dark:text-zinc-50 dark:shadow-none dark:ring-border [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label={t("clear")}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-muted hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}

      {trimmed && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-card p-1.5 shadow-[0_2px_4px_rgb(0_0_0/0.04),0_16px_40px_-12px_rgb(0_0_0/0.22)] ring-1 ring-zinc-900/[0.06] animate-in fade-in slide-in-from-top-1 dark:ring-border sm:-left-24">
          {hits.length > 0 ? (
            <ul id="gc-search-results" role="listbox" aria-label={t("search")}>
              {hits.map((hit, i) => (
                <li
                  key={hit.key}
                  id={`gc-hit-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(hit)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5",
                    i === active && "bg-muted"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", hit.accent)}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      <Highlight text={hit.label} query={trimmed} />
                    </span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {hit.context}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              id="gc-search-results"
              className="px-3 py-2.5 text-sm text-zinc-500 dark:text-zinc-400"
            >
              {t("noMatches", { query: trimmed })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- the stage ---------- */

type ClumpState = "open" | "rest" | "back";

const clumpState = (topic: CategoryKey, open: OpenPath): ClumpState =>
  !open.topic ? "rest" : open.topic === topic ? "open" : "back";

/** Offset sizes of every `[data-measure]` label, re-read after each render
    and only stored when one changed, so the camera uses real sizes. */
function useLabelSizes(root: React.RefObject<HTMLElement | null>) {
  const [sizes, setSizes] = React.useState<Record<string, Size>>({});
  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let next: Record<string, Size> | null = null;
    el.querySelectorAll<HTMLElement>("[data-measure]").forEach((node) => {
      const id = node.dataset.measure!;
      const w = node.offsetWidth;
      const h = node.offsetHeight;
      const known = (next ?? sizes)[id];
      if (!known || known.w !== w || known.h !== h) {
        next ??= { ...sizes };
        next[id] = { w, h };
      }
    });
    if (next) setSizes(next);
  });
  return sizes;
}

/* Guesses for a label's size until it has been measured once. */
const guessCard = (topic: ExplorerTopic): Size => ({
  w: Math.min(180, 36 + topic.title.length * 7.6),
  h: 50,
});
const guessChip = (row: Row): Size => ({
  w: Math.min(240, (row.kind === "guide" ? 56 : 44) + row.label.length * 7.2),
  h: row.kind === "guide" ? 38 : 30,
});

/** Screen px between a leaf's tip and its label. */
const CHIP_GAP = 8;

/** A card sits on its clump, a little below the centre so the crown of
    the clump shows above it. */
const cardAt = (clump: Clump) => ({ x: clump.center.x, y: clump.center.y + clump.radius * 0.12 });

interface TreeStageProps {
  topics: ExplorerTopic[];
  open: OpenPath;
  hover: Hover;
  onHover: (hover: Hover) => void;
  onGuide: (slug: string) => void;
  onStep: (slug: string, step: string) => void;
  onTopic: (key: CategoryKey) => void;
  onUp: () => void;
}

const TreeStage = React.forwardRef<HTMLDivElement, TreeStageProps>(function TreeStage(
  { topics, open, hover, onHover, onGuide, onStep, onTopic, onUp },
  ref
) {
  const t = useTranslations("hubs.explorer");
  const stageRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => stageRef.current!);

  const [size, setSize] = React.useState<Size>({ w: 860, h: 660 });
  const [mounted, setMounted] = React.useState(false);
  const [grown, setGrown] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  const compact = size.w < 640;
  const model = React.useMemo(() => growTree(topics, compact), [topics, compact]);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    setMounted(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => setSize({ w: stage.clientWidth, h: stage.clientHeight });
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(stage);

    let timer = 0;
    let begun = false;
    /* Two frames, so the ungrown tree is painted once and the growth
       really transitions from it. */
    const begin = () => {
      if (begun) return;
      begun = true;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setGrown(true);
          timer = window.setTimeout(() => setSettled(true), reduced ? 0 : model.settled * 1000);
        })
      );
    };

    if (reduced || !("IntersectionObserver" in window)) {
      begin();
      return () => {
        resize.disconnect();
        window.clearTimeout(timer);
      };
    }
    const seen = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setInView(visible);
        if (visible) begin();
      },
      { threshold: 0.2 }
    );
    seen.observe(stage);
    return () => {
      resize.disconnect();
      seen.disconnect();
      window.clearTimeout(timer);
    };
  }, [model]);

  const sizes = useLabelSizes(overlayRef);
  const topicOf = (key: CategoryKey) => topics.find((tp) => tp.key === key)!;
  const openKey = sprayKey(open);
  const openSpray = model.sprays.find((spray) => spray.key === openKey);

  /* ---------- camera ---------- */

  const cam = React.useMemo(() => {
    const cardSize = (clump: Clump) =>
      sizes[`card:${clump.topic}`] ?? guessCard(topics[clump.index]);
    const chipSize = (row: Row) => sizes[`chip:${row.id}`] ?? guessChip(row);
    const rest: Reach[] = [
      ...treeReach(model),
      ...model.clumps.map((clump) => {
        const s = cardSize(clump);
        return { p: cardAt(clump), l: s.w / 2, r: s.w / 2, t: s.h / 2, b: s.h / 2 };
      }),
    ];
    const reachOf = (spray: Spray): Reach[] =>
      spray.rows.map((row) => {
        const s = chipSize(row);
        const hang = CHIP_GAP + s.w;
        return spray.side > 0
          ? { p: row.tip, r: hang, t: s.h / 2, b: s.h / 2 }
          : { p: row.tip, l: hang, t: s.h / 2, b: s.h / 2 };
      });

    if (compact) {
      if (!openSpray) return centre(rest, size, fitZoom(rest, size, 10, 1.2));
      /* Zoomed in far enough that rows never touch; the camera centres on
         them and lets the rest of the tree run off the edge. */
      const items: Reach[] = [
        ...reachOf(openSpray),
        { p: openSpray.rows[0].at },
        /* Room for the way-back bar along the top. */
        { p: openSpray.rows[0].tip, t: 64 },
      ];
      return centre(items, size, Math.max(fitZoom(items, size, 12, 1.6), 1));
    }

    /* Opening a spray may ease the zoom out a little and pan, never more:
       at rest the tree is drawn no more than a fifth larger than when its
       widest spray is out, so the whole tree always stays in view and
       nothing lurches. */
    const widest = Math.min(
      ...model.sprays.map((spray) => fitZoom([...rest, ...reachOf(spray)], size, 18, 1.3))
    );
    if (!openSpray)
      return centre(rest, size, Math.min(fitZoom(rest, size, 18, 1.3), widest * 1.18));
    const items = [...rest, ...reachOf(openSpray)];
    return centre(items, size, Math.min(fitZoom(items, size, 18, 1.3), widest * 1.18));
  }, [model, topics, sizes, size, compact, openSpray]);

  /* ---------- pointer on the drawing ---------- */

  const targetOf = (target: EventTarget): Hover => {
    const el = target as Element;
    const row = el.closest?.("[data-row]");
    if (row)
      return {
        topic: row.getAttribute("data-topic") as CategoryKey,
        guide: row.getAttribute("data-guide"),
        step: row.getAttribute("data-step"),
      };
    const clump = el.closest?.("[data-clump]");
    if (clump)
      return { topic: clump.getAttribute("data-clump") as CategoryKey, guide: null, step: null };
    return NO_HOVER;
  };

  const setHover = (next: Hover) => {
    if (next.topic !== hover.topic || next.guide !== hover.guide || next.step !== hover.step)
      onHover(next);
  };

  /* Open clump drawn last, so its spray and rustle sit on top. */
  const clumps = [...model.clumps].sort(
    (a, b) =>
      Number(a.topic === open.topic) - Number(b.topic === open.topic) || a.center.y - b.center.y
  );

  return (
    <div
      ref={stageRef}
      data-grown={grown || undefined}
      data-settled={settled || undefined}
      data-paused={!inView || undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open.topic) {
          event.preventDefault();
          onUp();
        }
      }}
      className="gc-stage relative h-[min(78svh,600px)] min-h-[460px] overflow-hidden rounded-[1.75rem] bg-card shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:h-[600px] lg:h-[660px] dark:shadow-none dark:ring-1 dark:ring-border"
    >
      {mounted && (
        <svg
          aria-hidden="true"
          focusable="false"
          className="absolute inset-0 h-full w-full"
          onPointerOver={(event) =>
            event.pointerType === "mouse" && setHover(targetOf(event.target))
          }
          onPointerLeave={(event) => event.pointerType === "mouse" && setHover(NO_HOVER)}
          onClick={(event) => {
            const hit = targetOf(event.target);
            if (hit.step && hit.guide) onStep(hit.guide, hit.step);
            else if (hit.guide) onGuide(hit.guide);
            else if (hit.topic) onTopic(hit.topic);
          }}
        >
          <defs>
            <path id="gc-blade" d={BLADE} />
            <path id="gc-ovate" d={OVATE} />
          </defs>
          <g
            className="gc-cam"
            style={{ transform: `translate(${r2(cam.x)}px, ${r2(cam.y)}px) scale(${r3(cam.s)})` }}
          >
            <ellipse
              className="gc-ground"
              cx={model.ground.cx}
              cy={model.ground.cy}
              rx={model.ground.rx}
              ry={model.ground.ry}
            />
            <g className="gc-grow gc-rise" style={origin(0, 0, 0)}>
              {model.roots.map((d, i) => (
                <path key={i} className="gc-wood" d={d} />
              ))}
              <path className="gc-wood" d={model.trunk.d} />
              <path className="gc-shade" d={model.shade} />
              {model.grain.map((d, i) => (
                <path key={i} className="gc-grain" d={d} />
              ))}
              {model.trunk.kids.map((limb) => (
                <Limb key={limb.id} limb={limb} lit={limb.topic === open.topic} />
              ))}
            </g>

            {clumps.map((clump) => (
              <g
                key={clump.topic}
                className="gc-clump"
                data-clump={clump.topic}
                data-state={clumpState(clump.topic, open)}
                data-hot={hover.topic === clump.topic || undefined}
                style={{
                  ...paint(clump.topic),
                  transformOrigin: `${r2(clump.stalk.x)}px ${r2(clump.stalk.y)}px`,
                }}
              >
                <g className="gc-pop" style={origin(clump.center.x, clump.center.y, clump.delay)}>
                  <g
                    className="gc-sway"
                    style={
                      {
                        transformOrigin: `${r2(clump.stalk.x)}px ${r2(clump.stalk.y)}px`,
                        "--phase": `${clump.phase}s`,
                      } as React.CSSProperties
                    }
                  >
                    <ClumpBody clump={clump} />
                  </g>
                </g>
              </g>
            ))}

            {model.sprays.map((spray) => (
              <SprayArt
                key={spray.key}
                spray={spray}
                open={spray.key === openKey}
                step={open.step}
                hover={hover}
              />
            ))}
          </g>
        </svg>
      )}

      <div ref={overlayRef} className="gc-overlay pointer-events-none absolute inset-0">
        {model.clumps.map((clump) => {
          const at = project(cam, cardAt(clump));
          const topic = topicOf(clump.topic);
          const state = clumpState(clump.topic, open);
          const accent = CATEGORY_ACCENTS[topic.key];
          const steps = topic.guides.reduce((sum, g) => sum + g.sections.length, 0);
          const minutes = topic.guides.reduce((sum, g) => sum + g.readingTime, 0);
          const hidden = compact && Boolean(openSpray);
          return (
            <div
              key={clump.topic}
              className="gc-card absolute left-0 top-0"
              data-state={state}
              style={
                {
                  transform: `translate(${r2(at.x)}px, ${r2(at.y)}px)`,
                  "--in": `${r2(clump.delay + 0.45)}s`,
                } as React.CSSProperties
              }
            >
              <div
                data-measure={`card:${clump.topic}`}
                className="w-max -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => onTopic(clump.topic)}
                  aria-expanded={state === "open"}
                  tabIndex={hidden ? -1 : undefined}
                  aria-hidden={hidden || undefined}
                  onPointerEnter={(event) =>
                    event.pointerType === "mouse" &&
                    setHover({ topic: clump.topic, guide: null, step: null })
                  }
                  onPointerLeave={(event) => event.pointerType === "mouse" && setHover(NO_HOVER)}
                  onFocus={() => setHover({ topic: clump.topic, guide: null, step: null })}
                  onBlur={() => setHover(NO_HOVER)}
                  className={cn(
                    "gc-card-face block max-w-[180px] rounded-2xl px-3.5 py-2 text-center outline-none transition-[background-color,box-shadow,opacity,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-zellige/50",
                    hidden ? "pointer-events-none !opacity-0" : "pointer-events-auto",
                    state === "open"
                      ? cn(
                          accent.tint,
                          "shadow-[0_2px_4px_rgb(0_0_0/0.05),0_14px_30px_-14px_rgb(0_0_0/0.3)] dark:ring-1 dark:ring-border"
                        )
                      : cn(
                          "bg-card/95 ring-1 ring-zinc-900/[0.06] dark:bg-muted dark:ring-border",
                          hover.topic === clump.topic
                            ? "shadow-[0_2px_4px_rgb(0_0_0/0.05),0_14px_30px_-12px_rgb(0_0_0/0.3)]"
                            : "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_20px_-10px_rgb(0_0_0/0.22)]"
                        )
                  )}
                >
                  <span
                    className={cn(
                      "block font-display text-[14px] font-bold leading-[18px] tracking-tight",
                      state === "open" ? accent.acc : "text-zinc-900 dark:text-zinc-50"
                    )}
                  >
                    {topic.title}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-4 text-zinc-500 dark:text-zinc-400">
                    {topic.guides.length > 1
                      ? t("guides", { count: topic.guides.length })
                      : t("steps", { count: steps })}{" "}
                    · {t("minutes", { count: minutes })}
                  </span>
                </button>
              </div>
            </div>
          );
        })}

        {model.sprays.map((spray) =>
          spray.rows.map((row) => (
            <RowChip
              key={row.id}
              row={row}
              side={spray.side}
              at={project(cam, row.tip)}
              shown={spray.key === openKey}
              open={row.kind === "step" ? open.step === row.step : false}
              hot={
                hover.guide === row.guide &&
                (row.kind === "step" ? hover.step === row.step : !hover.step)
              }
              guides={topicOf(row.topic).guides}
              onPick={() => (row.step ? onStep(row.guide, row.step) : onGuide(row.guide))}
              onHover={(on) =>
                setHover(on ? { topic: row.topic, guide: row.guide, step: row.step } : NO_HOVER)
              }
            />
          ))
        )}
      </div>

      {/* Phones zoom into an open spray; this is the way back out. */}
      {compact && openSpray && (
        <div className="absolute inset-x-3 top-3 flex items-center gap-2 animate-in fade-in duration-500">
          <button
            type="button"
            onClick={onUp}
            aria-label={t("zoomOut")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_12px_-4px_rgb(0_0_0/0.16)] ring-1 ring-zinc-900/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 dark:bg-muted dark:text-zinc-200 dark:ring-border"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            className={cn(
              "min-w-0 truncate rounded-full px-3.5 py-2 text-[13px] font-semibold",
              CATEGORY_ACCENTS[openSpray.topic].tint,
              CATEGORY_ACCENTS[openSpray.topic].acc
            )}
          >
            {open.guide
              ? topicOf(openSpray.topic).guides.find((g) => g.slug === open.guide)?.label
              : topicOf(openSpray.topic).title}
          </span>
        </div>
      )}

      {!open.topic && grown && (
        <p className="pointer-events-none absolute bottom-3 left-4 hidden text-xs font-medium text-zinc-400 animate-in fade-in duration-1000 sm:block dark:text-zinc-500">
          {t("tapHint")}
        </p>
      )}
    </div>
  );
});

const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/* ---------- drawing ---------- */

/* A second leaf shape for the foliage, broader towards a pointed tip, so
   the clumps are not one blade repeated. Stem at the origin, along +x. */
const OVATE =
  "M0 0C2.5-4 8.5-6.6 14-5C17.6-3.8 19.4-1.6 20 0C19.4 1.6 17.6 3.8 14 5C8.5 6.6 2.5 4 0 0Z";

/* Midrib and two pairs of veins on the 20-unit blade. */
const VEINS = `${RIB}M6.5 -.2L9.5-3.2M6.5 .2L9.5 3.2M11.5-.1L14-2.4M11.5.1L14 2.4`;

const origin = (x: number, y: number, delay: number) =>
  ({
    transformOrigin: `${r2(x)}px ${r2(y)}px`,
    "--d": `${delay}s`,
  }) as React.CSSProperties;

const paint = (topic: CategoryKey) =>
  ({
    "--hue": CATEGORY_ACCENTS[topic].line,
    "--pale": CATEGORY_ACCENTS[topic].pale,
  }) as React.CSSProperties;

function Limb({ limb, lit }: { limb: Wood; lit: boolean }) {
  return (
    <g className="gc-grow" style={origin(limb.base.x, limb.base.y, limb.delay)}>
      <path
        className="gc-wood"
        data-lit={lit || undefined}
        d={limb.d}
        style={limb.topic ? paint(limb.topic) : undefined}
      />
    </g>
  );
}

/** A clump never changes once grown, so it renders once. */
const ClumpBody = React.memo(function ClumpBody({ clump }: { clump: Clump }) {
  return (
    <>
      {clump.masses.map((mass, i) => (
        <circle
          key={i}
          className="gc-mass"
          data-tone={mass.tone}
          cx={mass.cx}
          cy={mass.cy}
          r={mass.r}
        />
      ))}
      {clump.leaves.map((leaf, i) => (
        <use
          key={i}
          href={i % 3 === 1 ? "#gc-ovate" : "#gc-blade"}
          className="gc-foliage"
          data-tone={leaf.tone}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.s})`}
        />
      ))}
    </>
  );
});

/** A spray: its stem and twigs draw themselves out along their length,
    one after another, then each leaf unfurls. Closed, it runs back in. */
function SprayArt({
  spray,
  open,
  step,
  hover,
}: {
  spray: Spray;
  open: boolean;
  step: string | null;
  hover: Hover;
}) {
  return (
    <g className="gc-spray" data-open={open || undefined} style={paint(spray.topic)}>
      <path className="gc-shoot gc-stem" d={spray.stem} pathLength={1} />
      {spray.rows.map((row) => (
        <g key={row.id}>
          <path
            className="gc-shoot gc-twig"
            d={row.twig}
            pathLength={1}
            style={{ "--sd": `${row.delay}s` } as React.CSSProperties}
          />
          <g
            className="gc-rowleaf"
            data-row=""
            data-topic={row.topic}
            data-guide={row.guide}
            data-step={row.step ?? undefined}
            data-kind={row.kind}
            data-open={(row.step !== null && row.step === step) || undefined}
            data-hot={
              (hover.guide === row.guide && (row.step ? hover.step === row.step : !hover.step)) ||
              undefined
            }
            style={
              {
                transformOrigin: `${r2(row.at.x)}px ${r2(row.at.y)}px`,
                "--sd": `${r2(row.delay + 0.26)}s`,
              } as React.CSSProperties
            }
          >
            <g
              transform={`translate(${r2(row.at.x)} ${r2(row.at.y)}) rotate(${row.angle}) scale(${r3(row.len / 20)})`}
            >
              <path className="gc-node-blade" d={BLADE} />
              <path className="gc-node-rib" d={VEINS} />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

/* ---------- labels ---------- */

/** A row's name beside its leaf, and the control for it while its spray
    is out. */
function RowChip({
  row,
  side,
  at,
  shown,
  open,
  hot,
  guides,
  onPick,
  onHover,
}: {
  row: Row;
  side: -1 | 1;
  at: { x: number; y: number };
  shown: boolean;
  open: boolean;
  hot: boolean;
  guides: ExplorerTopic["guides"];
  onPick: () => void;
  onHover: (on: boolean) => void;
}) {
  const t = useTranslations("hubs.explorer");
  const accent = CATEGORY_ACCENTS[row.topic];
  const guide = guides.find((g) => g.slug === row.guide);
  return (
    <div
      className="gc-chip absolute left-0 top-0"
      data-shown={shown || undefined}
      data-side={side}
      style={
        {
          transform: `translate(${r2(at.x)}px, ${r2(at.y)}px)`,
          "--sd": `${r2(row.delay + 0.34)}s`,
        } as React.CSSProperties
      }
    >
      <div
        data-measure={`chip:${row.id}`}
        className="w-max"
        style={{ translate: side > 0 ? `${CHIP_GAP}px -50%` : `calc(-100% - ${CHIP_GAP}px) -50%` }}
      >
        <button
          type="button"
          onClick={onPick}
          tabIndex={shown ? undefined : -1}
          aria-hidden={shown ? undefined : true}
          aria-pressed={row.kind === "step" ? open : undefined}
          aria-label={
            row.kind === "step"
              ? `${t("stepOf", { n: row.index + 1, total: row.count })}: ${row.label}`
              : undefined
          }
          onPointerEnter={(event) => event.pointerType === "mouse" && onHover(true)}
          onPointerLeave={(event) => event.pointerType === "mouse" && onHover(false)}
          onFocus={() => onHover(true)}
          onBlur={() => onHover(false)}
          className={cn(
            "gc-chip-face flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
            row.kind === "guide" ? "py-1.5 pl-1.5 pr-3.5" : "py-1 pl-1 pr-3",
            open || hot
              ? cn(
                  accent.tint,
                  "shadow-[0_2px_4px_rgb(0_0_0/0.05),0_10px_22px_-12px_rgb(0_0_0/0.3)] dark:ring-1 dark:ring-border"
                )
              : "bg-card shadow-[0_1px_2px_rgb(0_0_0/0.05),0_6px_16px_-8px_rgb(0_0_0/0.22)] ring-1 ring-zinc-900/[0.06] dark:bg-muted dark:ring-border"
          )}
        >
          {row.kind === "step" ? (
            <span
              aria-hidden="true"
              className={cn(
                "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                open ? cn(accent.dot, "text-card") : cn(accent.tint, accent.acc)
              )}
            >
              {row.index + 1}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                accent.tint,
                accent.acc
              )}
            >
              <LeafGlyph className="h-3.5 w-3.5" />
            </span>
          )}
          <span
            className={cn(
              "whitespace-nowrap",
              row.kind === "guide" ? "text-[13.5px] font-bold" : "text-[13px] font-semibold",
              open ? accent.acc : "text-zinc-800 dark:text-zinc-100"
            )}
          >
            {row.label}
            {row.kind === "guide" && guide && (
              <span className="ml-1.5 hidden text-[11.5px] font-medium text-zinc-500 sm:inline dark:text-zinc-400">
                {t("steps", { count: guide.sections.length })}
              </span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
