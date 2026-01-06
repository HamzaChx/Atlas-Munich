import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroBadge } from "@/components/shared";
import { getTranslations } from "next-intl/server";
import {
  Users,
  Heart,
  GithubIcon,
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Globe,
  ExternalLink,
  Star,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Atlas Munich - the community-driven guide for Moroccan students and professionals in Munich.",
};

const contributors = [{ name: "Hamza Chaouki", role: "Founder & Developer", avatar: "👨‍💻" }];

export default async function AboutPage() {
  const t = await getTranslations("about");

  const values = [
    {
      icon: Heart,
      title: t("values.communityFirst"),
      description: t("values.communityFirstDesc"),
      gradient: "from-red-500/20 to-rose-500/20",
      iconColor: "text-red-400",
    },
    {
      icon: CheckCircle2,
      title: t("values.accuracyMatters"),
      description: t("values.accuracyMattersDesc"),
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: Globe,
      title: t("values.openAndFree"),
      description: t("values.openAndFreeDesc"),
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
    },
  ];

  const ways = [
    {
      icon: MessageCircle,
      title: t("contribute.suggestUpdates"),
      description: t("contribute.suggestUpdatesDesc"),
      action: { label: t("contribute.contactUs"), href: "mailto:hello@atlas-munich.de" },
    },
    {
      icon: Star,
      title: t("contribute.spreadTheWord"),
      description: t("contribute.spreadTheWordDesc"),
      action: { label: t("contribute.share"), href: "#" },
    },
  ];

  const manifestoItems = [
    {
      icon: CheckCircle2,
      title: t("manifesto.items.practical"),
      desc: t("manifesto.items.practicalDesc"),
    },
    {
      icon: BookOpen,
      title: t("manifesto.items.studentAware"),
      desc: t("manifesto.items.studentAwareDesc"),
    },
    {
      icon: GithubIcon,
      title: t("manifesto.items.openSource"),
      desc: t("manifesto.items.openSourceDesc"),
    },
  ];
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - Moroccan Colors */}
        <div className="absolute -left-32 top-0 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-red-400/40 to-red-300/30 dark:from-red-600/25 dark:to-red-500/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-400/40 to-emerald-300/30 dark:from-green-600/25 dark:to-emerald-500/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-200/20 to-white/30 dark:from-amber-500/10 dark:to-white/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left: story-driven intro */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <HeroBadge icon={Users} text={t("badge")} color="emerald" />
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {t("titleHighlight")}
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 lg:mx-0">
                {t("subtitle")}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  className="text-white bg-emerald-600 px-6 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500"
                >
                  <Link href="#contribute">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("howToContribute")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-zinc-200 dark:border-white/10 px-6 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <Link href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    {t("getInTouch")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: manifesto card (distinct from homepage stats) */}
            <div className="mx-auto w-full max-w-xl mt-8">
              <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200/80 dark:border-white/10 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 dark:from-white/5 dark:via-white/5 dark:to-white/5 p-8 shadow-2xl shadow-emerald-900/10 dark:shadow-none ring-1 ring-emerald-900/5 dark:ring-0 backdrop-blur-sm">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-500/10 dark:to-teal-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-teal-400/15 to-cyan-400/15 dark:from-amber-500/10 dark:to-amber-500/10 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-rose-200 dark:border-white/10 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-white/5 dark:to-white/5 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-zinc-300 shadow-lg shadow-rose-900/10 dark:shadow-none ring-1 ring-rose-900/5 dark:ring-0">
                    <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400 fill-rose-200 dark:fill-transparent" />
                    {t("manifesto.badge")}
                  </div>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-emerald-900 to-zinc-900 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent">
                    {t("manifesto.title")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
                    {t("manifesto.description")}
                  </p>

                  <div className="mt-7 space-y-3">
                    {manifestoItems.map((item) => (
                      <div
                        key={item.title}
                        className="group flex items-start gap-3.5 rounded-2xl border-2 border-emerald-100/80 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 shadow-lg shadow-emerald-900/5 dark:shadow-none transition-all hover:border-emerald-200 dark:hover:border-white/20 hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-none hover:bg-emerald-50/50 dark:hover:bg-white/10"
                      >
                        <div className="mt-0.5 inline-flex rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-emerald-500/15 p-2.5 ring-2 ring-emerald-200/50 dark:ring-emerald-500/20 group-hover:ring-emerald-300/60 dark:group-hover:ring-emerald-500/30 transition-all">
                          <item.icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-zinc-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-sm text-zinc-700 dark:text-zinc-400 mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/30 p-8 sm:p-10 shadow-xl shadow-zinc-900/5 dark:shadow-none">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 shadow-sm shadow-emerald-900/5 dark:shadow-none">
                  <span className="text-sm">📖</span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {t("story.badge")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  {t("story.title")}
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <p>{t("story.p1")}</p>
                  <p>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {t("story.p2Start")}
                    </span>
                    {t("story.p2End")}
                  </p>
                  <p>{t("story.p3")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 shadow-sm shadow-rose-900/5 dark:shadow-none">
              <span className="text-sm">💡</span>
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                {t("values.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 text-center shadow-xl shadow-zinc-900/5 dark:shadow-none backdrop-blur-sm transition-all hover:border-zinc-300/80 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
              >
                <div
                  className={`mx-auto mb-4 inline-flex rounded-xl bg-gradient-to-br ${value.gradient} p-3`}
                >
                  <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Contribute */}
        <section id="contribute" className="mb-20 scroll-mt-24">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 shadow-sm shadow-amber-900/5 dark:shadow-none">
              <span className="text-sm">🤝</span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {t("contribute.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contribute.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {t("contribute.description")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <div
                key={way.title}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 shadow-xl shadow-zinc-900/5 dark:shadow-none backdrop-blur-sm transition-all hover:border-zinc-300/80 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-2.5">
                    <way.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      {way.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {way.description}
                    </p>
                    <Link
                      href={way.action.href}
                      target={way.action.href.startsWith("http") ? "_blank" : undefined}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-300"
                    >
                      {way.action.label}
                      {way.action.href.startsWith("http") ? (
                        <ExternalLink className="h-3 w-3" />
                      ) : (
                        <ArrowRight className="h-3 w-3" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contributors */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-4 py-2 shadow-sm shadow-purple-900/5 dark:shadow-none">
              <span className="text-sm">👥</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                {t("contributors.badge")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {t("contributors.title")}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {contributors.map((contributor) => (
              <div
                key={contributor.name}
                className="w-56 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 text-center shadow-xl shadow-zinc-900/5 dark:shadow-none backdrop-blur-sm"
              >
                <div className="mx-auto mb-3 text-4xl">{contributor.avatar}</div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {contributor.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{contributor.role}</p>
              </div>
            ))}

            {/* Join CTA */}
            <div className="w-56 rounded-2xl border-2 border-dashed border-zinc-300/80 dark:border-white/10 bg-white dark:bg-zinc-900/30 p-5 text-center shadow-sm shadow-zinc-900/5 dark:shadow-none">
              <div className="mx-auto mb-3 text-4xl">🙋</div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {t("contributors.you")}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {t("contributors.joinTeam")}
              </p>
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                {t("contributors.contributeOnGithub")}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 dark:from-zinc-900 dark:via-emerald-950/20 dark:to-zinc-900 p-6 md:p-10 shadow-2xl shadow-emerald-900/5 dark:shadow-none">
            {/* Background decoration */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-3xl" />

            <div className="relative text-center">
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-200 dark:from-emerald-500/20 to-teal-200 dark:to-teal-500/20 p-3">
                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                {t("contact.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                {t("contact.description")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="https://github.com/HamzaChx/Atlas-Munich"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
                >
                  <GithubIcon className="h-4 w-4" />
                  {t("contact.github")}
                </Link>
                <Link
                  href="mailto:hello@atlas-munich.de"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Mail className="h-4 w-4" />
                  {t("contact.emailUs")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
