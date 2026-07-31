import {
  BookOpen,
  Beef,
  Coffee,
  Croissant,
  Laptop,
  LucideIcon,
  MoonStar,
  Scissors,
  ShoppingBasket,
  Utensils,
} from "lucide-react";

/* The five brand hues, one per place category family */
export type PlaceAccent = "terra" | "saffron" | "green" | "blue" | "plum";

/* One hue per place category, shared by the page filters, the browser and the
   map. `key` lets non-Tailwind consumers (the Leaflet markers) reach the same
   `--acc-*` token, so a colour means the same thing everywhere on the page. */
export interface PlaceAccentStyles {
  key: PlaceAccent;
  /** accent text colour */
  text: string;
  /** solid accent fill, for dots and rails */
  dot: string;
  /** soft surface, for selected rows and the spotlight plate */
  tint: string;
}

const terra: PlaceAccentStyles = {
  key: "terra",
  text: "text-acc-terra",
  dot: "bg-acc-terra",
  tint: "bg-tint-terra",
};
const saffron: PlaceAccentStyles = {
  key: "saffron",
  text: "text-acc-saffron",
  dot: "bg-acc-saffron",
  tint: "bg-tint-saffron",
};
const green: PlaceAccentStyles = {
  key: "green",
  text: "text-acc-green",
  dot: "bg-acc-green",
  tint: "bg-tint-green",
};
const blue: PlaceAccentStyles = {
  key: "blue",
  text: "text-acc-blue",
  dot: "bg-acc-blue",
  tint: "bg-tint-blue",
};
const plum: PlaceAccentStyles = {
  key: "plum",
  text: "text-acc-plum",
  dot: "bg-acc-plum",
  tint: "bg-tint-plum",
};

export const placeAccents: Record<string, PlaceAccentStyles> = {
  restaurant: terra,
  butcher: terra,
  cafe: saffron,
  bakery: saffron,
  grocery: green,
  mosque: green,
  "study-spot": blue,
  barber: blue,
  cowork: plum,
};

export const fallbackAccent: PlaceAccentStyles = {
  key: "green",
  text: "text-zellige",
  dot: "bg-zellige",
  tint: "bg-zellige-soft",
};

/* The glyph a category wears, in the browser index and on its map marker */
export const placeIcons: Record<string, LucideIcon> = {
  restaurant: Utensils,
  butcher: Beef,
  cafe: Coffee,
  bakery: Croissant,
  grocery: ShoppingBasket,
  mosque: MoonStar,
  "study-spot": BookOpen,
  cowork: Laptop,
  barber: Scissors,
};
