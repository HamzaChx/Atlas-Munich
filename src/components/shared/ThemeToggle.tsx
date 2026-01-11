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
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          "border border-white/10 bg-white/5 text-zinc-400",
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
        isDark
          ? "border border-white/10 bg-white/5 text-zinc-400 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"
          : "border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600",
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
