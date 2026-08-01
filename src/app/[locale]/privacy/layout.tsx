import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

/**
 * The `legal` namespace is 42 KB — over a third of all translated strings —
 * and only these two pages read it. Supplying it here rather than from the
 * root layout keeps it out of the HTML of every other page in the app.
 */
export default async function PrivacyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Reading messages here would otherwise pull this branch back into
  // on-demand rendering, the way the whole app used to render.
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={{ legal: messages.legal }}>{children}</NextIntlClientProvider>
  );
}
