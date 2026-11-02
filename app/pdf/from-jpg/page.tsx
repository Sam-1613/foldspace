"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { imagesToPDF, downloadBytes } from "@/lib/pdf-utils";

export default function JPGToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleConvert() {
    if (files.length === 0) return;
    setStatus("processing");
    setError("");
    try {
      const bytes = await imagesToPDF(files);
      setOutputSize(bytes.length);
      downloadBytes(bytes, "images.pdf");
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create PDF.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="JPG to PDF"
      description="Convert JPG and PNG images into a single PDF document. Each image becomes one page."
      icon={FileText}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".jpg", ".jpeg", ".png", "image/jpeg", "image/png"]}
          multiple
          maxSize={20 * 1024 * 1024}
          onFiles={setFiles}
          label="Drop images here"
          hint="JPG & PNG · up to 20 MB each · multiple files allowed"
        />

        {files.length > 0 && (
          <button onClick={handleConvert} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ marginTop: "1rem", width: "100%" }}>
            Convert {files.length} image{files.length !== 1 ? "s" : ""} to PDF
          </button>
        )}
      </div>

      <ProcessingCard
        status={status}
        fileName="images.pdf"
        outputSize={outputSize}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFiles([]); setOutputSize(undefined); }}
        onRetry={handleConvert}
        progressLabel="Building PDF from images…"
      />
    </ToolLayout>
  );
}
