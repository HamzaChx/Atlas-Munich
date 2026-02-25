"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  fromColor: string;
  toColor: string;
}

export function ReadingProgress({ fromColor, toColor }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-zinc-100 dark:bg-zinc-800">
      <div
        className={`h-full bg-gradient-to-r ${fromColor} ${toColor} transition-[width] duration-75`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
