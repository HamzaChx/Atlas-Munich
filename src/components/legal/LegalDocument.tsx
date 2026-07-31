"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Landmark,
  Mail,
  Printer,
  Rows3,
  SquareStack,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LEGAL, fillLegalTokens } from "@/lib/legal-config";

/* ------------------------------------------------------------------ types */

export type LegalBlock =
  | { t: "p"; x: string }
  | { t: "h"; x: string }
  | { t: "list"; x: string[] }
  | { t: "defs"; x: { k: string; v: string }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "note"; x: string }
  | { t: "controller" }
  | { t: "authority" };

export type LegalSection = {
  id: string;
  title: string;
  summary: string;
  blocks: LegalBlock[];
};

export type LegalAccent = { icon: LucideIcon; tint: string; text: string; dot: string };

/* The six brand hues, cycled when a section has no explicit accent. */
const FALLBACK_ACCENTS: Omit<LegalAccent, "icon">[] = [
  { tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  { tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  { tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  { tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  { tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  { tint: "bg-tint-saffron", text: "text-acc-saffron", dot: "bg-acc-saffron" },
];

/* ------------------------------------------------------------ small parts */

/** Provider identification card, driven by legal-config rather than i18n. */
function ControllerCard({ labels }: { labels: Record<string, string> }) {
  return (
    <div className="mt-4 rounded-2xl bg-card p-5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] dark:bg-foreground/[0.075] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-blue">
          <Building2 className="h-[18px] w-[18px] text-acc-blue" />
        </span>
        <div className="min-w-0 text-sm leading-relaxed">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{LEGAL.entity}</p>
          <p className="text-zinc-600 dark:text-zinc-400">{LEGAL.operator}</p>
          <a
            href={`mailto:${LEGAL.email}`}
            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-zellige transition-opacity hover:opacity-80"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {LEGAL.email}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Supervisory authority card for the Art. 77 GDPR right of complaint. */
function AuthorityCard({ labels }: { labels: Record<string, string> }) {
  const authority = LEGAL.supervisoryAuthority;

  return (
    <div className="mt-4 rounded-2xl bg-card p-5 shadow-[0_1px_8px_rgb(0_0_0/0.05)] dark:bg-foreground/[0.075] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-plum">
          <Landmark className="h-[18px] w-[18px] text-acc-plum" />
        </span>
        <div className="min-w-0 text-sm leading-relaxed">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {labels.authority}
          </p>
          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{authority.name}</p>
          <div className="mt-1 text-zinc-600 dark:text-zinc-400">
            {authority.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>{authority.phone}</p>
          </div>
          <a
            href={authority.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-zellige transition-opacity hover:opacity-80"
          >
            {authority.url.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>
    </div>
  );
}

function Blocks({
  blocks,
  accent,
  labels,
}: {
  blocks: LegalBlock[];
  accent: LegalAccent;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "h":
            return (
              <h3
                key={i}
                className="pt-2 text-[15px] font-semibold text-zinc-900 dark:text-zinc-50"
              >
                {fillLegalTokens(block.x)}
              </h3>
            );

          case "p":
            return (
              <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {fillLegalTokens(block.x)}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="space-y-2.5">
                {block.x.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className={cn("mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)}
                      aria-hidden="true"
                    />
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {fillLegalTokens(item)}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "defs":
            return (
              <dl key={i} className="space-y-2.5">
                {block.x.map((row, j) => (
                  <div
                    key={j}
                    className="rounded-xl bg-card p-3.5 shadow-[0_1px_6px_rgb(0_0_0/0.04)] dark:bg-foreground/[0.05] dark:shadow-none"
                  >
                    <dt
                      className={cn("text-[13px] font-semibold uppercase tracking-wide", accent.text)}
                    >
                      {fillLegalTokens(row.k)}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {fillLegalTokens(row.v)}
                    </dd>
                  </div>
                ))}
              </dl>
            );

          case "table":
            return (
              <div key={i} className="-mx-1 overflow-x-auto px-1 py-1">
                <table className="w-full min-w-[38rem] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className={accent.tint}>
                      {block.head.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className={cn(
                            "px-3.5 py-2.5 font-semibold first:rounded-l-xl last:rounded-r-xl",
                            accent.text
                          )}
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr
                        key={j}
                        className="border-b border-zinc-100 last:border-0 dark:border-border"
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={cn(
                              "px-3.5 py-3 align-top leading-relaxed",
                              k === 0
                                ? "font-semibold text-zinc-900 dark:text-zinc-50"
                                : "text-zinc-600 dark:text-zinc-400"
                            )}
                          >
                            {fillLegalTokens(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "note":
            return (
              <div key={i} className={cn("rounded-2xl p-4 sm:p-5", accent.tint)}>
                <p className={cn("text-sm font-medium leading-relaxed", accent.text)}>
                  {fillLegalTokens(block.x)}
                </p>
              </div>
            );

          case "controller":
            return <ControllerCard key={i} labels={labels} />;

          case "authority":
            return <AuthorityCard key={i} labels={labels} />;

          default:
            return null;
        }
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- shell */

export function LegalDocument({
  namespace,
  version,
  effective,
  accents,
  sibling,
}: {
  /** i18n namespace holding title, subtitle, ui.* and sections[]. */
  namespace: string;
  version: string;
  effective: string;
  /** Optional per-section icon and hue, keyed by section id. */
  accents?: Record<string, LegalAccent>;
  sibling: { href: string; label: string };
}) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as LegalSection[];

  const [selected, setSelected] = useState(sections[0]?.id ?? "");
  const [showAll, setShowAll] = useState(false);

  const labels = useMemo(
    () => ({
      contents: t("ui.contents"),
      section: t("ui.section"),
      of: t("ui.of"),
      readAll: t("ui.readAll"),
      readOne: t("ui.readOne"),
      print: t("ui.print"),
      previous: t("ui.previous"),
      next: t("ui.next"),
      version: t("ui.version"),
      effective: t("ui.effective"),
      authority: t("ui.authority"),
      questionsTitle: t("ui.questionsTitle"),
      questionsBody: t("ui.questionsBody"),
      writeUs: t("ui.writeUs"),
    }),
    [t]
  );

  const accentFor = (id: string, index: number): LegalAccent => {
    const explicit = accents?.[id];
    if (explicit) return explicit;
    const fallback = FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length];
    return { icon: SquareStack, ...fallback };
  };

  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === selected)
  );

  const goTo = (id: string) => {
    setSelected(id);
    setShowAll(false);
    if (typeof window !== "undefined" && window.scrollY > 420) {
      document.getElementById("legal-body")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const effectiveDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(effective));

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-12 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>

        <p className="rise rise-2 mt-4 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:text-xl">
          {t("subtitle")}
        </p>

        <div className="rise rise-3 mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
              {labels.version}
            </span>{" "}
            {version}
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" aria-hidden="true" />
          <span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
              {labels.effective}
            </span>{" "}
            <time dateTime={effective}>{effectiveDate}</time>
          </span>
        </div>

        <div className="rise rise-4 no-print mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {labels.print}
          </button>
          <Link
            href={sibling.href}
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
          >
            {sibling.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ========== MOBILE SECTION PILLS ========== */}
      <div className="no-print sticky top-14 z-30 bg-background py-3 shadow-[0_12px_16px_-12px_rgb(0_0_0/0.06)] sm:top-16 lg:hidden">
        <div className="hide-scrollbar-mobile overflow-x-auto px-4 sm:px-6">
          <div className="flex min-w-max items-center gap-1.5">
            {sections.map((section, index) => {
              const accent = accentFor(section.id, index);
              const active = !showAll && selected === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => goTo(section.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                    active
                      ? cn(accent.tint, accent.text, "dark:ring-1 dark:ring-border")
                      : "bg-card text-zinc-600 shadow-sm dark:bg-foreground/[0.075] dark:text-zinc-400 dark:shadow-none"
                  )}
                >
                  <span className="text-xs tabular-nums opacity-60">{index + 1}</span>
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== DOCUMENT ========== */}
      <section
        id="legal-body"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 lg:pt-4 2xl:max-w-[96rem] 2xl:px-12"
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 2xl:gap-12">
          {/* Contents rail: filters the document down to one section at a time */}
          <aside className="no-print hidden lg:col-span-4 lg:block">
            <nav className="sticky top-24" aria-label={labels.contents}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className="eyebrow">{labels.contents}</p>
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  aria-pressed={showAll}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold transition-colors",
                    showAll
                      ? "text-zellige"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  )}
                >
                  <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {showAll ? labels.readOne : labels.readAll}
                </button>
              </div>

              <div className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto pr-1">
                {sections.map((section, index) => {
                  const accent = accentFor(section.id, index);
                  const active = !showAll && selected === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => goTo(section.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all duration-200",
                        active
                          ? cn(accent.tint, "dark:ring-1 dark:ring-border")
                          : "bg-card shadow-[0_1px_8px_rgb(0_0_0/0.05)] hover:-translate-y-0.5 hover:shadow-md dark:bg-foreground/[0.075] dark:shadow-none dark:hover:bg-foreground/10"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                          active ? "bg-card shadow-sm" : accent.tint
                        )}
                      >
                        <accent.icon className={cn("h-4 w-4", accent.text)} aria-hidden="true" />
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 text-sm font-semibold leading-snug",
                          active ? accent.text : "text-zinc-800 dark:text-zinc-100"
                        )}
                      >
                        {section.title}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          active ? accent.text : "text-zinc-400 dark:text-zinc-500"
                        )}
                      >
                        {index + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* The document itself */}
          <div className="mt-6 lg:col-span-8 lg:mt-0">
            {/* Mobile mirror of the read-all toggle */}
            <div className="no-print mb-4 flex items-center justify-between gap-4 lg:hidden">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {labels.section}{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {activeIndex + 1}
                </span>{" "}
                {labels.of} {sections.length}
              </p>
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                aria-pressed={showAll}
                className="shrink-0 text-sm font-semibold text-zellige hover:underline"
              >
                {showAll ? labels.readOne : labels.readAll}
              </button>
            </div>

            {/*
              Every section stays in the DOM. Inactive ones are hidden on screen
              but printed, so a saved PDF is always the complete document, which
              is what a legal text has to be.
            */}
            {sections.map((section, index) => {
              const accent = accentFor(section.id, index);
              const visible = showAll || selected === section.id;

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className={cn(
                    "scroll-mt-32 print:mb-8 print:block",
                    visible ? "block" : "hidden",
                    showAll && index > 0 && "mt-10 border-t border-zinc-100 pt-10 dark:border-border"
                  )}
                >
                  <header className="mb-5 flex items-start gap-3.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        accent.tint
                      )}
                    >
                      <accent.icon
                        className={cn("h-[18px] w-[18px]", accent.text)}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                        <span className="mr-2 text-sm font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                          {index + 1}
                        </span>
                        {section.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {section.summary}
                      </p>
                    </div>
                  </header>

                  <Blocks blocks={section.blocks} accent={accent} labels={labels} />

                  {/* Sequential reading for anyone who wants the whole text */}
                  {!showAll && (
                    <nav className="no-print mt-8 flex items-center justify-between gap-3 border-t border-zinc-100 pt-5 dark:border-border">
                      {index > 0 ? (
                        <button
                          type="button"
                          onClick={() => goTo(sections[index - 1].id)}
                          aria-label={`${labels.previous}: ${sections[index - 1].title}`}
                          className="group inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                          <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                          <span className="truncate">{sections[index - 1].title}</span>
                        </button>
                      ) : (
                        <span />
                      )}
                      {index < sections.length - 1 && (
                        <button
                          type="button"
                          onClick={() => goTo(sections[index + 1].id)}
                          aria-label={`${labels.next}: ${sections[index + 1].title}`}
                          className="group inline-flex min-w-0 items-center gap-2 text-right text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                          <span className="truncate">{sections[index + 1].title}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}
                    </nav>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* ========== CONTACT ========== */}
        <div className="reveal no-print mt-14 rounded-[2rem] bg-tint-saffron p-8 text-center sm:mt-20 sm:p-10 dark:ring-1 dark:ring-border">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {labels.questionsTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
            {labels.questionsBody}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${LEGAL.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-zinc-900/15 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {labels.writeUs}
            </a>
            <Link
              href={sibling.href}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-card dark:text-zinc-300 dark:hover:bg-foreground/10"
            >
              {sibling.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
