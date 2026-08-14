import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input component following premium UI principles:
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-emerald-500/20 selection:text-foreground border-zinc-200 dark:border-border bg-white dark:bg-foreground/[0.075] h-10 w-full min-w-0 rounded-lg border px-4 py-2 text-base shadow-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-zinc-300 dark:hover:border-input",
        "focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:shadow-md focus-visible:shadow-emerald-500/5",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
