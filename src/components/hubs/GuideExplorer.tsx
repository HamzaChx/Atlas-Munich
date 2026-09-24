"use client";

// ============================================
// Atlas Munich – guide explorer (the Lifestyle tree)
//
// Every guide on the site, grown as one vertical tree:
//
//   Lifestyle
//   ├─ topic             a category: housing, papers, studies, work, apps
//   │  ├─ guide
//   │  │  ├─ 1  step     a section, previewed in place
//   │  │  └─ 2  step
//   │  └─ guide
//   └─ topic
//
// It opens on the topics alone, and only one topic, one guide and one step
// can be open at once, so the tree never shows more than a single path in
// full. That is what keeps five topics and thirty-odd sections from reading
// as a wall.
//
// Decisions worth keeping:
//
// 1. Branches animate both ways. A closed branch stays mounted (grid rows
//    at 0fr, `inert`), so closing plays the opening in reverse instead of
//    vanishing. On the way in, lines draw down, elbows reach out, then the
//    cards settle, one row after another. All of it is CSS transitions keyed
//    on `data-open` (`.vt-*` in globals.css), so nothing is timed in JS.
//
// 2. Everything is in the prerendered HTML: every guide, step, excerpt and
//    link, open or not. `inert` keeps closed branches out of the tab order
//    and the accessibility tree without taking them off the page.
//
// 3. It is drawn as a real tree (tree-art.tsx): a trunk rising from its
//    roots, one bough and a spray of leaves per topic, alternating sides on
//    wide screens and hugging the left edge on phones. Below a topic the
//    shoots are pseudo-elements on the real list items, so nothing drifts on
//    resize, and the lit path to whatever is open is `:has()`, not state.
//    The one measurement is the packing of the two sides (see `usePacking`).
//
// 4. Rows are disclosure buttons and every navigation is a real link inside
//    what they reveal. Arrow keys walk the visible rows, Right opens, Left
//    closes or climbs to the parent. Deliberately not `role="tree"`, which
//    would replace the button and link roles for no gain.
//
// 5. What is open lives in the URL hash (`#<topic>` or `#<guide-slug>`), so
//    a view can be shared and other pages can link straight into a branch.
//    Read in an effect: `useSearchParams` would drop the page out of static
//    prerendering.
// ============================================

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { CATEGORY_ACCENTS, type CategoryAccent } from "@/lib/category-accents";
import { FreshnessBadge } from "@/components/shared/GuideFreshness";
import { Bough, Crown, LeafGlyph, Roots, Sprig, Trunk } from "./tree-art";
import type { ExplorerGuide, ExplorerSection, ExplorerTopic } from "@/lib/guide-tree-server";
import type { CategoryKey } from "@/types";

/* ---------- search ---------- */

/** Case- and accent-insensitive, so "demenagement" finds "déménagement". */
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const at = fold(text).indexOf(fold(query));
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[3px] bg-tint-saffron px-0.5 text-inherit">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

interface Hits {
  topics: Set<CategoryKey>;
  /** Visible guide -> the steps that matched (empty when only the guide or
      its topic did, in which case the guide shows closed). */
  guides: Map<string, ExplorerSection[]>;
}

function search(topics: ExplorerTopic[], query: string): Hits {
  const q = fold(query);
  const has = (...fields: string[]) => fields.some((field) => fold(field).includes(q));
  const hits: Hits = { topics: new Set(), guides: new Map() };

  for (const topic of topics) {
    const topicHit = has(topic.title, topic.description);
    for (const guide of topic.guides) {
      const steps = guide.sections.filter((s) =>
        has(s.label, s.title, s.excerpt, ...s.children.map((c) => c.label))
      );
      if (topicHit || steps.length > 0 || has(guide.title, guide.summary)) {
        hits.guides.set(guide.slug, steps);
        hits.topics.add(topic.key);
      }
    }
  }
  return hits;
}

/* ---------- page plumbing ---------- */

