// ============================================
// rehype-term-lists
//
// Guide authors write checklists as a run of paragraphs that each open with a
// bold term ("**Your passport.** Required for identification."). Rendered as
// plain paragraphs, a screen reader hears no list and a skimming reader sees
// no structure. This plugin turns two or more consecutive bold-led paragraphs
// into a `ul.guide-terms`, one item per paragraph, so the markup says what the
// content already is. A lone bold-led paragraph stays a paragraph.
// ============================================

import type { Element, ElementContent, Root, RootContent } from "hast";

function isBlank(node: RootContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}

/** A <p> whose first meaningful child is <strong>. */
function isTermParagraph(node: RootContent): node is Element {
  if (node.type !== "element" || node.tagName !== "p") return false;
  const first = node.children.find(
    (child) => !(child.type === "text" && child.value.trim() === "")
  );
  return first?.type === "element" && first.tagName === "strong";
}

function toList(paragraphs: Element[]): Element {
  return {
    type: "element",
    tagName: "ul",
    properties: { className: ["guide-terms"] },
    children: paragraphs.map(
      (p): ElementContent => ({ type: "element", tagName: "li", properties: {}, children: p.children })
    ),
  };
}

export function rehypeTermLists() {
  return (tree: Root) => {
    const out: RootContent[] = [];
    let run: Element[] = [];

    const flush = () => {
      if (run.length >= 2) out.push(toList(run));
      else out.push(...run);
      run = [];
    };

    for (const node of tree.children) {
      if (isTermParagraph(node)) {
        run.push(node);
      } else if (isBlank(node) && run.length > 0) {
        // Whitespace between paragraphs inside a run carries nothing.
        continue;
      } else {
        flush();
        out.push(node);
      }
    }
    flush();

    tree.children = out;
  };
}
