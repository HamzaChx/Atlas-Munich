import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: 1,
    key: "rent-housing",
    title: "Rent & Housing",
    description: "Find apartments, understand rental contracts, navigate the Munich housing market, and avoid scams.",
    icon: "Home",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    key: "kvr-residence",
    title: "KVR & Residence Permit",
    description: "City registration (Anmeldung), residence permits, visa extensions, and all bureaucratic procedures.",
    icon: "FileText",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    key: "university-life",
    title: "University Life",
    description: "Student ID, semester tickets, course registration, libraries, and campus resources.",
    icon: "GraduationCap",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    key: "career",
    title: "Career & Jobs",
    description: "Job search, internships, Werkstudent positions, CV tips, and networking events.",
    icon: "Briefcase",
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 5,
    key: "useful-apps",
    title: "Useful Apps & Tools",
    description: "Essential apps for transport, banking, communication, and daily life in Munich.",
    icon: "Smartphone",
    color: "from-indigo-500 to-violet-500",
  },
];

export function getCategoryByKey(key: string): Category | undefined {
  return categories.find((c) => c.key === key);
}

export function getCategoryById(id: number): Category | undefined {
  return categories.find((c) => c.id === id);
}
