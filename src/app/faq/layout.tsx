import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to the most common questions about living in Munich as a Moroccan student or professional. Housing, KVR, university, work permits, and more.",
  keywords: [
    "Munich FAQ",
    "Munich student questions",
    "KVR questions Munich",
    "housing FAQ Munich",
    "Anmeldung questions",
    "residence permit questions",
    "Moroccan expat Munich questions",
    "student visa Germany",
    "halal food Munich FAQ",
  ],
  openGraph: {
    title: "Frequently Asked Questions | Atlas Munich",
    description:
      "Answers to the most common questions about living in Munich as a Moroccan student or professional.",
    type: "website",
    url: "https://atlasmunich.de/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Atlas Munich",
    description:
      "Answers to the most common questions about living in Munich as a Moroccan student or professional.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
