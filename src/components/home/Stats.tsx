import { BookOpen, MapPin, Users } from "lucide-react";

function StatItem({ icon: Icon, value, label, accentClass }: { icon: any; value: string | number; label: string; accentClass: string; }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`mb-3 rounded-full p-3 ${accentClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-4xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

export function Stats({ guidesCount, placesCount, eventsCount }: { guidesCount: number; placesCount: number; eventsCount: number; }) {
  return (
    <div className="mt-16 grid grid-cols-3 gap-6 border-t border-gray-200 pt-12 dark:border-zinc-800 sm:gap-12">
      <StatItem icon={BookOpen} value={`${guidesCount}+`} label="Comprehensive Guides" accentClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
      <StatItem icon={MapPin} value={`${placesCount}+`} label="Verified Places" accentClass="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" />
      <StatItem icon={Users} value={`${eventsCount}+`} label="Community Events" accentClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" />
    </div>
  );
}