function writeHash(value: string | null) {
  try {
    const { pathname, search: query } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      value ? `#${value}` : `${pathname}${query}`
    );
  } catch {
    /* Some embedded browsers refuse; the tree still works, just unshared. */
  }
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToRow(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

/** Once a branch has opened, bring its row up if it was left low on screen
    (or tucked under the header by a branch closing above it). Waits for the
    motion to settle so it scrolls to where the row ends up, not where it
    started. */
function keepInView(id: string) {
  window.setTimeout(
    () => {
      const row = document.getElementById(id);
      if (!row) return;
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 64;
      const { top } = row.getBoundingClientRect();
      if (top < header || top > window.innerHeight * 0.55) scrollToRow(id);
    },
    prefersReducedMotion() ? 0 : 380
  );
}

/** Up/Down/Home/End walk the visible rows; Right opens (or steps into what
    is open); Left closes (or climbs to the parent row). */
function onTreeKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  const row = event.target as HTMLElement;
  if (!row.matches("[data-nav-item]")) return;

  const rows = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>("[data-nav-item]")
  ).filter((el) => !el.closest("[inert]"));
  const index = rows.indexOf(row);
  const expanded = row.getAttribute("aria-expanded");
  let next: HTMLElement | null | undefined;

  switch (event.key) {
    case "ArrowDown":
      next = rows[index + 1];
      break;
    case "ArrowUp":
      next = rows[index - 1];
      break;
    case "Home":
      next = rows[0];
      break;
    case "End":
      next = rows[rows.length - 1];
      break;
    case "ArrowRight":
      if (expanded === "false") row.click();
      else next = rows[index + 1];
      break;
    case "ArrowLeft":
      if (expanded === "true") row.click();
      else {
        const parent = row.closest("[data-branch]")?.parentElement?.closest("[data-branch]");
        next = parent?.querySelector<HTMLElement>(":scope > .vt-row [data-nav-item]");
      }
      break;
    default:
      return;
  }
  event.preventDefault();
  next?.focus();
}

/* ---------- the tree ---------- */

/** Grid row unit and gap between topics on the two-sided tree; match
    `.vt-l1` in globals.css. */
const PACK_UNIT = 4;
const PACK_GAP = 20;

/** On wide screens each side of the trunk stacks on its own, like a masonry
    column, so a topic opening on one side never drags the other side down
    after it. CSS grid can only do that with `dense` packing and each topic
    spanning rows in proportion to its height, which is what this measures.
    Before it runs (and on phones, where the tree is one column) the
    stylesheet's default span fits a closed topic. */
function usePacking(list: React.RefObject<HTMLOListElement | null>, layoutKey: string) {
  React.useEffect(() => {
    const ol = list.current;
    if (!ol || typeof ResizeObserver === "undefined") return;
    const wide = window.matchMedia("(min-width: 1024px)");

    const fit = (li: HTMLElement) => {
      const height = li.offsetHeight + parseFloat(getComputedStyle(li).marginTop) + PACK_GAP;
      li.style.setProperty("--span", String(Math.ceil(height / PACK_UNIT)));
    };
    const observer = new ResizeObserver((entries) =>
      entries.forEach((entry) => fit(entry.target as HTMLElement))
    );
    const watch = () => {
      observer.disconnect();
      if (!wide.matches) return;
      ol.querySelectorAll<HTMLElement>(":scope > li").forEach((li) => observer.observe(li));
    };

    watch();
    wide.addEventListener("change", watch);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", watch);
    };
  }, [list, layoutKey]);
}

interface GuideExplorerProps {
  topics: ExplorerTopic[];
  className?: string;
}

