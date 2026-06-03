"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Save, Loader2 } from "lucide-react";
import { GitHub } from "@/components/ui/icons/GitHub";
import type { DraftProject } from "@/lib/types";

interface DraftState {
  draft: DraftProject;
  readmeContent: string;
}

export default function GitHubDraftPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const draft = draftState?.draft ?? null;

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDraftState(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/github-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Failed to fetch repository");
        setLoading(false);
        return;
      }

      setDraftState({
        draft: data.draft,
        readmeContent: data.readmeContent ?? "",
      });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!draftState) return;
    setEnhancing(true);
    setError("");

    try {
      const response = await fetch("/api/ai-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: draftState.draft.title,
          description: draftState.draft.tagline,
          readmeContent: draftState.readmeContent,
          techStack: draftState.draft.techStack,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "AI enhancement failed");
        setEnhancing(false);
        return;
      }

      const result = data.result;
      const newBullets: string[] = [];

      // Use enhancedDescription as first bullet if available
      if (result.enhancedDescription) {
        newBullets.push(result.enhancedDescription);
      }

      // Append AI-generated bullets
      if (result.bullets && result.bullets.length > 0) {
        newBullets.push(...result.bullets);
      }

      setDraftState({
        ...draftState,
        draft: {
          ...draftState.draft,
          tagline: result.tagline ?? draftState.draft.tagline,
          bullets: newBullets.length > 0 ? newBullets : draftState.draft.bullets,
        },
      });
    } catch {
      setError("Network error during AI enhancement");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      // Fetch current projects via API (data/ dir is not statically served)
      const projectsResponse = await fetch("/api/admin/data/projects");
      const projectsResult = await projectsResponse.json();

      if (!projectsResponse.ok || !projectsResult.success) {
        setError(projectsResult.error ?? "Failed to load existing projects");
        setSaving(false);
        return;
      }

      const projects = projectsResult.data as DraftProject[];
      const updated = [...projects, draft];

      // Save updated projects
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "projects", data: updated }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Failed to save project");
        setSaving(false);
        return;
      }

      setSaveSuccess(true);
    } catch {
      setError("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof DraftProject, value: string | string[]) => {
    if (!draftState) return;
    setDraftState({
      ...draftState,
      draft: { ...draftState.draft, [field]: value },
    });
  };

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft size={14} />
        Dashboard
      </Link>

      <h1 className="mt-2 font-display text-2xl font-bold text-on-surface">
        GitHub Auto-Draft
      </h1>
      <p className="mt-1 text-on-surface-variant">
        Generate a project entry from a GitHub repository.
      </p>

      {/* URL Input */}
      <form onSubmit={handleFetch} className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            required
            className="flex-1 rounded-default border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GitHub className="h-[16px] w-[16px]" />
            )}
            {loading ? "Fetching..." : "Fetch Repo"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Draft Editor */}
      {draft && (
        <div className="mt-8 rounded-default border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Draft Project
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleEnhance}
                disabled={enhancing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
              >
                {enhancing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {enhancing ? "Enhancing..." : "Enhance with AI"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                Title
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={draft.techStack.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "techStack",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                  Year
                </label>
                <input
                  type="text"
                  value={draft.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={draft.githubUrl}
                  onChange={(e) => handleChange("githubUrl", e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                Live URL (optional)
              </label>
              <input
                type="url"
                value={draft.liveUrl}
                onChange={(e) => handleChange("liveUrl", e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-on-surface-variant">
                Description Bullets (one per line)
              </label>
              <textarea
                value={draft.bullets.join("\n")}
                onChange={(e) =>
                  handleChange(
                    "bullets",
                    e.target.value.split("\n").filter((s) => s.trim()),
                  )
                }
                rows={4}
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save to Projects"}
            </button>
          </div>

          {saveSuccess && (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
              Project saved successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}