import { Metadata } from "next";
import { LEGAL } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of Atlas Munich: scope, acceptable use, AI assistant limits, intellectual property, liability under German law and dispute resolution.",
  keywords: [
    "Atlas Munich terms",
    "terms and conditions",
    "Nutzungsbedingungen",
    "AI disclaimer",
    "liability German law",
  ],
  alternates: { canonical: `${LEGAL.site}/terms` },
  openGraph: {
    title: "Terms & Conditions | Atlas Munich",
    description:
      "What you may expect from Atlas Munich, what you may not do with it, and how liability is allocated under German and EU law.",
    type: "website",
    url: `${LEGAL.site}/terms`,
  },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
