"use client";
import { useState } from "react";
import { Scissors, Plus, Trash2 } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard, JobStatus } from "@/components/ui/ProcessingCard";
import { splitPDF, getPageCount, downloadBytes } from "@/lib/pdf-utils";

interface Range { start: string; end: string; name: string; }

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ranges, setRanges] = useState<Range[]>([{ start: "1", end: "1", name: "part-1.pdf" }]);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"ranges" | "every">("ranges");

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const count = await getPageCount(f);
    setPageCount(count);
    setRanges([{ start: "1", end: String(count), name: "part-1.pdf" }]);
  }

  function addRange() {
    setRanges([...ranges, { start: "1", end: String(pageCount), name: `part-${ranges.length + 1}.pdf` }]);
  }

  function removeRange(i: number) {
    setRanges(ranges.filter((_, idx) => idx !== i));
  }

  function updateRange(i: number, key: keyof Range, value: string) {
    setRanges(ranges.map((r, idx) => idx === i ? { ...r, [key]: value } : r));
  }

  async function handleSplit() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      let splitRanges;
      if (mode === "every") {
        splitRanges = Array.from({ length: pageCount }, (_, i) => ({
          start: i + 1, end: i + 1, name: `page-${i + 1}.pdf`
        }));
      } else {
        splitRanges = ranges.map(r => ({
          start: parseInt(r.start) || 1,
          end: parseInt(r.end) || pageCount,
          name: r.name || `part.pdf`,
        }));
      }
      const results = await splitPDF(file, splitRanges);
      for (const r of results) downloadBytes(r.bytes, r.name);
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Failed to split PDF");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Split PDF"
      description="Split a PDF by page ranges or extract every page as a separate file."
      icon={Scissors}
      iconColor="text-pdf-red"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card p-6">
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop a PDF file here"
          hint="PDF only · Up to 100 MB"
        />
        {pageCount > 0 && (
          <p className="mt-2 text-sm text-ink-500">{pageCount} pages detected</p>
        )}
      </div>

      {file && pageCount > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("ranges")}
              className={mode === "ranges" ? "btn-primary btn-sm btn" : "btn-secondary btn-sm btn"}
            >
              By range
            </button>
            <button
              onClick={() => setMode("every")}
              className={mode === "every" ? "btn-primary btn-sm btn" : "btn-secondary btn-sm btn"}
            >
              Every page
            </button>
          </div>

          {mode === "ranges" && (
            <div className="space-y-3">
              {ranges.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="number" min={1} max={pageCount} value={r.start}
                    onChange={e => updateRange(i, "start", e.target.value)}
                    className="input w-20" placeholder="From" />
                  <span className="text-ink-400 text-sm">to</span>
                  <input type="number" min={1} max={pageCount} value={r.end}
                    onChange={e => updateRange(i, "end", e.target.value)}
                    className="input w-20" placeholder="To" />
                  <input type="text" value={r.name}
                    onChange={e => updateRange(i, "name", e.target.value)}
                    className="input flex-1" placeholder="filename.pdf" />
                  {ranges.length > 1 && (
                    <button onClick={() => removeRange(i)} className="btn-ghost p-1.5 text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addRange} className="btn-ghost btn-sm btn">
                <Plus className="w-4 h-4" /> Add range
              </button>
            </div>
          )}

          {mode === "every" && (
            <p className="text-sm text-ink-500">
              Will create {pageCount} separate PDF files, one per page.
            </p>
          )}

          <button
            onClick={handleSplit}
            disabled={status === "processing"}
            className="btn-primary btn btn-lg w-full"
          >
            Split PDF
          </button>
        </div>
      )}

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setPageCount(0); }}
        onRetry={handleSplit}
        progressLabel="Splitting PDF in your browser…"
      />
    </ToolLayout>
  );
}
