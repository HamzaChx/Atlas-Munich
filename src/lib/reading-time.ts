import type { Guide } from "@/types";

/**
 * Standard adult pace for practical non-fiction.
 *
 * The six figures this replaces were hardcoded in guides.ts and were not
 * measurements of anything: against the actual word counts they implied
 * between 83 and 113 words per minute, roughly a third of real reading speed.
 * The housing guide is 996 words and was advertised as a 12 minute read.
 *
 * Quoting twelve minutes on a page whose job is to get someone to the document
 * they actually need is a reason to leave, and it was not even true.
 */
const WORDS_PER_MINUTE = 240;

/** Markdown emphasis and links are read, their syntax is not. */
function countWords(markdown: string): number {
  return markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_>#~|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Reading time computed from the guide actually handed in, so a localized
 * guide reports its own length.
 *
 * This also fixes a real defect: `readingTime` lived only on the English
 * entries, and French and German prose runs 15 to 20 percent longer, so every
 * translated page advertised the English figure.
 */
export function computeReadingTime(guide: Guide): number {
  const words = guide.sections.reduce((total, section) => {
    const subs = (section.subsections ?? []).reduce(
      (sum, sub) => sum + countWords(sub.content) + countWords(sub.title),
      0
    );
    return total + countWords(section.content) + countWords(section.title) + subs;
  }, countWords(guide.summary));

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Applies the computed figure, so callers can keep reading `guide.readingTime`. */
export function withReadingTime(guide: Guide): Guide {
  return { ...guide, readingTime: computeReadingTime(guide) };
}
