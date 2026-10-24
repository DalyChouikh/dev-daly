import { writeFile } from "fs/promises";
import { z, ZodError } from "zod";
import { commitBinaryFile } from "@/lib/github";
import { requireAdmin } from "@/lib/auth";

/**
 * Maximum file size in bytes (10 MB).
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const UploadSchema = z.object({
  fileBase64: z.string().min(1).regex(/^[A-Za-z0-9+/]+={0,2}$/),
  fileName: z.string().min(1),
});

/**
 * Accepts a base64-encoded PDF and saves it as public/resume.pdf.
 * In development: writes directly to the filesystem.
 * In production: commits to GitHub to trigger a rebuild.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { fileBase64, fileName } = UploadSchema.parse(await request.json());

    const fileSize = Buffer.byteLength(fileBase64, "base64");
    if (fileSize > MAX_FILE_SIZE) {
      return Response.json(
        { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024} MB limit` },
        { status: 413 },
      );
    }

    if (!fileName.toLowerCase().endsWith(".pdf")) {
      return Response.json(
        { success: false, error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(fileBase64, "base64");
    if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      return Response.json({ success: false, error: "File must contain a PDF document" }, { status: 400 });
    }

    const filePath = "public/resume.pdf";
    const message = `Update resume via admin panel (${new Date().toISOString()})`;

    if (process.env.NODE_ENV === "development") {
      await writeFile(filePath, buffer);
    } else {
      await commitBinaryFile(filePath, fileBase64, message);
    }

    return Response.json({ success: true, size: fileSize });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: error instanceof ZodError || error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
