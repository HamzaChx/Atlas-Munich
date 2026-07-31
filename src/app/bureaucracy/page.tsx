import { Metadata } from "next";
import {
  Building2,
  MessageSquareText,
  ClipboardList,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldCheck,
  AlertCircle,
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
  stepIcons: [MessageSquareText, ClipboardList, CheckCircle2],
  linksKey: "authorities",
  links: [
    {
      name: "KVR Munich",
      label: "City registration and Anmeldung",
      url: "https://www.muenchen.de/rathaus/kreisverwaltungsreferat",
      icon: Building2,
    },
    {
      name: "Ausländerbehörde",
      label: "Residence permits and extensions",
      url: "https://www.muenchen.de/rathaus/auslaenderbehoerde",
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

export default function BureaucracyPage() {
  return <AssistantLanding config={CONFIG} />;
}
