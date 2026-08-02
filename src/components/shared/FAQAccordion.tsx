"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { FAQ } from "@/types";

interface FAQAccordionProps {
  faqs: FAQ[];
  className?: string;
  defaultOpen?: string;
}

export function FAQAccordion({ faqs, className, defaultOpen }: FAQAccordionProps) {
  const [open, setOpen] = React.useState<string | undefined>(defaultOpen);

  /* Deep links from the old /faq page arrive as `#faq-kvr-3`. The fragment
     never reaches the server, so nothing upstream can route it: opening and
     scrolling to the question has to happen here, once mounted. */
  React.useEffect(() => {
    const target = window.location.hash.slice(1);
    if (!target || !faqs.some((faq) => faq.id === target)) return;

    setOpen(target);
    // After the accordion has painted the open panel, not before.
    const timer = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [faqs]);

  if (!faqs.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className={cn("w-full text-zinc-900 dark:text-zinc-50 space-y-3", className)}
    >
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          /* The DOM id is what makes `#faq-kvr-3` resolve at all; the item's
             `value` is internal to Radix and invisible to the browser.
             scroll-mt clears the fixed header when jumped to. */
          id={faq.id}
          className="scroll-mt-32 border border-zinc-200 dark:border-border rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:border-zellige/30 data-[state=open]:shadow-md data-[state=open]:shadow-zinc-200/50 dark:data-[state=open]:shadow-none hover:border-zinc-300 dark:hover:border-input"
        >
          <AccordionTrigger className="text-left text-zinc-900 dark:text-zinc-50 hover:no-underline px-5 py-4 transition-colors duration-200 data-[state=open]:text-zellige [&>svg]:text-zinc-400 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:text-zellige">
            <span className="pr-4 font-semibold text-[15px] leading-relaxed">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-zinc-600 dark:text-zinc-300 px-5 pb-5">
            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-zellige prose-a:no-underline hover:prose-a:opacity-80 prose-p:leading-relaxed prose-li:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
