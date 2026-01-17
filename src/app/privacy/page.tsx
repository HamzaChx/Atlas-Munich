import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Shield, Lock, Database, Users, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Atlas Munich - Learn how we handle your data.",
};

export default async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");

  const sections = [
    {
      icon: Database,
      title: t("dataCollected.title"),
      content: [
        { label: "Analytics", text: t("dataCollected.analytics") },
        { label: "AI Prompts", text: t("dataCollected.prompts") },
      ],
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: Lock,
      title: "Cookies & Tracking",
      content: [{ label: "", text: t("cookies") }],
      gradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Users,
      title: "Third Parties",
      content: [{ label: "", text: t("thirdParties") }],
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        { label: "GDPR Rights", text: t("rights") },
        { label: "Data Retention", text: t("dataRetention") },
      ],
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs - smaller on mobile */}
        <div className="absolute -left-16 sm:-left-32 top-0 z-[5] h-[250px] w-[250px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-br from-blue-400/40 to-indigo-300/30 dark:from-blue-600/25 dark:to-indigo-500/15 blur-[80px] sm:blur-[120px]" />
        <div className="absolute -right-16 sm:-right-32 bottom-0 z-[5] h-[250px] w-[250px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-br from-purple-400/40 to-blue-300/30 dark:from-purple-600/25 dark:to-blue-500/15 blur-[80px] sm:blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 shadow-sm shadow-blue-900/5 dark:shadow-none">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Legal Information
            </span>
          </div>

          <h1 className="mt-6 mb-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t("title")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("intro")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Controller:</strong>{" "}
                {t("controller")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        {/* Legal Basis */}
        <section className="mb-12">
          <div className="rounded-3xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/30 p-6 sm:p-8 shadow-xl shadow-zinc-900/5 dark:shadow-none">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/15 p-3">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Lawful Basis for Processing
                </h2>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t("lawfulBasis")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sections Grid */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.title}
                className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 shadow-xl shadow-zinc-900/5 dark:shadow-none backdrop-blur-sm transition-all hover:border-zinc-300/80 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-none"
              >
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${section.gradient} p-3`}
                >
                  <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.content.map((item, idx) => (
                    <div key={idx}>
                      {item.label && (
                        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          {item.label}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Updates Notice */}
        <section className="mb-12">
          <div className="rounded-2xl border border-amber-200/70 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 p-6 shadow-lg shadow-amber-900/5 dark:shadow-none">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-500/15 p-2">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                  Policy Updates
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("updates")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links to Terms */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Also view our{" "}
            <Link
              href="/terms"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
