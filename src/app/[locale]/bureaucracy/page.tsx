import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  Building2,
  Landmark,
  FileText,
  Radio,
} from "lucide-react";
import {
  AssistantLanding,
  type AssistantLandingConfig,
} from "@/components/chatbot/AssistantLanding";

export const metadata: Metadata = {
  title: "German Bureaucracy Navigator for Munich | Dalilah",
  description:
    "Navigate Munich's German bureaucracy effortlessly. Dalilah guides you through Anmeldung, residence permits, health insurance, KVR, and more, step by step.",
  keywords: [
    "Anmeldung Munich",
    "residence permit Munich students",
    "KVR Munich appointment",
    "Ausländerbehörde Munich",
    "health insurance Munich students",
    "German bureaucracy guide",
    "Munich registration Moroccan students",
    "Wohnungsgeberbestätigung",
  ],
  openGraph: {
    title: "German Bureaucracy Navigator Munich | Atlas Munich",
    description:
      "Navigate Anmeldung, residence permits, KVR, and German bureaucracy step by step with Dalilah, your AI guide for Munich admin.",
    type: "website",
    url: "https://atlasmunich.de/bureaucracy",
  },
};

const CONFIG: AssistantLandingConfig = {
  namespace: "bureaucracy",
  chatbot: "dalilah",
  name: "Dalilah",
  avatar: "/dalilah.webp",
  icon: Building2,
  chatPath: "/bureaucracy/chat",
  linksKey: "authorities",
  links: [
    {
      name: "Bürgerbüro (KVR)",
      label: "City registration and Anmeldung",
      // The old muenchen.de/rathaus/* addresses return 404 (checked 2026-11-21).
      url: "https://stadt.muenchen.de/service/info/wohnsitzanmeldung/1063475/n0/",
      icon: Building2,
    },
    {
      // Munich's Ausländerbehörde is now the Servicestelle für Zuwanderung
      // und Einbürgerung (SZE), part of the KVR.
      name: "Servicestelle für Zuwanderung",
      label: "Residence permits and extensions (formerly Ausländerbehörde)",
      url: "https://stadt.muenchen.de/service/en-GB/info/servicestelle-fur-zuwanderung-und-einburgerung/10424886/",
      icon: FileText,
    },
    {
      name: "BAMF",
      label: "Federal Office for Migration",
      url: "https://www.bamf.de",
      icon: Landmark,
    },
    {
      name: "Rundfunkbeitrag",
      label: "Broadcasting fee registration",
      url: "https://www.rundfunkbeitrag.de",
      icon: Radio,
    },
  ],
};

export default async function BureaucracyPage({ params }: { params: Promise<{ locale: string }> }) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  return <AssistantLanding config={CONFIG} />;
}
