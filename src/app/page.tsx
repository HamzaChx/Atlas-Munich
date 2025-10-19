import { guidesIndex } from "@/data/guides-index";
import { events as EVENTS_RAW } from "@/data/events";
import { places } from "@/data/places";
import { Hero, Stats, Categories, FeaturedGuides, Events, Testimonials, ContributeCTA } from "@/components/home";
import { isUpcoming } from "@/lib/date";

const norm = (s: string) => s.toLowerCase();
const countByCategory = (label: string) =>
  guidesIndex.filter((g) => norm(g.category) === norm(label)).length;

const TOP_GUIDES = [...guidesIndex].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 6);
const UPCOMING = EVENTS_RAW.filter((e) => isUpcoming(e.start))
  .sort((a, b) => +new Date(a.start) - +new Date(b.start))
  .slice(0, 4);

const TESTIMONIALS = [
  { text: "This saved me hours of research when I first moved!", author: "Youssef, TUM Student" },
  { text: "Finally found halal restaurants near campus!", author: "Fatima, LMU" },
  { text: "The KVR guide made my Anmeldung so much easier.", author: "Ahmed, Working Professional" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-center">
          <Stats guidesCount={guidesIndex.length} placesCount={places.length} eventsCount={EVENTS_RAW.length} />
        </section>

        {/* Mission */}
        <section className="mb-20 mt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Making Munich feel like home</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              We know how overwhelming it can be to start fresh in a new city. That’s why we built this platform —
              <span className="font-semibold text-gray-900 dark:text-white"> to share knowledge, connect our community, and help every Moroccan in Munich thrive</span>.
              From bureaucracy to finding the best couscous, we’ve got you covered.
            </p>
          </div>
        </section>

        <Categories guidesCountBy={countByCategory} placesCount={places.length} eventsCount={EVENTS_RAW.length} />
        <FeaturedGuides guides={TOP_GUIDES} />
        <Events events={UPCOMING} />
        <Testimonials items={TESTIMONIALS} />
        <ContributeCTA />
      </div>

      <footer className="border-t bg-gray-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Built with ❤️ by Hamza Chaouki</p>
        </div>
      </footer>
    </div>
  );
}
