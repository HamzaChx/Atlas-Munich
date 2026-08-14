import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge component following premium UI principles:
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 [a&]:hover:bg-zinc-800 dark:[a&]:hover:bg-zinc-100",
        secondary:
          "border-zinc-200 dark:border-border bg-zinc-100 dark:bg-foreground/[0.075] text-zinc-700 dark:text-zinc-300 [a&]:hover:bg-zinc-200 dark:[a&]:hover:bg-foreground/10",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-500 focus-visible:ring-red-500/50",
        outline:
          "border-zinc-200 dark:border-input text-zinc-700 dark:text-zinc-300 bg-transparent [a&]:hover:bg-zinc-100 dark:[a&]:hover:bg-foreground/10",
        success:
          "border-transparent bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 [a&]:hover:bg-emerald-200 dark:[a&]:hover:bg-emerald-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
