"use client";

// ============================================
// Atlas Munich – bottom sheet
//
// A sheet is a page navigation we don't have to make: it opens over the
// current view, and the phone's back gesture dismisses it for free. Built on
// Vaul so drag-to-dismiss and scroll locking behave the way a native sheet
// does rather than the way a repositioned modal does.
// ============================================

import * as React from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";

const BottomSheet = Drawer.Root;
const BottomSheetTrigger = Drawer.Trigger;
const BottomSheetClose = Drawer.Close;

function BottomSheetContent({
  className,
  children,
  /** Rendered as the sheet's accessible name; visually hidden when `hideTitle` */
  title,
  description,
  hideTitle = false,
  ...props
}: React.ComponentProps<typeof Drawer.Content> & {
  title: string;
  description?: string;
  hideTitle?: boolean;
}) {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-[70] bg-zinc-900/40 dark:bg-zinc-950/60" />
      <Drawer.Content
        data-slot="bottom-sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[71] mt-24 flex max-h-[92dvh] flex-col rounded-t-[1.75rem] bg-card outline-none",
          "shadow-[0_-8px_40px_-12px_rgb(0_0_0/0.25)] ring-1 ring-border dark:shadow-none",
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />

        {/* Collapses to nothing when the header is hidden, so a sheet whose
            content carries its own heading doesn't open with a dead band. */}
        <div className={cn(!hideTitle && "px-5 pt-4")}>
          {hideTitle ? (
            <Drawer.Title className="sr-only">{title}</Drawer.Title>
          ) : (
            <Drawer.Title className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </Drawer.Title>
          )}
          {description ? (
            <Drawer.Description className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </Drawer.Description>
          ) : (
            // Radix warns without one, and an empty node is cheaper than
            // inventing copy for sheets that don't need a subtitle.
            <Drawer.Description className="sr-only">{title}</Drawer.Description>
          )}
        </div>

        {/* `overscroll-contain` keeps a scrolled-to-the-end sheet from handing
            the gesture to the page behind it. */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          {children}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  );
}

export { BottomSheet, BottomSheetTrigger, BottomSheetClose, BottomSheetContent };
