"use client";
import { useState } from "react";
import { Hash } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { addPageNumbers, downloadBytes } from "@/lib/pdf-utils";

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";

const positions: { value: Position; label: string }[] = [
  { value: "bottom-center", label: "Bottom centre" },
  { value: "bottom-right",  label: "Bottom right" },
  { value: "bottom-left",   label: "Bottom left" },
  { value: "top-center",    label: "Top centre" },
  { value: "top-right",     label: "Top right" },
  { value: "top-left",      label: "Top left" },
];

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startAt, setStartAt] = useState(1);
  const [prefix, setPrefix] = useState("");
  const [fontSize, setFontSize] = useState(11);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const bytes = await addPageNumbers(file, { position, startAt, prefix, fontSize });
      downloadBytes(bytes, file.name.replace(/\.pdf$/i, "-numbered.pdf"));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add page numbers.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Add Page Numbers"
      description="Stamp page numbers on every page of a PDF with configurable placement and formatting."
      icon={Hash}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={(f) => setFile(f[0] ?? null)}
          label="Drop a PDF file here"
          hint="PDF only · up to 100 MB"
        />

        {file && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label">Position</label>
              <select className="input select" value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                {positions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label className="label">Start at</label>
                <input type="number" min={1} className="input" value={startAt} onChange={(e) => setStartAt(parseInt(e.target.value) || 1)} />
              </div>
              <div>
                <label className="label">Prefix text</label>
                <input type="text" className="input" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. Page " />
              </div>
              <div>
                <label className="label">Font size (pt)</label>
                <input type="number" min={8} max={24} className="input" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 11)} />
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
              Preview: {prefix}{startAt}, {prefix}{startAt + 1}, {prefix}{startAt + 2}…
            </p>

            <button onClick={handleAdd} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ width: "100%" }}>
              Add Page Numbers
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); }}
        onRetry={handleAdd}
        progressLabel="Stamping page numbers…"
      />
    </ToolLayout>
  );
}
