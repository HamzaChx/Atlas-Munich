import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Star } from "lucide-react";

type Testimonial = { text: string; author: string };

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;

  return (
    <section className="mb-20">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <MessageCircle className="h-4 w-4" /> Community Love
        </div>
        <h2 className="text-3xl font-bold tracking-tight">What people are saying</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Card key={i} className="border-2">
            <CardContent className="pt-6">
              <div className="mb-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, i2) => (
                  <Star key={i2} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">“{t.text}”</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">— {t.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}