"use client";
import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { compressImage, downloadBlob, replaceExtension, formatBytes } from "@/lib/image-utils";
import type { OutputFormat } from "@/lib/image-utils";

const formats: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png",  label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleCompress() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const blob = await compressImage(file, { quality: quality / 100, format });
      setOutputSize(blob.size);
      downloadBlob(blob, replaceExtension(file.name, format));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Compression failed.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce image file size with configurable quality. Convert to WebP for best compression."
      icon={Minimize2}
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
            <div style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
              Original: <strong>{formatBytes(file.size)}</strong>
            </div>

            <div>
              <label className="label">Output format</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {formats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`btn btn-sm ${format === f.value ? "btn-primary" : "btn-secondary"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {format === "image/jpeg" && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.25rem" }}>
                  Transparency will be flattened to white.
                </p>
              )}
            </div>

            <div>
              <label className="label">Quality: {quality}%</label>
              <input
                type="range" min={10} max={100} value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#7C3AED" }}
              />
            </div>

            <button onClick={handleCompress} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ width: "100%", background: "#7C3AED" }}>
              Compress Image
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
        onRetry={handleCompress}
        progressLabel="Compressing image in your browser…"
      />
    </ToolLayout>
  );
}
