import { writeFile } from "fs/promises";
import { ZodError } from "zod";
import { commitFile, GitHubConflictError } from "@/lib/github";
import { requireAdmin } from "@/lib/auth";
import { AdminSaveRequestSchema } from "@/lib/types";

/**
 * Saves updated JSON data to the data files.
 * In development: writes directly to local filesystem for instant feedback.
 * In production: commits to GitHub repo to trigger a Vercel rebuild.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { section, data, sha } = AdminSaveRequestSchema.parse(await request.json());
    if (process.env.NODE_ENV === "production" && !sha) {
      return Response.json({ success: false, error: "Reload the editor to get the current file revision before saving." }, { status: 409 });
    }

    const filePath = `data/${section}.json`;
    const content = JSON.stringify(data, null, 2) + "\n";
    const message = `Update ${section} data via admin panel`;

    if (process.env.NODE_ENV === "development") {
      await writeFile(filePath, content, "utf-8");
    } else {
      const result = await commitFile(filePath, content, message, sha);
      return Response.json({ success: true, sha: result.fileSha, commitSha: result.commitSha });
    }

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: error instanceof GitHubConflictError ? 409 : error instanceof ZodError || error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
