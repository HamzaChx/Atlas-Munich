"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-zinc-900 antialiased dark:text-zinc-50">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Atlas Munich hit a snag.
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            The app failed to load. Reloading usually fixes it.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
