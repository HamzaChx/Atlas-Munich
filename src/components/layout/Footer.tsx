import Link from "next/link";
import { Sparkles, Heart, Github, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  guides: [
    { label: "Housing & Rent", href: "/category/rent-housing" },
    { label: "KVR & Residence", href: "/category/kvr-residence" },
    { label: "University Life", href: "/category/university-life" },
    { label: "Career & Jobs", href: "/category/career" },
  ],
  resources: [
    { label: "Halal Places", href: "/places" },
    { label: "FAQ", href: "/faq" },
    { label: "Useful Apps", href: "/category/useful-apps" },
    { label: "Search", href: "/search" },
  ],
  community: [
    { label: "About Us", href: "/about" },
    { label: "Contribute", href: "/about#contribute" },
    { label: "Contact", href: "/about#contact" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950">
      {/* Moroccan Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)"/>
        </svg>
      </div>

      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                <span className="text-lg" role="img" aria-label="Morocco flag">🇲🇦</span>
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="text-lg" role="img" aria-label="Germany flag">🇩🇪</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Atlas
                </span>{" "}
                <span className="text-white">Munich</span>
              </span>
            </Link>
            
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              Your complete guide to thriving in Munich as a Moroccan student or professional.
              Built by the community, for the community.
            </p>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="mailto:hello@atlas-munich.de"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Guides
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Community
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Atlas Munich. All rights reserved.
          </p>
          
          <p className="flex items-center gap-1.5 text-sm text-zinc-500">
            Built with{" "}
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />{" "}
            by{" "}
            <Link
              href="https://github.com/HamzaChx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-300 transition-colors hover:text-emerald-400"
            >
              Hamza Chaouki
            </Link>
          </p>
        </div>

        {/* Cultural Touch - Flag Colors Line */}
        <div className="mt-8 flex justify-center gap-1">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-red-600 to-red-500" />
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-green-600 to-green-500" />
          <div className="h-1 w-8 rounded-full bg-zinc-900" />
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-red-600 to-red-500" />
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
        </div>
      </div>
    </footer>
  );
}
