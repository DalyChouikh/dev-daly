import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { addSeconds } from "date-fns";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 24 * 60 * 60;

/** Compares fixed-length password hashes without leaking matching prefixes. */
export function isAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(
    createHash("sha256").update(password).digest(),
    createHash("sha256").update(expected).digest(),
  );
}

/** Issues a signed token without embedding the admin password in the cookie. */
export function createAdminSession(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Admin password not configured");
  const expires = addSeconds(new Date(), SESSION_MAX_AGE).getTime();
  const payload = `${expires}.${randomBytes(32).toString("base64url")}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

/** Validates the signature and expiry; rotating ADMIN_PASSWORD revokes all sessions. */
export function isValidAdminSession(token: string | undefined): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token || token.length > 200) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!/^\d+$/.test(expires) || !/^[\w-]{43}$/.test(nonce) || !/^[\w-]{43}$/.test(signature)) return false;
  if (!Number.isSafeInteger(Number(expires)) || Number(expires) <= Date.now()) return false;
  const expected = createHmac("sha256", secret).update(`${expires}.${nonce}`).digest("base64url");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/** Checks authorization inside each handler, independently of proxy matching. */
export function requireAdmin(request: Request): Response | null {
  const token = new NextRequest(request.url, { headers: request.headers }).cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (isValidAdminSession(token)) return null;
  return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

/** Keeps login and logout cookie attributes consistent in each environment. */
export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
