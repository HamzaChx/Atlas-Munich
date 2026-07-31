"use client";

// ============================================
// Atlas Munich – chat markdown renderer
//
// Shared by the floating widget and the dedicated chat pages so both speak
// the same typographic language. Elements inherit their size from the bubble,
// which is the only place the two surfaces differ.
// ============================================

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function parseInline(text: string, linkClass: string): ReactNode[] {
  const result: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) result.push(text.slice(last, match.index));
    const token = match[0];

    if (token.startsWith("**")) {
      result.push(
        <strong key={key++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        result.push(
          <a
            key={key++}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-0.5 font-medium underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current",
              linkClass
            )}
          >
            {link[1]}
            <ArrowUpRight className="h-3 w-3" />
          </a>
        );
      }
    }
    last = match.index + token.length;
  }

  if (last < text.length) result.push(text.slice(last));
  return result.length > 0 ? result : [text];
}

export function ChatMarkdown({
  text,
  linkClass,
}: {
  text: string;
  /** Text colour class for links, e.g. `text-acc-blue` */
  linkClass: string;
}) {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="my-2 space-y-1.5">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <span
              className="mt-[0.55em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-30"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trimStart();
    const isIndented = line !== trimmed && trimmed.length > 0;

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      flushList();
      const level = trimmed.startsWith("### ") ? 3 : trimmed.startsWith("## ") ? 2 : 1;
      const content = trimmed.replace(/^#{1,3}\s/, "");
      elements.push(
        <p
          key={idx}
          className={cn(
            "mt-3 mb-1 font-display font-bold tracking-tight first:mt-0",
            level === 1 ? "text-[1.15em]" : level === 2 ? "text-[1.08em]" : "text-[1em]"
          )}
        >
          {parseInline(content, linkClass)}
        </p>
      );
    } else if (trimmed.match(/^[-*•]\s/)) {
      listItems.push(parseInline(trimmed.replace(/^[-*•]\s/, ""), linkClass));
    } else if (trimmed.match(/^\d+\.\s/)) {
      flushList();
      elements.push(
        <p key={idx} className="my-1.5 leading-relaxed">
          <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[0.8em] font-bold tabular-nums">
            {trimmed.match(/^\d+/)?.[0]}
          </span>
          {parseInline(trimmed.replace(/^\d+\.\s/, ""), linkClass)}
        </p>
      );
    } else if (isIndented) {
      flushList();
      elements.push(
        <p key={idx} className="mt-2 mb-0.5 font-semibold">
          {parseInline(trimmed, linkClass)}
        </p>
      );
    } else if (trimmed === "") {
      flushList();
      elements.push(<div key={idx} className="h-1.5" />);
    } else {
      flushList();
      elements.push(
        <p key={idx} className="my-0.5 leading-relaxed">
          {parseInline(line, linkClass)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}
