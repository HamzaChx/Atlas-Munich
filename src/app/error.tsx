"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-tint-terra">
        <AlertTriangle className="h-8 w-8 text-acc-terra" />
      </div>
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {t("errorEyebrow")}
      </span>
      <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        {t("errorTitle")}
      </h1>
      <p className="mt-4 max-w-sm text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("errorDescription")}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          {t("tryAgain")}
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
