"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MapPin, Star, ExternalLink, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Place } from "@/types";
import { useTranslations } from "next-intl";

interface PlaceCardProps {
  place: Place;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  restaurant: "Restaurant",
  grocery: "Grocery Store",
  mosque: "Mosque",
  butcher: "Butcher",
  cafe: "Café",
  bakery: "Bakery",
  "study-spot": "Study Spot",
  cowork: "Coworking",
  barber: "Barber Shop",
};

/* The five brand hues, one per place category family */
export type PlaceAccent = "terra" | "saffron" | "green" | "blue" | "plum";

/* One hue per place category, shared with the page filters and the map.
   `key` lets non-Tailwind consumers (the Leaflet markers) reach the same
   `--acc-*` token, so a colour means the same thing everywhere on the page. */
export const placeAccents: Record<string, { key: PlaceAccent; text: string; dot: string }> = {
  restaurant: { key: "terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  butcher: { key: "terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  cafe: { key: "saffron", text: "text-acc-saffron", dot: "bg-acc-saffron" },
  bakery: { key: "saffron", text: "text-acc-saffron", dot: "bg-acc-saffron" },
  grocery: { key: "green", text: "text-acc-green", dot: "bg-acc-green" },
  mosque: { key: "green", text: "text-acc-green", dot: "bg-acc-green" },
  "study-spot": { key: "blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  barber: { key: "blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  cowork: { key: "plum", text: "text-acc-plum", dot: "bg-acc-plum" },
};

export function PlaceCard({ place, className }: PlaceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tPlaces = useTranslations("places");

  const needsTruncation = place.description && place.description.length > 100;
  const accent = placeAccents[place.category] ?? { text: "text-zellige", dot: "bg-zellige" };

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl bg-card p-5 shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0_0_0/0.12)] dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:bg-zinc-800/60 sm:p-6",
        className
      )}
    >
      {/* Category + verified */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em]",
            accent.text
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} aria-hidden="true" />
          {categoryLabels[place.category] || place.category}
        </span>
        {place.verified && (
          <span className="flex items-center gap-1 text-xs font-medium text-zellige">
            <BadgeCheck className="h-3.5 w-3.5" />
            {tPlaces("card.verified") ?? "Verified"}
          </span>
        )}
      </div>

      <h3 className="font-display mt-3 text-lg font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
        {place.name}
      </h3>

      {/* Rating, price, address in one quiet meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {place.rating && (
          <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
            <Star className="h-3.5 w-3.5 fill-acc-saffron text-acc-saffron" />
            {place.rating}
            {place.reviewCount && (
              <span className="font-normal text-zinc-400 dark:text-zinc-500">
                ({place.reviewCount})
              </span>
            )}
          </span>
        )}
        {place.price && <span className="font-semibold text-zellige">{place.price}</span>}
        <span className="flex min-w-0 items-center gap-1 text-zinc-400 dark:text-zinc-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{place.address}</span>
        </span>
      </div>

      {/* Description */}
      {place.description && (
        <div className="mt-3">
          <p
            className={cn(
              "text-sm leading-relaxed text-zinc-500 dark:text-zinc-400",
              !isExpanded && needsTruncation && "line-clamp-2"
            )}
          >
            {place.description}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zellige dark:text-zinc-500"
            >
              {isExpanded ? (
                <>
                  {tPlaces("card.showLess") ?? "Show less"}
                  <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  {tPlaces("card.readMore") ?? "Read more"}
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Tags, first three only */}
      {place.tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {place.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
          {place.tags.length > 3 && (
            <span
              title={place.tags.slice(3).join(", ")}
              className="text-xs text-zinc-400 dark:text-zinc-500"
            >
              +{place.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-5">
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <MapPin className="h-3.5 w-3.5" />
          {tPlaces("card.directions") ?? "Directions"}
        </Link>
        {place.website && (
          <Link
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {tPlaces("card.website") ?? "Website"}
          </Link>
        )}
      </div>
    </article>
  );
}
