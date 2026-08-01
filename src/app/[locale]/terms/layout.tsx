import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

/**
 * The `legal` namespace is 42 KB — over a third of all translated strings —
 * and only these two pages read it. Supplying it here rather than from the
 * root layout keeps it out of the HTML of every other page in the app.
 */
export default async function TermsLayout({
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
