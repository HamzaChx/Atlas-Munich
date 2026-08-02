import { Metadata } from "next";
import { places } from "@/data/places";
import type { PlaceCategory } from "@/types";

const BASE_URL = "https://atlasmunich.de";

const SCHEMA_TYPE_BY_CATEGORY: Record<PlaceCategory, string> = {
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  bakery: "Bakery",
  grocery: "GroceryStore",
  butcher: "Store",
  mosque: "PlaceOfWorship",
  "study-spot": "LocalBusiness",
  sport: "SportsActivityLocation",
  leisure: "EntertainmentBusiness",
  park: "Park",
};

export const metadata: Metadata = {
  title: "Halal Food & Community Places in Munich",
  description:
    "Discover halal restaurants, mosques, Moroccan butchers, cafés, and study spots in Munich. Community-verified places with interactive map.",
  keywords: [
    "halal restaurants Munich",
    "halal food Munich",
    "mosque Munich",
    "Moroccan restaurant Munich",
    "halal butcher Munich",
    "Muslim places Munich",
    "study spots Munich",
    "Moroccan community Munich",
    "halal grocery Munich",
  ],
  openGraph: {
    title: "Halal Food & Community Places in Munich | Atlas Munich",
    description:
      "Discover halal restaurants, mosques, Moroccan butchers, cafés, and study spots in Munich. Community-verified places with interactive map.",
    type: "website",
    url: "https://atlasmunich.de/map",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halal Food & Community Places in Munich | Atlas Munich",
    description:
      "Discover halal restaurants, mosques, Moroccan butchers, cafés, and study spots in Munich.",
  },
};

export default function PlacesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": places.map((place) => ({
      "@type": SCHEMA_TYPE_BY_CATEGORY[place.category],
      "@id": `${BASE_URL}/map#${place.slug}`,
      name: place.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: place.address,
        addressLocality: "Munich",
        addressCountry: "DE",
      },
      ...(place.lat && place.lng
        ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } }
        : {}),
      ...(place.phone ? { telephone: place.phone } : {}),
      ...(place.website ? { url: place.website } : {}),
      ...(place.price ? { priceRange: place.price } : {}),
      ...(place.rating && place.reviewCount
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: place.rating,
              reviewCount: place.reviewCount,
            },
          }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
