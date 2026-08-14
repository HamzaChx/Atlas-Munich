"use client";

import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCallback, useRef, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

export interface Contributor {
  name: string;
  role: string;
  photo: string;
  url: string;
  tint: string;
  photoAccent: string;
  /** object-position Y, 0 = top of source photo, 100 = bottom */
  focalY?: number;
}

const MAX_TILT_DEG = 5;

/**
 * Pointer-tracked tilt + glow, restrained on purpose: a few degrees of
 * rotation and a soft radial highlight, not a holographic foil effect.
 * Transform writes go straight to the DOM (no React state) so the hover
 * loop never re-renders, matching the perf approach in scroll-expand.tsx.
 */
export function ContributorCard({
  name,
  role,
  photo,
  url,
  tint,
  photoAccent,
  focalY = 22,
}: Contributor) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1000px) rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
      card.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group block"
      aria-label={`${name} — ${role}`}
    >
      <div
        ref={cardRef}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_2px_20px_rgb(0_0_0/0.06)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:shadow-[0_20px_45px_rgb(0_0_0/0.18)] dark:shadow-none dark:ring-1 dark:ring-border"
      >
        <div className={cn("absolute inset-0", tint)} />
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(min-width: 640px) 320px, 50vw"
          style={{ objectPosition: `50% ${focalY}%` }}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgb(255 255 255 / 0.16), transparent 60%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pb-5 pt-14">
          <p className="font-display text-lg font-bold text-white">{name}</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className={cn("text-xs font-semibold uppercase tracking-wide", photoAccent)}>
              {role}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white/25">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function OpenContributorCard({
  youLabel,
  joinLabel,
}: {
  youLabel: string;
  joinLabel: string;
}) {
  return (
    <a
      href="https://github.com/HamzaChx/Atlas-Munich"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 px-4 text-center transition-colors duration-300 hover:border-zellige hover:bg-zellige-soft dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zellige dark:hover:bg-zellige/10"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zellige-soft text-zellige transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 dark:bg-zellige/15">
        <Plus className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
          {youLabel}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{joinLabel}</p>
      </div>
    </a>
  );
}
