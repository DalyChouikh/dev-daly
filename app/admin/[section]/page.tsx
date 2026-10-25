"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { createEditorItem } from "@/lib/admin-editor";
import { ADMIN_SECTIONS } from "@/lib/admin-navigation";
import type { JsonArray, JsonObject, JsonValue } from "@/lib/types";

interface ContentResponse {
  success: boolean;
  data: JsonValue;
  sha?: string;
  error?: string;
}

/** Opens a fresh editor when navigation changes the content section. */
export default function SectionEditorPage() {
  const { section } = useParams<{ section: string }>();

  if (!ADMIN_SECTIONS.some((item) => item.id === section)) {
    return (
      <div className="admin-page">
        <h1>Unknown Section</h1>
        <p className="admin-feedback admin-feedback--error" role="alert">
          The section &quot;{section}&quot; does not exist.
        </p>
        <Link href="/admin" className="admin-breadcrumb">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return <SectionEditor key={section} section={section} />;
}

/** Retains local edits and their original file revision until publishing succeeds. */
function SectionEditor({ section }: { section: string }) {
  const [data, setData] = useState<JsonValue>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sha, setSha] = useState<string>();
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/admin/data/${section}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const result: ContentResponse = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || !result.success) {
          setError(result.error ?? "Failed to load data");
          return;
        }
        setData(result.data);
        setSha(result.sha);
      } catch {
        if (!controller.signal.aborted) setError("Failed to load data");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadData();
    return () => controller.abort();
  }, [section, loadAttempt]);

  const handleSave = async () => {
    if (saving || !hasChanges) return;
    setSaving(true);
    setSaveError("");
    setConflict(false);
    setSaved(false);

    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data, sha }),
      });
      const result: ContentResponse = await response.json();
      if (!response.ok || !result.success) {
        setSaveError(result.error ?? "Failed to save");
        setConflict(response.status === 409);
        return;
      }
      setHasChanges(false);
      setSha(result.sha);
      setSaved(true);
    } catch {
      setSaveError(
        "Network error while saving. Your edits are still here; try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page" aria-busy={loading || saving}>
      <header className="admin-page-header">
        <div>
          <Link href="/admin" className="admin-breadcrumb">
            <ArrowLeft size={14} aria-hidden="true" /> Dashboard
          </Link>
          <h1>{ADMIN_SECTIONS.find((item) => item.id === section)?.label}</h1>
          <p className="admin-page-copy">
            Update the {section} content on your portfolio.
          </p>
        </div>
        {!loading && !error && (
          <div className="admin-actions">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="admin-button admin-button--quiet"
              aria-expanded={showJson}
              aria-controls="editor-json"
            >
              {showJson ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
              {showJson ? "Hide JSON" : "Show JSON"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="admin-button admin-button--primary"
            >
              <Save size={16} aria-hidden="true" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </header>

      {loading ? (
        <p className="admin-feedback" role="status">
          Loading {section}…
        </p>
      ) : error ? (
        <div className="admin-panel">
          <p className="admin-feedback admin-feedback--error" role="alert">
            {error}
          </p>
          <button
            type="button"
            className="admin-button"
            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {saveError && (
            <div className="admin-feedback admin-feedback--error" role="alert">
              <p>{saveError}</p>
              {conflict && (
                <p>
                  Your edits are kept here. Use Show JSON to copy them before
                  reopening the latest version.
                </p>
              )}
            </div>
          )}
          <p
            className={
              saved ? "admin-feedback admin-feedback--success" : "admin-muted"
            }
            role="status"
          >
            {saving
              ? "Saving your changes…"
              : hasChanges
                ? "You have unsaved changes."
                : saved
                  ? "Changes saved successfully."
                  : "All changes saved."}
          </p>
          {showJson && (
            <pre id="editor-json" className="admin-json">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
          <fieldset className="admin-panel" disabled={saving}>
            <legend className="sr-only">{section} content</legend>
            <GenericEditor
              data={data}
              path={section}
              onChange={(nextData) => {
                setData(nextData);
                setHasChanges(true);
                setSaved(false);
              }}
            />
          </fieldset>
        </>
      )}
    </div>
  );
}

interface GenericEditorProps {
  data: JsonValue;
  onChange: (data: JsonValue) => void;
  path: string;
}

/** Chooses a labelled editor without changing the value's JSON shape. */
function GenericEditor({ data, onChange, path }: GenericEditorProps) {
  if (data === null) return <span className="admin-muted">No value</span>;
  if (Array.isArray(data))
    return <ArrayEditor data={data} onChange={onChange} path={path} />;
  if (typeof data === "object")
    return <ObjectEditor data={data} onChange={onChange} path={path} />;
  return <SimpleField value={data} onChange={onChange} path={path} />;
}

interface SimpleFieldProps {
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  path: string;
}

/** Uses native inputs so enclosing fieldsets consistently disable pending edits. */
function SimpleField({ value, onChange, path }: SimpleFieldProps) {
  const [multiline] = useState(
    () =>
      typeof value === "string" && (value.length > 60 || value.includes("\n")),
  );
  const id = `admin-field-${path}`;
  if (typeof value === "boolean") {
    return (
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  }
  if (multiline) {
    return (
      <textarea
        id={id}
        className="admin-textarea"
        value={String(value)}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <input
      id={id}
      className="admin-input"
      type={typeof value === "number" ? "number" : "text"}
      value={value}
      onChange={(event) =>
        onChange(
          typeof value === "number"
            ? Number(event.target.value)
            : event.target.value,
        )
      }
    />
  );
}

interface ObjectEditorProps {
  data: JsonObject;
  onChange: (data: JsonObject) => void;
  path: string;
}

/** Groups nested values and associates every primitive control with its field name. */
function ObjectEditor({ data, onChange, path }: ObjectEditorProps) {
  return (
    <div className="admin-form-grid">
      {Object.entries(data).map(([key, value]) => {
        const fieldPath = `${path}.${key}`;
        const label = key
          .replace(/([a-z])([A-Z])/gu, "$1 $2")
          .replace(/^./u, (letter) => letter.toUpperCase());
        const editor = (
          <GenericEditor
            data={value}
            path={fieldPath}
            onChange={(nextValue) => onChange({ ...data, [key]: nextValue })}
          />
        );
        return value !== null && typeof value === "object" ? (
          <fieldset key={key} className="admin-editor-field">
            <legend className="admin-field-label">{label}</legend>
            {editor}
          </fieldset>
        ) : (
          <div key={key} className="admin-editor-field">
            <label
              className="admin-field-label"
              htmlFor={`admin-field-${fieldPath}`}
            >
              {label}
            </label>
            {editor}
          </div>
        );
      })}
    </div>
  );
}

interface ArrayEditorProps {
  data: JsonArray;
  onChange: (data: JsonArray) => void;
  path: string;
}

/** Keeps object collections scannable while using section-aware templates for new rows. */
function ArrayEditor({ data, onChange, path }: ArrayEditorProps) {
  return (
    <div className="admin-array">
      {data.length === 0 && (
        <p className="admin-empty">
          No entries yet. Add an item to get started.
        </p>
      )}
      {data.map((item, index) => {
        const itemPath = `${path}[${index}]`;
        const isObject =
          item !== null && typeof item === "object" && !Array.isArray(item);
        const titleValue =
          isObject &&
          (item.displayTitle ||
            item.title ||
            item.company ||
            item.institution ||
            item.category ||
            item.organization ||
            item.name ||
            item.label ||
            item.id);
        const title =
          typeof titleValue === "string" && titleValue
            ? titleValue
            : `Item ${index + 1}`;
        if (!isObject) {
          return (
            <div key={index} className="admin-array-controls">
              <div>
                <label
                  className="admin-field-label"
                  htmlFor={`admin-field-${itemPath}`}
                >
                  {title}
                </label>
                <GenericEditor
                  data={item}
                  path={itemPath}
                  onChange={(value) =>
                    onChange(
                      data.map((entry, entryIndex) =>
                        entryIndex === index ? value : entry,
                      ),
                    )
                  }
                />
              </div>
              <button
                type="button"
                className="admin-icon-button"
                aria-label={`Remove ${title}`}
                onClick={() =>
                  onChange(data.filter((_, entryIndex) => entryIndex !== index))
                }
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          );
        }
        const body = (
          <div className="admin-array-item-body">
            <GenericEditor
              data={item}
              path={itemPath}
              onChange={(value) =>
                onChange(
                  data.map((entry, entryIndex) =>
                    entryIndex === index ? value : entry,
                  ),
                )
              }
            />
            <div className="admin-actions">
              <button
                type="button"
                className="admin-button admin-button--danger"
                aria-label={`Remove ${title}`}
                onClick={() =>
                  onChange(data.filter((_, entryIndex) => entryIndex !== index))
                }
              >
                <Trash2 size={14} aria-hidden="true" /> Remove item
              </button>
            </div>
          </div>
        );

        return (
          <ObjectArrayItem
            key={index}
            title={title}
            initiallyOpen={index === 0 || !titleValue}
          >
            {body}
          </ObjectArrayItem>
        );
      })}
      <button
        type="button"
        className="admin-button"
        onClick={() => onChange([...data, createEditorItem(path)])}
      >
        <Plus size={16} aria-hidden="true" /> Add Item
      </button>
    </div>
  );
}

/** Preserves disclosure state when the entry title changes during editing. */
function ObjectArrayItem({
  title,
  initiallyOpen,
  children,
}: {
  title: string;
  initiallyOpen: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <details
      className="admin-array-item"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="admin-array-item-header">{title}</summary>
      {children}
    </details>
  );
}
