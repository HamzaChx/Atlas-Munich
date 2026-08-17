// ============================================
// Core Data Types for Atlas Munich
// ============================================

// Category identifiers matching the content model
export type CategoryKey =
  | "rent-housing"
  | "kvr-residence"
  | "university-life"
  | "halal-food"
  | "career"
  | "useful-apps";

// Tags for filtering content
export type ContentTag =
  | "newcomer"
  | "urgent"
  | "documents"
  | "tips"
  | "official"
  | "community-verified"
  | "budget-friendly"
  | "time-sensitive";

// ============================================
// Category
// ============================================
export interface Category {
  id: number;
  key: CategoryKey;
  title: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind gradient classes
  image?: string;
}

// ============================================
// Journey hub
//
// The four steps the top bar tells as a story. Every category, guide and
// helper belongs to exactly one of them, so a reader picks a stage of their
// move rather than picking a kind of page.
// ============================================
export type HubKey = "map" | "career" | "community" | "guide";

// ============================================
// Guide / Article
// ============================================
export interface GuideSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  categoryKey: CategoryKey;
  tags: ContentTag[];
  author?: string;
  lastUpdated: string; // ISO date
  readingTime: number; // minutes
  featured?: boolean;
  sections: GuideSection[];
  faqs?: FAQ[];
  resources?: ResourceLink[];
  relatedSlugs?: string[];
}

// ============================================
// FAQ
// ============================================
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryKey?: CategoryKey;
  /**
   * Which journey hub answers this question. Set explicitly rather than
   * derived from `categoryKey`, because the food and first-week questions
   * have no category at all and still have to land somewhere.
   */
  hub?: HubKey;
  tags?: ContentTag[];
}

// ============================================
// Resource Link
// ============================================
export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type: "official" | "community" | "tool" | "document" | "video";
  description?: string;
}

// ============================================
// Place (for halal food, mosques, etc.)
// ============================================
/* `cowork` and `barber` were declared but never had a single entry, so their
   filter pills could never appear. Replaced by the three leisure families,
   which answer the question the map could not: what is there to actually do. */
export type PlaceCategory =
  | "restaurant"
  | "grocery"
  | "mosque"
  | "butcher"
  | "cafe"
  | "bakery"
  | "study-spot"
  | "sport"
  | "leisure"
  | "park";

export type PriceLevel = "€" | "€€" | "€€€";

export interface Place {
  slug: string;
  name: string;
  category: PlaceCategory;
  address: string;
  district?: string;
  lat?: number;
  lng?: number;
  price?: PriceLevel;
  tags: string[];
  description?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  instagram?: string;
  /** Distance from the visitor, computed client-side once they share their
      location. Never persisted — absent unless "near me" is active. */
  distanceKm?: number;
}

// ============================================
// Event
// ============================================
export type EventCategory = "career" | "community" | "education" | "cultural" | "networking";

export interface Event {
  slug: string;
  title: string;
  description?: string;
  start: string; // ISO date
  end?: string; // ISO date
  location: string;
  address?: string;
  category: EventCategory;
  organizer?: string;
  link?: string;
  image?: string;
  isFree?: boolean;
  isOnline?: boolean;
}

// ============================================
// App / Tool Recommendation
// ============================================
export interface AppRecommendation {
  slug: string;
  name: string;
  description: string;
  category:
    | "transport"
    | "banking"
    | "communication"
    | "food"
    | "learning"
    | "utilities"
    | "housing";
  platforms: ("ios" | "android" | "web")[];
  icon?: string;
  iosLink?: string;
  androidLink?: string;
  webLink?: string;
  isFree?: boolean;
  rating?: number;
}

// ============================================
// Guide Translation (locale overlay)
// ============================================
// Every entry carries the `id` of the English entry it translates. The overlay
// is matched on that id, never on array position, so reordering or inserting a
// section in guides.ts can no longer slide the French and German prose onto the
// wrong heading.
export interface GuideSectionTranslation {
  id: string;
  title: string;
  content: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface GuideTranslation {
  title: string;
  summary: string;
  sections: GuideSectionTranslation[];
  faqs?: {
    id: string;
    question: string;
    answer: string;
  }[];
  resources?: {
    id: string;
    title: string;
    description?: string;
  }[];
}

// ============================================
// Search Result
// ============================================
export interface SearchResult {
  type: "guide" | "faq" | "place" | "event" | "app";
  title: string;
  description: string;
  url: string;
  categoryKey?: CategoryKey;
  tags?: string[];
  score?: number;
}

// ============================================
// Navigation
// ============================================
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// ============================================
// Breadcrumb
// ============================================
export interface Breadcrumb {
  label: string;
  href?: string;
}

// ============================================
// Testimonial
// ============================================
export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}
