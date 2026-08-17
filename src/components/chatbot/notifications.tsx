"use client";

// ============================================
// Atlas Munich – chat notifications
//
// Flat plaster cards that sit under the site header, shared by the floating
// widget and the dedicated chat pages.
// ============================================

import { X, ArrowRightLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TOAST_SHELL =
  "fixed right-3 top-[4.5rem] z-[60] w-[min(22rem,calc(100vw-1.5rem))] sm:right-5 sm:top-20";
const TOAST_CARD =
  "flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.28)] ring-1 ring-border dark:ring-border";

export function SuccessToast({
  chatbotName,
  onDismiss,
}: {
  chatbotName: string;
  onDismiss: () => void;
}) {
  return (
    <div className={cn(TOAST_SHELL, "animate-in fade-in-0 slide-in-from-top-2 duration-300")}>
      <div className={TOAST_CARD}>
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-tint-green text-acc-green">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Connected to</p>
          <p className="truncate font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {chatbotName}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-muted hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function HandoffToast({
  message,
  onDismiss,
  className,
}: {
  message: string;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <div className={cn("animate-in fade-in-0 slide-in-from-top-2 duration-300", className)}>
      <div className={TOAST_CARD}>
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-tint-saffron text-acc-saffron">
          <ArrowRightLeft className="h-4 w-4" />
        </span>
        <p className="flex-1 text-sm leading-snug text-zinc-700 dark:text-zinc-200">{message}</p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-muted hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
