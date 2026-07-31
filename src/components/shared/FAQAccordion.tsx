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

/**
 * FAQAccordion component following premium UI principles:
 */
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
      className={cn("w-full text-zinc-900 dark:text-zinc-50 space-y-3", className)}
    >
      {faqs.map((faq) => (
        <AccordionItem 
          key={faq.id} 
          value={faq.id} 
          className="border border-zinc-200 dark:border-border rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:border-emerald-200 dark:data-[state=open]:border-emerald-500/30 data-[state=open]:shadow-md data-[state=open]:shadow-zinc-200/50 dark:data-[state=open]:shadow-none hover:border-zinc-300 dark:hover:border-input"
        >
          <AccordionTrigger className="text-left text-zinc-900 dark:text-zinc-50 hover:no-underline px-5 py-4 transition-colors duration-200 data-[state=open]:text-emerald-600 dark:data-[state=open]:text-emerald-400 [&>svg]:text-zinc-400 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:text-emerald-500">
            <span className="pr-4 font-semibold text-[15px] leading-relaxed">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-zinc-600 dark:text-zinc-300 px-5 pb-5">
            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-500 dark:hover:prose-a:text-emerald-300 prose-p:leading-relaxed prose-li:leading-relaxed">
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
