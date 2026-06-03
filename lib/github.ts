import type { RepoMetadata } from "./types";

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  homepage: string | null;
  created_at: string;
  updated_at: string;
}

interface GitHubContentResponse {
  content: string;
  encoding: string;
}

interface GitHubCommitResponse {
  commit?: { sha?: string };
}

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Fetches repository metadata from the GitHub REST API.
 * Uses GITHUB_TOKEN env var if available for higher rate limits.
 */
export async function fetchRepoMetadata(
  owner: string,
  repo: string,
): Promise<RepoMetadata> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: GitHubRepoResponse = await response.json();

  return {
    name: data.name,
    description: data.description,
    language: data.language,
    stargazersCount: data.stargazers_count,
    topics: data.topics,
    homepage: data.homepage,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Fetches the README content for a repository.
 * Tries common README filenames and returns decoded content.
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string,
): Promise<string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const readmeFilenames = ["README.md", "readme.md", "README", "README.rst"];
  let lastError: Error | null = null;

  for (const filename of readmeFilenames) {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filename}`,
      { headers },
    );

    if (!response.ok) {
      lastError = new Error(
        `GitHub API error for ${filename}: ${response.status}`,
      );
      continue;
    }

    const data: GitHubContentResponse = await response.json();

    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
  }

  return lastError?.message ?? "README not found";
}

/**
 * Gets the current SHA of a file in the GitHub repository.
 * Returns undefined if the file does not exist.
 */
export async function getFileSha(path: string): Promise<string | undefined> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return undefined;

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) return undefined;

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=main`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) return undefined;

    const data = await response.json() as { sha?: string };
    return data.sha;
  } catch {
    return undefined;
  }
}

/**
 * Commits a file to the GitHub repository using the Contents API.
 * Requires GITHUB_TOKEN with repo scope.
 */
export async function commitFile(
  path: string,
  content: string,
  message: string,
  sha?: string,
): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) {
    throw new Error(
      "GITHUB_REPO_OWNER and GITHUB_REPO_NAME environment variables are not set",
    );
  }

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: "main",
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GitHub Contents API error: ${response.status} ${errorBody}`,
    );
  }

  const data: GitHubCommitResponse = await response.json();
  return data.commit?.sha ?? `commit-${Date.now()}`;
}

/**
 * Commits a base64-encoded binary file to the GitHub repository.
 * Used for uploading binary assets like PDF resumes or images.
 */
export async function commitBinaryFile(
  path: string,
  base64Content: string,
  message: string,
): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) {
    throw new Error(
      "GITHUB_REPO_OWNER and GITHUB_REPO_NAME environment variables are not set",
    );
  }

  const sha = await getFileSha(path);

  const body: Record<string, string> = {
    message,
    content: base64Content,
    branch: "main",
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GitHub Contents API error: ${response.status} ${errorBody}`,
    );
  }

  const data: GitHubCommitResponse = await response.json();
  return data.commit?.sha ?? `commit-${Date.now()}`;
}

/**
 * Parses a GitHub URL to extract owner and repo name.
 * Supports various GitHub URL formats.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+)/,
    /github\.com\/([^/]+)\/([^/]+)\.git/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
  }

  throw new Error(`Invalid GitHub URL: ${url}`);
}