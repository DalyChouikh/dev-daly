import { enhanceProjectDraft } from "@/lib/ai";
import type { AIEnhanceRequest } from "@/lib/types";

/**
 * Enhances a project draft using AI via OpenRouter.
 * Takes draft data + README content and returns polished descriptions.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, description, readmeContent, techStack } = body as AIEnhanceRequest;

    const result = await enhanceProjectDraft({
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
      { status: 500 },
    );
  }
}