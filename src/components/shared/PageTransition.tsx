"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageTransition component following premium UI principles:
 * - Rule 35: Animations 150-300ms
 * - Rule 36: Motion to explain cause and effect
 * - Rule 41: Speed is UX
 * - Rule 43: Avoid layout shifts
 */
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure smooth entrance
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-2",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Staggered animation wrapper for list items
 * Rule 36: Motion to explain cause and effect
 */
interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // ms between each child animation
}

export function StaggerChildren({ 
  children, 
  className,
  staggerDelay = 50 
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{ 
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: "backwards"
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * Section reveal animation on scroll
 */
interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealSection({ children, className }: RevealSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}
