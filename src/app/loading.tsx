import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zellige" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
