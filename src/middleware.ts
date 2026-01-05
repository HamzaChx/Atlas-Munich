import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr", "de", "ar"] as const;
const defaultLocale = "en";
const COOKIE_NAME = "NEXT_LOCALE";

export function middleware(request: NextRequest) {
  // Get locale from cookie or use default
  const localeCookie = request.cookies.get(COOKIE_NAME)?.value;
  const locale = locales.includes(localeCookie as typeof locales[number])
    ? localeCookie
    : defaultLocale;

  // Create response with locale header for next-intl
  const response = NextResponse.next();
  
  // Set the locale in the request headers for next-intl to pick up
  response.headers.set("x-next-intl-locale", locale!);
  
  return response;
}

export const config = {
  // Match all paths except static files and api routes
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
