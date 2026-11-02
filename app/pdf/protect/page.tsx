"use client";
import { useState } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";

export default function ProtectPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleProtect() {
    if (!file || !password) return;
    if (password !== confirm) {
      setError("Passwords do not match.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setError("");
    // pdf-lib v1 does not support AES-based PDF encryption.
    // We surface this limitation honestly rather than saving an unencrypted file
    // labelled as protected.
    await new Promise((r) => setTimeout(r, 400));
    setError(
      "Browser-based PDF encryption is not available — the pdf-lib library does not implement AES password protection. " +
        "To protect a PDF, use LibreOffice (free, desktop), Microsoft Word, or Adobe Acrobat."
    );
    setStatus("error");
  }

  return (
    <ToolLayout
      title="Protect PDF"
      description="Add a password to restrict access to a PDF document."
      icon={Shield}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div style={{ padding: "0.75rem 1rem", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: "#92400E" }}>
        <AlertCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
        <span>
          <strong>Limitation:</strong> AES PDF encryption requires server-side processing and is not available in the browser. This tool shows the limitation clearly and suggests alternatives.
        </span>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={50 * 1024 * 1024}
          onFiles={(f) => setFile(f[0] ?? null)}
          label="Drop a PDF file here"
          hint="PDF only · up to 50 MB"
        />
        {file && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
            </div>
            <button onClick={handleProtect} className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={!password || status === "processing"}>
              Protect PDF
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setPassword(""); setConfirm(""); }}
        onRetry={handleProtect}
        progressLabel="Applying protection…"
      />
    </ToolLayout>
  );
}
