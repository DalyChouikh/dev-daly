/**
 * Admin authentication API.
 * POST /api/admin/auth — login (sets session cookie)
 * DELETE /api/admin/auth — logout (clears session cookie)
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      return Response.json(
        { success: false, error: "Admin password not configured" },
        { status: 500 },
      );
    }

    if (password !== expectedPassword) {
      return Response.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    // Create session token (base64 encoded password:timestamp)
    const token = Buffer.from(`${password}:${Date.now()}`).toString("base64");

    const response = Response.json({ success: true });

    // Set cookie
    response.headers.set(
      "Set-Cookie",
      `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
    );

    return response;
  } catch {
    return Response.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const response = Response.json({ success: true });

  // Clear cookie
  response.headers.set(
    "Set-Cookie",
    "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
  );

  return response;
}