export function GuideExplorer({ topics, className }: GuideExplorerProps) {
  const t = useTranslations("hubs.explorer");

  const [openTopic, setOpenTopic] = React.useState<CategoryKey | null>(null);
  const [openGuide, setOpenGuide] = React.useState<string | null>(null);
  const [openStep, setOpenStep] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const treeRef = React.useRef<HTMLOListElement>(null);

  const trimmed = query.trim();
  const hits = React.useMemo(() => (trimmed ? search(topics, trimmed) : null), [topics, trimmed]);

  /** Opens exactly one path, or closes everything, and records it. */
  const openPath = React.useCallback(
    (topic: CategoryKey | null, guide: string | null = null, step: string | null = null) => {
      setOpenTopic(topic);
      setOpenGuide(guide);
      setOpenStep(step);
      writeHash(guide ?? topic);
    },
    []
  );

  /* Land on the branch named in the hash, now and on later changes (a link
     to /lifestyle#<slug> followed while already on the page). */
  React.useEffect(() => {
    const fromHash = () => {
      const key = decodeURIComponent(window.location.hash.slice(1));
      if (!key) return;
      const topic = topics.find((tp) => tp.key === key);
      const owner = topics.find((tp) => tp.guides.some((guide) => guide.slug === key));
      if (!topic && !owner) return;
      setQuery("");
      if (topic) openPath(topic.key);
      else if (owner) openPath(owner.key, key);
      requestAnimationFrame(() => scrollToRow(`vt-${key}`));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [topics, openPath]);

  /* In search mode a row is a shortcut: it leaves search and opens that
     exact path in the full tree. */
  const goTo = (topic: CategoryKey, guide: string | null = null, step: string | null = null) => {
    setQuery("");
    openPath(topic, guide, step);
    keepInView(step ? `vt-step-${guide}-${step}` : `vt-${guide ?? topic}`);
  };

  const toggleTopic = (key: CategoryKey) => {
    if (hits) return goTo(key);
    if (openTopic === key) return openPath(null);
    openPath(key);
    keepInView(`vt-${key}`);
  };

  const toggleGuide = (topic: CategoryKey, slug: string) => {
    if (hits) return goTo(topic, slug);
    if (openGuide === slug) return openPath(topic);
    openPath(topic, slug);
    keepInView(`vt-${slug}`);
  };

  const toggleStep = (topic: CategoryKey, slug: string, id: string) => {
    if (hits) return goTo(topic, slug, id);
    setOpenStep((open) => (open === id ? null : id));
  };

  const firstHit = () => {
    if (!hits) return;
    for (const topic of topics) {
      const guide = topic.guides.find((g) => hits.guides.has(g.slug));
      if (guide) return goTo(topic.key, guide.slug, hits.guides.get(guide.slug)?.[0]?.id ?? null);
    }
  };

  const guideCount = topics.reduce((sum, topic) => sum + topic.guides.length, 0);
  const minuteCount = topics.reduce(
    (sum, topic) => sum + topic.guides.reduce((m, guide) => m + guide.readingTime, 0),
    0
  );
  const visibleTopics = hits ? topics.filter((topic) => hits.topics.has(topic.key)) : topics;
  usePacking(treeRef, visibleTopics.map((topic) => topic.key).join());

  return (
    <nav
      aria-label={t("label")}
      onKeyDown={onTreeKeyDown}
      data-searching={hits ? "" : undefined}
      className={cn("vt", className)}
    >
      {/* Root, with search beside it (above it on phones) */}
      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-10 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-green text-acc-green">
            <LeafGlyph className="h-[18px] w-[18px]" />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-base font-bold leading-5 text-zinc-900 dark:text-zinc-50">
              {t("root")}
            </span>
            <span aria-live="polite" className="text-xs leading-4 text-zinc-500 dark:text-zinc-400">
              {hits
                ? t("results", { count: hits.guides.size })
                : `${t("topics", { count: topics.length })} · ${t("guides", { count: guideCount })} · ${t("minutes", { count: minuteCount })}`}
            </span>
          </span>
        </div>

        <div className="relative sm:w-72">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
              } else if (event.key === "Enter") {
                event.preventDefault();
                firstHit();
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                treeRef.current?.querySelector<HTMLElement>("[data-nav-item]")?.focus();
              }
            }}
            placeholder={t("search")}
            aria-label={t("search")}
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
        </div>
      </div>

      {visibleTopics.length > 0 ? (
        <div className="vt-tree">
          <Crown />
          <Trunk />
          <Roots />
          <ol ref={treeRef} className="vt-l1">
            {visibleTopics.map((topic, i) => (
              <TopicBranch
                key={topic.key}
                topic={topic}
                index={i}
                open={hits ? true : openTopic === topic.key}
                guides={hits ? topic.guides.filter((g) => hits.guides.has(g.slug)) : topic.guides}
                isGuideOpen={(slug) =>
                  hits ? (hits.guides.get(slug)?.length ?? 0) > 0 : openGuide === slug
                }
                stepsFor={(guide) => (hits ? (hits.guides.get(guide.slug) ?? []) : guide.sections)}
                openStep={hits ? null : openStep}
                query={trimmed}
                onTopic={() => toggleTopic(topic.key)}
                onGuide={(slug) => toggleGuide(topic.key, slug)}
                onStep={(slug, id) => toggleStep(topic.key, slug, id)}
              />
            ))}
          </ol>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-card p-5 text-sm shadow-[0_1px_3px_rgb(0_0_0/0.04)] dark:ring-1 dark:ring-border">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            {t("noMatches", { query: trimmed })}
          </p>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {t("noMatchesHint")}{" "}
            <Link
              href="/chat"
              className="font-semibold text-acc-blue underline-offset-4 hover:underline"
            >
              {t("askZellija")}
            </Link>
          </p>
        </div>
      )}
    </nav>
  );
}

