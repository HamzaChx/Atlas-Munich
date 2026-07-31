"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GuideSection } from "@/types";

interface TableOfContentsProps {
  sections: GuideSection[];
  className?: string;
}

export function TableOfContents({ sections, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);

      section.subsections?.forEach((sub) => {
        const subElement = document.getElementById(sub.id);
        if (subElement) observer.observe(subElement);
      });
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className={cn("space-y-1", className)} aria-label="Table of contents">
      <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">On this page</p>
      <ul className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={cn(
                "block rounded-md py-1.5 pl-3 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50",
                activeId === section.id
                  ? "border-l-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
                  : "border-l-2 border-transparent text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600"
              )}
            >
              {section.title}
            </a>
            {section.subsections && section.subsections.length > 0 && (
              <ul className="mt-1 space-y-1">
                {section.subsections.map((sub) => (
                  <li key={sub.id}>
                    <a
                      href={`#${sub.id}`}
                      onClick={(e) => handleClick(e, sub.id)}
                      className={cn(
                        "block rounded-md py-1 pl-6 text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-50",
                        activeId === sub.id
                          ? "font-medium text-emerald-700 dark:text-emerald-400"
                          : "text-zinc-500"
                      )}
                    >
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
