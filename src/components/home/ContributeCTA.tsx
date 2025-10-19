import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

export function ContributeCTA() {
  return (
    <section className="mb-20">
      <Card className="overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:border-emerald-900 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-teal-950/30">
        <CardContent className="relative p-10 text-center md:p-16">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-200/50 blur-2xl dark:bg-emerald-900/30" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-rose-200/50 blur-2xl dark:bg-rose-900/30" />
          <div className="relative mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" /> Join the Movement
            </div>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Help us keep this guide accurate & growing</h3>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              This is a community-driven project. Your experiences, corrections, and contributions help thousands of Moroccans navigate Munich successfully.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 shadow-lg">
                <Link href="https://github.com/yourusername/munich-morocco/issues/new" target="_blank" rel="noreferrer">
                  <Sparkles className="mr-2 h-5 w-5" /> Suggest an Update
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-2 px-8">
                <Link href="/contribute">Learn How to Contribute</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              {["Free forever", "Open source", "Community-driven"].map((txt) => (
                <div key={txt} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
