import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
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
    description:
      "The complete starter guide for Moroccan students and professionals in Munich.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[geistSans.variable, geistMono.variable, "antialiased"].join(
        " "
      )}
    >
      <body className="min-h-screen bg-zinc-950">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}