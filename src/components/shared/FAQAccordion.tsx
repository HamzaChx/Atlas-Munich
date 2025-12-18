"use client";

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
  if (!faqs.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen}
      className={cn("w-full text-zinc-900 dark:text-white", className)}
    >
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-b border-zinc-200 dark:border-white/10">
          <AccordionTrigger className="text-left text-zinc-900 dark:text-white hover:no-underline data-[state=open]:text-emerald-600 dark:data-[state=open]:text-emerald-400">
            <span className="pr-4 font-semibold">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-zinc-600 dark:text-zinc-300">
            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {faq.answer}
              </ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
