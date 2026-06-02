import { writeFile } from "fs/promises";
import { commitFile } from "@/lib/github";
import type { JsonValue } from "@/lib/types";

/**
 * Saves updated JSON data to the data files.
 * In development: writes directly to local filesystem for instant feedback.
 * In production: commits to GitHub repo to trigger a Vercel rebuild.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body as { section: string; data: JsonValue };

    const filePath = `data/${section}.json`;
    const content = JSON.stringify(data, null, 2) + "\n";
    const message = `Update ${section} data via admin panel`;

    if (process.env.NODE_ENV === "development") {
      await writeFile(filePath, content, "utf-8");
    } else {
      await commitFile(filePath, content, message);
    }

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}