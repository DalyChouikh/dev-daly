"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Upload, FileText, Check, AlertCircle, X } from "lucide-react";
import { encodeFileBase64 } from "@/lib/admin-editor";

interface ResumeUploaderProps {
  currentResumeUrl?: string;
}

interface UploadResponse {
  success: boolean;
  error?: string;
}

const MAX_SIZE = 10 * 1024 * 1024;

/** Accepts a PDF, manages its local preview, and publishes it as resume.pdf. */
export function ResumeUploader({ currentResumeUrl }: ResumeUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const activePreview = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(
    () => () => {
      if (activePreview.current) URL.revokeObjectURL(activePreview.current);
    },
    [],
  );

  const clearSelection = () => {
    if (activePreview.current) URL.revokeObjectURL(activePreview.current);
    activePreview.current = null;
    setPreviewUrl(null);
    setFile(null);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (uploading) return;
    setError("");
    setSuccess(false);
    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are accepted");
      return;
    }
    if (selectedFile.size > MAX_SIZE) {
      setError(
        `File size exceeds 10 MB limit (${(selectedFile.size / 1024 / 1024).toFixed(1)} MB)`,
      );
      return;
    }
    if (activePreview.current) URL.revokeObjectURL(activePreview.current);
    const url = URL.createObjectURL(selectedFile);
    activePreview.current = url;
    setFile(selectedFile);
    setPreviewUrl(url);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
    event.target.value = "";
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const base64 = encodeFileBase64(await file.arrayBuffer());
      const response = await fetch("/api/admin/upload-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, fileName: file.name }),
      });
      const data: UploadResponse = await response.json();
      if (!response.ok || !data.success) {
        setError(
          data.error ??
            "Upload failed. Your file is still selected; try again.",
        );
        return;
      }
      setSuccess(true);
      clearSelection();
    } catch {
      setError(
        "Network error during upload. Your file is still selected; try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-array" aria-busy={uploading}>
      {currentResumeUrl && (
        <div className="admin-file-preview">
          <FileText size={18} aria-hidden="true" />
          <div>
            <p className="admin-field-label">Current résumé</p>
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View /resume.pdf
            </a>
          </div>
        </div>
      )}
      <label
        className="admin-dropzone"
        htmlFor={inputId}
        data-dragging={isDragging}
        aria-disabled={uploading}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          if (!uploading) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
      >
        <Upload size={24} aria-hidden="true" />
        <span className="admin-field-label">
          {file ? "Choose another PDF résumé" : "Drop your PDF résumé here"}
        </span>
        <span className="admin-muted">
          or click to browse · PDF, up to 10 MB
        </span>
        <input
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Choose PDF résumé"
          onChange={handleInputChange}
          disabled={uploading}
        />
      </label>

      {file && previewUrl && (
        <div className="admin-array-item">
          <div className="admin-array-item-header">
            <div>
              <p className="admin-field-label">{file.name}</p>
              <p className="admin-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB · Publishes as
                resume.pdf
              </p>
            </div>
            <button
              type="button"
              className="admin-icon-button"
              aria-label="Clear selected file"
              disabled={uploading}
              onClick={() => {
                if (uploading) return;
                clearSelection();
                setError("");
                setSuccess(false);
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="admin-array-item-body">
            <iframe
              src={previewUrl}
              title="Resume preview"
              className="admin-file-preview"
            />
            <div className="admin-actions">
              <button
                type="button"
                className="admin-button admin-button--primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                <Upload size={16} aria-hidden="true" />
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <p className="admin-feedback" role="status">
          Uploading résumé…
        </p>
      )}
      {error && (
        <p className="admin-feedback admin-feedback--error" role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {error}
        </p>
      )}
      {success && (
        <p className="admin-feedback admin-feedback--success" role="status">
          <Check size={16} aria-hidden="true" /> Resume uploaded successfully!
          Changes will be live after the next rebuild.
        </p>
      )}
    </div>
  );
}
