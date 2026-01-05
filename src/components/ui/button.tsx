import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variants following premium UI principles:
 * - Rule 33: Buttons must look clickable without explanation
 * - Rule 34: Hover states are required on desktop
 * - Rule 35: Animations should be fast (150-300ms)
 * - Rule 38: Disable buttons instead of showing errors later
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:shadow-md",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-md focus-visible:ring-red-500/50 dark:bg-red-600 dark:hover:bg-red-500",
        outline:
          "border border-zinc-200 dark:border-white/15 bg-white dark:bg-transparent text-zinc-900 dark:text-white shadow-sm hover:bg-zinc-50 dark:hover:bg-white/5 hover:border-zinc-300 dark:hover:border-white/25",
        secondary:
          "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm hover:bg-zinc-200 dark:hover:bg-white/15",
        ghost:
          "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white",
        link: "text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline",
        primary: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/30",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 text-base has-[>svg]:px-4",
        xl: "h-14 rounded-xl px-8 text-base font-semibold has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
