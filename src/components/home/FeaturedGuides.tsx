import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { fmtUpdated } from "@/lib/date";

type Guide = { slug: string; title: string; summary: string; category: string; lastVerified: string; path: string; };

function GuideCard({ g }: { g: Guide }) {
  return (
    <Link href={g.path}>
      <Card className="group h-full transition-all hover:border-emerald-200 hover:shadow-xl dark:hover:border-emerald-800">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="secondary" className="font-semibold">{g.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" /><span>5 min read</span>
            </div>
          </div>
          <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {g.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">{g.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Updated {fmtUpdated(g.lastVerified)}</span>
            <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
              Read guide <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FeaturedGuides({ guides }: { guides: Guide[] }) {
  return (
    <section className="mb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <TrendingUp className="h-4 w-4" /> Most Popular
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Guides</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The most helpful resources from our community</p>
        </div>
        <Button asChild variant="ghost" className="hidden sm:flex">
          <Link href="/guides">
            View all guides <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {guides.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => <GuideCard key={g.slug} g={g} />)}
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold">No guides yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Be the first to contribute and help the community!</p>
            <Button asChild className="mt-6"><Link href="/contribute">Start Contributing</Link></Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
