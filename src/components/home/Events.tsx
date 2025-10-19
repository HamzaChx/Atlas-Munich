import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { clamp } from "@/lib/text";
import { fmtDay, fmtMonth } from "@/lib/date";

type Event = { slug: string; title: string; start: string; location?: string; link?: string; };

function EventCard({ e }: { e: Event }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <CardHeader className="pb-3">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wide">{fmtMonth(e.start)}</div>
            <div className="text-xl font-bold">{fmtDay(e.start)}</div>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-base leading-tight">{clamp(e.title, 100)}</CardTitle>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{e.location ?? "Munich"}</span>
        </CardDescription>
      </CardHeader>
      {e.link && (
        <CardContent className="pt-0">
          <Button asChild variant="link" size="sm" className="h-auto p-0 text-indigo-600 dark:text-indigo-400">
            <Link href={e.link} target="_blank" rel="noreferrer">
              View details <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function Events({ events }: { events: Event[] }) {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          <Calendar className="h-4 w-4" /> Community
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Connect with fellow Moroccans and advance your career</p>
      </div>

      {events.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((e) => <EventCard key={e.slug} e={e} />)}
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-gray-600 dark:text-gray-400">No upcoming events at the moment</p>
            <Button asChild variant="outline" className="mt-4"><Link href="/events">View all events</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/events">View All Community Events <ChevronRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
