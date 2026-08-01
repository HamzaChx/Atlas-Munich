# Data pipeline: growing the halal places directory legally

We used to seed `src/data/places.ts` partly from a scrape of joinhalal.
Those entries have been removed (the commented-out block at the bottom of
the file is kept only as a "do not re-add without going through this
pipeline" record - not something to uncomment).

Going forward, new places come from two independent, openly-licensed
sources instead:

1. **OpenStreetMap** for the place itself (name, address, coordinates,
   contact info). OSM is licensed under the ODbL - reuse and redistribution
   are explicitly allowed, provided we credit "© OpenStreetMap contributors"
   wherever the data is shown. Germany has strong OSM coverage, and
   contributors tag halal businesses themselves via `diet:halal=yes|only`.
2. **Google Places API** for `rating` / `reviewCount`. Instead of scraping
   those numbers off Google Maps, we fetch them through the official API,
   which comes with its own (manageable) rules: don't cache place data
   longer than 30 days without refreshing, and show "Powered by Google"
   attribution next to any UI that displays it.

## Usage

```bash
# 1. Pull new halal-tagged candidates from OSM (skips anything that already
#    matches an existing or previously-removed places.ts entry by address).
python3 scripts/fetch_osm_halal_places.py
# -> scripts/data/osm-halal-munich.json

# 2. Optionally enrich with real ratings (requires your own API key - never
#    commit it). Safe to re-run; a local cache avoids re-billing API calls
#    for entries fetched within the last 30 days.
export GOOGLE_PLACES_API_KEY=your-key-here
python3 scripts/enrich_google_ratings.py
# -> scripts/data/osm-halal-munich.enriched.json

# 3. Manually review the output and hand-merge the entries you want into
#    src/data/places.ts. This step stays manual on purpose: category
#    assignment, district names, and description wording all need a human
#    pass before something goes live - that's the "slowly" in "slowly grow".
```

`scripts/data/` is gitignored except for this README - the raw/enriched
JSON files are working output, not source of truth. `places.ts` is the
source of truth once you've merged something in.

## Attribution

Anywhere the site displays OSM-sourced place data (not just the map tiles,
which are already credited in `PlacesMapCanvas`), add a short
"© OpenStreetMap contributors" note. Anywhere it displays a Google-sourced
`rating`/`reviewCount`, add "Powered by Google" nearby. Both currently live
as a single line on `/places` - see `attribution` in `messages/*.json`.
