import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, ConditionalFooter } from "@/components/layout";
import { ThemeProvider } from "@/components/shared";
import { ChatbotWrapper } from "@/components/chatbot";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const BASE_URL = "https://atlasmunich.de";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Atlas Munich | Your Guide to Thriving in Munich",
    template: "%s | Atlas Munich",
  },
  description:
    "The complete starter guide for Moroccan students and professionals in Munich. Housing, KVR, university, halal food, and more. Built by the community, for the community.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "Atlas Munich",
    "Munich guide",
    "Morocco Munich",
    "Moroccan students Munich",
    "Moroccan expats Germany",
    "student life Munich",
    "living in Munich",
    "Munich newcomer guide",
    "Anmeldung Munich",
    "KVR Munich",
    "residence permit Munich",
    "halal food Munich",
    "housing Munich",
    "WG Munich",
    "apartment Munich",
    "TUM students",
    "LMU students",
    "university Munich",
    "Werkstudent Munich",
    "internship Munich",
    "MVV Munich transport",
    "München",
    "German bureaucracy guide",
    "expat Munich",
  ],
  authors: [{ name: "Atlas Munich Team", url: BASE_URL }],
  creator: "Atlas Munich Team",
  publisher: "Atlas Munich",
  category: "Community Guide",
  openGraph: {
    title: "Atlas Munich | Your Guide to Thriving in Munich",
    description:
      "The complete starter guide for Moroccan students and professionals in Munich. Housing, KVR, university, halal food, and more.",
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Atlas Munich",
    images: [
      {
        url: "/atlas.png",
        width: 1200,
        height: 630,
        alt: "Atlas Munich - Your Guide to Thriving in Munich",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Munich | Your Guide to Thriving in Munich",
    description:
      "The complete starter guide for Moroccan students and professionals in Munich. Housing, KVR, university, halal food, and more.",
    images: ["/atlas.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "-GZmYKhOD0IyzbpHSEwRSyH0FVDFivjMcv-lCJWFlRI",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Extract nav translations for the header
  const navTranslations = messages.nav as {
    home: string;
    guides: string;
    places: string;
    community: string;
    faq: string;
    about: string;
    search: string;
    toggleTheme: string;
    tools: string;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Atlas Munich",
        description:
          "The complete starter guide for Moroccan students and professionals in Munich.",
        inLanguage: ["en", "fr", "de"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/guides?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Atlas Munich",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@atlasmunich.de",
          contactType: "customer support",
        },
        sameAs: ["https://github.com/HamzaChx/Atlas-Munich"],
      },
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={[archivo.variable, hanken.variable, "antialiased"].join(" ")}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background transition-colors">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header locale={locale as "en" | "fr"} translations={navTranslations} />
            <main className="pt-14 sm:pt-16">{children}</main>
            <ConditionalFooter />
            <ChatbotWrapper />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
