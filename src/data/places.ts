export type Place = {
  slug: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  price?: "€" | "€€" | "€€€";
  tags?: string[];
  link?: string;
};

export const places: Place[] = [
  {
    slug: "placeholder-moroccan-bistro",
    name: "Placeholder Moroccan Bistro",
    address: "Altstadt, 80331 München",
    lat: 48.1374, lng: 11.5755,
    price: "€€",
    tags: ["moroccan", "halal", "tajine", "couscous"],
    link: "#"
  },
  {
    slug: "placeholder-halwa-shop",
    name: "Placeholder Halwa & Tea",
    address: "Maxvorstadt, 80333 München",
    lat: 48.1500, lng: 11.5670,
    price: "€",
    tags: ["sweets", "mint tea", "bakery"],
    link: "#"
  },
  {
    slug: "placeholder-halal-grocery",
    name: "Placeholder Halal Grocery",
    address: "Schwabing, 80802 München",
    lat: 48.1650, lng: 11.5860,
    price: "€",
    tags: ["grocery", "spices", "halal"],
    link: "#"
  },
  {
    slug: "placeholder-mosque",
    name: "Placeholder Mosque",
    address: "Sendling, 81371 München",
    lat: 48.1185, lng: 11.5485,
    price: "€",
    tags: ["mosque", "community"],
    link: "#"
  },
  {
    slug: "placeholder-library",
    name: "Placeholder Study Library",
    address: "Garching Forschungszentrum, 85748",
    lat: 48.2620, lng: 11.6690,
    price: "€",
    tags: ["study", "wifi", "quiet"],
    link: "#"
  },
  {
    slug: "placeholder-cowork",
    name: "Placeholder Cowork Space",
    address: "Haidhausen, 81667 München",
    lat: 48.1340, lng: 11.5980,
    price: "€€",
    tags: ["cowork", "power outlets", "coffee"],
    link: "#"
  }
];
