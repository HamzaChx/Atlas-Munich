import { AppRecommendation } from "@/types";

export const apps: AppRecommendation[] = [
  // Transport
  {
    slug: "mvgo",
    name: "MVGO",
    description: "Official Munich public transport app. Buy tickets, plan routes, and link your semester ticket.",
    category: "transport",
    platforms: ["ios", "android"],
    iosLink: "https://apps.apple.com/app/mvgo/id1354016075",
    androidLink: "https://play.google.com/store/apps/details?id=de.mvv_muenchen.mvg",
    isFree: true,
    rating: 4.5,
  },
  {
    slug: "db-navigator",
    name: "DB Navigator",
    description: "Deutsche Bahn app for train tickets throughout Germany. Check delays and book tickets.",
    category: "transport",
    platforms: ["ios", "android", "web"],
    iosLink: "https://apps.apple.com/app/db-navigator/id343555245",
    androidLink: "https://play.google.com/store/apps/details?id=de.hafas.android.db",
    webLink: "https://bahn.de",
    isFree: true,
    rating: 4.3,
  },
  {
    slug: "google-maps",
    name: "Google Maps",
    description: "Navigation and real-time transit info. Works great for Munich public transport.",
    category: "transport",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.8,
  },
  {
    slug: "tier-lime",
    name: "TIER / Lime",
    description: "Electric scooter rentals around Munich. Good for short distances.",
    category: "transport",
    platforms: ["ios", "android"],
    isFree: false,
    rating: 4.2,
  },
  
  // Banking
  {
    slug: "n26",
    name: "N26",
    description: "Modern mobile bank. Free basic account, easy to open with just a passport. Very popular with students.",
    category: "banking",
    platforms: ["ios", "android", "web"],
    webLink: "https://n26.com",
    isFree: true,
    rating: 4.5,
  },
  {
    slug: "sparkasse",
    name: "Sparkasse",
    description: "Traditional German bank with many branches. More features and ATMs, but can have monthly fees.",
    category: "banking",
    platforms: ["ios", "android", "web"],
    isFree: false,
    rating: 4.1,
  },
  {
    slug: "paypal",
    name: "PayPal",
    description: "Online payments and money transfers. Widely accepted in Germany.",
    category: "banking",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.4,
  },
  
  // Communication
  {
    slug: "whatsapp",
    name: "WhatsApp",
    description: "Everyone in Germany uses WhatsApp. Essential for staying connected.",
    category: "communication",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.7,
  },
  {
    slug: "deepl",
    name: "DeepL Translator",
    description: "Best translator for German. Much better than Google Translate for nuanced translations.",
    category: "communication",
    platforms: ["ios", "android", "web"],
    webLink: "https://deepl.com",
    isFree: true,
    rating: 4.9,
  },
  {
    slug: "telegram",
    name: "Telegram",
    description: "Popular for groups and channels. Many student and community groups use Telegram.",
    category: "communication",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.6,
  },
  
  // Food
  {
    slug: "lieferando",
    name: "Lieferando",
    description: "Food delivery from many restaurants. Filter by halal options available.",
    category: "food",
    platforms: ["ios", "android", "web"],
    webLink: "https://lieferando.de",
    isFree: true,
    rating: 4.3,
  },
  {
    slug: "too-good-to-go",
    name: "Too Good To Go",
    description: "Rescue unsold food at big discounts. Great for bakery items and meals.",
    category: "food",
    platforms: ["ios", "android"],
    isFree: true,
    rating: 4.7,
  },
  
  // Housing
  {
    slug: "immoscout24",
    name: "ImmobilienScout24",
    description: "Germany's largest apartment search platform. Essential for finding housing.",
    category: "housing",
    platforms: ["ios", "android", "web"],
    webLink: "https://immobilienscout24.de",
    isFree: true,
    rating: 4.2,
  },
  {
    slug: "wg-gesucht",
    name: "WG-Gesucht",
    description: "Best platform for finding shared apartments (WGs). Very active in Munich.",
    category: "housing",
    platforms: ["ios", "android", "web"],
    webLink: "https://wg-gesucht.de",
    isFree: true,
    rating: 4.1,
  },
  
  // Utilities
  {
    slug: "doctolib",
    name: "Doctolib",
    description: "Book doctor appointments online. Many Munich doctors use this platform.",
    category: "utilities",
    platforms: ["ios", "android", "web"],
    webLink: "https://doctolib.de",
    isFree: true,
    rating: 4.6,
  },
  {
    slug: "expatrio",
    name: "Expatrio",
    description: "Blocked account and health insurance for students. Easy online setup.",
    category: "utilities",
    platforms: ["web"],
    webLink: "https://expatrio.com",
    isFree: false,
    rating: 4.4,
  },
  
  // Learning
  {
    slug: "duolingo",
    name: "Duolingo",
    description: "Learn German with gamified lessons. Good for basic vocabulary and consistency.",
    category: "learning",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.7,
  },
  {
    slug: "anki",
    name: "Anki",
    description: "Flashcard app for vocabulary. Great for serious German learners.",
    category: "learning",
    platforms: ["ios", "android", "web"],
    isFree: true,
    rating: 4.5,
  },
];

// Helper functions
export function getAppBySlug(slug: string): AppRecommendation | undefined {
  return apps.find((a) => a.slug === slug);
}

export function getAppsByCategory(category: AppRecommendation["category"]): AppRecommendation[] {
  return apps.filter((a) => a.category === category);
}

export function searchApps(query: string): AppRecommendation[] {
  const q = query.toLowerCase();
  return apps.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
}
