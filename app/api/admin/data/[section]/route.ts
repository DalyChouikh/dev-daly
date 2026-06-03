import { readFile } from "fs/promises";

/**
 * Serves JSON data files for the admin editor.
 * The data/ directory is not exposed as static files, so this API
 * reads them server-side and returns the contents.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;

  const allowedSections = [
    "profile",
    "experience",
    "education",
    "projects",
    "skills",
    "leadership",
    "certifications",
    "languages",
    "site",
  ];

  if (!allowedSections.includes(section)) {
    return Response.json(
      { success: false, error: "Invalid section" },
      { status: 400 },
    );
  }

  try {
    const filePath = `data/${section}.json`;
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