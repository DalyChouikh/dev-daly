import { getYear } from "date-fns";
import { parseGitHubUrl, fetchRepoMetadata, fetchRepoReadme } from "@/lib/github";
import type { DraftProject } from "@/lib/types";

/**
 * Generates a draft project entry from a GitHub repository URL.
 * Fetches repo metadata and README to populate the draft.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repoUrl } = body as { repoUrl: string };

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const [metadata, readme] = await Promise.all([
      fetchRepoMetadata(owner, repo),
      fetchRepoReadme(owner, repo),
    ]);

    const year = metadata.createdAt
      ? getYear(new Date(metadata.createdAt)).toString()
      : getYear(new Date()).toString();

    // Build tech stack from language + topics
    const techStack: string[] = [];
    if (metadata.language) {
      techStack.push(metadata.language);
    }
    if (metadata.topics && metadata.topics.length > 0) {
      techStack.push(...metadata.topics.slice(0, 4));
    }

    // Generate bullets from README (first few lines) or description
    const bullets: string[] = [];
    if (metadata.description) {
      bullets.push(metadata.description);
    }

    // Try to extract first paragraph from README
    const readmeLines = readme.split("\n").filter((line) => line.trim().length > 0);
    const firstParagraph = readmeLines.find((line) => !line.startsWith("#") && line.trim().length > 20);
    if (firstParagraph && !bullets.includes(firstParagraph)) {
      bullets.push(firstParagraph.substring(0, 150));
    }

    const draft: DraftProject = {
      id: `${owner}-${repo}`,
      title: repo,
      tagline: metadata.description ?? "A software project",
      techStack: techStack.length > 0 ? techStack : ["Unknown"],
      year,
      githubUrl: repoUrl,
      liveUrl: metadata.homepage ?? "",
      bullets: bullets.length > 0 ? bullets : ["Project details to be added."],
    };

    return Response.json({ success: true, draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}