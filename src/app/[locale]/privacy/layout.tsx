import { Metadata } from "next";
import { LEGAL } from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Atlas Munich processes personal data: cookieless analytics, AI assistant conversations, processors, international transfers, retention and your rights under the GDPR.",
  keywords: [
    "Atlas Munich privacy policy",
    "GDPR",
    "Datenschutzerklärung",
    "data protection Munich",
    "cookieless analytics",
    "AI privacy",
  ],
  alternates: { canonical: `${LEGAL.site}/privacy` },
  openGraph: {
    title: "Privacy Policy | Atlas Munich",
    description:
      "What data Atlas Munich processes, on what legal basis, who receives it and how to exercise your GDPR rights.",
    type: "website",
    url: `${LEGAL.site}/privacy`,
  },
  // Legal notices should stay findable: transparency under Art. 12 GDPR is
  // easier to demonstrate when the policy is publicly indexed.
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
