"use client";

/**
 * The directory's second view: an index that drives a spotlight.
 *
 * Instead of a wall of cards, the left column is a dense, scannable index of
 * every result and the right column is one large panel showing whichever place
 * is selected. Only the index scrolls; the spotlight stays put. Below `lg`
 * there is no room for two columns, so the spotlight opens inline under the
 * row that was tapped.
 */

import * as React from "react";
import Link from "next/link";
import { BadgeCheck, Globe, Instagram, MapPin, Navigation, Phone, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

import { Place, PlaceCategory } from "@/types";
import { cn } from "@/lib/utils";
import { fallbackAccent, placeAccents, placeIcons } from "./place-accents";
import { ZELLIGE_MOTIF_MASK } from "./zellige-motif";

interface PlacesBrowserProps {
  places: Place[];
  /** Category order and labels, mirroring the filter bar */
  categories: { key: PlaceCategory; label: string }[];
  className?: string;
}

/** Which slice of the rosette a place shows, stable per slug (no hydration drift). */
function motifAngle(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  return hash;
}

/** "Munich" is the catch-all district in the data, so prefer the street line. */
function locality(place: Place) {
  return place.district && place.district !== "Munich"
    ? place.district
    : place.address.split(",")[0];
}

/** Quiet round icon link, for the spotlight's secondary actions. */
function IconAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Globe;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 outline-none transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zellige/50 dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white"
    >
      <Icon className="h-[18px] w-[18px]" />
    </Link>
  );
}

