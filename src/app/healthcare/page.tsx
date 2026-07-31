import { Metadata } from "next";
import {
  Activity,
  MessageSquareText,
  ClipboardList,
  CheckCircle2,
  ShieldCheck,
  Heart,
  AlertCircle,
  Shield,
  Hospital,
  Stethoscope,
} from "lucide-react";
import {
  AssistantLanding,
  type AssistantLandingConfig,
} from "@/components/chatbot/AssistantLanding";

export const metadata: Metadata = {
  title: "Healthcare Navigator for Munich | Loubna",
  description:
    "Navigate German health insurance, find English-speaking doctors, and get medical translations for Munich. Loubna guides Moroccan students through every step.",
  keywords: [
    "German health insurance Munich",
    "Techniker Krankenkasse students",
    "English speaking doctor Munich",
    "Krankenversicherung international students",
    "medical translation Munich",
    "healthcare guide Moroccan students Munich",
  ],
  openGraph: {
    title: "Healthcare Navigator Munich | Atlas Munich",
    description:
      "Navigate German health insurance, find doctors, and understand medical processes step by step with Loubna, your AI healthcare guide for Munich.",
    type: "website",
    url: "https://atlasmunich.de/healthcare",
  },
};

const CONFIG: AssistantLandingConfig = {
  namespace: "healthcare",
  chatbot: "loubna",
  name: "Loubna",
  avatar: "/loubna.webp",
  icon: Activity,
  chatPath: "/healthcare/chat",
  stepIcons: [MessageSquareText, ClipboardList, CheckCircle2],
  linksKey: "resources",
  links: [
    {
      name: "Techniker Krankenkasse",
      label: "Health insurance with English support",
      url: "https://www.tk.de",
      icon: Shield,
    },
    {
      name: "AOK Bayern",
      label: "Bavarian public health insurer",
      url: "https://www.aok.de/pk/plus/",
      icon: ShieldCheck,
    },
    {
      name: "Klinikum rechts der Isar",
      label: "TUM university hospital",
      url: "https://www.mri.tum.de",
      icon: Hospital,
    },
    {
      name: "LMU Klinikum",
      label: "LMU university hospital",
      url: "https://www.lmu-klinikum.de",
      icon: Stethoscope,
    },
  ],
};

export default function HealthcarePage() {
  return <AssistantLanding config={CONFIG} />;
}
