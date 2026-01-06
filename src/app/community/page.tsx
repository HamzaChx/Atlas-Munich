import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Users, Heart, Shield, Zap, Globe } from "lucide-react";
import Image from "next/image";

/**
 * Community Page - WhatsApp Integration
 * Following Golden UI/UX Rules:
 * - Rule 1: Clarity beats creativity
 * - Rule 11: 8-point spacing system
 * - Rule 12: Max content width 1100-1280px
 * - Rule 13: Whitespace aggressively (luxury brand style)
 * - Rule 17: One primary action per screen (Join WhatsApp)
 * - Rule 26: Neutral base + 1 accent color
 * - Rule 35: Animations 150-300ms
 * - Rule 46: Radix UI + shadcn/ui (already in use)
 */

export default async function CommunityPage() {
  const t = await getTranslations("community");

  const whatsappLink = "https://chat.whatsapp.com/BjITbXHnM9Q6xapvC1Q3rX";

  // QR Code via reliable API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(whatsappLink)}&bgcolor=ffffff&color=000000&margin=16`;

  const benefits = [
    {
      icon: Users,
      title: t("benefits.support.title"),
      description: t("benefits.support.description"),
    },
    {
      icon: Zap,
      title: t("benefits.realtime.title"),
      description: t("benefits.realtime.description"),
    },
    {
      icon: Heart,
      title: t("benefits.friendships.title"),
      description: t("benefits.friendships.description"),
    },
    {
      icon: Globe,
      title: t("benefits.events.title"),
      description: t("benefits.events.description"),
    },
  ];

  const guidelines = [
    t("guidelines.respectful"),
    t("guidelines.helpful"),
    t("guidelines.language"),
    t("guidelines.spam"),
    t("guidelines.privacy"),
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
        {/* Decorative Elements - Subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
              <MessageCircle className="h-4 w-4" />
              {t("badge")}
            </div>

            {/* Main Heading - Following Rule 3 */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              {t("subtitle")}
            </p>

            {/* Stats - Visual Proof */}
            <div className="mb-16 grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">100+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{t("stats.members")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">24/7</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{t("stats.active")}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">🇲🇦 🇩🇪</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("stats.cultures")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section - The Hero */}
      <section className="relative -mt-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-zinc-100 dark:bg-zinc-50">
                  <Image
                    src={qrCodeUrl}
                    alt="WhatsApp Community QR Code"
                    width={400}
                    height={400}
                    className="h-auto w-full max-w-[280px]"
                    priority
                  />
                </div>
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {t("qrInstructions")}
                </p>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
                    {t("joinTitle")}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400">{t("joinDescription")}</p>
                </div>

                {/* Primary Action - Rule 17 */}
                <div className="space-y-4">
                  <Button
                    asChild
                    size="lg"
                    className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg dark:from-green-500 dark:to-emerald-500 dark:text-white"
                  >
                    <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {t("joinButton")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
                    {t("joinNote")}
                  </p>
                </div>

                {/* Trust Signals */}
                <div className="mt-8 flex items-center gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-500" />
                  <div className="text-sm">
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      {t("verified.title")}
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {t("verified.description")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
              {t("benefitsTitle")}
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
              {t("benefitsSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-900"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 transition-transform group-hover:scale-110 dark:from-green-950 dark:to-emerald-950 dark:text-green-400">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
