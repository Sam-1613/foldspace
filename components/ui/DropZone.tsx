"use client";
import { useCallback, useState } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";

interface DropZoneProps {
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File, accept: string[], maxSize: number): string | null {
  if (maxSize && file.size > maxSize) return `File too large (max ${formatSize(maxSize)})`;
  if (accept.length > 0) {
    const ok = accept.some((a) => {
      if (a.startsWith(".")) return file.name.toLowerCase().endsWith(a.toLowerCase());
      if (a.endsWith("/*")) return file.type.startsWith(a.replace("/*", ""));
      return file.type === a;
    });
    if (!ok) return "Unsupported file format";
  }
  return null;
}

export function DropZone({
  accept = [],
  maxSize = 100 * 1024 * 1024,
  multiple = false,
  onFiles,
  label = "Drop files here",
  hint,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const inputId = `dz-${Math.random().toString(36).slice(2, 8)}`;

  const processFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      const chosen = multiple ? arr : [arr[0]];
      const errs: string[] = [];
      const valid: File[] = [];
      chosen.forEach((f) => {
        const err = validateFile(f, accept, maxSize);
        if (err) errs.push(`${f.name}: ${err}`);
        else valid.push(f);
      });
      setErrors(errs);
      if (valid.length > 0) {
        const next = multiple ? [...files, ...valid] : valid;
        setFiles(next);
        onFiles(next);
      }
    },
    [accept, maxSize, multiple, files, onFiles]
  );

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFiles(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById(inputId)?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") document.getElementById(inputId)?.click(); }}
        role="button"
        tabIndex={0}
        aria-label="File upload area"
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 10,
          padding: "2.5rem 1rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#EBF0FC" : "var(--bg)",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <input
          id={inputId}
          type="file"
          style={{ display: "none" }}
          accept={accept.join(",")}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: dragging ? "#D6E2FA" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload style={{ width: 22, height: 22, color: dragging ? "var(--accent)" : "var(--text-3)" }} />
          </div>
          <div>
            <p style={{ fontWeight: 500, color: "var(--text)", fontSize: "0.9375rem" }}>{label}</p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>or click to browse</p>
          </div>
          {hint && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)", background: "var(--border)", borderRadius: 4, padding: "0.25rem 0.625rem" }}>
              {hint}
            </p>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", padding: "0.75rem", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: "0.8125rem", color: "#991B1B" }}>
          <AlertCircle style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {files.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", background: "#fff", border: "1px solid var(--border)", borderRadius: 8 }}>
              <File style={{ width: 16, height: 16, color: "var(--text-3)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{formatSize(f.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                style={{ padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", borderRadius: 4, display: "flex" }}
                aria-label={`Remove ${f.name}`}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
