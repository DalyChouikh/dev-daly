import OpenAI from "openai";
import type { AIEnhanceRequest, AIEnhanceResponse } from "./types";

/**
 * Creates an OpenRouter-compatible OpenAI client.
 * Model is configurable via OPENROUTER_MODEL env var.
 */
function createAIClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-daly.netlify.app",
      "X-Title": "Portfolio Admin",
    },
  });
}

const SYSTEM_PROMPT = `You are a professional portfolio content writer. Given a GitHub project's README content, repository metadata, and tech stack, generate compelling portfolio content.

Rules:
- Write concise, action-oriented bullet points starting with strong verbs
- Keep the tagline to one short sentence describing the project's purpose
- The enhanced description should be 1-2 sentences suitable for a portfolio card
- Return valid JSON only, no markdown fences
- Bullet points should be 3-5 items, each one line
- Focus on what the project does and its technical highlights`;

/**
 * Uses OpenRouter to generate enhanced project content from README + metadata.
 * The model is configurable via OPENROUTER_MODEL env var (defaults to openai/gpt-4o).
 */
export async function enhanceProjectDraft(
  request: AIEnhanceRequest,
): Promise<AIEnhanceResponse> {
  const client = createAIClient();
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o";

  const userContent = `Project Name: ${request.projectName}
Tech Stack: ${request.techStack.join(", ")}
Description: ${request.description}

README Content:
${request.readmeContent}

Generate a tagline, 3-5 bullet points, and an enhanced description for this project portfolio entry. Return JSON: { "tagline": "...", "bullets": ["..."], "enhancedDescription": "..." }`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI model returned empty response");
  }

  const parsed: AIEnhanceResponse = JSON.parse(content);
  return parsed;
}