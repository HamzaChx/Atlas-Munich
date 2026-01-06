import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  HomeIcon,
  GraduationCap,
  FileText,
  UtensilsCrossed,
  Briefcase,
  Users,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

type Category = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  color: string;
  count: string | number;
};

function CategoryCard({ icon: Icon, title, desc, href, color, count }: Category) {
  return (
    <Link href={href}>
      <Card className="group h-full overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl">
        <div className={`h-2 bg-gradient-to-r ${color}`} />
        <CardHeader className="pb-4">
          <div className="mb-4 flex items-start justify-between">
            <div className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow-lg`}>
              <Icon className="h-7 w-7" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {count} resources
            </Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Explore guides
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Categories({
  guidesCountBy,
  placesCount,
  eventsCount,
}: {
  guidesCountBy: (label: string) => number;
  placesCount: number;
  eventsCount: number;
}) {
  const items: Category[] = [
    {
      icon: HomeIcon,
      title: "Housing & Registration",
      desc: "Find apartments, understand Anmeldung, navigate the rental market",
      href: "/guides/housing",
      color: "from-blue-500 to-cyan-500",
      count: guidesCountBy("housing") || "2+",
    },
    {
      icon: GraduationCap,
      title: "University Life",
      desc: "Student ID, semester tickets, courses, libraries, and campus tips",
      href: "/guides/university",
      color: "from-purple-500 to-pink-500",
      count: guidesCountBy("university") || "3+",
    },
    {
      icon: FileText,
      title: "KVR & Bureaucracy",
      desc: "Immigration office, residence permits, visa extensions",
      href: "/guides/kvr",
      color: "from-emerald-500 to-teal-500",
      count: guidesCountBy("immigration") || "4+",
    },
    {
      icon: UtensilsCrossed,
      title: "Halal Food & Culture",
      desc: "Moroccan restaurants, halal butchers, Middle Eastern groceries",
      href: "/places?category=food",
      color: "from-orange-500 to-red-500",
      count: `${placesCount}+`,
    },
    {
      icon: Briefcase,
      title: "Career & Opportunities",
      desc: "Job search, internships, CV tips, networking events",
      href: "/guides/career",
      color: "from-red-500 to-rose-500",
      count: guidesCountBy("careers") || "2+",
    },
    {
      icon: Users,
      title: "Community & Events",
      desc: "Meet other Moroccans, cultural events, sports groups",
      href: "/events",
      color: "from-indigo-500 to-purple-500",
      count: `${eventsCount}+`,
    },
  ];

  return (
    <section className="mb-12 sm:mb-20">
      <div className="mb-8 sm:mb-10 text-center px-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Everything you need to know
        </h2>
        <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Explore guides organized by topic
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <CategoryCard key={c.href} {...c} />
        ))}
      </div>
    </section>
  );
}
