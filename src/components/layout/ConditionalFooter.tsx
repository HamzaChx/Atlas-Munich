"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/**
 * Renders the Footer on all routes EXCEPT dedicated chat pages (e.g.
 * /bureaucracy/chat, /chat, /chat/housing). The chat interface fills the
 * full viewport, so a footer would be unusable there.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  // Anything under /chat/*, or one of the remaining /x/chat routes.
  if (pathname.startsWith("/chat/") || /\/chat\/?$/.test(pathname)) return null;
  return <Footer />;
}
