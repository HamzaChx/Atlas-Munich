import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="moroccan-about" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.8"/>
                <path d="M30 20L40 30L30 40L20 30Z" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#moroccan-about)"/>
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-500/15 to-amber-500/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-zinc-300">Community Project</span>
            </div>

            {/* Cultural flags */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="text-5xl" role="img" aria-label="Morocco flag">🇲🇦</span>
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
                <Sparkles className="h-6 w-6 text-amber-400" />
                <span className="h-px w-8 bg-gradient-to-r from-black via-red-500 to-amber-400" />
              </div>
              <span className="text-5xl" role="img" aria-label="Germany flag">🇩🇪</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Atlas Munich
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Your trusted guide to navigating life in Munich as a Moroccan student or professional. 
              Built by the community, for the community.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        {/* Our Story */}
        <section className="mb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">Our Story</span>
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why We Built This
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-400">
              <p>
                Moving to Munich as a Moroccan student or professional can be overwhelming. 
                The bureaucracy is complex, finding housing is challenging, and figuring out 
                where to find halal food takes time.
              </p>
              <p>
                <span className="font-semibold text-white">Atlas Munich was born from this experience.</span>{" "}
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
        <section className="mb-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">What We Believe</span>
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Values</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-8 text-center backdrop-blur-sm transition-all hover:border-white/20 hover:bg-zinc-900/80"
              >
                <div className={`mx-auto mb-5 inline-flex rounded-2xl bg-gradient-to-br ${value.gradient} p-4`}>
                  <value.icon className={`h-7 w-7 ${value.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                <p className="mt-3 text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Contribute */}
        <section id="contribute" className="mb-24 scroll-mt-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-amber-400">Get Involved</span>
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How to Contribute</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Atlas Munich is open source and community-driven. Here&apos;s how you can help:
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {ways.map((way) => (
              <div
                key={way.title}
                className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-zinc-900/80"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-3">
                    <way.icon className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{way.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{way.description}</p>
                    <Link
                      href={way.action.href}
                      target={way.action.href.startsWith("http") ? "_blank" : undefined}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      {way.action.label}
                      {way.action.href.startsWith("http") ? (
                        <ExternalLink className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contributors */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-purple-400">The Team</span>
              <span className="h-1 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Contributors</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((contributor) => (
              <div
                key={contributor.name}
                className="w-64 rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 text-5xl">{contributor.avatar}</div>
                <h3 className="font-semibold text-white">{contributor.name}</h3>
                <p className="text-sm text-zinc-400">{contributor.role}</p>
              </div>
            ))}
            
            {/* Join CTA */}
            <div className="w-64 rounded-2xl border-2 border-dashed border-white/10 bg-zinc-900/30 p-6 text-center">
              <div className="mx-auto mb-4 text-5xl">🙋</div>
              <h3 className="font-semibold text-white">You?</h3>
              <p className="text-sm text-zinc-400">Join the team!</p>
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                Contribute on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-zinc-900 via-emerald-950/20 to-zinc-900 p-8 md:p-12">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
            
            <div className="relative text-center">
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3">
                <Mail className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Get in Touch</h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                Have questions, suggestions, or just want to say hello? We&apos;d love to hear from you!
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600">
                  <Link href="https://github.com/HamzaChx/Atlas-Munich" target="_blank">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="mailto:hello@atlas-munich.de">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
