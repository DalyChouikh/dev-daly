import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, adminCookieOptions, createAdminSession, isAdminPassword } from "@/lib/auth";

const LoginSchema = z.object({ password: z.string().min(1).max(1024) });

/**
 * Admin authentication API.
 * POST /api/admin/auth — login (sets session cookie)
 * DELETE /api/admin/auth — logout (clears session cookie)
 */

export async function POST(request: Request) {
  try {
    const { password } = LoginSchema.parse(await request.json());

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      return Response.json(
        { success: false, error: "Admin password not configured" },
        { status: 500 },
      );
    }

    if (!isAdminPassword(password)) {
      return Response.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminSession(), adminCookieOptions());

    return response;
  } catch {
    return Response.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions(), maxAge: 0 });

  return response;
}
