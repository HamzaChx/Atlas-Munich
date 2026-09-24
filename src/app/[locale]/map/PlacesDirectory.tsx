import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { placeAccents } from "@/components/shared/place-accents";
import { cn } from "@/lib/utils";
import type { Place, PlaceCategory } from "@/types";

/* Same order as the explorer's filter pills, with their message keys. */
const CATEGORY_LABEL_KEYS: [PlaceCategory, string][] = [
  ["restaurant", "restaurants"],
  ["cafe", "cafes"],
  ["grocery", "groceries"],
  ["bakery", "bakeries"],
  ["butcher", "butchers"],
  ["mosque", "mosques"],
  ["study-spot", "studySpots"],
  ["sport", "sport"],
  ["leisure", "leisure"],
  ["park", "parks"],
];

/**
 * Every place as plain server-rendered HTML, at the foot of /map.
 *
 * The interactive explorer above it opens on a Leaflet map, which is
 * client-only, so without this a crawler (or anyone without JavaScript)
 * would find no place names on the page at all. Groups are native <details>,
 * collapsed so the page stays short, but their contents are in the markup.
 *
 * Each entry's `id` is the place slug, which is what the structured data in
 * layout.tsx already points at (`/map#<slug>`).
 */
export async function PlacesDirectory({ places }: { places: Place[] }) {
  const t = await getTranslations("places");

  const groups = CATEGORY_LABEL_KEYS.map(([category, labelKey]) => ({
    category,
    label: t(`filters.${labelKey}`),
    places: places
      .filter((place) => place.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.places.length > 0);

  return (
    <section
      aria-labelledby="places-directory"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12"
    >
      <div className="rounded-[2rem] bg-card p-5 shadow-[0_2px_20px_rgb(0_0_0/0.06)] sm:p-8 dark:shadow-none dark:ring-1 dark:ring-border">
        <h2
          id="places-directory"
          className="font-display text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50"
        >
          {t("directory.title")}
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("directory.subtitle", { count: places.length })}
        </p>

        <div className="mt-5 divide-y divide-border">
          {groups.map((group) => (
            <details key={group.category} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-2 py-3 outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden="true"
                  className={cn("h-2 w-2 shrink-0 rounded-full", placeAccents[group.category].dot)}
                />
                <span className="flex-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
                  {group.label}
                </span>
                <span className="tabular-nums text-sm text-zinc-400">{group.places.length}</span>
                <span
                  aria-hidden="true"
                  className="text-xl leading-none text-zinc-400 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <ul className="grid gap-x-8 gap-y-3 px-2 pb-4 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                {group.places.map((place) => (
                  <li key={place.slug} id={place.slug} className="min-w-0 scroll-mt-40">
                    <Link
                      href={`/map?category=${place.category}&q=${encodeURIComponent(place.name)}`}
                      className="text-sm font-semibold text-zinc-800 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-zellige/50 dark:text-zinc-200"
                    >
                      {place.name}
                    </Link>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {[place.district, place.address].filter(Boolean).join(" · ")}
                    </p>
                    {place.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {place.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
