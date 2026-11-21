"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/* Base chrome: a solid card circle (no blur), or cream-on-film over the
   homepage video when `tone` is "hero". */
const surface = {
  default:
    "border border-border/60 bg-card text-zinc-600 shadow-sm hover:bg-muted hover:text-zinc-900 focus-visible:ring-zellige/50 dark:text-zinc-300 dark:hover:text-zinc-50",
  hero: "border border-hero-cream/25 bg-hero-cream/10 text-hero-cream hover:bg-hero-cream/20 focus-visible:ring-hero-gold",
};

export function ThemeToggle({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "hero";
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors duration-200 focus-visible:ring-2",
          surface[tone],
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-4.5 w-4.5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors duration-200 focus-visible:ring-2",
        surface[tone],
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Moon
        className={cn(
          "absolute h-4.5 w-4.5 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        )}
      />
      <Sun
        className={cn(
          "absolute h-4.5 w-4.5 transition-all duration-300",
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}
