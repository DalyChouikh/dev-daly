"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Save } from "lucide-react";
import { GitHub } from "@/components/ui/icons/GitHub";
import { mergeProjectDraft } from "@/lib/admin-editor";
import type { AIEnhanceResponse, DraftProject, JsonArray } from "@/lib/types";

interface DraftState {
  draft: DraftProject;
  readmeContent: string;
}

interface DraftResponse {
  success: boolean;
  draft?: DraftProject;
  readmeContent?: string;
  error?: string;
}

interface EnhanceResponse {
  success: boolean;
  result?: AIEnhanceResponse;
  error?: string;
}

interface ProjectsResponse {
  success: boolean;
  data: JsonArray;
  sha?: string;
  error?: string;
}

/** Builds a reviewable GitHub draft and merges it into the latest project revision. */
export default function GitHubDraftPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const draft = draftState?.draft;
  const busy = loading || enhancing || saving;

  const handleFetch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setLoading(true);
    setError("");
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/github-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data: DraftResponse = await response.json();
      if (!response.ok || !data.success || !data.draft) {
        setError(data.error ?? "Failed to fetch repository");
        return;
      }
      setDraftState({
        draft: data.draft,
        readmeContent: data.readmeContent ?? "",
      });
    } catch {
      setError("Network error while fetching the repository. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!draftState || busy) return;
    setEnhancing(true);
    setError("");
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/ai-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTitle: draftState.draft.title,
          projectName: draftState.draft.title,
          description: draftState.draft.tagline,
          readmeContent: draftState.readmeContent,
          techStack: draftState.draft.techStack,
        }),
      });
      const data: EnhanceResponse = await response.json();
      if (!response.ok || !data.success || !data.result) {
        setError(data.error ?? "AI enhancement failed");
        return;
      }
      const result = data.result;
      setDraftState({
        ...draftState,
        draft: {
          ...draftState.draft,
          title: result.title ?? draftState.draft.title,
          tagline: result.tagline ?? draftState.draft.tagline,
          techStack: result.techStack ?? draftState.draft.techStack,
          bullets: [
            ...draftState.draft.bullets,
            ...(result.enhancedDescription ? [result.enhancedDescription] : []),
            ...(result.bullets ?? []),
          ],
        },
      });
    } catch {
      setError(
        "Network error during AI enhancement. Your draft is still here; try again.",
      );
    } finally {
      setEnhancing(false);
    }
  };

  const handleSave = async () => {
    if (!draft || busy) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const projectsResponse = await fetch("/api/admin/data/projects", {
        cache: "no-store",
      });
      const projectsResult: ProjectsResponse = await projectsResponse.json();
      if (
        !projectsResponse.ok ||
        !projectsResult.success ||
        !Array.isArray(projectsResult.data)
      ) {
        setError(projectsResult.error ?? "Failed to load existing projects");
        return;
      }
      const updated = mergeProjectDraft(projectsResult.data, {
        ...draft,
        techStack: draft.techStack
          .map((technology) => technology.trim())
          .filter(Boolean),
        bullets: draft.bullets.map((bullet) => bullet.trim()).filter(Boolean),
      });
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "projects",
          data: updated,
          sha: projectsResult.sha,
        }),
      });
      const data: ProjectsResponse = await response.json();
      if (!response.ok || !data.success) {
        setError(
          response.status === 409
            ? `${data.error ?? "The projects changed before saving."} Your draft is kept here; try again to use the latest revision.`
            : (data.error ?? "Failed to save project"),
        );
        return;
      }
      setSaveSuccess(true);
    } catch {
      setError(
        "Network error while saving. Your draft is still here; try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    field: keyof DraftProject,
    value: string | string[],
  ) => {
    if (!draftState || busy) return;
    setSaveSuccess(false);
    setDraftState({
      ...draftState,
      draft: { ...draftState.draft, [field]: value },
    });
  };

  return (
    <div className="admin-page" aria-busy={busy}>
      <header className="admin-page-header">
        <div>
          <Link href="/admin" className="admin-breadcrumb">
            <ArrowLeft size={14} aria-hidden="true" /> Dashboard
          </Link>
          <h1>GitHub Auto-Draft</h1>
          <p className="admin-page-copy">
            Start with a repository, then review your project before publishing.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="admin-button admin-button--quiet"
        >
          View projects
        </Link>
      </header>

      <form onSubmit={handleFetch} className="admin-panel">
        <fieldset disabled={busy} className="admin-field">
          <label className="admin-field-label" htmlFor="draft-repository">
            GitHub repository URL
          </label>
          <div className="admin-actions">
            <input
              id="draft-repository"
              type="url"
              className="admin-input"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/username/repo"
              required
            />
            <button type="submit" className="admin-button">
              <GitHub width={16} height={16} aria-hidden="true" />
              {loading ? "Fetching..." : "Fetch Repo"}
            </button>
          </div>
          <p className="admin-muted">
            Fetching another repository replaces the current draft after it
            loads.
          </p>
        </fieldset>
      </form>

      {error && (
        <div className="admin-feedback admin-feedback--error" role="alert">
          {error}
        </div>
      )}
      {busy && (
        <p className="admin-feedback" role="status">
          {loading
            ? "Fetching repository…"
            : enhancing
              ? "Enhancing your draft…"
              : "Saving your project…"}
        </p>
      )}

      {draft ? (
        <section className="admin-panel" aria-labelledby="draft-heading">
          <div className="admin-panel-header">
            <h2 id="draft-heading">Draft Project</h2>
            <button
              type="button"
              onClick={handleEnhance}
              disabled={busy}
              className="admin-button"
            >
              <Sparkles size={16} aria-hidden="true" />
              {enhancing ? "Enhancing..." : "Enhance with AI"}
            </button>
          </div>
          <fieldset disabled={busy} className="admin-form-grid">
            <legend className="sr-only">Project details</legend>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-title">
                Title
              </label>
              <input
                id="draft-title"
                className="admin-input"
                value={draft.title}
                onChange={(event) => handleChange("title", event.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-tagline">
                Tagline
              </label>
              <input
                id="draft-tagline"
                className="admin-input"
                value={draft.tagline}
                onChange={(event) =>
                  handleChange("tagline", event.target.value)
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-tech">
                Tech Stack (comma-separated)
              </label>
              <input
                id="draft-tech"
                className="admin-input"
                value={draft.techStack.join(", ")}
                onChange={(event) =>
                  handleChange(
                    "techStack",
                    event.target.value
                      .split(",")
                      .map((technology) => technology.trim()),
                  )
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-year">
                Year
              </label>
              <input
                id="draft-year"
                className="admin-input"
                value={draft.year}
                onChange={(event) => handleChange("year", event.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-github">
                GitHub URL
              </label>
              <input
                id="draft-github"
                type="url"
                className="admin-input"
                value={draft.githubUrl}
                onChange={(event) =>
                  handleChange("githubUrl", event.target.value)
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="draft-live">
                Live URL (optional)
              </label>
              <input
                id="draft-live"
                type="url"
                className="admin-input"
                value={draft.liveUrl}
                onChange={(event) =>
                  handleChange("liveUrl", event.target.value)
                }
              />
            </div>
            <div className="admin-editor-field">
              <label className="admin-field-label" htmlFor="draft-bullets">
                Description Bullets (one per line)
              </label>
              <textarea
                id="draft-bullets"
                className="admin-textarea"
                rows={6}
                value={draft.bullets.join("\n")}
                onChange={(event) =>
                  handleChange("bullets", event.target.value.split("\n"))
                }
              />
            </div>
          </fieldset>
          <div className="admin-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="admin-button admin-button--primary"
            >
              <Save size={16} aria-hidden="true" />
              {saving ? "Saving..." : "Save to Projects"}
            </button>
            <p className="admin-muted">
              Saving again updates this project without creating another entry.
            </p>
          </div>
          {saveSuccess && (
            <p className="admin-feedback admin-feedback--success" role="status">
              Project saved successfully!
            </p>
          )}
        </section>
      ) : (
        !loading && (
          <div className="admin-empty">
            Your project draft will appear here after fetching a repository.
          </div>
        )
      )}
    </div>
  );
}
