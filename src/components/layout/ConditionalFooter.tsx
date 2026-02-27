"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/**
 * Renders the Footer on all routes EXCEPT dedicated chat pages (e.g. /housing/chat).
 * The chat interface fills the full viewport, so a footer would be unusable there.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  // Match any path that ends with /chat (handles all tool chat routes)
  if (/\/chat\/?$/.test(pathname)) return null;
  return <Footer />;
}
