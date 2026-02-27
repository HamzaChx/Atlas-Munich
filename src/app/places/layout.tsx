import { Metadata } from "next";

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
    url: "https://atlasmunich.de/places",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halal Food & Community Places in Munich | Atlas Munich",
    description:
      "Discover halal restaurants, mosques, Moroccan butchers, cafés, and study spots in Munich.",
  },
};

export default function PlacesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
