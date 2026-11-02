"use client";
import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { createZip, downloadBlob, formatBytes } from "@/lib/zip-utils";

export default function CreateZIPPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [archiveName, setArchiveName] = useState("archive.zip");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  const totalInput = files.reduce((s, f) => s + f.size, 0);

  async function handleCreate() {
    if (files.length === 0) return;
    setStatus("processing");
    setError("");
    try {
      const blob = await createZip(files);
      setOutputSize(blob.size);
      downloadBlob(blob, archiveName.endsWith(".zip") ? archiveName : `${archiveName}.zip`);
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create ZIP.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Create ZIP"
      description="Compress multiple files into a single ZIP archive using DEFLATE compression."
      icon={FilePlus2}
      iconColor="#D97706"
      backHref="/files"
      backLabel="File Utilities"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[]}
          multiple
          maxSize={100 * 1024 * 1024}
          onFiles={setFiles}
          label="Drop files here"
          hint="Any file type · up to 100 MB per file · multiple files"
        />

        {files.length > 0 && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} · Total: {formatBytes(totalInput)}
            </div>

            <div>
              <label className="label">Archive name</label>
              <input
                type="text"
                className="input"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                placeholder="archive.zip"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={status === "processing"}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", background: "#D97706" }}
            >
              Create ZIP
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        originalSize={totalInput}
        outputSize={outputSize}
        fileName={archiveName}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFiles([]); setOutputSize(undefined); }}
        onRetry={handleCreate}
        progressLabel="Compressing files into ZIP…"
      />
    </ToolLayout>
  );
}
