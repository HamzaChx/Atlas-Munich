import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Search, Sparkles, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-50 via-white to-rose-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Ambient blobs */}
      <div className="absolute -top-24 right-1/4 h-96 w-96 animate-pulse rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/10" />
      <div className="absolute -bottom-24 left-1/4 h-96 w-96 animate-pulse rounded-full bg-rose-200/20 blur-3xl dark:bg-rose-900/10" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber-200/10 blur-3xl dark:bg-amber-900/10" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-white/90 px-5 py-2.5 shadow-lg backdrop-blur-sm dark:border-emerald-900 dark:bg-zinc-900/90">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">Community-driven knowledge base</span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl" role="img" aria-label="Morocco flag">
              🇲🇦
            </span>
            <Sparkles className="h-8 w-8 text-amber-500" aria-hidden="true" />
            <span className="text-6xl" role="img" aria-label="Germany flag">
              🇩🇪
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Welcome to
            <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-teal-600 to-rose-600 bg-clip-text text-transparent">
              Atlas Munich
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 sm:text-2xl">
            The complete starter guide for{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Moroccan students and professionals
            </span>{" "}
            in Munich
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-gray-400">
            From finding housing to landing your dream job, everything you need to thrive in Munich,
            curated by our community
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group h-14 px-10 text-lg shadow-lg">
              <Link href="/guides">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore All Guides
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 border-2 px-10 text-lg">
              <Link href="/guides">
                <Search className="mr-2 h-5 w-5" />
                Search Everything
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
