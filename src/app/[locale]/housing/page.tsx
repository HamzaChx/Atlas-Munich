import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  HomeIcon,
  ClipboardPaste,
  MessageSquareText,
  Send,
  Zap,
  FileCheck,
  UserCheck,
  ShieldAlert,
  Building2,
  Users,
  Tag,
} from "lucide-react";
import {
  AssistantLanding,
  type AssistantLandingConfig,
} from "@/components/chatbot/AssistantLanding";

export const metadata: Metadata = {
  title: "Housing Application Assistant for Munich",
  description:
    "Generate a high-conversion WG or apartment application message in German for Munich's rental market. Paste a listing and Riad writes a ready-to-send message for you.",
  keywords: [
    "Munich WG application",
    "apartment application Munich German",
    "Bewerbung WG Munich",
    "WG-Gesucht application generator",
    "ImmobilienScout24 Munich application",
    "rental application AI Munich",
    "housing tool Munich students",
  ],
  openGraph: {
    title: "Munich Housing Application Assistant | Atlas Munich",
    description:
      "Generate a high-conversion WG or apartment application message in German. Paste a listing and get a ready-to-send message instantly.",
    type: "website",
    url: "https://atlasmunich.de/housing",
  },
};

const CONFIG: AssistantLandingConfig = {
  namespace: "housing",
  chatbot: "riad",
  name: "Riad",
  avatar: "/riad.webp",
  icon: HomeIcon,
  chatPath: "/housing/chat",
  stepIcons: [ClipboardPaste, MessageSquareText, Send],
  linksKey: "platforms",
  links: [
    {
      name: "ImmobilienScout24",
      label: "Apartments and WG rooms",
      url: "https://www.immobilienscout24.de",
      icon: Building2,
    },
    {
      name: "WG-Gesucht",
      label: "Shared flats and sublets",
      url: "https://www.wg-gesucht.de",
      icon: Users,
    },
    {
      name: "Immowelt",
      label: "Apartments across Bavaria",
      url: "https://www.immowelt.de",
      icon: HomeIcon,
    },
    {
      name: "eBay Kleinanzeigen",
      label: "Private listings and short lets",
      url: "https://www.kleinanzeigen.de",
      icon: Tag,
    },
  ],
};

export default async function HousingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  return <AssistantLanding config={CONFIG} />;
}