/** The selected place, shown large. */
function Spotlight({ place, className }: { place: Place; className?: string }) {
  const t = useTranslations("places");
  const accent = placeAccents[place.category] ?? fallbackAccent;
  const Icon = placeIcons[place.category] ?? MapPin;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-zinc-900/[0.05] dark:ring-white/10",
        className
      )}
    >
      {/* Tinted plate, carrying the category and the rosette */}
      <div className={cn("relative overflow-hidden px-6 pb-7 pt-6 sm:px-8", accent.tint)}>
        <span
          aria-hidden="true"
          className={cn(
            /* Mostly inside the plate, so its dense core reads as a rosette,
               with the outer rings running off the edge like a real panel. */
            "zellige-motif pointer-events-none absolute right-0 top-1/2 h-[17rem] w-[17rem] -translate-y-1/2 translate-x-[26%] opacity-[0.18] dark:opacity-[0.26]",
            accent.text
          )}
          style={
            {
              "--motif-rot": `${motifAngle(place.slug)}deg`,
              maskImage: ZELLIGE_MOTIF_MASK,
              WebkitMaskImage: ZELLIGE_MOTIF_MASK,
            } as React.CSSProperties
          }
        />

        <div className="relative flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]",
              accent.text
            )}
          >
            <Icon className="h-4 w-4" />
            {t(`category.${place.category}`)}
          </span>

          {place.rating && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-bold tabular-nums text-zinc-900 shadow-sm dark:text-white">
              <Star className="h-3.5 w-3.5 fill-acc-saffron text-acc-saffron" />
              {place.rating}
              {place.reviewCount && (
                <span className="font-medium text-zinc-400 dark:text-zinc-500">
                  ({place.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>

        <h3 className="font-display relative mt-4 text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem] dark:text-white">
          {place.name}
        </h3>

        <div className="relative mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            {place.address}
          </span>
          {place.price && (
            <span className={cn("font-bold", accent.text)}>{place.price}</span>
          )}
          {place.verified && (
            <span className="flex items-center gap-1 font-semibold text-zellige">
              <BadgeCheck className="h-4 w-4" />
              {t("card.verified")}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-7">
        {place.description && (
          <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
            {place.description}
          </p>
        )}

        {place.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-white/[0.07] dark:text-zinc-400"
              >
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}

        <div className="mt-7 flex items-center gap-2.5">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${place.name} ${place.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("place_directions_click", { place: place.slug, category: place.category })}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zellige/50 sm:flex-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Navigation className="h-4 w-4" />
            {t("card.directions")}
          </Link>
          {place.website && <IconAction href={place.website} label={t("card.website")} icon={Globe} />}
          {place.instagram && (
            <IconAction href={place.instagram} label={t("card.instagram")} icon={Instagram} />
          )}
          {place.phone && (
            <IconAction href={`tel:${place.phone}`} label={t("card.call")} icon={Phone} />
          )}
        </div>
      </div>
    </div>
  );
}

export function PlacesBrowser({ places, categories, className }: PlacesBrowserProps) {
  const t = useTranslations("places");

  /* The index, grouped in filter-bar order; groups collapse away when a filter
     leaves only one category standing. */
  const groups = React.useMemo(() => {
    return categories
      .map((c) => ({ ...c, items: places.filter((p) => p.category === c.key) }))
      .filter((g) => g.items.length > 0);
  }, [categories, places]);

  /* Flat order, so the arrow keys can walk across group boundaries */
  const ordered = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);
  const rowRefs = React.useRef(new Map<string, HTMLButtonElement>());

  /* Filtering can remove whatever was selected; fall back to the first result. */
  const selected =
    ordered.find((p) => p.slug === selectedSlug) ?? (ordered.length > 0 ? ordered[0] : null);

  const move = (delta: number) => {
    if (!selected) return;
    const index = ordered.findIndex((p) => p.slug === selected.slug);
    const next = ordered[Math.min(ordered.length - 1, Math.max(0, index + delta))];
    if (!next) return;
    setSelectedSlug(next.slug);
    rowRefs.current.get(next.slug)?.scrollIntoView({ block: "nearest" });
    rowRefs.current.get(next.slug)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(-ordered.length);
    } else if (event.key === "End") {
      event.preventDefault();
      move(ordered.length);
    }
  };

  if (!selected) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
        className
      )}
    >
      {/* ---------- Index ---------- */}
      <div className="lg:sticky lg:top-[8.75rem] lg:self-start">
        <div className="overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-zinc-900/[0.05] dark:ring-white/10">
          <div className="flex items-baseline justify-between px-5 py-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
              {t("title")}
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-zinc-400 dark:text-zinc-500">
              {ordered.length} {ordered.length === 1 ? t("results.place") : t("results.places")}
            </span>
          </div>

          <div
            role="listbox"
            aria-label={t("title")}
            onKeyDown={onKeyDown}
            className="max-h-[68vh] overflow-y-auto overscroll-contain px-2 pb-3 lg:max-h-[calc(100vh-15rem)]"
          >
            {groups.map((group) => {
              const accent = placeAccents[group.key] ?? fallbackAccent;
              return (
                <div key={group.key}>
                  <div className="sticky top-0 z-10 flex items-center gap-2 bg-card px-3 py-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} aria-hidden="true" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                      {group.label}
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums text-zinc-300 dark:text-zinc-600">
                      {group.items.length}
                    </span>
                  </div>

                  {group.items.map((place) => {
                    const active = place.slug === selected.slug;
                    return (
                      <React.Fragment key={place.slug}>
                        <button
                          ref={(node) => {
                            if (node) rowRefs.current.set(place.slug, node);
                            else rowRefs.current.delete(place.slug);
                          }}
                          type="button"
                          role="option"
                          aria-selected={active}
                          /* Roving tabstop: Tab reaches the list once, the
                             arrow keys walk it from there. */
                          tabIndex={active ? 0 : -1}
                          onClick={() => setSelectedSlug(place.slug)}
                          className={cn(
                            "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zellige/50",
                            active
                              ? accent.tint
                              : "hover:bg-zinc-100/80 dark:hover:bg-white/[0.06]"
                          )}
                        >
                          {active && (
                            <span
                              className={cn(
                                "absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full",
                                accent.dot
                              )}
                              aria-hidden="true"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block truncate text-[13.5px] font-semibold",
                                active
                                  ? accent.text
                                  : "text-zinc-800 dark:text-zinc-100"
                              )}
                            >
                              {place.name}
                            </span>
                            <span className="mt-0.5 block truncate text-[11.5px] text-zinc-400 dark:text-zinc-500">
                              {locality(place)}
                            </span>
                          </span>
                          {place.rating && (
                            <span className="flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold tabular-nums text-zinc-400 dark:text-zinc-500">
                              <Star className="h-3 w-3 fill-acc-saffron text-acc-saffron" />
                              {place.rating}
                            </span>
                          )}
                        </button>

                        {/* No room for two columns on phones: open in place */}
                        {active && (
                          <Spotlight
                            place={place}
                            className="my-2 animate-in fade-in slide-in-from-top-1 duration-300 lg:hidden"
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Spotlight ---------- */}
      <div className="hidden lg:sticky lg:top-[8.75rem] lg:block lg:self-start">
        <Spotlight key={selected.slug} place={selected} className="animate-in fade-in duration-300" />
      </div>
    </div>
  );
}
