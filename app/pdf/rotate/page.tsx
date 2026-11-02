"use client";
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard, JobStatus } from "@/components/ui/ProcessingCard";
import { rotatePDFPages, getPageCount, downloadBytes } from "@/lib/pdf-utils";

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [target, setTarget] = useState<"all" | "even" | "odd">("all");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleFiles(files: File[]) {
    const f = files[0]; if (!f) return;
    setFile(f);
    setPageCount(await getPageCount(f));
  }

  async function handleRotate() {
    if (!file || pageCount === 0) return;
    setStatus("processing");
    try {
      let indices: number[];
      if (target === "all") indices = Array.from({ length: pageCount }, (_, i) => i);
      else if (target === "even") indices = Array.from({ length: pageCount }, (_, i) => i).filter(i => (i + 1) % 2 === 0);
      else indices = Array.from({ length: pageCount }, (_, i) => i).filter(i => (i + 1) % 2 !== 0);
      const bytes = await rotatePDFPages(file, indices, angle);
      downloadBytes(bytes, file.name.replace(".pdf", `-rotated.pdf`));
      setStatus("done");
    } catch (e: any) {
      setError(e.message); setStatus("error");
    }
  }

  return (
    <ToolLayout title="Rotate Pages" description="Rotate PDF pages by 90°, 180°, or 270°." icon={RotateCw} iconColor="text-pdf-red" backHref="/pdf" backLabel="PDF Tools">
      <div className="card p-6">
        <DropZone accept={[".pdf", "application/pdf"]} maxSize={100 * 1024 * 1024} onFiles={handleFiles} label="Drop a PDF file here" hint="PDF only · Up to 100 MB" />
        {pageCount > 0 && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Rotation angle</label>
              <div className="flex gap-2">
                {([90, 180, 270] as const).map(a => (
                  <button key={a} onClick={() => setAngle(a)} className={angle === a ? "btn-primary btn-sm btn" : "btn-secondary btn-sm btn"}>
                    {a}°
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Apply to</label>
              <div className="flex gap-2">
                {(["all", "odd", "even"] as const).map(t => (
                  <button key={t} onClick={() => setTarget(t)} className={target === t ? "btn-primary btn-sm btn" : "btn-secondary btn-sm btn"}>
                    {t === "all" ? "All pages" : t === "odd" ? "Odd pages" : "Even pages"}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleRotate} disabled={status === "processing"} className="btn-primary btn btn-lg w-full">Rotate PDF</button>
          </div>
        )}
      </div>
      <ProcessingCard status={status} errorMessage={error} onReset={() => { setStatus("idle"); setFile(null); setPageCount(0); }} onRetry={handleRotate} progressLabel="Rotating pages…" />
    </ToolLayout>
  );
}
