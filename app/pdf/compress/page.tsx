"use client";
import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard, JobStatus } from "@/components/ui/ProcessingCard";
import { compressPDF, downloadBytes } from "@/lib/pdf-utils";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");
  const [outputSize, setOutputSize] = useState<number>();

  async function handleCompress() {
    if (!file) return;
    setStatus("processing");
    try {
      const bytes = await compressPDF(file);
      setOutputSize(bytes.length);
      downloadBytes(bytes, file.name.replace(".pdf", "-compressed.pdf"));
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Failed to compress PDF");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size using object stream optimization. Results vary by PDF content."
      icon={Minimize2}
      iconColor="text-pdf-red"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
        <strong>Note:</strong> Browser-based compression uses object stream deduplication via pdf-lib.
        For heavily image-laden PDFs, actual savings may vary. Image resampling compression requires a server-side tool.
      </div>

      <div className="card p-6">
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={(f) => setFile(f[0] || null)}
          label="Drop a PDF file here"
          hint="PDF only · Up to 100 MB"
        />
        {file && (
          <button
            onClick={handleCompress}
            disabled={status === "processing"}
            className="btn-primary btn btn-lg w-full mt-4"
          >
            Compress PDF
          </button>
        )}
      </div>

      <ProcessingCard
        status={status}
        fileName={file ? file.name.replace(".pdf", "-compressed.pdf") : undefined}
        originalSize={file?.size}
        outputSize={outputSize}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setOutputSize(undefined); }}
        onRetry={handleCompress}
        progressLabel="Compressing PDF in your browser…"
      />
    </ToolLayout>
  );
}
