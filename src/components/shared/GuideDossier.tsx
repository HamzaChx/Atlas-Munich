"use client";

// ============================================
// Atlas Munich – "Before you go"
//
// The summary a newcomer needs the night before an appointment: the deadline,
// the cost, where to go, and a checklist of what to bring. It opens the guide
// because that is the panic question; the prose below explains.
//
// The card wears the tint of the persona who owns the topic (see
// lib/guide-personas), so the guide reads as handed over by Dalilah or Riad
// rather than by nobody.
//
// Ticks live in this browser only, keyed by document id so they survive a
// language switch. If storage is blocked they still work for the visit.
// "Print checklist" prints this card alone on one page (see .print-dossier in
// globals.css); an ordinary Ctrl+P still prints the whole guide.
// ============================================

import * as React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Check, Printer } from "lucide-react";

import { cn } from "@/lib/utils";
import { fmtLongDate } from "@/lib/date";
import type { GuideDossier as Dossier } from "@/types";
import type { GuidePersona } from "@/lib/guide-personas";

interface GuideDossierProps {
  slug: string;
  guideTitle: string;
  dossier: Dossier;
  persona: GuidePersona | null;
  verifiedAt: string;
  source: { title: string; url: string };
  className?: string;
}

const storageKey = (slug: string) => `atlas:dossier:${slug}`;

function readTicks(slug: string, validIds: string[]): Set<string> {
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    const ids: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((id): id is string => validIds.includes(id)));
  } catch {
    return new Set();
  }
}

function writeTicks(slug: string, ticks: Set<string>) {
  try {
    if (ticks.size === 0) window.localStorage.removeItem(storageKey(slug));
    else window.localStorage.setItem(storageKey(slug), JSON.stringify([...ticks]));
  } catch {
    // Private mode or blocked storage: ticks last for this visit only.
  }
}

