export const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/**
 * The first paragraph of a markdown string as plain text, cut at a word
 * boundary. Used for previews, where emphasis markers and link syntax would
 * otherwise show up as literal asterisks and brackets.
 */
export function plainExcerpt(markdown: string, max = 200): string {
  const firstParagraph = markdown.trim().split(/\n\s*\n/)[0] ?? "";
  const plain = firstParagraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}
