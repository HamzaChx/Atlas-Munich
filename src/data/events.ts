export type EventItem = {
  slug: string;
  title: string;
  start: string;  // ISO date
  end?: string;
  location?: string;
  link?: string;
  category?: "career" | "community";
};

export const events: EventItem[] = [
  {
    slug: "placeholder-career-fair",
    title: "Placeholder Career Fair",
    start: "2025-11-05",
    end: "2025-11-05",
    location: "Garching Campus",
    link: "#",
    category: "career"
  },
  {
    slug: "placeholder-tech-meetup",
    title: "Placeholder Tech Meetup",
    start: "2025-11-18",
    location: "Munich City Center",
    link: "#",
    category: "community"
  },
  {
    slug: "placeholder-language-exchange",
    title: "Placeholder Language Exchange (AR/FR/EN/DE)",
    start: "2025-12-03",
    location: "Maxvorstadt",
    link: "#",
    category: "community"
  },
  {
    slug: "placeholder-resume-workshop",
    title: "Placeholder Resume Workshop",
    start: "2025-12-10",
    location: "Online",
    link: "#",
    category: "career"
  }
];
