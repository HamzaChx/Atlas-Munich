import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistants for Munich Life",
  description:
    "Meet your personal AI assistants for Munich: housing applications, German bureaucracy, academic research, CVs, and more. Built for Moroccan newcomers.",
  keywords: [
    "Munich AI assistants",
    "WG application assistant",
    "German bureaucracy AI",
    "academic research companion Munich",
    "CV tool Munich",
    "tools for Moroccan students Munich",
  ],
  openGraph: {
    title: "AI Assistants for Munich | Atlas Munich",
    description:
      "Personal AI assistants built for your Munich journey: housing, careers, bureaucracy, research. Each one specializes in getting you ahead.",
    type: "website",
    url: "https://atlasmunich.de/tools",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
