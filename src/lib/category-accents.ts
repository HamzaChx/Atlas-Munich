import type { CategoryKey } from "@/types";

/**
 * One flat hue per guide category, matching the /guides index, so a topic
 * wears the same colour wherever it appears. Literal class strings, so
 * Tailwind can see every one of them; `line` and `pale` are the raw tokens
 * for CSS that draws.
 */
export interface CategoryAccent {
  tint: string;
  acc: string;
  dot: string;
  line: string;
  /** The raw tint token, the pale partner of `line`. */
  pale: string;
}

const accent = (hue: string): CategoryAccent => ({
  tint: `bg-tint-${hue}`,
  acc: `text-acc-${hue}`,
  dot: `bg-acc-${hue}`,
  line: `var(--acc-${hue})`,
  pale: `var(--tint-${hue})`,
});

/* Spelled out in full below as well: Tailwind only generates classes it can
   find as complete strings in the source.
   bg-tint-terra text-acc-terra bg-acc-terra
   bg-tint-blue text-acc-blue bg-acc-blue
   bg-tint-green text-acc-green bg-acc-green
   bg-tint-plum text-acc-plum bg-acc-plum
   bg-tint-saffron text-acc-saffron bg-acc-saffron
   bg-tint-teal text-acc-teal bg-acc-teal */
export const CATEGORY_ACCENTS: Record<CategoryKey, CategoryAccent> = {
  "rent-housing": accent("terra"),
  "kvr-residence": accent("blue"),
  "university-life": accent("green"),
  career: accent("plum"),
  "useful-apps": accent("saffron"),
  "halal-food": accent("teal"),
};
