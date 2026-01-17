import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroBadge } from "@/components/shared";
import { ArrowRight, MessageCircle, Users, Heart, Shield, Zap, Globe } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-2xl sm:blur-3xl" />
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-2xl sm:blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Badge */}
            <HeroBadge icon={MessageCircle} text={t("badge")} color="emerald" />

            {/* Main Heading - Following Rule 3 */}
            <h1 className="mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 sm:mb-12 max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 px-2">
              {t("subtitle")}
            </p>

            {/* Stats - Visual Proof */}
            <div className="mb-12 sm:mb-16 grid grid-cols-2 gap-6 sm:gap-8 px-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                  100+
                </div>
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t("stats.members")}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t("stats.active")}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                  🇲🇦 🇩🇪
                </div>
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t("stats.cultures")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section - The Hero */}
      <section className="relative -mt-16 sm:-mt-24 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-8 sm:gap-12 p-6 sm:p-8 lg:p-12 lg:grid-cols-2 lg:gap-16">
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
                  <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
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
      <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 sm:mb-16 text-center px-2">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
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
