import { writeFile } from "fs/promises";
import { commitFile } from "@/lib/github";

/**
 * Saves updated JSON data to the data files.
 * In development: writes directly to local filesystem.
 * In production: commits to GitHub repo via Contents API.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body as { section: string; data: unknown };

    const filePath = `data/${section}.json`;
    const content = JSON.stringify(data, null, 2) + "\n";
    const message = `Update ${section} data via admin panel`;

    if (process.env.NODE_ENV === "development") {
      // Write directly to local file
      await writeFile(filePath, content, "utf-8");
    } else {
      // Commit to GitHub
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