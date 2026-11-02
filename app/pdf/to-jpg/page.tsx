"use client";
import { useState } from "react";
import { FileImage } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [scale, setScale] = useState(2);
  const [pagesConverted, setPagesConverted] = useState(0);

  async function handleConvert() {
    if (!file) return;
    setStatus("processing");
    setError("");
    setPagesConverted(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      // Use the CDN worker to avoid bundling issues in static exports
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await (page.render as any)({ canvasContext: ctx, canvas, viewport }).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}-page-${i}.jpg`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
        setPagesConverted(i);
      }

      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to convert PDF to JPG.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Render each page of a PDF as a high-quality JPG image using PDF.js."
      icon={FileImage}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={50 * 1024 * 1024}
          onFiles={(f) => setFile(f[0] ?? null)}
          label="Drop a PDF file here"
          hint="PDF only · up to 50 MB · each page saved as JPG"
        />

        {file && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label className="label">Resolution: {scale}× ({Math.round(scale * 96)} dpi equivalent)</label>
              <input
                type="range" min={1} max={4} step={0.5} value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                2× is recommended — higher values produce sharper images but take longer.
              </p>
            </div>

            {status === "processing" && pagesConverted > 0 && (
              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                Converted {pagesConverted} page{pagesConverted !== 1 ? "s" : ""}…
              </p>
            )}

            <button onClick={handleConvert} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ width: "100%" }}>
              Convert to JPG
            </button>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setPagesConverted(0); }}
        onRetry={handleConvert}
        progressLabel="Rendering PDF pages to JPG…"
      />
    </ToolLayout>
  );
}
