"use client";

// ============================================
// Atlas Munich – chat markdown renderer
//
// Shared by the floating widget and the dedicated chat pages so both speak
// the same typographic language. Elements inherit their size from the bubble,
// which is the only place the two surfaces differ.
//
// Blocks: headings, bullet and numbered lists (nested), fenced code, tables,
// quotes, rules, and a TL;DR card pinned to the end of an answer.
// Inline: bold, italic, code, markdown links, bare URLs, emails, phone and
// mail schemes, and internal Atlas paths like /guides/anmeldung-guide.
// ============================================

import { useCallback, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Inline                                                             */
/* ------------------------------------------------------------------ */

/** Site sections an assistant may reference as a bare path. */
const INTERNAL_ROOTS =
  "guides|places|tools|housing|healthcare|bureaucracy|academic|about|faq|category|privacy|terms";

// Built fresh per call: emphasis is parsed recursively, and a shared stateful
// regex would have its lastIndex clobbered by the nested pass.
const INLINE_SOURCE = [
  "(?<code>`[^`]+`)",
  "(?<bold>\\*\\*.+?\\*\\*|__.+?__)",
  "(?<italic>\\*(?!\\s)[^*]+?\\*)",
  "(?<link>\\[[^\\]]*\\]\\([^)\\s]+\\))",
  "(?<url>(?:https?://|www\\.)[^\\s<>()\\[\\]]+)",
  "(?<email>[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})",
  `(?<pathPre>^|[\\s(])(?<path>/(?:${INTERNAL_ROOTS})(?:/[A-Za-z0-9\\-_]+)*)`,
].join("|");

/**
 * Turn a raw href into something safe to navigate to, or null when it is not
 * a scheme we are willing to render as a link (blocks `javascript:`, `data:`).
 */
function safeHref(raw: string): string | null {
  const url = raw.trim();
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  if (url.startsWith("/")) return url;
  if (/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(url)) return `mailto:${url}`;
  return null;
}

/** Shorten a bare URL for display so it never blows out the bubble width. */
function prettyUrl(raw: string): string {
  const stripped = raw.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return stripped.length > 44 ? `${stripped.slice(0, 42)}…` : stripped;
}

function ChatLink({
  href,
  linkClass,
  children,
}: {
  href: string;
  linkClass: string;
  children: ReactNode;
}) {
  const base = cn(
    "inline-flex items-baseline gap-0.5 font-medium break-words underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current",
    linkClass
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    const Icon = href.startsWith("tel:") ? Phone : Mail;
    return (
      <a href={href} className={base}>
        <Icon className="h-3 w-3 self-center" aria-hidden="true" />
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
      {children}
      <ArrowUpRight className="h-3 w-3 self-center" aria-hidden="true" />
    </a>
  );
}

function parseInline(text: string, linkClass: string, depth = 0): ReactNode[] {
  const pattern = new RegExp(INLINE_SOURCE, "g");
  const result: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const g = match.groups ?? {};
    if (match.index > last) result.push(text.slice(last, match.index));
    last = match.index + match[0].length;

    // Nested emphasis is parsed one level deep, which covers every shape a
    // model realistically emits without risking runaway recursion.
    const inner = (value: string) =>
      depth < 2 ? parseInline(value, linkClass, depth + 1) : value;

    if (g.code) {
      result.push(
        <code
          key={key++}
          className="rounded bg-current/10 px-1 py-0.5 font-mono text-[0.88em] break-words"
        >
          {g.code.slice(1, -1)}
        </code>
      );
    } else if (g.bold) {
      result.push(
        <strong key={key++} className="font-semibold">
          {inner(g.bold.slice(2, -2))}
        </strong>
      );
    } else if (g.italic) {
      result.push(
        <em key={key++} className="italic">
          {inner(g.italic.slice(1, -1))}
        </em>
      );
    } else if (g.link) {
      const parts = g.link.match(/^\[([^\]]*)\]\(([^)\s]+)\)$/);
      const label = parts?.[1] ?? "";
      const href = parts ? safeHref(parts[2]) : null;
      if (href) {
        result.push(
          <ChatLink key={key++} href={href} linkClass={linkClass}>
            {label ? inner(label) : prettyUrl(href)}
          </ChatLink>
        );
      } else {
        result.push(label || g.link);
      }
    } else if (g.url) {
      // Sentence punctuation that trails a bare URL is not part of it.
      const trimmed = g.url.replace(/[.,;:!?)\]}'"]+$/, "");
      last = match.index + trimmed.length;
      const href = safeHref(trimmed);
      if (href) {
        result.push(
          <ChatLink key={key++} href={href} linkClass={linkClass}>
            {prettyUrl(trimmed)}
          </ChatLink>
        );
      } else {
        result.push(trimmed);
      }
    } else if (g.email) {
      result.push(
        <ChatLink key={key++} href={`mailto:${g.email}`} linkClass={linkClass}>
          {g.email}
        </ChatLink>
      );
    } else if (g.path) {
      if (g.pathPre) result.push(g.pathPre);
      result.push(
        <ChatLink key={key++} href={g.path} linkClass={linkClass}>
          {g.path}
        </ChatLink>
      );
    }

    // A bare URL may have given punctuation back to the sentence, so scanning
    // always resumes from what we actually consumed.
    pattern.lastIndex = last;
  }

  if (last < text.length) result.push(text.slice(last));
  return result.length > 0 ? result : [text];
}

