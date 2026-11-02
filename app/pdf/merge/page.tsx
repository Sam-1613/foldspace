"use client";
import { useState, useCallback } from "react";
import { Merge } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard, JobStatus } from "@/components/ui/ProcessingCard";
import { mergePDFs, downloadBytes } from "@/lib/pdf-utils";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleMerge() {
    if (files.length < 2) return;
    setStatus("processing");
    setError("");
    try {
      const bytes = await mergePDFs(files);
      setOutputSize(bytes.length);
      downloadBytes(bytes, "merged.pdf");
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Failed to merge PDFs");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder before merging."
      icon={Merge}
      iconColor="text-pdf-red"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card p-6">
        <DropZone
          accept={[".pdf", "application/pdf"]}
          multiple
          maxSize={100 * 1024 * 1024}
          onFiles={setFiles}
          label="Drop PDF files here"
          hint="PDF only · Up to 100 MB per file · Multiple files"
        />
        {files.length > 0 && (
          <div className="mt-4 p-3 bg-linen-100 rounded text-sm text-ink-600">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
            {files.length < 2 && <span className="text-warning ml-2">— add at least 2 files to merge</span>}
          </div>
        )}
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || status === "processing"}
          className="btn-primary btn mt-4 btn-lg w-full"
        >
          Merge {files.length > 0 ? `${files.length} PDFs` : "PDFs"}
        </button>
      </div>
      <ProcessingCard
        status={status}
        fileName="merged.pdf"
        outputSize={outputSize}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFiles([]); setOutputSize(undefined); }}
        onRetry={handleMerge}
        progressLabel="Merging PDFs in your browser…"
      />
    </ToolLayout>
  );
}
