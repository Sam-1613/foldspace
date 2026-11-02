"use client";
import { useState } from "react";
import { Info } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { extractPDFMetadata } from "@/lib/pdf-utils";

export default function MetadataPage() {
  const [meta, setMeta] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setLoading(true);
    setError("");
    setMeta(null);
    try {
      const data = await extractPDFMetadata(f);
      setMeta(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not read metadata.");
    }
    setLoading(false);
  }

  return (
    <ToolLayout
      title="PDF Metadata"
      description="View the metadata embedded in a PDF document — author, title, creator, dates, and page count."
      icon={Info}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop a PDF to inspect"
          hint="PDF only · up to 100 MB"
        />

        {loading && (
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-2)" }} className="animate-pulse">
            Reading metadata…
          </p>
        )}

        {error && (
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--danger)" }}>{error}</p>
        )}

        {meta && (
          <dl style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
            {Object.entries(meta).map(([key, val]) => (
              <div key={key} style={{ display: "flex", gap: "1rem", padding: "0.625rem 0", borderBottom: "1px solid var(--border)" }}>
                <dt style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-2)", width: 140, flexShrink: 0 }}>{key}</dt>
                <dd style={{ fontSize: "0.8125rem", color: "var(--text)" }}>{val}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </ToolLayout>
  );
}
