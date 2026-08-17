import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingMasonrySection } from "@/components/home";
import WebThreads from "@/components/ui/web-threads";
import GlassIcons from "@/components/ui/glass-icons";
import { MapPin, MessageCircle, Briefcase } from "lucide-react";

const iconClass = "h-full w-full";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Required for static rendering: without it next-intl falls back to reading
  // the locale from headers, which opts this page back into rendering on demand.
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const quickAccess = [
    {
      label: t("quick.ask"),
      href: "/chat",
      icon: <MessageCircle className={iconClass} />,
      color: "red",
    },
    { label: t("quick.map"), href: "/map", icon: <MapPin className={iconClass} />, color: "green" },
    {
      label: t("quick.career"),
      href: "/career",
      icon: <Briefcase className={iconClass} />,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO ==========*/}
      {/* `main` carries a global `pt-(--header-h)` so sticky offsets on every
          other page line up under the bar; that same padding would leave
          this hero's threads starting below the header instead of behind it.
          Pulling the section up by that exact height (and no more, so nothing
          else on the page shifts) is the fix, not touching the shared spacer. */}
      <section className="relative isolate -mt-(--header-h) flex min-h-[78vh] w-full flex-col justify-center overflow-hidden bg-background sm:min-h-screen">
        {/* Woven threads in the flag's red and green. The canvas sits on
            --background (plaster in light mode, ink in dark mode) rather
            than a hardcoded color, so it reads correctly in both themes. */}
        <div className="absolute inset-0 z-0">
          <WebThreads
            color1="#c52b30"
            color2="#227240"
            color3="#fdf1e6"
            speed={0.2}
            threadCount={6}
            frequency={5}
            spread={0.18}
            taper={1}
            position={0.5}
            fanMode="center"
            glow={0.02}
            falloff={0.6}
            thickness={1.1}
            brightness={0.6}
            opacity={1}
            mirror
            shimmer={false}
            grain
            grainIntensity={0.05}
            mouseInteraction
            mouseStrength={0}
          />
        </div>

        {/* Scrim: pins the reading column back toward --background wherever
            the threads glow brightest, so text stays legible regardless of
            the animation's state. Built from the same token as the section
            background, so it fades toward plaster in light mode and toward
            ink in dark mode instead of flattening everything to grey. The
            linear layer's top stop is held deliberately high and long,
            since the fixed header sits transparent over this exact band and
            needs to stay readable even when a thread swoops through it. */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 42%, color-mix(in oklab, var(--background) 80%, transparent) 0%, color-mix(in oklab, var(--background) 45%, transparent) 45%, transparent 75%), linear-gradient(to bottom, color-mix(in oklab, var(--background) 72%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 10%, transparent 30%, color-mix(in oklab, var(--background) 15%, transparent) 65%, color-mix(in oklab, var(--background) 55%, transparent) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 pt-32 pb-16 text-center sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:pt-44">
          <h1 className="rise rise-1 display-wide font-display text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.02em] text-zinc-950 drop-shadow-[0_2px_14px_rgba(0,0,0,0.3)] dark:text-zinc-50 dark:drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
            {t("heroTitle")}
            {/* --bloom shifts a shade brighter in dark mode already (see
                globals.css), so text-bloom alone keeps this readable and
                on-brand in both themes without a manual override here. */}
            <span className="block pb-1 text-bloom">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="rise rise-2 mx-auto mt-6 max-w-lg text-balance text-lg leading-relaxed text-zinc-700 drop-shadow-[0_1px_10px_rgba(0,0,0,0.2)] dark:text-zinc-300 dark:drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:text-xl">
            {t("heroSubtitle")}
          </p>

          <span className="sr-only">{t("quick.badge")}</span>

          <div className="rise rise-4 mt-12 w-full">
            <GlassIcons items={quickAccess} />
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES + FEATURED GUIDES (Replaced with Masonry Section) ========== */}
      <LandingMasonrySection />
    </div>
  );
}
