"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { compressImage, downloadBlob, replaceExtension } from "@/lib/image-utils";
import type { OutputFormat } from "@/lib/image-utils";

const formats: { value: OutputFormat; label: string; note?: string }[] = [
  { value: "image/jpeg", label: "JPG",  note: "Lossy · no transparency" },
  { value: "image/png",  label: "PNG",  note: "Lossless · transparency supported" },
  { value: "image/webp", label: "WebP", note: "Best compression · transparency supported" },
];

export default function ConvertImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleConvert() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const blob = await compressImage(file, { quality: quality / 100, format });
      setOutputSize(blob.size);
      downloadBlob(blob, replaceExtension(file.name, format));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Convert Image"
      description="Convert between JPG, PNG, and WebP formats instantly in your browser."
      icon={RefreshCw}
      iconColor="#7C3AED"
      backHref="/images"
      backLabel="Image Studio"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"]}
          maxSize={20 * 1024 * 1024}
          onFiles={(f) => { setFile(f[0] ?? null); setStatus("idle"); setOutputSize(undefined); }}
          label="Drop an image here"
          hint="JPG, PNG, WebP · up to 20 MB"
        />

        {file && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label">Convert to</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {formats.map((f) => (
                  <label
                    key={f.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.875rem",
                      border: `1px solid ${format === f.value ? "#7C3AED" : "var(--border)"}`,
                      borderRadius: 6,
                      background: format === f.value ? "#F5F3FF" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f.value}
                      checked={format === f.value}
                      onChange={() => setFormat(f.value)}
                      style={{ accentColor: "#7C3AED" }}
                    />
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{f.label}</span>
                    {f.note && <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{f.note}</span>}
                  </label>
                ))}
              </div>
            </div>

            {format !== "image/png" && (
              <div>
                <label className="label">Quality: {quality}%</label>
                <input
                  type="range" min={50} max={100} value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#7C3AED" }}
                />
              </div>
            )}

            <button onClick={handleConvert} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ width: "100%", background: "#7C3AED" }}>
              Convert Image
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        originalSize={file?.size}
        outputSize={outputSize}
        fileName={file ? replaceExtension(file.name, format) : undefined}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setOutputSize(undefined); }}
        onRetry={handleConvert}
        progressLabel="Converting image…"
      />
    </ToolLayout>
  );
}
