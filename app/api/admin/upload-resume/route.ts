import { writeFile } from "fs/promises";
import { commitBinaryFile } from "@/lib/github";

/**
 * Maximum file size in bytes (10 MB).
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Accepts a base64-encoded PDF and saves it as public/resume.pdf.
 * In development: writes directly to the filesystem.
 * In production: commits to GitHub to trigger a rebuild.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileBase64, fileName } = body as {
      fileBase64: string;
      fileName: string;
    };

    if (!fileBase64 || !fileName) {
      return Response.json(
        { success: false, error: "Missing file data or file name" },
        { status: 400 },
      );
    }

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

    const filePath = "public/resume.pdf";
    const message = `Update resume via admin panel (${new Date().toISOString()})`;

    if (process.env.NODE_ENV === "development") {
      const buffer = Buffer.from(fileBase64, "base64");
      await writeFile(filePath, buffer);
    } else {
      await commitBinaryFile(filePath, fileBase64, message);
    }

    return Response.json({ success: true, size: fileSize });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}