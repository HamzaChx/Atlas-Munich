"use client";

/**
 * LandingMasonrySection - Interactive 9-card Masonry showcase of Atlas Munich features.
 */
import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Users, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Masonry, { Item } from "@/components/ui/masonry";

export function LandingMasonrySection() {
  const t = useTranslations("home");
  const tCommunity = useTranslations("home.community");

  // Items describing the different parts of the application & topbar elements
  const masonryItems: Item[] = [
    {
      id: "map",
      img: "/masonry/map.png",
      url: "/map",
      height: 520,
      title: "Interactive Munich Map",
      category: "Map & Halal Spots",
    },
    {
      id: "essentials",
      img: "/masonry/essentials.png",
      url: "/essentials",
      height: 420,
      title: "Rent & Housing Essentials",
      category: "Apartments & Anmeldung",
    },
    {
      id: "bureaucracy",
      img: "/masonry/bureaucracy.png",
      url: "/bureaucracy",
      height: 540,
      title: "KVR & Residence Permits",
      category: "Bureaucracy & Visa",
    },
    {
      id: "career",
      img: "/masonry/career.png",
      url: "/career",
      height: 560,
      title: "Werkstudent & TUM/LMU",
      category: "Career & Studies",
    },
    {
      id: "healthcare",
      img: "/masonry/healthcare.png",
      url: "/healthcare",
      height: 480,
      title: "German Healthcare & Doctors",
      category: "Insurance & Medical",
    },
    {
      id: "community",
      img: "/masonry/community.png",
      url: "/community",
      height: 460,
      title: "Moroccan Collective",
      category: "Community & Events",
    },
    {
      id: "academic",
      img: "/masonry/academic.png",
      url: "/academic",
      height: 450,
      title: "TUM & LMU Campus Life",
      category: "Universities & Research",
    },
    {
      id: "tools",
      img: "/masonry/tools.png",
      url: "/tools",
      height: 520,
      title: "AI Bureaucracy & Housing Helpers",
      category: "Smart AI Tools",
    },
    {
      id: "guides",
      img: "/masonry/guides.png",
      url: "/guides",
      height: 440,
      title: "Munich Knowledge Base",
      category: "Practical Guides",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 2xl:py-28 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 2xl:gap-20">
          {/* ── LEFT SIDE: Masonry Showcase of App Parts & Topbar Elements ──────── */}
          <div className="w-full lg:col-span-7 min-h-[640px] relative">
            <Masonry
              items={masonryItems}
              ease="power3.out"
              duration={0.7}
              stagger={0.06}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.96}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
          </div>

          {/* ── RIGHT SIDE: "Our story" — stretched (via the row's default grid
              `align-items: stretch`) to the masonry's actual rendered height,
              then split top/bottom internally so the greeting anchors level
              with the bottom of the grid instead of floating mid-page. ── */}
          <div className="w-full lg:col-span-5 flex flex-col">
            <span className="eyebrow">{tCommunity("badge")}</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl 2xl:text-5xl">
              {tCommunity("title")}
              <span className="text-bloom">{tCommunity("titleHighlight")}</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base 2xl:text-lg">
              {tCommunity("description1")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base 2xl:text-lg">
              {tCommunity("description2")}{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {tCommunity("atlasName")}
              </span>
              {tCommunity("description3")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Button
                asChild
                className="rounded-full bg-zinc-900 px-6 text-white shadow-md shadow-zinc-900/15 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-200"
              >
                <Link href="/about">
                  <Users className="mr-2 h-4 w-4" />
                  {tCommunity("aboutCommunity")}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-6 text-zinc-600 hover:bg-card hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
              >
                <Link href="/community">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {tCommunity("commonQuestions")}
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-col items-center text-center">
              <p
                dir="rtl"
                lang="ar"
                className="float-slower text-4xl font-bold leading-snug text-bloom sm:text-5xl 2xl:text-6xl"
              >
                مرحبا بيك
              </p>
              <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">{t("byTheCommunity")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingMasonrySection;
