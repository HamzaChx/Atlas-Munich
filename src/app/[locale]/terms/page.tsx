"use client";

import { useTranslations } from "next-intl";
import {
  Ban,
  BookOpen,
  Bot,
  Compass,
  Copyright,
  FileSignature,
  Gavel,
  History,
  Layers,
  Scale,
  ShieldAlert,
} from "lucide-react";

import { LegalDocument, type LegalAccent } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal-config";

/* One hue and icon per section, on the landing tint system */
const accents: Record<string, LegalAccent> = {
  overview: { icon: Compass, tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
  scope: {
    icon: FileSignature,
    tint: "bg-tint-blue",
    text: "text-acc-blue",
    dot: "bg-acc-blue",
  },
  service: { icon: Layers, tint: "bg-tint-green", text: "text-acc-green", dot: "bg-acc-green" },
  acceptableUse: {
    icon: ShieldAlert,
    tint: "bg-tint-terra",
    text: "text-acc-terra",
    dot: "bg-acc-terra",
  },
  ai: {
    icon: Bot,
    tint: "bg-tint-saffron",
    text: "text-acc-saffron",
    dot: "bg-acc-saffron",
  },
  content: { icon: BookOpen, tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  ip: { icon: Copyright, tint: "bg-tint-blue", text: "text-acc-blue", dot: "bg-acc-blue" },
  liability: { icon: Scale, tint: "bg-tint-terra", text: "text-acc-terra", dot: "bg-acc-terra" },
  termination: { icon: Ban, tint: "bg-tint-plum", text: "text-acc-plum", dot: "bg-acc-plum" },
  changes: {
    icon: History,
    tint: "bg-tint-saffron",
    text: "text-acc-saffron",
    dot: "bg-acc-saffron",
  },
  law: { icon: Gavel, tint: "bg-zellige-soft", text: "text-zellige", dot: "bg-zellige" },
};

export default function TermsPage() {
  const t = useTranslations("legal");

  return (
    <LegalDocument
      namespace="legal.terms"
      version={LEGAL.terms.version}
      effective={LEGAL.terms.effective}
      accents={accents}
      sibling={{ href: "/privacy", label: t("privacy.title") + " " + t("privacy.titleHighlight") }}
    />
  );
}
