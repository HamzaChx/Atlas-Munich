import { cn } from "@/lib/utils";
import { FileQuestion, Search, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type EmptyStateType = "search" | "guides" | "places" | "general";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

const defaultContent: Record<
  EmptyStateType,
  { icon: React.ElementType; title: string; description: string }
> = {
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search terms or explore our categories.",
  },
  guides: {
    icon: BookOpen,
    title: "No guides yet",
    description: "We're working on adding more guides. Check back soon!",
  },
  places: {
    icon: MapPin,
    title: "No places found",
    description: "Try adjusting your filters or search terms.",
  },
  general: {
    icon: FileQuestion,
    title: "Nothing here",
    description: "This section is empty right now.",
  },
};

export function EmptyState({
  type = "general",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title || content.title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || content.description}
      </p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
