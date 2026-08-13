import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Github, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const linkColumns = [
  {
    titleKey: "guides",
    links: [
      { labelKey: "links.housingRent", href: "/map" },
      { labelKey: "links.kvrResidence", href: "/essentials" },
      { labelKey: "links.universityLife", href: "/essentials" },
      { labelKey: "links.careerJobs", href: "/career" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { labelKey: "links.halalPlaces", href: "/map" },
      { labelKey: "links.faq", href: "/essentials#questions" },
      { labelKey: "links.usefulApps", href: "/career" },
      { labelKey: "links.aiTools", href: "/tools" },
    ],
  },
  {
    titleKey: "community",
    links: [
      { labelKey: "links.aboutUs", href: "/about" },
      { labelKey: "links.contribute", href: "/community#contribute" },
      { labelKey: "links.contact", href: "/about#contact" },
    ],
  },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    // The bottom padding clears the floating mobile nav controls, which
    // would otherwise sit on top of the last row of footer links.
    <footer className="bg-zinc-100/60 pb-20 dark:bg-zinc-900/40 md:pb-0">
      <div className="mx-auto max-w-[1280px] 2xl:max-w-[96rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 2xl:px-12 safe-area-bottom">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-zellige/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Atlas Munich
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t("description")}
            </p>
            <p className="mt-3 flex items-baseline gap-2 text-sm text-terracotta">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] [font-stretch:118%]">
                Servus
              </span>
              <span className="h-1 w-1 self-center rounded-full bg-saffron" aria-hidden="true" />
              <span dir="rtl" lang="ar" className="font-semibold">
                مرحبا
              </span>
            </p>
          </div>

          {/* Link columns */}
          {linkColumns.map((column) => (
            <div key={column.titleKey}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                {t(column.titleKey)}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 -my-1 text-sm text-zinc-500 transition-colors duration-200 hover:text-zellige dark:text-zinc-400 outline-none focus-visible:text-zellige"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Single bottom row: copyright, legal, socials */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} Atlas Munich. {t("rights")}{" "}
            <Link
              href="https://hamzachaouki.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-zellige outline-none focus-visible:text-zellige"
            >
              Hamza Chaouki
            </Link>
          </p>

          <div className="flex items-center gap-4 py-4">
            <Link
              href="/privacy"
              className="py-2 -my-2 text-xs text-zinc-500 transition-colors hover:text-zellige dark:text-zinc-400"
            >
              {t("links.privacy")}
            </Link>
            <Link
              href="/terms"
              className="py-2 -my-2 text-xs text-zinc-500 transition-colors hover:text-zellige dark:text-zinc-400"
            >
              {t("links.terms")}
            </Link>
            <Link
              href="https://github.com/HamzaChx/Atlas-Munich"
              target="_blank"
              rel="noopener noreferrer"
              className="flex p-2 -m-1 text-zinc-500 transition-colors duration-200 hover:text-zellige dark:text-zinc-400 outline-none focus-visible:text-zellige"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="mailto:hamza.chaouki@tum.de"
              className="flex p-2 -m-1 text-zinc-500 transition-colors duration-200 hover:text-zellige dark:text-zinc-400 outline-none focus-visible:text-zellige"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
