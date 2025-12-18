import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import { Place } from "@/types";

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
};

export function PlaceCard({ place, className }: PlaceCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 hover:shadow-md dark:hover:shadow-none",
        className
      )}
    >
      {/* Category gradient bar */}
      <div className={cn("h-1 bg-gradient-to-r", categoryColors[place.category])} />
      
      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryIcons[place.category]}</span>
            <Badge 
              variant="secondary" 
              className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-xs text-zinc-700 dark:text-zinc-300"
            >
              {categoryLabels[place.category] || place.category}
            </Badge>
          </div>
          {place.verified && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {place.name}
        </h3>

        {/* Description */}
        {place.description && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {place.description}
          </p>
        )}

        {/* Address */}
        <div className="mt-3 flex items-start gap-2 text-sm text-zinc-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
          <span className="line-clamp-1">{place.address}</span>
        </div>

        {/* Rating & Price */}
        <div className="mt-4 flex items-center gap-4">
          {place.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">{place.rating}</span>
              {place.reviewCount && (
                <span className="text-sm text-zinc-500">({place.reviewCount})</span>
              )}
            </div>
          )}
          {place.price && (
            <span className="text-sm font-semibold text-emerald-400">
              {place.price}
            </span>
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
              <span className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 text-xs text-zinc-500">
                +{place.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">
          {place.website && (
            <Link
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </Link>
          )}
          {place.lat && place.lng && (
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <MapPin className="h-3.5 w-3.5" />
              Directions
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
