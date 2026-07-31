"use client";

import { useTranslations } from "next-intl";
import {
  Baby,
  Bot,
  Building2,
  CalendarClock,
  Compass,
  Cookie,
  Database,
  Globe,
  Lock,
  Mail,
  Scale,
  UserCheck,
  Users,
} from "lucide-react";

import { LegalDocument, type LegalAccent } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal-config";

/* One hue and icon per section, on the landing tint system */
const accents: Record<string, LegalAccent> = {
  overview: { icon: Compass, tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  controller: { icon: Building2, tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  data: { icon: Database, tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  legalBasis: { icon: Scale, tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  storage: {
    icon: Cookie,
    tint: "bg-tint-saffron",
    text: "text-acc-saffron",
    dot: "bg-acc-saffron",
  },
  ai: { icon: Bot, tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  recipients: { icon: Users, tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  transfers: { icon: Globe, tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  retention: {
    icon: CalendarClock,
    tint: "bg-tint-saffron",
    text: "text-acc-saffron",
    dot: "bg-acc-saffron",
  },
  rights: { icon: UserCheck, tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  security: { icon: Lock, tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  minors: { icon: Baby, tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  contact: { icon: Mail, tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
};

export default function PrivacyPage() {
  const t = useTranslations("legal");

  return (
    <LegalDocument
      namespace="legal.privacy"
      version={LEGAL.privacy.version}
      effective={LEGAL.privacy.effective}
      accents={accents}
      sibling={{ href: "/terms", label: t("terms.title") + " " + t("terms.titleHighlight") }}
    />
  );
}
