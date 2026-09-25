"use client";

// ============================================
// Atlas Munich – the words beside the Lifestyle tree
//
// Whatever the tree has open, this panel says it in full and lists what
// grows from it, so every leaf is also one readable row away:
//
//   nothing open   the index: every topic and its guides
//   a topic        its description and guides (topics with one guide
//                  open straight onto it, see GuideCanvas)
//   a guide        its summary, steps, and the way into the full guide
//   a step         its excerpt, sub-sections, and previous / next
//
// Rows move the tree (onGo) and light what they point at in it (onHover);
// links leave for the guide itself.
// ============================================

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CATEGORY_ACCENTS } from "@/lib/category-accents";
import { FreshnessBadge } from "@/components/shared/GuideFreshness";
import type { ExplorerTopic } from "@/lib/guide-tree-server";
import { LeafGlyph } from "./tree-art";
import type { OpenPath } from "./guide-canvas-layout";
import { NO_HOVER, type Hover } from "./GuideCanvas";
import type { CategoryKey } from "@/types";

const row =
  "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-zellige/50 data-[hot]:bg-muted dark:hover:bg-foreground/[0.06] dark:data-[hot]:bg-foreground/[0.06]";

export function CanvasPanel({
  topics,
  open,
  hover,
  onGo,
  onUp,
  onHover,
}: {
  topics: ExplorerTopic[];
  open: OpenPath;
  hover: Hover;
  onGo: (path: OpenPath) => void;
  onUp: () => void;
  onHover: (hover: Hover) => void;
}) {
  const t = useTranslations("hubs.explorer");
  const tGuide = useTranslations("guidePage");
  const topic = topics.find((tp) => tp.key === open.topic);
  const guide = topic?.guides.find((g) => g.slug === open.guide);
  const stepIndex = guide ? guide.sections.findIndex((s) => s.id === open.step) : -1;
  const step = guide && stepIndex >= 0 ? guide.sections[stepIndex] : undefined;
  const accent = topic ? CATEGORY_ACCENTS[topic.key] : null;

  /* Keyed on the focus, so each change settles in afresh. */
  const focusKey = `${open.topic}/${open.guide}/${open.step}`;

  /** Hover props for a row that points at a guide (and maybe a step). */
  const lights = (key: CategoryKey, slug: string, stepId: string | null = null) => ({
    "data-hot": hover.guide === slug && hover.step === stepId ? "" : undefined,
    onPointerEnter: (event: React.PointerEvent) =>
      event.pointerType === "mouse" && onHover({ topic: key, guide: slug, step: stepId }),
    onPointerLeave: (event: React.PointerEvent) =>
      event.pointerType === "mouse" && onHover(NO_HOVER),
  });

  /* Where "back" goes, named. */
  const parent = step
    ? guide!.label
    : guide && topic && topic.guides.length > 1
      ? topic.title
      : t("root");

  let body: React.ReactNode;

  if (!topic || !accent) {
    body = (
      <>
        <p className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("indexTitle")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("indexHint")}
        </p>
        <div className="mt-4 space-y-4">
          {topics.map((tp) => {
            const a = CATEGORY_ACCENTS[tp.key];
            return (
              <section key={tp.key} aria-labelledby={`gc-index-${tp.key}`}>
                <button
                  type="button"
                  id={`gc-index-${tp.key}`}
                  onClick={() => onGo({ topic: tp.key, guide: null, step: null })}
                  className={cn(
                    "flex items-center gap-1.5 rounded text-[10.5px] font-bold uppercase tracking-[0.1em] outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
                    a.acc
                  )}
                >
                  <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
                  {tp.title}
                </button>
                <ul className="-mx-3 mt-1">
                  {tp.guides.map((g) => (
                    <li key={g.slug}>
                      <button
                        type="button"
                        onClick={() => onGo({ topic: tp.key, guide: g.slug, step: null })}
                        className={cn(row, "py-2")}
                        {...lights(tp.key, g.slug)}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                            a.tint,
                            a.acc
                          )}
                        >
                          <LeafGlyph className="vt-glyph h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {g.label}
                          </span>
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                            {t("steps", { count: g.sections.length })} ·{" "}
                            {t("minutes", { count: g.readingTime })}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </>
    );
  } else if (!guide) {
    body = (
      <>
        <p
          className={cn(
            "flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em]",
            accent.acc
          )}
        >
          <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
          {t("guides", { count: topic.guides.length })}
        </p>
        <p className={cn("mt-2 font-display text-xl font-bold tracking-tight", accent.acc)}>
          {topic.title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {topic.description}
        </p>
        <ul className="-mx-3 mt-4 space-y-1">
          {topic.guides.map((g) => (
            <li key={g.slug}>
              <button
                type="button"
                onClick={() => onGo({ topic: topic.key, guide: g.slug, step: null })}
                className={cn(row, "items-start")}
                {...lights(topic.key, g.slug)}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
                    {g.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-[13px] leading-5 text-zinc-500 dark:text-zinc-400">
                    {g.summary}
                  </span>
                  <span className="mt-1.5 block text-xs text-zinc-500 dark:text-zinc-400">
                    {t("minutes", { count: g.readingTime })} ·{" "}
                    {t("steps", { count: g.sections.length })}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600"
                />
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (!step) {
    body = (
      <>
        <p
          className={cn(
            "flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em]",
            accent.acc
          )}
        >
          <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
          {topic.title}
        </p>
        <p className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
          {guide.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {guide.summary}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{t("minutes", { count: guide.readingTime })}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span>{t("steps", { count: guide.sections.length })}</span>
          <FreshnessBadge
            verifiedAt={guide.lastVerified}
            initial={guide.freshness}
            className="ml-1"
          />
        </p>

        <ol className="-mx-3 mt-4 space-y-0.5">
          {guide.sections.map((section, k) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onGo({ topic: topic.key, guide: guide.slug, step: section.id })}
                className={cn(row, "py-2")}
                {...lights(topic.key, guide.slug, section.id)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                    accent.tint,
                    accent.acc
                  )}
                >
                  {k + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {section.label}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                  {t("minutes", { count: section.minutes })}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <GuideLinks
          href={guide.href}
          source={guide.source}
          sourceLabel={tGuide("officialSource")}
        />
      </>
    );
  } else {
    const previous = guide.sections[stepIndex - 1];
    const next = guide.sections[stepIndex + 1];
    body = (
      <>
        <p className={cn("text-xs font-semibold", accent.acc)}>
          {t("stepOf", { n: stepIndex + 1, total: guide.sections.length })}
          <span className="font-medium text-zinc-400 dark:text-zinc-500"> · {guide.label}</span>
        </p>
        <p className="mt-1 font-display text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
          {step.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
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
            "group/read mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-zellige/50",
            accent.acc
          )}
        >
          {t("readSection")}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover/read:translate-x-0.5"
          />
        </Link>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <StepButton
            label={t("prevStep")}
            step={previous?.label}
            disabled={!previous}
            onClick={() => previous && onGo({ ...open, step: previous.id })}
            back
          />
          <StepButton
            label={t("nextStep")}
            step={next?.label}
            disabled={!next}
            onClick={() => next && onGo({ ...open, step: next.id })}
          />
        </div>

        <GuideLinks
          href={guide.href}
          source={guide.source}
          sourceLabel={tGuide("officialSource")}
        />
      </>
    );
  }

  return (
    <aside
      aria-live="polite"
      className="rounded-[1.75rem] bg-card p-5 shadow-[0_2px_20px_rgb(0_0_0/0.06)] lg:max-h-[680px] lg:overflow-y-auto dark:shadow-none dark:ring-1 dark:ring-border"
    >
      {topic && (
        <button
          type="button"
          onClick={onUp}
          className="-ml-1 mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs font-semibold text-zinc-500 outline-none transition-colors hover:bg-muted hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-400 dark:hover:bg-foreground/[0.06] dark:hover:text-zinc-50"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{parent}</span>
        </button>
      )}
      <div key={focusKey} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {body}
      </div>
    </aside>
  );
}

function StepButton({
  label,
  step,
  disabled,
  onClick,
  back,
}: {
  label: string;
  step?: string;
  disabled: boolean;
  onClick: () => void;
  back?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-w-0 flex-col rounded-2xl bg-muted px-3 py-2 outline-none transition-colors hover:bg-zinc-200/70 focus-visible:ring-2 focus-visible:ring-zellige/50 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-foreground/15",
        back ? "items-start text-left" : "items-end text-right"
      )}
    >
      <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
        {back && <ArrowLeft aria-hidden="true" className="h-3 w-3" />}
        {label}
        {!back && <ArrowRight aria-hidden="true" className="h-3 w-3" />}
      </span>
      <span className="w-full truncate text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
        {step ?? " "}
      </span>
    </button>
  );
}

function GuideLinks({
  href,
  source,
  sourceLabel,
}: {
  href: string;
  source: { title: string; url: string };
  sourceLabel: string;
}) {
  const t = useTranslations("hubs.explorer");
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      <Link
        href={href}
        className="group/cta inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-semibold text-white outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {t("readGuide")}
        <ArrowRight
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
        />
      </Link>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 rounded text-xs text-zinc-500 outline-none transition-colors hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <span className="sr-only">{sourceLabel}: </span>
        {source.title}
        <ArrowUpRight aria-hidden="true" className="h-3 w-3 shrink-0" />
      </a>
    </div>
  );
}
