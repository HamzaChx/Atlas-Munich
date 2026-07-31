import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeroBadgeProps {
  icon: LucideIcon;
  text: string;
  /** Kept for call-site compatibility; all badges share the brand treatment. */
  color?: string;
  className?: string;
}

export function HeroBadge({ icon: Icon, text, className }: HeroBadgeProps) {
  return (
    <div
      className={cn(
        "mb-8 inline-flex items-center gap-2 rounded-full border border-zellige/25 bg-zellige-soft px-5 py-2.5 text-zellige",
        className
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-base font-semibold">{text}</span>
    </div>
  );
}
