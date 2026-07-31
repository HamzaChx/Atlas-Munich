"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { Place } from "@/types";
import { cn } from "@/lib/utils";

interface PlacesMapProps {
  places: Place[];
  /** Plural category names, for the counted legend */
  categoryLabels?: Record<string, string>;
  /** Singular category names, for a single marker's popup */
  categoryNames?: Record<string, string>;
  className?: string;
}

function MapSkeleton({ className }: { className?: string }) {
  const t = useTranslations("places");
  return (
    <div className="overflow-hidden rounded-[2rem] bg-card shadow-[0_2px_24px_rgb(0_0_0/0.08)] dark:shadow-none dark:ring-1 dark:ring-border">
      <div className={cn("flex w-full items-center justify-center bg-muted", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zellige border-t-transparent" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{t("loadingMap")}</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{t("mapNote")}</p>
      </div>
    </div>
  );
}

/* Leaflet touches `window` on import, so the canvas is browser only */
const PlacesMapCanvas = dynamic(() => import("./PlacesMapCanvas"), {
  ssr: false,
  loading: () => <MapSkeleton className="h-[60vh] min-h-[26rem] sm:h-[38rem]" />,
});

export function PlacesMap({ places, categoryLabels, categoryNames, className }: PlacesMapProps) {
  return (
    <PlacesMapCanvas
      places={places}
      categoryLabels={categoryLabels}
      categoryNames={categoryNames}
      className={cn("h-[60vh] min-h-[26rem] sm:h-[38rem]", className)}
    />
  );
}
