import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/shared";
import { ChatbotWrapper } from "@/components/chatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Atlas Munich | Your Guide to Thriving in Munich",
    template: "%s | Atlas Munich",
  },
  description:
    "The complete starter guide for Moroccan students and professionals in Munich. Housing, KVR, university, halal food, and more.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "Munich",
    "Morocco",
    "Moroccan students",
    "Germany",
    "student guide",
    "Anmeldung",
    "KVR",
    "halal Munich",
    "housing Munich",
  ],
  openGraph: {
    title: "Atlas Munich | Your Guide to Thriving in Munich",
    description: "The complete starter guide for Moroccan students and professionals in Munich.",
    type: "website",
    locale: "en_US",
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
    explore: string;
    exploreAll: string;
    toggleTheme: string;
    tools: string;
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={[geistSans.variable, geistMono.variable, "antialiased"].join(" ")}
    >
      <body className="min-h-screen bg-white transition-colors dark:bg-zinc-950">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header locale={locale as "en" | "fr"} translations={navTranslations} />
            <main className="pt-14 sm:pt-16">{children}</main>
            <Footer />
            <ChatbotWrapper />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
