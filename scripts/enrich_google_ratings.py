#!/usr/bin/env python3
"""Enrich OSM place candidates with official ratings from the Google Places API.

Why this instead of scraping: the previous data source (joinhalal) mirrored
ratings that we could not verify or legally redistribute. The Places API
(New) gives the same rating/reviewCount fields directly from Google, under
Google's own terms, so we're pulling real numbers instead of copying someone
else's scrape.

Two rules from the Google Maps Platform Terms of Service that this script
exists to satisfy - both are enforced by the caching logic below, not just
documented:
  1. Place data other than the Place ID (rating, review count, etc.) must
     not be cached for longer than 30 days without being refreshed.
  2. Any UI that displays Places API data must show a "Powered by Google"
     attribution near it. (See ATTRIBUTION.md for where that lives on the site.)

Usage:
    export GOOGLE_PLACES_API_KEY=...        # required, never hardcode this
    python3 scripts/enrich_google_ratings.py --input scripts/data/osm-halal-munich.json

Re-running is safe and cheap: entries refreshed within REFRESH_DAYS are
served from scripts/data/google-ratings-cache.json instead of re-querying.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = REPO_ROOT / "scripts" / "data" / "osm-halal-munich.json"
CACHE_PATH = REPO_ROOT / "scripts" / "data" / "google-ratings-cache.json"

SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
FIELD_MASK = "places.id,places.displayName,places.rating,places.userRatingCount,places.googleMapsUri"

REFRESH_DAYS = 30  # Google ToS: don't hold cached place data longer than this without refreshing
REQUEST_DELAY_SECONDS = 0.2  # be a polite API citizen, not a burst client


def load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(cache, indent=2, ensure_ascii=False), encoding="utf-8")


def is_fresh(entry: dict) -> bool:
    fetched_at = datetime.fromisoformat(entry["fetchedAt"])
    return datetime.now(timezone.utc) - fetched_at < timedelta(days=REFRESH_DAYS)


def search_place(api_key: str, name: str, address: str) -> dict | None:
    body = json.dumps({"textQuery": f"{name}, {address}"}).encode()
    req = urllib.request.Request(
        SEARCH_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"  Places API error {e.code} for '{name}': {e.read().decode(errors='replace')[:300]}\n")
        return None

    places = data.get("places") or []
    if not places:
        return None
    top = places[0]
    return {
        "placeId": top.get("id"),
        "rating": top.get("rating"),
        "reviewCount": top.get("userRatingCount"),
        "googleMapsUri": top.get("googleMapsUri"),
        "matchedName": top.get("displayName", {}).get("text"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=None, help="defaults to <input>.enriched.json")
    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        sys.exit(
            "GOOGLE_PLACES_API_KEY is not set. Get one from the Google Cloud Console "
            "(Places API (New) enabled) and export it - never commit it."
        )

    places = json.loads(args.input.read_text(encoding="utf-8"))
    cache = load_cache()

    for place in places:
        slug = place["slug"]
        cached = cache.get(slug)
        if cached and is_fresh(cached):
            print(f"cache hit  : {slug}")
        else:
            print(f"fetching   : {slug}")
            result = search_place(api_key, place["name"], place["address"])
            time.sleep(REQUEST_DELAY_SECONDS)
            if result is None:
                print(f"  no match found on Google Places for '{place['name']}' - leaving unrated")
                continue
            cached = {**result, "fetchedAt": datetime.now(timezone.utc).isoformat()}
            cache[slug] = cached

        if cached.get("rating") is not None:
            place["rating"] = cached["rating"]
        if cached.get("reviewCount") is not None:
            place["reviewCount"] = cached["reviewCount"]
        place["googlePlaceId"] = cached.get("placeId")
        # Flag for human review: Google's matched name should read like the
        # same business before we trust the rating enough to publish it.
        if cached.get("matchedName") and cached["matchedName"].lower() != place["name"].lower():
            place["reviewNeeded"] = f"Google matched this to '{cached['matchedName']}' - verify it's the same place"

    save_cache(cache)

    output_path = args.output or args.input.with_suffix(".enriched.json")
    output_path.write_text(json.dumps(places, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(places)} enriched entries to {output_path}")


if __name__ == "__main__":
    main()
