import { readFile } from "fs/promises";
import { requireAdmin } from "@/lib/auth";
import { fetchGitHubFile } from "@/lib/github";
import { AdminSectionSchema } from "@/lib/types";

/**
 * Serves JSON data files for the admin editor.
 * The data/ directory is not exposed as static files, so this API
 * reads them server-side and returns the contents.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { section } = await params;
  if (!AdminSectionSchema.safeParse(section).success) {
    return Response.json(
      { success: false, error: "Invalid section" },
      { status: 400 },
    );
  }

  try {
    const filePath = `data/${section}.json`;
    if (process.env.NODE_ENV === "production") {
      const { content, sha } = await fetchGitHubFile(filePath);
      return Response.json({ success: true, data: JSON.parse(content), sha }, {
        headers: { "Cache-Control": "private, no-store" },
      });
    }
    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content);

    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read data";
    return Response.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
