import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroBadge } from "@/components/shared";
import {
  Users,
  Heart,
  Github,
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  MapPin,
  Globe,
  ExternalLink,
  Star,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Atlas Munich - the community-driven guide for Moroccan students and professionals in Munich.",
};

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "Built by Moroccans in Munich, for Moroccans in Munich. Every piece of advice comes from real experience.",
    gradient: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-400",
  },
  {
    icon: CheckCircle2,
    title: "Accuracy Matters",
    description: "We verify information regularly and update guides to reflect the latest processes and requirements.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Globe,
    title: "Open & Free",
    description: "All content is free and open source. We believe knowledge should be accessible to everyone.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
  },
];

const contributors = [
  { name: "Hamza Chaouki", role: "Founder & Developer", avatar: "👨‍💻" },
];

const ways = [
  {
    icon: MessageCircle,
    title: "Suggest Updates",
    description: "Found outdated info? Know a better way? Reach out to us!",
    action: { label: "Contact Us", href: "mailto:hello@atlas-munich.de" },
  },
  {
    icon: Star,
    title: "Spread the Word",
    description: "Share Atlas Munich with other Moroccans coming to Munich. Word of mouth helps!",
    action: { label: "Share", href: "#" },
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-400/30 dark:from-emerald-600/20 to-teal-400/30 dark:to-teal-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 z-[5] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-rose-400/25 dark:from-rose-500/15 to-amber-400/25 dark:to-amber-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left: story-driven intro */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <HeroBadge icon={Users} text="Community Project" color="emerald" />
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
                About{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Atlas Munich
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 lg:mx-0">
                Atlas Munich is a community guide built to reduce the friction of arriving in Munich — especially for Moroccan students navigating bureaucracy, housing, and daily life.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild className="text-white bg-emerald-600 px-6 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500">
                  <Link href="#contribute">
                    <Sparkles className="mr-2 h-4 w-4" />
                    How to Contribute
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-zinc-200 dark:border-white/10 px-6 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <Link href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: manifesto card (distinct from homepage stats) */}
            <div className="mx-auto w-full max-w-xl mt-8">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <Heart className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                    Built for newcomers
                  </div>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    A guide that feels like a friend
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    We focus on practical steps, real experiences, and small details that make Munich easier to navigate.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[ 
                      { icon: CheckCircle2, title: "Practical, step-by-step", desc: "No fluff — just what works." },
                      { icon: BookOpen, title: "Student-aware", desc: "LMU/TUM realities, deadlines, and systems." },
                      { icon: Github, title: "Open source", desc: "Anyone can improve it — transparently." },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                        <div className="mt-0.5 inline-flex rounded-lg bg-emerald-100 dark:bg-emerald-500/15 p-2">
                          <item.icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</div>
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
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 dark:border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/10 px-4 py-2">
              <span className="text-sm">📖</span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Our Story</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Why We Built This
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>
                Moving to Munich as a Moroccan student or professional can be overwhelming. 
                The bureaucracy is complex, finding housing is challenging, and figuring out 
                where to find halal food takes time.
              </p>
              <p>
                <span className="font-semibold text-zinc-900 dark:text-white">Atlas Munich was born from this experience.</span>{" "}
                We wanted to create a single, trusted resource that answers all the questions 
                newcomers have — the same questions we once had.
              </p>
              <p>
                Today, Atlas Munich is a growing collection of guides, tips, and resources 
                maintained by volunteers who have been through it all and want to help others 
                do the same.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300 dark:border-rose-500/30 bg-rose-100 dark:bg-rose-500/10 px-4 py-2">
              <span className="text-sm">💡</span>
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">What We Believe</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Our Values</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 text-center shadow-lg dark:shadow-none backdrop-blur-sm transition-all hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
              >
                <div className={`mx-auto mb-4 inline-flex rounded-xl bg-gradient-to-br ${value.gradient} p-3`}>
                  <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Contribute */}
        <section id="contribute" className="mb-20 scroll-mt-24">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 dark:border-amber-500/30 bg-amber-100 dark:bg-amber-500/10 px-4 py-2">
              <span className="text-sm">🤝</span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Get Involved</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">How to Contribute</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Atlas Munich is open source and community-driven. Here&apos;s how you can help:
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {ways.map((way) => (
              <div
                key={way.title}
                className="group rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 shadow-lg dark:shadow-none backdrop-blur-sm transition-all hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-2.5">
                    <way.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{way.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{way.description}</p>
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-300 dark:border-purple-500/30 bg-purple-100 dark:bg-purple-500/10 px-4 py-2">
              <span className="text-sm">👥</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">The Team</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Contributors</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {contributors.map((contributor) => (
              <div
                key={contributor.name}
                className="w-56 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-5 text-center shadow-lg dark:shadow-none backdrop-blur-sm"
              >
                <div className="mx-auto mb-3 text-4xl">{contributor.avatar}</div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{contributor.name}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{contributor.role}</p>
              </div>
            ))}
            
            {/* Join CTA */}
            <div className="w-56 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30 p-5 text-center">
              <div className="mx-auto mb-3 text-4xl">🙋</div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">You?</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Join the team!</p>
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                Contribute on GitHub
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 dark:from-zinc-900 dark:via-emerald-950/20 dark:to-zinc-900 p-6 md:p-10">
            {/* Background decoration */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-3xl" />
            
            <div className="relative text-center">
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-200 dark:from-emerald-500/20 to-teal-200 dark:to-teal-500/20 p-3">
                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">Get in Touch</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                Have questions, suggestions, or just want to say hello? We&apos;d love to hear from you!
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="https://github.com/HamzaChx/Atlas-Munich"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
                <Link
                  href="mailto:hello@atlas-munich.de"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
