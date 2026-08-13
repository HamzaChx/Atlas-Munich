#!/usr/bin/env python3
"""Fetch halal-tagged food places in Munich from OpenStreetMap (Overpass API).

Why OSM: it is a community-mapped, openly licensed (ODbL) dataset. Reuse and
redistribution are explicitly allowed as long as we credit
"(c) OpenStreetMap contributors" wherever the data is shown
(https://www.openstreetmap.org/copyright). This is an independent dataset,
not a mirror of any proprietary directory (e.g. joinhalal) - contributors
tag restaurants/shops with diet:halal=yes|only themselves.

This script only reads publicly queryable tags: diet:halal, cuisine, addr:*,
phone/contact:*, website, opening_hours. It writes a draft JSON file for
human review - nothing here is auto-published to src/data/places.ts.

Usage:
    python3 scripts/fetch_osm_halal_places.py [--output PATH] [--include-existing]

By default, candidates whose street + house number already match an entry
in src/data/places.ts are skipped, so re-running only surfaces new spots.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PLACES_TS = REPO_ROOT / "src" / "data" / "places.ts"
DEFAULT_OUTPUT = REPO_ROOT / "scripts" / "data" / "osm-halal-munich.json"

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
# Munich's official municipality key (Amtlicher Gemeindeschluessel) - stabler
# than matching on the city name string.
MUNICH_AGS = "09162000"

USER_AGENT = "AtlasMunich-DataPipeline/1.0 (+https://atlasmunich.de; contact: chaoukihamza16@gmail.com)"

OVERPASS_QUERY = f"""
[out:json][timeout:90];
area["de:amtlicher_gemeindeschluessel"="{MUNICH_AGS}"]->.searchArea;
(
  nwr["diet:halal"~"^(yes|only)$"](area.searchArea);
);
out center tags;
"""

CATEGORY_BY_TAG = {
    "restaurant": "restaurant",
    "fast_food": "restaurant",
    "cafe": "cafe",
    "supermarket": "grocery",
    "convenience": "grocery",
    "greengrocer": "grocery",
    "bakery": "bakery",
    "butcher": "butcher",
}

KNOWN_CUISINE_TAGS = {
    "turkish",
    "arabic",
    "lebanese",
    "persian",
    "iranian",
    "moroccan",
    "indian",
    "italian",
    "afghan",
    "uyghur",
    "pakistani",
    "kurdish",
    "iraqi",
    "balkan",
    "mediterranean",
    "asian",
    "american",
    "uzbek",
    "kebab",
    "chicken",
    "burger",
    "pizza",
}


def fetch_overpass(query: str) -> dict:
    data = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=data, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"Overpass API error {e.code}: {e.read().decode(errors='replace')[:500]}\n")
        raise


def slugify(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    return slug or "place"


def normalize_street_key(street: str, housenumber: str) -> str:
    key = f"{street} {housenumber}".lower()
    normalized = unicodedata.normalize("NFKD", key).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "", normalized)


def load_existing_keys() -> tuple[set[str], set[str]]:
    """Parse src/data/places.ts (including commented-out blocks) for
    already-known slugs and street+housenumber keys, so we never suggest a
    duplicate of a place that's already listed or was deliberately removed."""
    text = PLACES_TS.read_text(encoding="utf-8")
    slugs = set(re.findall(r'slug:\s*"([^"]+)"', text))

    addr_keys = set()
    for addr in re.findall(r'address:\s*"([^"]+)"', text):
        street_part = addr.split(",")[0].strip()
        m = re.match(r"^(.*?)\s+(\d+\s*[a-zA-Z]?)$", street_part)
        if m:
            addr_keys.add(normalize_street_key(m.group(1), m.group(2)))
        else:
            addr_keys.add(re.sub(r"[^a-z0-9]+", "", street_part.lower()))
    return slugs, addr_keys


