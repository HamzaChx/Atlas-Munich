"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ExternalLink, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Place } from "@/types";

/**
 * PlaceCard component following premium UI principles:
 * - Rule 6: Visual hierarchy obvious in under 1 second
 * - Rule 33: Buttons must look clickable
 * - Rule 34: Hover states required on desktop
 * - Rule 35: Animations 150-300ms
 * - Rule 44: Micro-interactions sparingly but intentionally
 */

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

const categoryColors: Record<string, string> = {
  restaurant: "from-orange-500 to-red-500",
  grocery: "from-green-500 to-emerald-500",
  mosque: "from-teal-500 to-cyan-500",
  butcher: "from-rose-500 to-red-500",
  cafe: "from-amber-500 to-orange-500",
  bakery: "from-yellow-500 to-amber-500",
  "study-spot": "from-blue-500 to-indigo-500",
  cowork: "from-purple-500 to-pink-500",
  barber: "from-slate-500 to-zinc-500",
};

const categoryIcons: Record<string, string> = {
  restaurant: "🍽️",
  grocery: "🛒",
  mosque: "🕌",
  butcher: "🥩",
  cafe: "☕",
  bakery: "🥐",
  "study-spot": "📚",
  cowork: "💻",
  barber: "💈",
};

export function PlaceCard({ place, className }: PlaceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Check if description needs truncation (roughly 100 characters = 2 lines)
  const needsTruncation = place.description && place.description.length > 100;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none flex flex-col",
        className
      )}
    >
      {/* Category gradient bar */}
      <div className={cn("h-1 bg-gradient-to-r", categoryColors[place.category])} />

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryIcons[place.category]}</span>
            <Badge
              variant="secondary"
              className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              {categoryLabels[place.category] || place.category}
            </Badge>
          </div>
          {place.verified && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Title - Rule 6: Visual hierarchy */}
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
          {place.name}
        </h3>

        {/* Description */}
        {place.description && (
          <div className="mt-2.5">
            <p
              className={cn(
                "text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 transition-all duration-200",
                !isExpanded && needsTruncation && "line-clamp-2"
              )}
            >
              {place.description}
            </p>
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-150"
              >
                {isExpanded ? (
                  <>
                    Show less
                    <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Address - Rule 16: Group related elements visually */}
        <div className="mt-4 flex items-start gap-2 text-sm text-zinc-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <span className="line-clamp-1">{place.address}</span>
        </div>

        {/* Rating & Price */}
        <div className="mt-4 flex items-center gap-4">
          {place.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {place.rating}
              </span>
              {place.reviewCount && (
                <span className="text-sm text-zinc-500">({place.reviewCount})</span>
              )}
            </div>
          )}
          {place.price && (
            <span className="text-sm font-semibold text-emerald-400">{place.price}</span>
          )}
        </div>

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {place.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400"
              >
                {tag.replace(/-/g, " ")}
              </span>
            ))}

            {place.tags.length > 4 && (
              <>
                <button
                  onClick={() => setShowAllTags((s) => !s)}
                  title={place.tags.join(", ")}
                  aria-expanded={showAllTags}
                  className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  +{place.tags.length - 4}
                </button>

                {showAllTags && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {place.tags.slice(4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        {tag.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions - Rule 33: Buttons must look clickable */}
        <div className="mt-auto pt-5 flex items-center gap-2">
          {place.website && (
            <Link
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </Link>
          )}
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2"
          >
            <MapPin className="h-3.5 w-3.5" />
            Directions
          </Link>
        </div>
      </div>
    </div>
  );
}
