"use client";

// ============================================
// Atlas Munich – FAQ topic grid
//
// FAQAccordion used to flatten every question for a hub into one accordion,
// which is fine at six questions and unusable at sixteen — the studies hub's
// thirteen kvr-residence questions and three university-life ones landed in
// the same unbroken column. This groups them by the categoryKey the data
// already carries (see src/lib/faq-topics.ts) into topic cards, and moves
// the actual questions into a sheet with its own search box, so a reader
// with one specific question never has to scroll past a dozen others to
// find it.
// ============================================

import * as React from "react";
import { useTranslations } from "next-intl";

import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { groupFaqsByTopic, type FaqTopicKey } from "@/lib/faq-topics";
import { ZELLIGE_MOTIF_MASK, motifAngle } from "./zellige-motif";
import { FaqTopicSheet } from "./FaqTopicSheet";
import type { FAQ } from "@/types";
import type { Hub } from "@/data/hubs";

interface FaqTopicGridProps {
  faqs: FAQ[];
  hub: Hub;
  className?: string;
}

export function FaqTopicGrid({ faqs, hub, className }: FaqTopicGridProps) {
  const t = useTranslations("categories");
  const tHubs = useTranslations("hubs");
  const groups = React.useMemo(() => groupFaqsByTopic(faqs), [faqs]);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  /* Separate from `sheetOpen` on purpose: this stays pointed at the last
     opened topic through the close animation instead of clearing to null,
     so BottomSheetContent's subtree stays mounted across opens/closes (only
     `open` toggles) rather than being torn down mid-animation — the same
     shape PlacesBrowser's `selected`/`sheetOpen` pair already uses. */
  const [displayedKey, setDisplayedKey] = React.useState<FaqTopicKey | null>(null);
  const [deepLinkFaqId, setDeepLinkFaqId] = React.useState<string | undefined>(undefined);

  /* Deep links from the old /faq page arrive as `#faq-kvr-3`. The fragment
     never reaches the server, so nothing upstream can route it: opening the
     right topic's sheet has to happen here, once mounted. */
  React.useEffect(() => {
    const target = window.location.hash.slice(1);
    const faq = faqs.find((f) => f.id === target);
    if (!faq) return;
    setDisplayedKey(faq.categoryKey ?? "general");
    setDeepLinkFaqId(target);
    setSheetOpen(true);
  }, [faqs]);

  if (!faqs.length) return null;

  const activeGroup = groups.find((g) => g.topic.key === displayedKey);
  const topicLabel = (key: FaqTopicKey) =>
    key === "general" ? tHubs("faqGeneralTopic") : t(`${key}.title`);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {groups.map(({ topic, faqs: topicFaqs }) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.key}
              type="button"
              onClick={() => {
                setDeepLinkFaqId(undefined);
                setDisplayedKey(topic.key);
                setSheetOpen(true);
              }}
              className={cn(
                "group relative overflow-hidden rounded-[1.75rem] p-4 text-left outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-5",
                "ring-1 ring-zinc-900/[0.05] dark:ring-border",
                "hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgb(0_0_0/0.22)] dark:hover:shadow-none dark:hover:ring-input",
                "focus-visible:ring-2 focus-visible:ring-zellige/50",
                hub.tint
              )}
            >
              {/* The zellige rosette, tinted with the hub's own accent and
                  rotated per topic so a row of cards reads as hand-cut tiles
                  rather than one shape stamped out three times. */}
              <span
                aria-hidden="true"
                className={cn(
                  "zellige-motif pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-[0.16] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 dark:opacity-[0.22]",
                  hub.acc
                )}
                style={
                  {
                    "--motif-rot": `${motifAngle(topic.key)}deg`,
                    maskImage: ZELLIGE_MOTIF_MASK,
                    WebkitMaskImage: ZELLIGE_MOTIF_MASK,
                  } as React.CSSProperties
                }
              />

              <span
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm transition-transform duration-300 group-hover:scale-105",
                  hub.acc
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="relative mt-4 block font-display text-[15px] font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                {topicLabel(topic.key)}
              </span>
              <span className={cn("relative mt-1 block text-xs font-semibold", hub.acc)}>
                {tHubs("faqTopicCount", { count: topicFaqs.length })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Every question and answer stays in the prerendered HTML, hidden
          (not just visually) regardless of whether any sheet is ever
          opened — the same convention the guide tree/graph uses for
          collapsed panels, so search engines index every answer
          independent of this interactive card+sheet layer. */}
      <div hidden>
        {groups.map(({ topic, faqs: topicFaqs }) => (
          <div key={topic.key}>
            <h3>{topicLabel(topic.key)}</h3>
            {topicFaqs.map((faq) => (
              <div key={faq.id}>
                <p>{faq.question}</p>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setDeepLinkFaqId(undefined);
        }}
      >
        {activeGroup && (
          <BottomSheetContent
            title={topicLabel(activeGroup.topic.key)}
            className="sm:mx-auto sm:max-w-lg"
          >
            <FaqTopicSheet faqs={activeGroup.faqs} deepLinkFaqId={deepLinkFaqId} />
          </BottomSheetContent>
        )}
      </BottomSheet>
    </div>
  );
}
