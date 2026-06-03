"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Check, AlertCircle, Loader2, X } from "lucide-react";

interface ResumeUploaderProps {
  currentResumeUrl?: string;
}

/**
 * Admin resume uploader with drag-and-drop support.
 * Accepts PDF files up to 10 MB, renames to resume.pdf on upload.
 */
export function ResumeUploader({ currentResumeUrl }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError("");
    setSuccess(false);

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      return;
    }
    if (selectedFile.size > MAX_SIZE) {
      setError(`File size exceeds 10 MB limit (${(selectedFile.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }, [MAX_SIZE]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect],
  );

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const response = await fetch("/api/admin/upload-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: base64,
          fileName: file.name,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Upload failed");
        setUploading(false);
        return;
      }

      setSuccess(true);
      setFile(null);
      setPreviewUrl(null);
    } catch {
      setError("Network error during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess(false);
  };

  return (
    <div className="space-y-4">
      {/* Current Resume Link */}
      {currentResumeUrl && (
        <div className="flex items-center gap-3 rounded-default border border-primary/30 bg-primary/5 px-4 py-3">
          <FileText size={18} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface">Current Resume</p>
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View /resume.pdf
            </a>
          </div>
        </div>
      )}

      {/* Dropzone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={[
            "flex flex-col items-center justify-center rounded-default border-2 border-dashed px-6 py-10 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/5",
          ].join(" ")}
        >
          <Upload size={32} className={isDragging ? "text-primary" : "text-on-surface-variant"} />
          <p className="mt-3 text-sm font-medium text-on-surface">
            Drop your PDF resume here
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            or click to browse (max 10 MB)
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      )}

      {/* Selected File Preview */}
      {file && previewUrl && (
        <div className="rounded-default border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-on-surface">{file.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {(file.size / 1024 / 1024).toFixed(2)} MB → renames to <span className="text-primary">resume.pdf</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-error"
            >
              <X size={16} />
            </button>
          </div>

          {/* PDF Preview (first page as image) */}
          <div className="mt-4 aspect-[3/4] max-h-[400px] overflow-hidden rounded-md border border-white/5">
            <iframe
              src={previewUrl}
              title="Resume preview"
              className="h-full w-full"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-on-primary transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
          <Check size={16} />
          Resume uploaded successfully! Changes will be live after the next rebuild.
        </div>
      )}
    </div>
  );
}