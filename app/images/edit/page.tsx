"use client";
import { useState } from "react";
import { Sliders, RotateCw, FlipHorizontal } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { editImage, downloadBlob, replaceExtension } from "@/lib/image-utils";
import type { OutputFormat } from "@/lib/image-utils";

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <span className="label" style={{ marginBottom: 0 }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#7C3AED" }} />
    </div>
  );
}

export default function EditImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  function reset() {
    setBrightness(0); setContrast(0); setSaturation(0);
    setRotation(0); setFlipH(false); setFlipV(false); setGrayscale(false);
  }

  async function handleExport() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const blob = await editImage(file, { brightness, contrast, saturation, rotation, flipH, flipV, grayscale, format, quality: quality / 100 });
      setOutputSize(blob.size);
      downloadBlob(blob, replaceExtension(file.name, format));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Export failed.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Edit Image"
      description="Adjust brightness, contrast, saturation, rotation, and flip. Export in JPG, PNG, or WebP."
      icon={Sliders}
      iconColor="#7C3AED"
      backHref="/images"
      backLabel="Image Studio"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"]}
          maxSize={20 * 1024 * 1024}
          onFiles={(f) => { setFile(f[0] ?? null); setStatus("idle"); setOutputSize(undefined); reset(); }}
          label="Drop an image here"
          hint="JPG, PNG, WebP · up to 20 MB"
        />

        {file && (
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Slider label="Brightness" value={brightness} min={-100} max={100} onChange={setBrightness} />
            <Slider label="Contrast"   value={contrast}   min={-100} max={100} onChange={setContrast}   />
            <Slider label="Saturation" value={saturation} min={-100} max={100} onChange={setSaturation} />

            <div>
              <label className="label">Rotation</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {([0, 90, 180, 270] as const).map((r) => (
                  <button key={r} onClick={() => setRotation(r)} className={`btn btn-sm ${rotation === r ? "btn-primary" : "btn-secondary"}`} style={rotation === r ? { background: "#7C3AED" } : {}}>
                    {r}°
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} style={{ accentColor: "#7C3AED" }} />
                Flip horizontal
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} style={{ accentColor: "#7C3AED" }} />
                Flip vertical
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} style={{ accentColor: "#7C3AED" }} />
                Greyscale
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {(["image/jpeg", "image/png", "image/webp"] as OutputFormat[]).map((f) => (
                <button key={f} onClick={() => setFormat(f)} className={`btn btn-sm ${format === f ? "btn-primary" : "btn-secondary"}`} style={format === f ? { background: "#7C3AED" } : {}}>
                  {f === "image/jpeg" ? "JPG" : f === "image/png" ? "PNG" : "WebP"}
                </button>
              ))}
              {format !== "image/png" && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Q: {quality}%</span>
              )}
              {format !== "image/png" && (
                <input type="range" min={50} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} style={{ flex: 1, accentColor: "#7C3AED" }} />
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={reset} className="btn btn-ghost btn-sm">Reset adjustments</button>
              <button onClick={handleExport} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ flex: 1, background: "#7C3AED" }}>
                Export Image
              </button>
            </div>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        originalSize={file?.size}
        outputSize={outputSize}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setOutputSize(undefined); reset(); }}
        onRetry={handleExport}
        progressLabel="Applying edits…"
      />
    </ToolLayout>
  );
}
