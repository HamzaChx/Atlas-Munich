"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

interface FaqTopicSheetProps {
  faqs: FAQ[];
  /** Set when arriving from a `#faq-kvr-3`-style deep link, so the matching
      question opens and scrolls into view once this sheet has painted. */
  deepLinkFaqId?: string;
}

export function FaqTopicSheet({ faqs, deepLinkFaqId }: FaqTopicSheetProps) {
  const t = useTranslations("hubs");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<string | undefined>(deepLinkFaqId);

  React.useEffect(() => {
    if (!deepLinkFaqId) return;
    setOpen(deepLinkFaqId);
    const timer = window.setTimeout(() => {
      document
        .getElementById(deepLinkFaqId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [deepLinkFaqId]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("faqSearchPlaceholder")}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("faqNoResults")}
        </p>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className={cn("w-full text-zinc-900 dark:text-zinc-50 space-y-3")}
        >
          {filtered.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              /* The DOM id is what makes `#faq-kvr-3` resolve at all; the
                 item's `value` is internal to Radix and invisible to the
                 browser. scroll-mt clears the sheet's own header when
                 jumped to. */
              id={faq.id}
              className="scroll-mt-6 border border-zinc-200 dark:border-border rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:border-zellige/30 data-[state=open]:shadow-md data-[state=open]:shadow-zinc-200/50 dark:data-[state=open]:shadow-none hover:border-zinc-300 dark:hover:border-input"
            >
              <AccordionTrigger className="text-left text-zinc-900 dark:text-zinc-50 hover:no-underline px-5 py-4 transition-colors duration-200 data-[state=open]:text-zellige [&>svg]:text-zinc-400 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:text-zellige">
                <span className="pr-4 font-semibold text-[15px] leading-relaxed">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-300 px-5 pb-5">
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-zellige prose-a:no-underline hover:prose-a:opacity-80 prose-p:leading-relaxed prose-li:leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
