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
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
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
