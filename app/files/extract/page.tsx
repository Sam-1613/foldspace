"use client";
import { useState } from "react";
import { FolderOpen, Download, CheckSquare, Square } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { inspectZip, extractZip, formatBytes } from "@/lib/zip-utils";
import type { ZipEntry } from "@/lib/zip-utils";

export default function ExtractZIPPage() {
  const [file, setFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    setError("");
    setEntries([]);
    setSelected(new Set());
    setStatus("idle");
    try {
      const list = await inspectZip(f);
      setEntries(list);
      setSelected(new Set(list.filter((e) => !e.isDir).map((e) => e.name)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not read ZIP.");
      setStatus("error");
    }
    setLoading(false);
  }

  function toggleEntry(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function selectAll()  { setSelected(new Set(entries.filter((e) => !e.isDir).map((e) => e.name))); }
  function selectNone() { setSelected(new Set()); }

  async function handleExtract() {
    if (!file || selected.size === 0) return;
    setStatus("processing");
    setError("");
    try {
      await extractZip(file, Array.from(selected));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
      setStatus("error");
    }
  }

  const fileEntries = entries.filter((e) => !e.isDir);

  return (
    <ToolLayout
      title="Extract ZIP"
      description="Inspect a ZIP archive, select the files you want, and extract them directly in your browser."
      icon={FolderOpen}
      iconColor="#D97706"
      backHref="/files"
      backLabel="File Utilities"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".zip", "application/zip", "application/x-zip-compressed"]}
          maxSize={200 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop a ZIP file here"
          hint="ZIP archives only · up to 200 MB"
        />

        {loading && (
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-2)" }} className="animate-pulse">
            Reading archive…
          </p>
        )}

        {entries.length > 0 && (
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                {fileEntries.length} file{fileEntries.length !== 1 ? "s" : ""} · {selected.size} selected
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={selectAll} className="btn btn-ghost btn-sm">All</button>
                <button onClick={selectNone} className="btn btn-ghost btn-sm">None</button>
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "20rem", overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
              {entries.map((entry) => (
                <li
                  key={entry.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.5rem 0.75rem",
                    borderBottom: "1px solid var(--border)",
                    background: entry.isDir ? "var(--bg)" : "#fff",
                    cursor: entry.isDir ? "default" : "pointer",
                  }}
                  onClick={() => !entry.isDir && toggleEntry(entry.name)}
                >
                  {!entry.isDir && (
                    selected.has(entry.name)
                      ? <CheckSquare style={{ width: 15, height: 15, color: "#D97706", flexShrink: 0 }} />
                      : <Square style={{ width: 15, height: 15, color: "var(--text-3)", flexShrink: 0 }} />
                  )}
                  {entry.isDir && <FolderOpen style={{ width: 15, height: 15, color: "#D97706", flexShrink: 0 }} />}
                  <span style={{ fontSize: "0.8125rem", color: entry.isDir ? "var(--text-2)" : "var(--text)", flex: 1, fontFamily: "monospace", wordBreak: "break-all" }}>
                    {entry.name}
                  </span>
                  {!entry.isDir && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)", whiteSpace: "nowrap" }}>
                      {formatBytes(entry.size)}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={handleExtract}
              disabled={selected.size === 0 || status === "processing"}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "0.75rem", background: "#D97706" }}
            >
              <Download style={{ width: 16, height: 16 }} />
              Extract {selected.size} file{selected.size !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setEntries([]); setSelected(new Set()); }}
        onRetry={handleExtract}
        progressLabel="Extracting files from archive…"
      />
    </ToolLayout>
  );
}
