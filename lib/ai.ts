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
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000",
      "X-Title": "Portfolio Admin",
    },
  });
}

const SYSTEM_PROMPT = `You are a professional portfolio content writer and technical editor. Given a GitHub project's README content, repository metadata, and existing tech stack, generate polished, compelling portfolio content.

## Title Rules
- If the original title looks "code-ish" (kebab-case like "qr-code-generator", snake_case like "my_app", all lowercase like "drawly", or has numbers/symbols), humanize it into a proper product name.
- "drawly" → "Drawly"
- "qr-code-generator" → "QR Code Generator"
- "ai_resume_parser" → "AI Resume Parser"
- "my-portfolio-v2" → "My Portfolio"
- If the title already looks like a proper name (e.g., "React", "Stripe", "Vercel", "Supabase"), keep it exactly as-is.
- Capitalize major words. Remove version numbers and redundant suffixes.

## Tech Stack Rules
- The provided tech stack comes from GitHub metadata (language + topics) and may be incomplete or noisy.
- Scan the README carefully for technologies explicitly mentioned: frameworks, libraries, databases, cloud services, APIs, tools, etc.
- Merge the discovered README technologies with the provided tech stack.
- Remove duplicates (case-insensitive). Remove irrelevant GitHub topics like "hacktoberfest", "good-first-issue", "tutorial", "portfolio", "readme", "awesome-list".
- Keep only genuine technologies used in the project. Return 3-8 items max.
- Use proper, recognizable names: "Next.js" not "nextjs", "PostgreSQL" not "postgresql", "Tailwind CSS" not "tailwindcss", "shadcn/ui" not "shadcn".

## Bullet Point Rules
- Write 3-5 concise, action-oriented bullet points starting with strong verbs (Built, Implemented, Designed, Engineered, Architected, etc.).
- These bullets will be APPENDED to existing bullets, so focus on NEW insights the README reveals — not repeating what's already obvious.
- Each bullet should be one line, 80-140 characters.
- Highlight technical complexity, scale, or unique features.

## Tagline Rules
- One punchy sentence describing the project's purpose and value.
- 60-100 characters. Professional but engaging.

## Enhanced Description Rules
- A polished 1-2 sentence overview suitable for a portfolio card.
- This will be used as a summary/overview bullet.

## Output Format
Return ONLY valid JSON, no markdown fences, no explanation:
{ "title": "...", "tagline": "...", "techStack": ["..."], "bullets": ["..."], "enhancedDescription": "..." }`;

/**
 * Uses OpenRouter to generate enhanced project content from README + metadata.
 * The model is configurable via OPENROUTER_MODEL env var (defaults to openai/gpt-4o).
 */
export async function enhanceProjectDraft(
  request: AIEnhanceRequest,
): Promise<AIEnhanceResponse> {
  const client = createAIClient();
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o";

  const userContent = `Original Title: ${request.originalTitle}
Current Title: ${request.projectName}
Description: ${request.description}
Provided Tech Stack: ${request.techStack.join(", ")}

README Content:
${request.readmeContent}

Generate a humanized title (if needed), a tagline, a merged and cleaned tech stack, 3-5 action-oriented bullet points, and an enhanced description. Return valid JSON only.`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0.6,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI model returned empty response");
  }

  const parsed: AIEnhanceResponse = JSON.parse(content);
  return parsed;
}