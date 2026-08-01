"use client";

// ============================================
// Atlas Munich – install banner
//
// A slide-in card above the tab bar rather than an interstitial: it waits for
// the second visit, so a first-time reader is never interrupted, and it never
// covers the tabs.
// ============================================

import * as React from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";

import {
  dismissInstall,
  isInstallDismissed,
  recordVisit,
  useInstallPrompt,
} from "./use-install-prompt";

export function InstallBanner() {
  const t = useTranslations("nav");
  const { canInstall, promptInstall } = useInstallPrompt();
  const [eligible, setEligible] = React.useState(false);

  React.useEffect(() => {
    // localStorage is browser-only, so eligibility can only be settled here.
    setEligible(recordVisit() >= 2 && !isInstallDismissed());
  }, []);

  if (!eligible || !canInstall) return null;

  return (
    <div
      className="pwa-banner-enter fixed inset-x-3 bottom-[4.75rem] z-[59] rounded-2xl bg-card p-4 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.3)] ring-1 ring-border md:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0)" }}
      role="complementary"
    >
      <button
        type="button"
        onClick={() => {
          dismissInstall();
          setEligible(false);
        }}
        aria-label={t("notNow")}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 active:bg-zinc-100 dark:active:bg-foreground/[0.075]"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="pr-8 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("installApp")}</p>
      <p className="mt-1 pr-8 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("installDesc")}
      </p>
      <button
        type="button"
        onClick={async () => {
          await promptInstall();
          dismissInstall();
          setEligible(false);
        }}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t("install")}
      </button>
    </div>
  );
}
