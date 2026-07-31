import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Guides",
  description:
    "In-depth, community-written guides to life in Munich for Moroccan students and professionals. Housing, KVR, university life, career, and useful apps.",
  keywords: [
    "Munich guides",
    "Munich student guide",
    "how to live in Munich",
    "Moroccan Munich guides",
    "KVR guide Munich",
    "housing guide Munich",
    "university guide Munich TUM LMU",
    "career guide Munich",
    "useful apps Munich",
  ],
  openGraph: {
    title: "All Guides | Atlas Munich",
    description:
      "In-depth, community-written guides to life in Munich for Moroccan students and professionals.",
    type: "website",
    url: "https://atlasmunich.de/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Guides | Atlas Munich",
    description:
      "In-depth, community-written guides to life in Munich for Moroccan students and professionals.",
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
