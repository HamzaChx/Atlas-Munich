import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FileText, AlertTriangle, Shield, Scale, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions for Atlas Munich - Rules and guidelines for using our service.",
};

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");

  const sections = [
    {
      icon: Shield,
      title: "Acceptable Use",
      content: t("use"),
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: AlertTriangle,
      title: "AI Disclaimer",
      content: t("aiDisclaimer"),
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
      highlight: true,
    },
    {
      icon: FileText,
      title: "No Warranty",
      content: t("noWarranty"),
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: Scale,
      title: "Liability",
      content: t("liability"),
      gradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: Code,
      title: "Intellectual Property",
      content: t("ip"),
      gradient: "from-rose-500/20 to-pink-500/20",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-300/30 dark:from-emerald-600/25 dark:to-teal-500/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-400/40 to-cyan-300/30 dark:from-teal-600/25 dark:to-cyan-500/15 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 shadow-sm shadow-emerald-900/5 dark:shadow-none">
            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Legal Agreement
            </span>
          </div>

          <h1 className="mt-6 mb-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t("title")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("intro")}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 px-5 py-2.5 shadow-lg shadow-zinc-900/5 dark:shadow-none">
            <Scale className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-white">Governing Law:</strong>{" "}
              {t("law")}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Important Notice - AI Disclaimer Highlight */}
        <section className="mb-12">
          <div className="rounded-3xl border-2 border-amber-200/80 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 p-8 shadow-2xl shadow-amber-900/10 dark:shadow-none">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-500/25 dark:to-orange-500/25 p-3 ring-2 ring-amber-300/50 dark:ring-amber-500/30">
                <AlertTriangle className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Important: AI Content Disclaimer
                </h2>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                  {t("aiDisclaimer")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections Grid */}
        <section className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Terms of Service
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Please read these terms carefully before using Atlas Munich
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sections
              .filter((section) => !section.highlight)
              .map((section) => (
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
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {section.content}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* Two Column: Jurisdiction & No Warranty */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-200/70 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 p-6 shadow-lg shadow-blue-900/5 dark:shadow-none">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 dark:bg-blue-500/15 p-2">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                    Jurisdiction
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t("law")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200/70 dark:border-purple-500/20 bg-gradient-to-br from-purple-50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/10 p-6 shadow-lg shadow-purple-900/5 dark:shadow-none">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-100 dark:bg-purple-500/15 p-2">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                    Service Basis
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t("noWarranty")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links to Privacy */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Also view our{" "}
            <Link
              href="/privacy"
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}