/* ---------- pieces ---------- */

/** The round +/× affordance; it overshoots a touch as it turns. */
function Toggle({
  open,
  accent,
  size = "md",
}: {
  open: boolean;
  accent: CategoryAccent;
  size?: "md" | "sm";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        size === "md" ? "h-8 w-8" : "h-7 w-7",
        open
          ? "bg-card dark:bg-foreground/10"
          : "bg-muted group-hover:bg-zinc-200/80 dark:group-hover:bg-foreground/15"
      )}
    >
      <Plus
        className={cn(
          "h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open ? cn("rotate-45", accent.acc) : "text-zinc-500 dark:text-zinc-400"
        )}
      />
    </span>
  );
}

interface TopicBranchProps {
  topic: ExplorerTopic;
  index: number;
  open: boolean;
  guides: ExplorerGuide[];
  isGuideOpen: (slug: string) => boolean;
  stepsFor: (guide: ExplorerGuide) => ExplorerSection[];
  openStep: string | null;
  query: string;
  onTopic: () => void;
  onGuide: (slug: string) => void;
  onStep: (slug: string, id: string) => void;
}

function TopicBranch({
  topic,
  index,
  open,
  guides,
  isGuideOpen,
  stepsFor,
  openStep,
  query,
  onTopic,
  onGuide,
  onStep,
}: TopicBranchProps) {
  const t = useTranslations("hubs.explorer");
  const accent = CATEGORY_ACCENTS[topic.key];
  const minutes = topic.guides.reduce((sum, guide) => sum + guide.readingTime, 0);
  const branchId = `vt-branch-${topic.key}`;

  return (
    <li
      className="vt-item vt-topic"
      data-branch
      data-open={open || undefined}
      style={
        {
          "--i": index,
          "--branch": accent.line,
        } as React.CSSProperties
      }
    >
      <Bough index={index + Math.floor(index / 2)} />
      <div className="vt-row" id={`vt-${topic.key}`}>
        <button
          type="button"
          data-nav-item
          aria-expanded={open}
          aria-controls={branchId}
          onClick={onTopic}
          className={cn(
            "group relative z-[1] flex w-full items-start gap-4 rounded-[1.25rem] px-4 py-3.5 text-left outline-none transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-zellige/50",
            open
              ? cn(accent.tint, "dark:ring-1 dark:ring-border")
              : "bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-14px_rgb(0_0_0/0.16)] ring-1 ring-zinc-900/[0.04] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-14px_rgb(0_0_0/0.22)] dark:shadow-none dark:ring-border dark:hover:ring-input"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-[background-color,transform] duration-300 group-hover:scale-105",
              open ? accent.dot : accent.tint
            )}
          >
            <LeafGlyph
              className={cn(
                "vt-glyph h-5 w-5 transition-colors duration-300",
                open ? "text-card" : accent.acc
              )}
            />
          </span>

          <span className="min-w-0 flex-1 pt-0.5">
            <span
              className={cn(
                "block font-display text-[17px] font-bold leading-6 tracking-tight transition-colors duration-300",
                open ? accent.acc : "text-zinc-900 dark:text-zinc-50"
              )}
            >
              <Highlight text={topic.title} query={query} />
            </span>
            {/* Phones get the counts; wider screens the one-line summary. */}
            <span className="mt-0.5 block text-xs text-zinc-500 sm:hidden dark:text-zinc-400">
              {t("guides", { count: topic.guides.length })} · {t("minutes", { count: minutes })}
            </span>
            <span className="mt-0.5 hidden text-[13.5px] leading-5 text-zinc-500 sm:line-clamp-1 lg:line-clamp-2 dark:text-zinc-400">
              {topic.description}
            </span>
          </span>

          <span className="hidden shrink-0 flex-col items-end pt-1 text-xs tabular-nums sm:flex">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
              {t("guides", { count: topic.guides.length })}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {t("minutes", { count: minutes })}
            </span>
          </span>

          <span className="pt-1.5">
            <Toggle open={open} accent={accent} />
          </span>
        </button>
      </div>

      <div id={branchId} className="vt-collapse" data-open={open || undefined} inert={!open}>
        <div className="vt-clip">
          <ol className="vt-l2">
            {guides.map((guide, k) => (
              <GuideBranch
                key={guide.slug}
                guide={guide}
                index={k}
                accent={accent}
                open={isGuideOpen(guide.slug)}
                steps={stepsFor(guide)}
                openStep={openStep}
                query={query}
                onGuide={() => onGuide(guide.slug)}
                onStep={(id) => onStep(guide.slug, id)}
              />
            ))}
          </ol>
        </div>
      </div>
    </li>
  );
}

