import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { SerwistProvider } from "@serwist/next/react";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, ConditionalFooter, MobileNav } from "@/components/layout";
import { ThemeProvider } from "@/components/shared";
import { ChatbotWrapper } from "@/components/chatbot";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { routing, type Locale } from "@/i18n";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";

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

/** OpenGraph wants a full territory code, not the bare language tag. */
const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale) as Locale;
  const localeUrl = locale === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${locale}`;

  return {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Atlas Munich | Your Guide to Thriving in Munich",
    template: "%s | Atlas Munich",
  },
  description:
    "The complete starter guide for Moroccan students and professionals in Munich. Housing, KVR, university, halal food, and more. Built by the community, for the community.",
  manifest: "/manifest.webmanifest",
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
    locale: OG_LOCALE[locale],
    // Every translation is declared, so a share in one language surfaces the
    // right variant rather than always advertising the English page.
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    url: localeUrl,
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Without `cover`, iOS keeps the page inside the safe area and every
  // env(safe-area-inset-*) in the stylesheet resolves to 0 — which would make
  // the tab bar's and the chat composer's inset padding silently do nothing.
  viewportFit: "cover",
  // Not capped: pinch-zoom is how a lot of people read on a phone, and
  // blocking it fails WCAG 1.4.4.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

/** Prerender all three locales at build time instead of rendering on demand. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;

  // Opts this subtree into static rendering: without it, anything reached
  // through `getTranslations` falls back to dynamic rendering.
  setRequestLocale(locale);

  const messages = await getMessages();

  // Two namespaces account for ~86 KB of the 118 KB message file and are each
  // needed by exactly one part of the site, yet a single provider here would
  // embed both in the HTML of every page — twice, since the RSC payload
  // repeats it. They are supplied closer to where they're read instead:
  //   placesData → resolved on the server in /map, never sent to the client
  //   legal      → a nested provider in the /privacy and /terms layouts
  const clientMessages = { ...messages };
  delete clientMessages.placesData;
  delete clientMessages.legal;

  // The four journey steps plus the About affordance, handed to the header as
  // props so it does not have to pull the whole nav namespace client-side.
  const navTranslations = messages.nav as {
    map: string;
    studies: string;
    career: string;
    community: string;
    about: string;
    aboutAria: string;
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
          email: "hamza.chaouki@tum.de",
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
        {/* The worker is emitted by `serwist build`, which only runs on a
            production build, so there is nothing to register in dev. */}
        <SerwistProvider swUrl="/sw.js" disable={process.env.NODE_ENV !== "production"}>
          <NextIntlClientProvider messages={clientMessages}>
            {/* Light is the product default: dark exists only for a visitor
                who explicitly flips ThemeToggle, not because their OS says
                so. Once they do, next-themes persists that choice in
                localStorage and it wins on every later visit. */}
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-zellige focus:ring-offset-2 dark:focus:bg-zinc-50 dark:focus:text-zinc-900"
              >
                Skip to content
              </a>
              <Header locale={locale} translations={navTranslations} />
              <main id="main-content" className="pt-(--header-h)">
                {children}
              </main>
              <ConditionalFooter />
              <MobileNav locale={locale} />
              <InstallBanner />
              <ChatbotWrapper />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SerwistProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
