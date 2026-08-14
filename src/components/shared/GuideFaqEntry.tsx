"use client";

// ============================================
// Atlas Munich – guide FAQ entry
//
// A guide's own FAQs (see Guide.faqs) are a different shape of problem than
// a hub's: there is only one topic, this guide, so a grid of topic cards
// (FaqTopicGrid) would produce exactly one tile — a pointless extra click.
// This is that grid's single-topic sibling: one elevated banner, same
// zellige-watermarked visual language, opening the same searchable sheet.
// ============================================

import * as React from "react";
import { useTranslations } from "next-intl";
import { HelpCircle, Search } from "lucide-react";

import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { ZELLIGE_MOTIF_MASK, motifAngle } from "./zellige-motif";
import { FaqTopicSheet } from "./FaqTopicSheet";
import type { FAQ } from "@/types";

interface GuideFaqEntryProps {
  faqs: FAQ[];
  /** Seeds the rosette's rotation; the guide's own slug is stable and unique. */
  guideSlug: string;
  title: string;
  /** Flat `text-*` class, e.g. this guide's category theme colour. */
  accentText: string;
  /** Flat plate background, e.g. "bg-blue-50 dark:bg-blue-500/10". */
  accentPlate: string;
  className?: string;
}

export function GuideFaqEntry({
  faqs,
  guideSlug,
  title,
  accentText,
  accentPlate,
  className,
}: GuideFaqEntryProps) {
  const tGuide = useTranslations("guidePage");
  const [open, setOpen] = React.useState(false);
  const [deepLinkFaqId, setDeepLinkFaqId] = React.useState<string | undefined>(undefined);

  /* Deep links arrive as `#faq-xxx`; the fragment never reaches the server,
     so opening the sheet has to happen here, once mounted. */
  React.useEffect(() => {
    const target = window.location.hash.slice(1);
    if (!target || !faqs.some((f) => f.id === target)) return;
    setDeepLinkFaqId(target);
    setOpen(true);
  }, [faqs]);

  if (!faqs.length) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => {
          setDeepLinkFaqId(undefined);
          setOpen(true);
        }}
        className={cn(
          "group relative flex w-full items-center gap-4 overflow-hidden rounded-[1.75rem] p-5 text-left outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-6",
          "ring-1 ring-zinc-900/[0.05] dark:ring-border",
          "hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgb(0_0_0/0.22)] dark:hover:shadow-none dark:hover:ring-input",
          "focus-visible:ring-2 focus-visible:ring-zellige/50",
          accentPlate
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "zellige-motif pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-[0.14] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 dark:opacity-[0.2]",
            accentText
          )}
          style={
            {
              "--motif-rot": `${motifAngle(guideSlug)}deg`,
              maskImage: ZELLIGE_MOTIF_MASK,
              WebkitMaskImage: ZELLIGE_MOTIF_MASK,
            } as React.CSSProperties
          }
        />

        <span
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm transition-transform duration-300 group-hover:scale-105",
            accentText
          )}
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </span>

        <span className="relative min-w-0 flex-1">
          <span className="block font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
            {title}
          </span>
          <span className={cn("mt-0.5 block text-xs font-semibold", accentText)}>
            {tGuide("faqsAnswered", { count: faqs.length })}
          </span>
        </span>

        <Search
          className="relative h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-zinc-500"
          aria-hidden="true"
        />
      </button>

      {/* Every question and answer stays in the prerendered HTML, hidden
          (not just visually), same convention as FaqTopicGrid, independent
          of the FAQPage JSON-LD this guide page already emits. */}
      <div hidden>
        {faqs.map((faq) => (
          <div key={faq.id}>
            <p>{faq.question}</p>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <BottomSheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setDeepLinkFaqId(undefined);
        }}
      >
        <BottomSheetContent title={title} className="sm:mx-auto sm:max-w-lg">
          <FaqTopicSheet faqs={faqs} deepLinkFaqId={deepLinkFaqId} />
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}
