"use client";
import { useState } from "react";
import { AlignLeft, GripVertical, RotateCcw } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { ProcessingCard } from "@/components/ui/ProcessingCard";
import type { JobStatus } from "@/components/ui/ProcessingCard";
import { reorderPDFPages, getPageCount, downloadBytes } from "@/lib/pdf-utils";

export default function ReorderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [error, setError] = useState("");

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const count = await getPageCount(f);
    setPageCount(count);
    setOrder(Array.from({ length: count }, (_, i) => i));
  }

  function onDragStart(idx: number) {
    setDraggingIdx(idx);
  }

  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === idx) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(draggingIdx, 1);
    newOrder.splice(idx, 0, removed);
    setOrder(newOrder);
    setDraggingIdx(idx);
  }

  async function handleApply() {
    if (!file) return;
    setStatus("processing");
    setError("");
    try {
      const bytes = await reorderPDFPages(file, order);
      downloadBytes(bytes, file.name.replace(/\.pdf$/i, "-reordered.pdf"));
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to reorder pages.");
      setStatus("error");
    }
  }

  return (
    <ToolLayout
      title="Reorder Pages"
      description="Drag pages into the order you want, then apply and download the result."
      icon={AlignLeft}
      iconColor="#DC2626"
      backHref="/pdf"
      backLabel="PDF Tools"
    >
      <div className="card" style={{ padding: "1.5rem" }}>
        <DropZone
          accept={[".pdf", "application/pdf"]}
          maxSize={100 * 1024 * 1024}
          onFiles={handleFiles}
          label="Drop a PDF file here"
          hint="PDF only · up to 100 MB"
        />

        {order.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", marginBottom: "0.5rem" }}>
              Drag rows to reorder ({pageCount} pages)
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "18rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {order.map((originalPageIdx, i) => (
                <li
                  key={i}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDragEnd={() => setDraggingIdx(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    background: "#fff",
                    border: `1px solid ${draggingIdx === i ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 6,
                    cursor: "grab",
                    opacity: draggingIdx === i ? 0.5 : 1,
                    userSelect: "none",
                  }}
                >
                  <GripVertical style={{ width: 16, height: 16, color: "var(--text-3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", color: "var(--text)" }}>
                    Page {originalPageIdx + 1}
                  </span>
                  {originalPageIdx !== i && (
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--accent)" }}>
                      was {originalPageIdx + 1}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={() => setOrder(Array.from({ length: pageCount }, (_, i) => i))}
                className="btn btn-ghost btn-sm"
              >
                <RotateCcw style={{ width: 14, height: 14 }} /> Reset
              </button>
              <button onClick={handleApply} disabled={status === "processing"} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                Apply new order
              </button>
            </div>
          </div>
        )}
      </div>

      <ProcessingCard
        status={status}
        errorMessage={error}
        onReset={() => { setStatus("idle"); setFile(null); setOrder([]); setPageCount(0); }}
        onRetry={handleApply}
        progressLabel="Reordering pages…"
      />
    </ToolLayout>
  );
}
