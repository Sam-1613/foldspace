"use client";
import { useState } from "react";
import { Droplets } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard, JobStatus } from "@/components/ui/ProcessingCard";
import { addWatermark, downloadBytes } from "@/lib/pdf-utils";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleWatermark() {
    if (!file || !text) return;
    setStatus("processing");
    try {
      const bytes = await addWatermark(file, text, opacity, fontSize);
      downloadBytes(bytes, file.name.replace(".pdf", "-watermarked.pdf"));
      setStatus("done");
    } catch (e: any) { setError(e.message); setStatus("error"); }
  }

  return (
    <ToolLayout title="Watermark PDF" description="Add a diagonal text watermark to every page of your PDF." icon={Droplets} iconColor="text-pdf-red" backHref="/pdf" backLabel="PDF Tools">
      <div className="card p-6 space-y-4">
        <DropZone accept={[".pdf", "application/pdf"]} maxSize={100 * 1024 * 1024} onFiles={(f) => setFile(f[0] || null)} label="Drop a PDF file here" hint="PDF only" />
        {file && (
          <>
            <div>
              <label className="label">Watermark text</label>
              <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. CONFIDENTIAL" maxLength={50} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Opacity: {Math.round(opacity * 100)}%</label>
                <input type="range" min={5} max={80} value={Math.round(opacity * 100)} onChange={e => setOpacity(parseInt(e.target.value) / 100)} className="w-full accent-accent-500" />
              </div>
              <div>
                <label className="label">Font size: {fontSize}pt</label>
                <input type="range" min={16} max={96} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-accent-500" />
              </div>
            </div>
            <button onClick={handleWatermark} disabled={!text || status === "processing"} className="btn-primary btn btn-lg w-full">Add Watermark</button>
          </>
        )}
      </div>
      <ProcessingCard status={status} errorMessage={error} onReset={() => { setStatus("idle"); setFile(null); }} onRetry={handleWatermark} progressLabel="Adding watermark…" />
    </ToolLayout>
  );
}