/* ------------------------------------------------------------------ */
/*  Code block                                                         */
/* ------------------------------------------------------------------ */

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-black/[0.07] bg-white/70 dark:border-border dark:bg-black/20">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-3 py-1.5 dark:border-border/80">
        <span className="text-[0.72em] font-semibold tracking-[0.1em] text-zinc-500 uppercase dark:text-zinc-400">
          {lang || "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.75em] font-medium text-zinc-500 transition-colors hover:bg-black/[0.04] hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-foreground/10 dark:hover:text-zinc-200"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5">
        <code className="font-mono text-[0.85em] leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Blocks                                                             */
/* ------------------------------------------------------------------ */

interface ListItem {
  content: string;
  indent: number;
  ordered: boolean;
  marker: string;
}

const BULLET_RE = /^([-*+•])\s+(.*)$/;
const ORDERED_RE = /^(\d{1,2})[.)]\s+(.*)$/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const RULE_RE = /^(?:-{3,}|\*{3,}|_{3,})$/;
const QUOTE_RE = /^>\s?(.*)$/;
const TABLE_DIVIDER_RE = /^\|?[\s:-]*-[\s|:-]*\|?$/;

/** Renders one nesting level of a list, recursing into deeper indents. */
function renderList(items: ListItem[], linkClass: string, keyPrefix: string): ReactNode {
  const baseIndent = items[0].indent;
  const ordered = items[0].ordered;
  const groups: { item: ListItem; children: ListItem[] }[] = [];

  for (const item of items) {
    if (item.indent <= baseIndent || groups.length === 0) {
      groups.push({ item, children: [] });
    } else {
      groups[groups.length - 1].children.push(item);
    }
  }

  const Wrapper = ordered ? "ol" : "ul";

  return (
    <Wrapper key={keyPrefix} className="my-1.5 space-y-1.5">
      {groups.map(({ item, children }, i) => (
        <li key={i} className="flex items-start gap-2 leading-relaxed">
          {ordered ? (
            <span className="mt-[0.1em] inline-flex h-[1.35em] w-[1.35em] flex-shrink-0 items-center justify-center rounded-full bg-current/10 text-[0.78em] font-bold tabular-nums">
              {item.marker}
            </span>
          ) : (
            <span
              className="mt-[0.55em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-30"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1">
            {parseInline(item.content, linkClass)}
            {children.length > 0 && renderList(children, linkClass, `${keyPrefix}-${i}`)}
          </div>
        </li>
      ))}
    </Wrapper>
  );
}

function renderTable(rows: string[], linkClass: string, key: string): ReactNode {
  const cells = rows.map((row) =>
    row
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim())
  );
  const [head, ...body] = cells;

  return (
    <div key={key} className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.92em]">
        <thead>
          <tr className="border-b border-current/15">
            {head.map((cell, i) => (
              <th key={i} className="px-2 py-1.5 font-semibold">
                {parseInline(cell, linkClass)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-current/[0.08] last:border-0">
              {row.map((cell, c) => (
                <td key={c} className="px-2 py-1.5 align-top">
                  {parseInline(cell, linkClass)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlocks(text: string, linkClass: string): ReactNode[] {
  const lines = text.split("\n");
  const out: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();

    // Fenced code, closed or still streaming in.
    const fence = trimmed.match(/^```\s*([A-Za-z0-9+#-]*)\s*$/);
    if (fence) {
      const lang = fence[1];
      const buffer: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1; // consume the closing fence
      out.push(<CodeBlock key={key++} code={buffer.join("\n")} lang={lang} />);
      continue;
    }

    if (trimmed === "") {
      i += 1;
      continue;
    }

    if (RULE_RE.test(trimmed)) {
      out.push(<hr key={key++} className="my-3 border-0 border-t border-current/15" />);
      i += 1;
      continue;
    }

    const heading = trimmed.match(HEADING_RE);
    if (heading) {
      const level = heading[1].length;
      out.push(
        <p
          key={key++}
          className={cn(
            "font-display mt-3 mb-1 font-bold tracking-tight first:mt-0",
            level === 1 ? "text-[1.15em]" : level === 2 ? "text-[1.08em]" : "text-[1em]"
          )}
        >
          {parseInline(heading[2], linkClass)}
        </p>
      );
      i += 1;
      continue;
    }

    // Table: a header row plus a divider row.
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      TABLE_DIVIDER_RE.test(lines[i + 1].trim()) &&
      lines[i + 1].includes("-")
    ) {
      const rows = [trimmed];
      i += 2;
      while (i < lines.length && lines[i].trim().includes("|") && lines[i].trim() !== "") {
        rows.push(lines[i].trim());
        i += 1;
      }
      out.push(renderTable(rows, linkClass, `t-${key++}`));
      continue;
    }

    if (QUOTE_RE.test(trimmed)) {
      const quoted: string[] = [];
      while (i < lines.length && QUOTE_RE.test(lines[i].trim())) {
        quoted.push(lines[i].trim().match(QUOTE_RE)![1]);
        i += 1;
      }
      out.push(
        <blockquote
          key={key++}
          className="my-2 border-l-2 border-current/25 pl-3 leading-relaxed opacity-90"
        >
          {parseInline(quoted.join(" "), linkClass)}
        </blockquote>
      );
      continue;
    }

    // Lists, including indented sub-items.
    if (BULLET_RE.test(trimmed) || ORDERED_RE.test(trimmed)) {
      const items: ListItem[] = [];
      while (i < lines.length) {
        const current = lines[i];
        const currentTrimmed = current.trim();
        const bullet = currentTrimmed.match(BULLET_RE);
        const ordered = currentTrimmed.match(ORDERED_RE);
        if (!bullet && !ordered) break;
        items.push({
          content: bullet ? bullet[2] : ordered![2],
          indent: current.length - current.trimStart().length,
          ordered: Boolean(ordered),
          marker: ordered ? ordered[1] : "",
        });
        i += 1;
      }
      out.push(renderList(items, linkClass, `l-${key++}`));
      continue;
    }

    // Paragraph: consecutive plain lines keep their soft breaks.
    const paragraph: string[] = [];
    while (i < lines.length) {
      const currentTrimmed = lines[i].trim();
      if (
        currentTrimmed === "" ||
        currentTrimmed.startsWith("```") ||
        RULE_RE.test(currentTrimmed) ||
        HEADING_RE.test(currentTrimmed) ||
        QUOTE_RE.test(currentTrimmed) ||
        BULLET_RE.test(currentTrimmed) ||
        ORDERED_RE.test(currentTrimmed)
      ) {
        break;
      }
      paragraph.push(currentTrimmed);
      i += 1;
    }
    out.push(
      <p key={key++} className="my-1 leading-relaxed">
        {paragraph.map((l, n) => (
          <span key={n}>
            {n > 0 && <br />}
            {parseInline(l, linkClass)}
          </span>
        ))}
      </p>
    );
  }

  return out;
}

/* ------------------------------------------------------------------ */
/*  TL;DR                                                              */
/* ------------------------------------------------------------------ */

// Matches every shape a model reaches for: "**TL;DR:**", "**TL;DR**:",
// "### TL;DR", "TLDR -", with or without the colon inside the bold markers.
const TLDR_RE = /^\s*(?:#{1,6}\s*)?(?:\*\*|__)?\s*TL;?\s*DR\s*:?\s*(?:\*\*|__)?\s*[:\-–]?\s*(.*)$/i;

/** Splits the closing TL;DR off the body so it can be rendered as a card. */
function splitTldr(text: string): { body: string; tldr: string | null } {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const match = lines[i].match(TLDR_RE);
    if (!match) continue;
    // Guard against a mid-answer mention: the card only makes sense when the
    // marker introduces the tail of the message.
    const rest = [match[1], ...lines.slice(i + 1)].join("\n").trim();
    const body = lines.slice(0, i).join("\n").trimEnd();
    if (rest === "" || body === "") return { body: text, tldr: null };
    return { body, tldr: rest };
  }
  return { body: text, tldr: null };
}

/* ------------------------------------------------------------------ */
/*  Streaming                                                          */
/* ------------------------------------------------------------------ */

/**
 * Half-typed markdown looks like noise. While a message streams we close
 * dangling emphasis and drop links that have not finished arriving, so text
 * settles into its final shape instead of flashing raw syntax.
 */
function stabilizeStream(text: string): string {
  const lines = text.split("\n");
  const openFence = (text.match(/^```/gm)?.length ?? 0) % 2 === 1;
  if (openFence) return text;

  let lastIndex = lines.length - 1;
  while (lastIndex > 0 && lines[lastIndex].trim() === "") lastIndex -= 1;

  let line = lines[lastIndex];
  line = line.replace(/\[[^\]]*$/, "").replace(/\[[^\]]*\]\([^)]*$/, "");
  if ((line.match(/`/g)?.length ?? 0) % 2 === 1) line = line.replace(/`[^`]*$/, "");
  if ((line.match(/\*\*/g)?.length ?? 0) % 2 === 1) line = `${line}**`;

  lines[lastIndex] = line;
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Entry point                                                        */
/* ------------------------------------------------------------------ */

export function ChatMarkdown({
  text,
  linkClass,
  streaming = false,
}: {
  text: string;
  /** Text colour class for links, e.g. `text-acc-blue` */
  linkClass: string;
  /** True while the message is still being written, softens partial syntax */
  streaming?: boolean;
}) {
  const source = streaming ? stabilizeStream(text) : text;
  const { body, tldr } = splitTldr(source);

  return (
    <div className="space-y-0.5">
      {renderBlocks(body, linkClass)}
      {tldr && (
        <div className="mt-3 rounded-xl border border-black/[0.06] bg-white/60 px-3 py-2 dark:border-border dark:bg-foreground/[0.08]">
          <p
            className={cn(
              "mb-0.5 text-[0.72em] font-bold tracking-[0.12em] uppercase",
              linkClass
            )}
          >
            TL;DR
          </p>
          <div className="leading-relaxed">{renderBlocks(tldr, linkClass)}</div>
        </div>
      )}
    </div>
  );
}
