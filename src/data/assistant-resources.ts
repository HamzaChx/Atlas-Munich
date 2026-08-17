// ============================================
// Atlas Munich – per-assistant outbound resources
//
// The same links each tool's landing page (/academic, /bureaucracy,
// /healthcare) already shows, made available to the dedicated chat pages too
// so the "?" info button doesn't need a trip back to the landing page for
// something as small as a link list. Zellija and the not-yet-live assistants
// carry no entry here, which is how DedicatedChat knows to skip the button.
// ============================================

import type { LucideIcon } from "lucide-react";
import {
  HomeIcon,
  Building2,
  Users,
  Tag,
  Landmark,
  FileText,
  Radio,
  Library,
  BookOpen,
  Search,
  BookMarked,
  Shield,
  ShieldCheck,
  Hospital,
  Stethoscope,
} from "lucide-react";
import type { ChatbotType } from "@/chatbot/types";

export interface AssistantResourceLink {
  name: string;
  label: string;
  url: string;
  icon: LucideIcon;
}

export interface AssistantResources {
  /** Translation namespace holding this assistant's `intro` and `<linksKey>.{title,subtitle}` copy. */
  namespace: "housing" | "bureaucracy" | "academic" | "healthcare";
  /** Sub-key under that namespace for this link list's heading. */
  linksKey: "platforms" | "authorities" | "resources";
  links: AssistantResourceLink[];
}

export const ASSISTANT_RESOURCES: Partial<Record<ChatbotType, AssistantResources>> = {
  riad: {
    namespace: "housing",
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
  },
  dalilah: {
    namespace: "bureaucracy",
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
  },
  ilham: {
    namespace: "academic",
    linksKey: "resources",
    links: [
      {
        name: "TUM Library",
        label: "Research and databases",
        url: "https://www.ub.tum.de",
        icon: Library,
      },
      {
        name: "LMU Library",
        label: "Research and databases",
        url: "https://www.ub.uni-muenchen.de",
        icon: BookOpen,
      },
      {
        name: "Google Scholar",
        label: "Literature discovery",
        url: "https://scholar.google.com",
        icon: Search,
      },
      {
        name: "Zotero",
        label: "Citation manager",
        url: "https://www.zotero.org",
        icon: BookMarked,
      },
    ],
  },
  loubna: {
    namespace: "healthcare",
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
  },
};