def build_tags(tags: dict) -> list[str]:
    result = ["halal"]
    cuisine_raw = tags.get("cuisine", "")
    for token in re.split(r"[;,]", cuisine_raw):
        token = token.strip().lower().replace("_", "-")
        if token in KNOWN_CUISINE_TAGS or (token and token not in result):
            result.append(token)
    if tags.get("diet:halal") == "only":
        result.append("100-percent-halal")
    if tags.get("takeaway") == "yes":
        result.append("takeaway")
    if tags.get("outdoor_seating") == "yes":
        result.append("outdoor-seating")
    if tags.get("delivery") == "yes":
        result.append("delivery")
    # de-dupe while preserving order
    seen = set()
    return [t for t in result if t not in seen and not seen.add(t)]


def normalize_element(el: dict, existing_slugs: set[str]) -> dict | None:
    tags = el.get("tags", {})
    name = tags.get("name")
    street = tags.get("addr:street")
    housenumber = tags.get("addr:housenumber")
    postcode = tags.get("addr:postcode", "")
    city = tags.get("addr:city", "München")

    if not name or not street or not housenumber or not postcode:
        return None  # not enough data to place it on the site responsibly

    osm_category = tags.get("amenity") or tags.get("shop")
    category = CATEGORY_BY_TAG.get(osm_category)
    if category is None:
        return None  # out of scope for the food/grocery directory for now

    lat = el.get("lat") or el.get("center", {}).get("lat")
    lng = el.get("lon") or el.get("center", {}).get("lon")

    base_slug = slugify(name)
    slug = base_slug
    suffix = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    existing_slugs.add(slug)

    website = tags.get("website") or tags.get("contact:website")
    phone = tags.get("phone") or tags.get("contact:phone") or tags.get("contact:mobile")
    instagram = tags.get("contact:instagram")

    cuisine_tokens = [t.strip().lower() for t in tags.get("cuisine", "").split(";")]
    cuisine_label = next((t for t in cuisine_tokens if t in KNOWN_CUISINE_TAGS), None)
    amenity_label = "restaurant" if osm_category == "restaurant" else osm_category.replace("_", " ")
    description = f"{name} is a halal-friendly {amenity_label} in Munich"
    if cuisine_label:
        description += f" serving {cuisine_label} cuisine"
    description += "."

    city_part = f"{postcode} {city}".strip() if postcode else city
    draft = {
        "slug": slug,
        "name": name,
        "category": category,
        "address": f"{street} {housenumber}, {city_part}",
        "district": tags.get("addr:suburb"),
        "lat": round(lat, 5) if lat else None,
        "lng": round(lng, 5) if lng else None,
        "tags": build_tags(tags),
        "description": description,
        "phone": phone,
        "website": website,
        "instagram": (
            instagram
            if instagram and instagram.startswith("http")
            else f"https://www.instagram.com/{instagram.lstrip('@')}"
            if instagram
            else None
        ),
        "openingHours": tags.get("opening_hours"),
        "verified": False,
        "source": "openstreetmap",
        "osm_type": el.get("type"),
        "osm_id": el.get("id"),
    }
    return {k: v for k, v in draft.items() if v is not None}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--include-existing",
        action="store_true",
        help="Don't skip candidates that already look like an existing/removed entry",
    )
    args = parser.parse_args()

    result = fetch_overpass(OVERPASS_QUERY)
    elements = result.get("elements", [])

    existing_slugs, existing_addr_keys = load_existing_keys()
    candidates = []
    skipped = 0
    for el in elements:
        draft = normalize_element(el, existing_slugs)
        if draft is None:
            continue
        street = el["tags"].get("addr:street", "")
        housenumber = el["tags"].get("addr:housenumber", "")
        key = normalize_street_key(street, housenumber)
        if not args.include_existing and key in existing_addr_keys:
            skipped += 1
            continue
        candidates.append(draft)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(candidates, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Fetched {len(elements)} OSM elements tagged diet:halal in Munich.")
    print(f"Skipped {skipped} that match an existing/removed places.ts entry.")
    print(f"Wrote {len(candidates)} new candidates to {args.output}")
    print("Review the file, then hand it to scripts/enrich_google_ratings.py before merging into places.ts.")


if __name__ == "__main__":
    main()
