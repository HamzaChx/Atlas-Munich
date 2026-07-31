"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
          "border border-border/50 bg-card/80 backdrop-blur-md text-zinc-600 dark:text-zinc-300 shadow-sm",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
        "border border-border/50 bg-card/80 backdrop-blur-md text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-muted hover:text-zinc-900 dark:hover:text-zinc-50",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Moon
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        )}
      />
      <Sun
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}
