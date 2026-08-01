"use client";

/**
 * "Near me": an explicit, two-step opt-in to the browser Geolocation API.
 *
 * GDPR / privacy design:
 * - The browser's native permission prompt is never triggered on load or on
 *   a single click. The first click opens this popover, which states in
 *   plain language what the location is used for, that it stays in the
 *   browser, and that it's never stored — only a second, deliberate "Allow"
 *   click calls the API. That's the informed, specific, freely-given
 *   consent GDPR asks for, layered on top of (not a replacement for) the
 *   browser's own permission gate.
 * - Withdrawing is exactly as easy as granting: one "Turn off" button, no
 *   confirmation dialog, no settings page to hunt through.
 * - There's nothing here about retention because nothing is retained — see
 *   `useGeolocation`.
 */

import { useTranslations } from "next-intl";
import { LocateFixed, Loader2, ShieldCheck, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { GeolocationStatus } from "@/hooks/useGeolocation";

const RADIUS_OPTIONS_KM = [1, 3, 5, 10] as const;

interface LocationControlProps {
  status: GeolocationStatus;
  isSupported: boolean;
  onRequest: () => void;
  onClear: () => void;
  radiusKm: number | null;
  onRadiusChange: (km: number | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationControl({
  status,
  isSupported,
  onRequest,
  onClear,
  radiusKm,
  onRadiusChange,
  open,
  onOpenChange,
}: LocationControlProps) {
  const t = useTranslations("places");
  const active = status === "granted";
  const locating = status === "locating";
  const errorKey =
    status === "denied"
      ? "location.errorDenied"
      : status === "timeout"
        ? "location.errorTimeout"
        : status === "unavailable"
          ? "location.errorUnavailable"
          : status === "error"
            ? "location.errorGeneric"
            : null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          aria-pressed={active}
          disabled={locating}
          className={cn(
            "flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold shadow-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-zellige/50 sm:min-h-0 sm:py-2",
            active
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-card text-zinc-500 hover:text-zinc-900 dark:bg-foreground/[0.075] dark:text-zinc-400 dark:shadow-none dark:hover:text-zinc-50",
            locating && "cursor-wait opacity-70"
          )}
        >
          {locating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LocateFixed className="h-3.5 w-3.5" />
          )}
          {locating ? t("location.locating") : t("location.button")}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 rounded-2xl border-0 bg-card p-4 shadow-[0_12px_40px_rgb(0_0_0/0.14)] ring-1 ring-zinc-900/[0.05] dark:ring-border"
      >
        {active ? (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              {t("location.radiusLabel")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onRadiusChange(null)}
                className={cn(
                  "min-h-9 rounded-lg px-3 text-[13px] font-semibold transition-colors",
                  radiusKm === null
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-foreground/[0.09] dark:text-zinc-400 dark:hover:bg-foreground/[0.14]"
                )}
              >
                {t("location.radiusAny")}
              </button>
              {RADIUS_OPTIONS_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => onRadiusChange(km)}
                  className={cn(
                    "min-h-9 rounded-lg px-3 text-[13px] font-semibold transition-colors",
                    radiusKm === km
                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-foreground/[0.09] dark:text-zinc-400 dark:hover:bg-foreground/[0.14]"
                  )}
                >
                  {t("location.radiusUpTo", { km })}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                onClear();
                onOpenChange(false);
              }}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-1.5 text-center text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 sm:min-h-0 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <X className="h-3.5 w-3.5" />
              {t("location.turnOff")}
            </button>
          </div>
        ) : (
          <div>
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zellige" />
              {t("location.consentDescription")}
            </p>

            {errorKey && (
              <p className="mt-3 rounded-lg bg-acc-terra/10 px-3 py-2 text-[12.5px] leading-relaxed text-acc-terra">
                {t(errorKey)}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={onRequest}
                disabled={!isSupported}
                className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zellige/50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2.5 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {t("location.allow")}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex min-h-11 items-center justify-center rounded-full px-4 text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 sm:min-h-0 sm:py-2.5 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {t("location.notNow")}
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
