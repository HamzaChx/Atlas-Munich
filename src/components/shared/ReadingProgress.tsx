"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

interface ReadingProgressProps {
  fromColor: string;
  toColor: string;
  /** When set, fires a one-time analytics event per read-depth milestone. */
  guideSlug?: string;
}

const MILESTONES = [50, 100];

export function ReadingProgress({ fromColor, toColor, guideSlug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const firedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);

      if (!guideSlug) return;
      for (const milestone of MILESTONES) {
        if (pct >= milestone && !firedMilestonesRef.current.has(milestone)) {
          firedMilestonesRef.current.add(milestone);
          track("guide_read_depth", { guide: guideSlug, milestone });
        }
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [guideSlug]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-zinc-100 dark:bg-zinc-800">
      <div
        className={`h-full bg-gradient-to-r ${fromColor} ${toColor} transition-[width] duration-75`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
