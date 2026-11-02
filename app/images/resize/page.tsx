"use client";
import { useState } from "react";
import { Maximize } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { resizeImage, loadImage, downloadBlob, replaceExtension } from "@/lib/image-utils";
import type { OutputFormat } from "@/lib/image-utils";

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspect, setAspect] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setOutputSize(undefined);
    const img = await loadImage(f);
    setOrigW(img.width); setOrigH(img.height);
    setWidth(img.width); setHeight(img.height);
  }

  function onWidthChange(v: number) {
    setWidth(v);
    if (aspect && origW > 0) setHeight(Math.round((v * origH) / origW));
  }

  function onHeightChange(v: number) {
    setHeight(v);
    if (aspect && origH > 0) setWidth(Math.round((v * origW) / origH));
  }

  async function handleResize() {
    if (!file || width <= 0 || height <= 0) return;
    setStatus("processing");
    setError("");
    try {
      const blob = await resizeImage(file, { width, height, maintainAspect: false, format, quality: quality / 100 });
      setOutputSize(blob.size);
      downloadBlob(blob, replaceExtension(file.name, format));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Resize failed.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Resize Image"
      description="Resize images to exact pixel dimensions with optional aspect ratio lock."
      icon={Maximize}
      iconColor="#7C3AED"
      backHref="/images"
      backLabel="Image Studio"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"]}
          maxSize={20 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop an image here"
          hint="JPG, PNG, WebP · up to 20 MB"
        />

        {file && origW > 0 && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
              Original: {origW} × {origH} px
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <label className="label">Width (px)</label>
                <input type="number" min={1} className="input" value={width} onChange={(e) => onWidthChange(parseInt(e.target.value) || 1)} />
              </div>
              <div style={{ paddingTop: "1.25rem", color: "var(--text-3)", fontSize: "1.25rem" }}>×</div>
              <div style={{ flex: 1 }}>
                <label className="label">Height (px)</label>
                <input type="number" min={1} className="input" value={height} onChange={(e) => onHeightChange(parseInt(e.target.value) || 1)} />
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-2)", cursor: "pointer" }}>
              <input type="checkbox" checked={aspect} onChange={(e) => setAspect(e.target.checked)} style={{ accentColor: "#7C3AED" }} />
              Lock aspect ratio
            </label>

            <div>
              <label className="label">Output format</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["image/jpeg", "image/png", "image/webp"] as OutputFormat[]).map((f) => (
                  <button key={f} onClick={() => setFormat(f)} className={`btn btn-sm ${format === f ? "btn-primary" : "btn-secondary"}`} style={format === f ? { background: "#7C3AED" } : {}}>
                    {f === "image/jpeg" ? "JPG" : f === "image/png" ? "PNG" : "WebP"}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleResize} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ width: "100%", background: "#7C3AED" }}>
              Resize Image
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        originalSize={file?.size}
        outputSize={outputSize}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setOrigW(0); setOrigH(0); }}
        onRetry={handleResize}
        progressLabel="Resizing image…"
      />
    </ToolLayout>
  );
}
