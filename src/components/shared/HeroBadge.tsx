import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeroBadgeProps {
  icon: LucideIcon;
  text: string;
  color?: "emerald" | "orange" | "blue" | "purple" | "amber";
  className?: string;
}

const colorVariants = {
  emerald: {
    border: "border-emerald-300 dark:border-emerald-500/30",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  orange: {
    border: "border-orange-300 dark:border-orange-500/30",
    bg: "bg-orange-100 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
  },
  blue: {
    border: "border-blue-300 dark:border-blue-500/30",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
  },
  purple: {
    border: "border-purple-300 dark:border-purple-500/30",
    bg: "bg-purple-100 dark:bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
  },
  amber: {
    border: "border-amber-300 dark:border-amber-500/30",
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
  },
};

export function HeroBadge({ icon: Icon, text, color = "emerald", className }: HeroBadgeProps) {
  const variant = colorVariants[color];
  
  return (
    <div
      className={cn(
        "mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5",
        variant.border,
        variant.bg,
        className
      )}
    >
      <Icon className={cn("h-5 w-5", variant.text)} />
      <span className={cn("text-base font-semibold", variant.text)}>{text}</span>
    </div>
  );
}