interface GuideBranchProps {
  guide: ExplorerGuide;
  index: number;
  accent: CategoryAccent;
  open: boolean;
  steps: ExplorerSection[];
  openStep: string | null;
  query: string;
  onGuide: () => void;
  onStep: (id: string) => void;
}

function GuideBranch({
  guide,
  index,
  accent,
  open,
  steps,
  openStep,
  query,
  onGuide,
  onStep,
}: GuideBranchProps) {
  const t = useTranslations("hubs.explorer");
  const tGuide = useTranslations("guidePage");
  const branchId = `vt-branch-${guide.slug}`;
  const openIndex = steps.findIndex((step) => step.id === openStep);

  return (
    <li
      className="vt-item vt-guide"
      data-branch
      data-open={open || undefined}
      style={{ "--i": index } as React.CSSProperties}
    >
      <Sprig />
      <div className="vt-row" id={`vt-${guide.slug}`}>
        <button
          type="button"
          data-nav-item
          aria-expanded={open}
          aria-controls={branchId}
          onClick={onGuide}
          className={cn(
            "group relative z-[1] flex w-full items-start gap-3 rounded-2xl bg-card py-3 pl-4 pr-3 text-left outline-none ring-1 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-zellige/50 dark:ring-border",
            open
              ? "shadow-[0_2px_4px_rgb(0_0_0/0.03),0_12px_28px_-14px_rgb(0_0_0/0.2)] ring-transparent"
              : "shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-zinc-900/[0.05] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgb(0_0_0/0.04),0_10px_24px_-14px_rgb(0_0_0/0.2)]"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "vt-gnode -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow] duration-300",
              open ? accent.dot : "bg-card"
            )}
          >
            <LeafGlyph className={cn("vt-glyph h-3.5 w-3.5", open ? "text-card" : accent.acc)} />
          </span>

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-[15px] font-semibold leading-snug transition-colors duration-300",
                open ? accent.acc : "text-zinc-900 dark:text-zinc-50"
              )}
            >
              <Highlight text={guide.title} query={query} />
            </span>
            <span className="mt-1 line-clamp-2 text-[13.5px] leading-5 text-zinc-500 dark:text-zinc-400">
              {guide.summary}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{t("minutes", { count: guide.readingTime })}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"
              />
              <span>{t("steps", { count: guide.sections.length })}</span>
              {/* The badge's own coloured dot is the separator, so nothing
                  is left dangling when it wraps to its own line. */}
              <FreshnessBadge
                verifiedAt={guide.lastVerified}
                initial={guide.freshness}
                className="ml-1"
              />
            </span>
          </span>

          <Toggle open={open} accent={accent} size="sm" />
        </button>
      </div>

      <div id={branchId} className="vt-collapse" data-open={open || undefined} inert={!open}>
        <div className="vt-clip">
          <ol className="vt-steps">
            {steps.map((step, j) => (
              <StepLeaf
                key={step.id}
                slug={guide.slug}
                step={step}
                index={j}
                accent={accent}
                open={openStep === step.id}
                reached={j <= openIndex}
                query={query}
                onToggle={() => onStep(step.id)}
              />
            ))}
          </ol>

          <div
            className="vt-foot flex flex-wrap items-center gap-x-4 gap-y-2 pb-5 pl-14 pt-3"
            style={{ "--i": steps.length } as React.CSSProperties}
          >
            <Link
              href={guide.href}
              className="group/cta inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-semibold text-white outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {t("readGuide")}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
              />
            </Link>
            <a
              href={guide.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 rounded text-xs text-zinc-500 outline-none transition-colors hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <span className="sr-only">{tGuide("officialSource")}: </span>
              {guide.source.title}
              <ArrowUpRight aria-hidden="true" className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

interface StepLeafProps {
  slug: string;
  step: ExplorerSection;
  index: number;
  accent: CategoryAccent;
  open: boolean;
  reached: boolean;
  query: string;
  onToggle: () => void;
}

function StepLeaf({ slug, step, index, accent, open, reached, query, onToggle }: StepLeafProps) {
  const t = useTranslations("hubs.explorer");
  const previewId = `vt-preview-${slug}-${step.id}`;

  return (
    <li
      id={`vt-step-${slug}-${step.id}`}
      className="vt-step scroll-mt-[calc(var(--header-h)+1rem)]"
      data-branch
      data-open={open || undefined}
      data-reached={reached || undefined}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div
        className={cn(
          "vt-row rounded-2xl transition-[background-color,box-shadow] duration-300",
          open &&
            "bg-card shadow-[0_2px_4px_rgb(0_0_0/0.03),0_12px_28px_-16px_rgb(0_0_0/0.2)] dark:shadow-none dark:ring-1 dark:ring-border"
        )}
      >
        <button
          type="button"
          data-nav-item
          aria-expanded={open}
          aria-controls={previewId}
          onClick={onToggle}
          className={cn(
            "group flex w-full items-center gap-3 rounded-2xl py-2.5 pl-2 pr-3 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zellige/50",
            !open && "hover:bg-card/70 dark:hover:bg-foreground/[0.06]"
          )}
        >
          <span
            aria-hidden="true"
            className="vt-num relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-[background-color,color,box-shadow,transform] duration-300 group-hover:scale-105"
          >
            {index + 1}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[15px] font-semibold transition-colors duration-300",
              open ? accent.acc : "text-zinc-800 dark:text-zinc-200"
            )}
          >
            <Highlight text={step.label} query={query} />
          </span>
          {step.children.length > 0 && (
            <span className="hidden shrink-0 text-xs font-medium text-zinc-400 sm:inline">
              +{step.children.length}
            </span>
          )}
          <span className="shrink-0 text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
            {t("minutes", { count: step.minutes })}
          </span>
          <Plus
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              open ? cn("rotate-45", accent.acc) : "text-zinc-400"
            )}
          />
        </button>

        <div id={previewId} className="vt-collapse" data-open={open || undefined} inert={!open}>
          <div className="vt-clip">
            <div className="vt-preview pb-4 pl-12 pr-4">
              <p className="font-display text-[15px] font-bold leading-snug text-zinc-900 dark:text-zinc-50">
                {step.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {step.excerpt}
              </p>

              {step.children.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {step.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.href}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-zinc-600 outline-none transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-300 dark:hover:text-zinc-50"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={step.href}
                className={cn(
                  "group/read mt-3 inline-flex items-center gap-1 rounded text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
                  accent.acc
                )}
              >
                {t("readSection")}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover/read:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
