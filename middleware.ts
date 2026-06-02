import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect admin routes.
 * Redirects to /admin/login if no valid session token is found.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes, except login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken || !isValidSession(sessionToken)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Simple session validation.
 * In production, use a proper session store.
 */
function isValidSession(token: string): boolean {
  const expectedToken = process.env.ADMIN_PASSWORD;
  if (!expectedToken) return false;

  // Token is a simple hash of the password + timestamp
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [password] = decoded.split(":");
    return password === expectedToken;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};