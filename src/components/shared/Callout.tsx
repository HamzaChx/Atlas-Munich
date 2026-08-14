import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, LucideIcon } from "lucide-react";

type CalloutVariant = "info" | "warning" | "success" | "error";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { icon: LucideIcon; classes: string }> = {
  info: {
    icon: Info,
    classes:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  },
  success: {
    icon: CheckCircle2,
    classes:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  error: {
    icon: AlertCircle,
    classes:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300",
  },
};

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const { icon: Icon, classes } = variantStyles[variant];

  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4", classes, className)} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
