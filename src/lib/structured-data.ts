import type { FAQ } from "@/types";

/**
 * A `FAQPage` block for exactly the questions visible on the page emitting it.
 *
 * Previously one 32-question block sat on `/faq`, a page with no topical
 * authority, while the 19 questions already rendered at the foot of each guide
 * emitted no markup at all. Splitting it across the hubs and the guides matches
 * Google's requirement that the markup mirror what is actually on screen, and
 * puts each cluster on a page that is about that subject.
 */
export function faqPageJsonLd(faqs: FAQ[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
