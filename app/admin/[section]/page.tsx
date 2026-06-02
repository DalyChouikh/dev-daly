"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Eye, EyeOff, AlertCircle } from "lucide-react";

// Map of section IDs to their data file names
const sectionMap: Record<string, string> = {
  profile: "profile",
  experience: "experience",
  education: "education",
  projects: "projects",
  skills: "skills",
  leadership: "leadership",
  certifications: "certifications",
  languages: "languages",
  site: "site",
};

export default function SectionEditorPage() {
  const params = useParams();
  const section = params.section as string;
  const sectionName = sectionMap[section];

  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load data on mount
  useState(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/data/${sectionName}.json`);
        const json = await response.json();
        setData(json);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  });

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionName, data }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSaveError(result.error ?? "Failed to save");
        setSaving(false);
        return;
      }

      setHasChanges(false);
    } catch {
      setSaveError("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  if (!sectionName) {
    return (
      <div className="rounded-default border border-error/30 bg-error/10 p-8 text-center">
        <AlertCircle size={32} className="mx-auto text-error" />
        <h1 className="mt-4 font-display text-xl font-bold text-on-surface">
          Unknown Section
        </h1>
        <p className="mt-2 text-on-surface-variant">
          The section &quot;{section}&quot; does not exist.
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-default border border-error/30 bg-error/10 p-8 text-center">
        <AlertCircle size={32} className="mx-auto text-error" />
        <p className="mt-2 text-error">{error}</p>
        <Link
          href="/admin"
          className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold capitalize text-on-surface">
            {section} Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJson(!showJson)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-white/5"
          >
            {showJson ? <EyeOff size={14} /> : <Eye size={14} />}
            {showJson ? "Hide JSON" : "Show JSON"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          {saveError}
        </div>
      )}

      {hasChanges && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
          You have unsaved changes.
        </div>
      )}

      {/* JSON Preview */}
      {showJson && (
        <div className="mt-6 rounded-default border border-white/10 bg-surface-container-low p-4">
          <pre className="overflow-auto text-xs text-on-surface-variant">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Editor */}
      <div className="mt-6">
        <GenericEditor
          data={data}
          onChange={(newData) => {
            setData(newData);
            setHasChanges(true);
          }}
        />
      </div>
    </div>
  );
}

/**
 * Generic JSON editor that recursively renders editable fields.
 */
function GenericEditor({
  data,
  onChange,
  path = "",
}: {
  data: unknown;
  onChange: (data: unknown) => void;
  path?: string;
}) {
  if (data === null || data === undefined) {
    return <span className="text-on-surface-variant">null</span>;
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return (
      <SimpleField
        value={data}
        onChange={(value) => onChange(value)}
      />
    );
  }

  if (Array.isArray(data)) {
    return (
      <ArrayEditor
        data={data}
        onChange={onChange}
        path={path}
      />
    );
  }

  if (typeof data === "object") {
    return (
      <ObjectEditor
        data={data as Record<string, unknown>}
        onChange={onChange}
        path={path}
      />
    );
  }

  return <span className="text-error">Unsupported type</span>;
}

function SimpleField({
  value,
  onChange,
}: {
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <button
        onClick={() => onChange(!value)}
        className={[
          "rounded-md px-2 py-1 text-sm font-medium transition-colors",
          value ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant",
        ].join(" ")}
      >
        {value ? "True" : "False"}
      </button>
    );
  }

  const isMultiline = typeof value === "string" && value.length > 60;

  if (isMultiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
      />
    );
  }

  return (
    <input
      type={typeof value === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        if (typeof value === "number") {
          onChange(Number(val));
        } else {
          onChange(val);
        }
      }}
      className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary"
    />
  );
}

function ObjectEditor({
  data,
  onChange,
  path,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  path: string;
}) {
  const updateField = useCallback(
    (key: string, value: unknown) => {
      onChange({ ...data, [key]: value });
    },
    [data, onChange],
  );

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
          <label className="min-w-[120px] pt-2 text-sm font-medium text-on-surface-variant">
            {key}
          </label>
          <div className="flex-1">
            <GenericEditor
              data={value}
              onChange={(newValue) => updateField(key, newValue)}
              path={`${path}.${key}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArrayEditor({
  data,
  onChange,
  path,
}: {
  data: unknown[];
  onChange: (data: unknown[]) => void;
  path: string;
}) {
  const addItem = useCallback(() => {
    if (data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
      // Clone first item with empty/default values
      const template = data[0] as Record<string, unknown>;
      const newItem: Record<string, unknown> = {};
      Object.keys(template).forEach((key) => {
        const val = template[key];
        if (typeof val === "string") newItem[key] = "";
        else if (typeof val === "number") newItem[key] = 0;
        else if (typeof val === "boolean") newItem[key] = false;
        else if (Array.isArray(val)) newItem[key] = [];
        else newItem[key] = null;
      });
      onChange([...data, newItem]);
    } else {
      onChange([...data, ""]);
    }
  }, [data, onChange]);

  const removeItem = useCallback(
    (index: number) => {
      onChange(data.filter((_, i) => i !== index));
    },
    [data, onChange],
  );

  const updateItem = useCallback(
    (index: number, value: unknown) => {
      onChange(data.map((item, i) => (i === index ? value : item)));
    },
    [data, onChange],
  );

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="rounded-default border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[20px]"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface-variant">
              Item {index + 1}
            </span>
            <button
              onClick={() => removeItem(index)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-error/10 text-error transition-colors hover:bg-error/20"
              title="Remove item"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <GenericEditor
            data={item}
            onChange={(value) => updateItem(index, value)}
            path={`${path}[${index}]`}
          />
        </div>
      ))}

      <button
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-default border border-dashed border-white/10 py-3 text-sm text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Plus size={14} />
        Add Item
      </button>
    </div>
  );
}