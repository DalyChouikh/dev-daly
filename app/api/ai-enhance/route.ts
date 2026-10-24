import { ZodError } from "zod";
import { enhanceProjectDraft } from "@/lib/ai";
import { requireAdmin } from "@/lib/auth";
import { AIEnhanceRequestSchema } from "@/lib/types";

/**
 * Enhances a project draft using AI via OpenRouter.
 * Takes draft data + README content and returns polished descriptions.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { originalTitle, projectName, description, readmeContent, techStack } = AIEnhanceRequestSchema.parse(await request.json());

    const result = await enhanceProjectDraft({
      originalTitle,
      projectName,
      description,
      readmeContent,
      techStack,
    });

    return Response.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: error instanceof ZodError || error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
