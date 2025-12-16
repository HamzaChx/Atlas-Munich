import { Place, PlaceCategory, PriceLevel } from "@/types";

export const places: Place[] = [
  // === POPULAR HALAL FOOD SPOTS ===
  {
    slug: "tacos-muenchner-freiheit",
    name: "Tacos Münchner Freiheit",
    category: "restaurant",
    address: "Münchner Freiheit 20, 80802 München",
    district: "Schwabing",
    lat: 48.1622,
    lng: 11.5865,
    price: "€",
    tags: ["halal", "tacos", "wraps", "quick-bite", "student-friendly"],
    description: "Located near Münchner Freiheit, this spot serves delicious tacos and wraps with halal-certified ingredients. Perfect for a quick bite or a casual lunch with friends.",
    verified: true,
    rating: 4.4,
    reviewCount: 156,
  },
  {
    slug: "anju-7da-tum",
    name: "Anju 89",
    category: "restaurant",
    address: "Arcisstraße 17, 80333 München",
    district: "Maxvorstadt",
    lat: 48.1492,
    lng: 11.5678,
    price: "€",
    tags: ["halal", "student-friendly", "tum", "asian", "affordable"],
    description: "A popular student-friendly restaurant close to the Technical University of Munich (TUM). Anju serves flavorful halal meals, making it a favorite among international students.",
    verified: true,
    rating: 4.5,
    reviewCount: 203,
  },
  {
    slug: "the-ash-muenchner-freiheit",
    name: "The Ash Münchner Freiheit",
    category: "restaurant",
    address: "Leopoldstraße 82, 80802 München",
    district: "Schwabing",
    lat: 48.1615,
    lng: 11.5858,
    price: "€€€",
    tags: ["halal-on-request", "grilled", "premium", "steakhouse", "dining"],
    description: "A stylish restaurant offering premium grilled dishes. They provide halal meat options upon request, making it a great place for dining out with friends or family.",
    verified: true,
    rating: 4.3,
    reviewCount: 312,
    website: "https://the-ash.com",
  },
  {
    slug: "ctr-messestadt",
    name: "CTR Messestadt",
    category: "restaurant",
    address: "Willy-Brandt-Platz 5, 81829 München",
    district: "Messestadt",
    lat: 48.1325,
    lng: 11.6952,
    price: "€€",
    tags: ["halal", "middle-eastern", "hearty", "authentic", "family-friendly"],
    description: "Located in the Messestadt area, CTR offers a wide variety of halal dishes inspired by Middle Eastern cuisine. A great choice for those looking for hearty and authentic meals.",
    verified: true,
    rating: 4.4,
    reviewCount: 128,
  },
  {
    slug: "caravan-oez",
    name: "Caravan - OEZ",
    category: "restaurant",
    address: "Hanauer Str. 68, 80993 München",
    district: "Moosach",
    lat: 48.1812,
    lng: 11.5235,
    price: "€€",
    tags: ["halal", "kebab", "rice-dishes", "traditional", "modern"],
    description: "Found in the Olympia-Einkaufszentrum (OEZ), Caravan serves flavorful halal options ranging from kebabs to rice dishes, blending traditional recipes with a modern touch.",
    verified: true,
    rating: 4.2,
    reviewCount: 95,
  },
  {
    slug: "argana-moroccan-restaurant",
    name: "Argana - Moroccan Restaurant",
    category: "restaurant",
    address: "Schwanthalerstraße 75, 80336 München",
    district: "Ludwigsvorstadt",
    lat: 48.1352,
    lng: 11.5512,
    price: "€€",
    tags: ["moroccan", "halal", "tajine", "couscous", "pastilla", "authentic"],
    description: "A newly opened Moroccan restaurant in Munich offering authentic Moroccan dishes such as tagines, couscous, and pastilla. Argana is fully halal and beautifully reflects the Moroccan culinary tradition in a cozy setting.",
    verified: true,
    rating: 4.7,
    reviewCount: 67,
    featured: true,
  },

  // === GROCERY STORES ===
  {
    slug: "orient-supermarket",
    name: "Orient Supermarket",
    category: "grocery",
    address: "Goethestraße 53, 80336 München",
    district: "Ludwigsvorstadt",
    lat: 48.1355,
    lng: 11.5595,
    price: "€",
    tags: ["halal", "spices", "moroccan-ingredients", "couscous", "harissa"],
    description: "Large selection of halal products and Middle Eastern/North African ingredients including authentic Moroccan spices.",
    verified: true,
    rating: 4.3,
    reviewCount: 67,
  },
  {
    slug: "turkish-market-hauptbahnhof",
    name: "Turkish Market Hauptbahnhof",
    category: "grocery",
    address: "Bayerstraße 57, 80335 München",
    district: "Hauptbahnhof",
    lat: 48.1398,
    lng: 11.5532,
    price: "€",
    tags: ["halal", "turkish", "fresh-produce", "spices"],
    description: "Fresh produce and halal products conveniently located near the main station.",
    verified: true,
    rating: 4.1,
    reviewCount: 45,
  },
  {
    slug: "al-sham-grocery",
    name: "Al-Sham Grocery",
    category: "grocery",
    address: "Schwanthalerstraße 149, 80339 München",
    district: "Schwanthalerhöhe",
    lat: 48.1302,
    lng: 11.5412,
    price: "€",
    tags: ["halal", "arabic", "syrian", "spices", "fresh-bread"],
    description: "Syrian-owned grocery with fresh Arabic bread and specialty items.",
    verified: true,
    rating: 4.4,
    reviewCount: 52,
  },

  // === HALAL BUTCHERS ===
  {
    slug: "halal-metzger-giesing",
    name: "Halal Metzger Giesing",
    category: "butcher",
    address: "Tegernseer Landstraße 68, 81541 München",
    district: "Giesing",
    lat: 48.1185,
    lng: 11.5785,
    price: "€",
    tags: ["halal", "butcher", "fresh-meat", "lamb", "chicken"],
    description: "Quality halal meat at reasonable prices. Trusted by the community.",
    verified: true,
    rating: 4.5,
    reviewCount: 38,
  },
  {
    slug: "al-amin-butcher",
    name: "Al-Amin Halal Butcher",
    category: "butcher",
    address: "Landwehrstraße 43, 80336 München",
    district: "Ludwigsvorstadt",
    lat: 48.1358,
    lng: 11.5565,
    price: "€",
    tags: ["halal", "butcher", "beef", "lamb", "organic-options"],
    description: "Trusted halal butcher with great selection and friendly service.",
    verified: true,
    rating: 4.6,
    reviewCount: 72,
  },

  // === MOSQUES ===
  {
    slug: "islamisches-zentrum-muenchen",
    name: "Islamisches Zentrum München (IZM)",
    category: "mosque",
    address: "Wallnerstraße 1-5, 80939 München",
    district: "Freimann",
    lat: 48.2012,
    lng: 11.6125,
    tags: ["mosque", "friday-prayer", "islamic-education", "arabic-classes"],
    description: "One of the largest mosques in Munich with regular prayers, community events, and educational programs.",
    website: "https://islamisches-zentrum-muenchen.de",
    verified: true,
  },
  {
    slug: "ditib-sendling",
    name: "DITIB Moschee Sendling",
    category: "mosque",
    address: "Aberlestraße 29, 81371 München",
    district: "Sendling",
    lat: 48.1185,
    lng: 11.5485,
    tags: ["mosque", "turkish", "friday-prayer", "community"],
    description: "Turkish mosque with active community programs and weekly gatherings.",
    verified: true,
  },
  {
    slug: "masjid-al-rahma",
    name: "Masjid Al-Rahma",
    category: "mosque",
    address: "Schleißheimer Str. 456, 80935 München",
    district: "Milbertshofen",
    lat: 48.1892,
    lng: 11.5642,
    tags: ["mosque", "arabic", "friday-prayer", "quran-classes"],
    description: "Active mosque with Quran classes and community events.",
    verified: true,
  },

  // === STUDY SPOTS ===
  {
    slug: "tum-library-stammgelaende",
    name: "TUM Main Library",
    category: "study-spot",
    address: "Arcisstraße 21, 80333 München",
    district: "Maxvorstadt",
    lat: 48.1488,
    lng: 11.5685,
    tags: ["study", "library", "wifi", "quiet", "power-outlets"],
    description: "Large study library with many seats, good WiFi, and power outlets at most desks.",
    verified: true,
  },
  {
    slug: "bayerische-staatsbibliothek",
    name: "Bayerische Staatsbibliothek",
    category: "study-spot",
    address: "Ludwigstraße 16, 80539 München",
    district: "Maxvorstadt",
    lat: 48.1505,
    lng: 11.5815,
    tags: ["study", "library", "historic", "quiet", "large"],
    description: "Magnificent state library with extensive collection and beautiful study spaces.",
    verified: true,
  },
  {
    slug: "lmu-philologicum",
    name: "LMU Philologicum",
    category: "study-spot",
    address: "Ludwigstraße 25, 80539 München",
    district: "Maxvorstadt",
    lat: 48.1495,
    lng: 11.5802,
    tags: ["study", "library", "lmu", "quiet", "modern"],
    description: "Modern LMU library with excellent study environment and natural lighting.",
    verified: true,
  },
  // === UNIVERSITY MENSA INFO ===
  {
    slug: "mensa-info",
    name: "University Mensa (Info)",
    category: "restaurant",
    address: "Various University Locations",
    district: "Maxvorstadt",
    lat: 48.1488,
    lng: 11.5685,
    price: "€",
    tags: ["mensa", "university", "vegan-options", "fish", "student-canteen"],
    description: "Munich's university cafeterias (TUM, LMU, etc.) don't offer certified halal options, but provide daily vegan meals and fish dishes weekly. Vegan and fish meals are clearly labeled in menus.",
    verified: true,
  },
];

// Helper functions
export function getPlaceBySlug(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

export function getPlacesByCategory(category: PlaceCategory): Place[] {
  return places.filter((p) => p.category === category);
}

export function searchPlaces(query: string): Place[] {
  const q = query.toLowerCase();
  return places.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.district?.toLowerCase().includes(q)
  );
}

export function getPlacesByDistrict(district: string): Place[] {
  return places.filter((p) => p.district?.toLowerCase() === district.toLowerCase());
}

export function getFeaturedPlaces(): Place[] {
  return places.filter((p) => p.featured);
}

// Export type for backwards compatibility
export type { Place, PlaceCategory, PriceLevel };
