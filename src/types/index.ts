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
export type PlaceCategory =
  | "restaurant"
  | "grocery"
  | "mosque"
  | "butcher"
  | "cafe"
  | "bakery"
  | "study-spot"
  | "cowork"
  | "barber";

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
  category: "transport" | "banking" | "communication" | "food" | "learning" | "utilities" | "housing";
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
export interface GuideSectionTranslation {
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface GuideTranslation {
  title: string;
  summary: string;
  sections: GuideSectionTranslation[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  resources?: {
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
