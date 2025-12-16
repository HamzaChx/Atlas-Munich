"use client";

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
      className={cn("w-full text-white", className)}
    >
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-b border-white/10">
          <AccordionTrigger className="text-left text-white hover:no-underline data-[state=open]:text-emerald-400">
            <span className="pr-4 font-semibold">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-zinc-300">
            <div className="prose prose-sm prose-invert max-w-none text-zinc-300">
              {faq.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
