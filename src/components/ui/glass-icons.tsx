"use client";

import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";

export interface GlassIconsItem {
  icon: ReactElement;
  color: string;
  label: string;
  href: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

// Matches the flag red/green used in the hero's WebThreads (#c52b30 / #227240).
const gradientMapping: Record<string, string> = {
  red: "linear-gradient(hsl(358, 70%, 54%), hsl(350, 68%, 44%))",
  green: "linear-gradient(hsl(142, 55%, 26%), hsl(142, 62%, 15%))",
};

function getBackgroundStyle(color: string) {
  return { background: gradientMapping[color] ?? color };
}

export default function GlassIcons({ items, className }: GlassIconsProps) {
  return (
    <div className={`flex flex-wrap items-start justify-center gap-8 sm:gap-10 ${className ?? ""}`}>
      {items.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className="group relative block h-[4.5em] w-[4.5em] cursor-pointer rounded-[1.25em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50"
          >
            <span
              className="absolute top-0 left-0 block h-full w-full origin-[100%_100%] rotate-[15deg] rounded-[1.25em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
              style={{
                ...getBackgroundStyle(item.color),
                boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
              }}
            />

            <span
              className="absolute top-0 left-0 flex h-full w-full origin-[80%_50%] rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] backdrop-blur-[0.75em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [will-change:transform] group-hover:[transform:translate3d(0,0,2em)]"
              style={{ boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset" }}
            >
              <span
                className="m-auto flex h-[1.5em] w-[1.5em] items-center justify-center text-white [&>svg]:h-full [&>svg]:w-full"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            </span>

            <span className="absolute top-full right-0 left-0 translate-y-0 text-center text-sm leading-[2] whitespace-nowrap text-zinc-900 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:translate-y-[20%] group-hover:opacity-100 dark:text-zinc-50">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