export function GuideDossier({
  slug,
  guideTitle,
  dossier,
  persona,
  verifiedAt,
  source,
  className,
}: GuideDossierProps) {
  const t = useTranslations("guidePage.dossier");
  const locale = useLocale();
  const headingId = `dossier-${slug}`;

  const docIds = React.useMemo(() => dossier.documents.map((d) => d.id), [dossier.documents]);
  const [ticks, setTicks] = React.useState<Set<string>>(() => new Set());

  React.useEffect(() => {
    setTicks(readTicks(slug, docIds));
  }, [slug, docIds]);

  const toggle = (id: string) => {
    setTicks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeTicks(slug, next);
      return next;
    });
  };

  const clear = () => {
    const empty = new Set<string>();
    writeTicks(slug, empty);
    setTicks(empty);
  };

  /* The card is cloned into a top-level print root and everything else is
     hidden, so the sheet prints on one page instead of trailing blank pages
     where the hidden guide would have been. */
  const sheetRef = React.useRef<HTMLElement>(null);
  const printSheet = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const html = document.documentElement;
    const printRoot = document.createElement("div");
    printRoot.id = "dossier-print-root";
    printRoot.appendChild(sheet.cloneNode(true));
    document.body.appendChild(printRoot);
    html.classList.add("print-dossier");
    const cleanup = () => {
      html.classList.remove("print-dossier");
      printRoot.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  const documentsMode = dossier.documentsMode ?? "bring";
  const total = dossier.documents.length;
  const done = ticks.size;
  const allDone = total > 0 && done === total;
  // "If it applies" only means something next to items that are not optional.
  const markOptional = dossier.documents.some((d) => !d.optional);

  // On a tinted plate, secondary text takes the persona's accent or a softened
  // foreground, never a neutral gray.
  const tint = persona?.tint ?? "bg-tint-green";
  const acc = persona?.acc ?? "text-acc-green";
  const accBg = persona?.accBg ?? "bg-acc-green";

  return (
    <section
      ref={sheetRef}
      aria-labelledby={headingId}
      className={cn("dossier-sheet max-w-[42.5rem] rounded-3xl px-5 py-6 sm:px-8 sm:py-8", tint, className)}
    >
      {/* Print only: the sheet has to say what it is once it leaves the screen. */}
      <p className="dossier-print-only mb-1 font-display text-lg font-bold text-foreground">
        {guideTitle}
      </p>

      <div className="flex items-start justify-between gap-4">
        <h2
          id={headingId}
          className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-[1.75rem]"
        >
          {t("title")}
        </h2>
        {persona && (
          <span className="dossier-screen-only flex shrink-0 items-center gap-2.5">
            <span className={cn("text-sm font-semibold", acc)}>{t("from", { name: persona.name })}</span>
            <Image
              src={persona.avatar}
              alt=""
              width={40}
              height={40}
              className={cn("h-10 w-10 rounded-full object-cover ring-2", persona.ring)}
            />
          </span>
        )}
      </div>

      {/* Facts */}
      {dossier.facts.length > 0 && (
        <dl className="mt-6 grid gap-y-4 sm:grid-cols-[8.5rem_1fr] sm:gap-x-6">
          {dossier.facts.map((fact) => (
            <div key={fact.id} className="contents">
              <dt
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.12em] sm:pt-[0.3rem]",
                  acc
                )}
              >
                {t(`kinds.${fact.kind}`)}
              </dt>
              <dd
                className={cn(
                  "-mt-3 text-[1.0625rem] leading-relaxed text-zinc-800 text-pretty dark:text-zinc-100 sm:mt-0",
                  fact.kind === "deadline" && "font-semibold text-zinc-900 dark:text-zinc-50"
                )}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Documents */}
      {total > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {documentsMode === "bring" ? t("documentsBring") : t("documentsPrepare")}
            </h3>
            <p
              aria-live="polite"
              className={cn("dossier-screen-only text-sm font-semibold tabular-nums", acc)}
            >
              {t("progress", { done, total })}
            </p>
          </div>

          <ul className="mt-3 -mx-3">
            {dossier.documents.map((doc) => {
              const checked = ticks.has(doc.id);
              return (
                <li key={doc.id}>
                  <label className="group flex min-h-11 cursor-pointer items-start gap-3.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/55 dark:hover:bg-white/[0.06]">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => toggle(doc.id)}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "dossier-box mt-[0.2rem] flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-md border-2 transition-[background-color,border-color] duration-150 ease-out",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-zellige/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                        checked
                          ? cn(accBg, "border-transparent")
                          : cn(acc, "border-current/45 bg-white/40 dark:bg-transparent")
                      )}
                    >
                      <Check
                        strokeWidth={3}
                        className={cn(
                          "h-3.5 w-3.5 text-background transition-opacity duration-150 ease-out",
                          checked ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "font-semibold text-zinc-900 transition-opacity duration-150 dark:text-zinc-50",
                          checked && "opacity-60"
                        )}
                      >
                        {doc.label}
                      </span>
                      {markOptional && doc.optional && (
                        <span className={cn("ml-2 text-xs font-semibold", acc)}>{t("optional")}</span>
                      )}
                      {doc.note && (
                        <span
                          className={cn(
                            "mt-0.5 block text-[0.9375rem] leading-relaxed text-zinc-700 text-pretty transition-opacity duration-150 dark:text-zinc-300",
                            checked && "opacity-60"
                          )}
                        >
                          {doc.note}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="dossier-screen-only mt-2 flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            {allDone ? (
              <p className={cn("inline-flex items-center gap-1.5 font-semibold", acc)}>
                <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {documentsMode === "bring" ? t("readyBring") : t("readyPrepare")}
              </p>
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300">{t("savedHere")}</p>
            )}
            {done > 0 && (
              <button
                type="button"
                onClick={clear}
                className="font-semibold text-zinc-700 underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current dark:text-zinc-300"
              >
                {t("reset")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="dossier-screen-only mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {dossier.action && (
          <a
            href={dossier.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold text-background transition-opacity hover:opacity-90",
              accBg
            )}
          >
            {dossier.action.title}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
        {total > 0 && (
          <button
            type="button"
            onClick={printSheet}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current",
              acc
            )}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t("print")}
          </button>
        )}
      </div>

      {/* Provenance, on screen and on paper */}
      <p className="mt-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {t("checked", { source: source.title, date: fmtLongDate(verifiedAt, locale) })}
        <span className="dossier-print-only"> ({source.url})</span>
      </p>
    </section>
  );
}
