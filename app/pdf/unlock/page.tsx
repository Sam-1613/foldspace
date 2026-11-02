"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { unlockPDF, downloadBytes } from "@/lib/pdf-utils";

export default function UnlockPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleUnlock() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const bytes = await unlockPDF(file, password);
      downloadBytes(bytes, file.name.replace(/\.pdf$/i, "-unlocked.pdf"));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not unlock PDF.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove the password from a PDF document you are authorised to access."
      icon={Lock}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={(f) => setFile(f[0] ?? null)}
          label="Drop a protected PDF here"
          hint="PDF only · up to 100 MB"
        />
        {file && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label className="label">PDF password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the document password"
              />
            </div>
            <button
              onClick={handleUnlock}
              disabled={status === "processing"}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              Unlock PDF
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        fileName={file ? file.name.replace(/\.pdf$/i, "-unlocked.pdf") : undefined}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setPassword(""); }}
        onRetry={handleUnlock}
        progressLabel="Unlocking PDF in your browser…"
      />
    </ToolLayout>
  );
}
