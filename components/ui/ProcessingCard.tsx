"use client";
import { CheckCircle, XCircle, Loader2, Download, RefreshCw } from "lucide-react";

export type JobStatus = "idle" | "processing" | "done" | "error";

interface ProcessingCardProps {
  status: JobStatus;
  fileName?: string;
  originalSize?: number;
  outputSize?: number;
  errorMessage?: string;
  downloadUrl?: string;
  downloadName?: string;
  onRetry?: () => void;
  onReset?: () => void;
  progressLabel?: string;
}

function fmt(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function reduction(orig?: number, out?: number): string {
  if (!orig || !out || orig <= out) return out && orig && out >= orig ? "No size reduction" : "";
  const pct = ((orig - out) / orig) * 100;
  return `${pct.toFixed(1)}% smaller`;
}

export function ProcessingCard({
  status, fileName, originalSize, outputSize,
  errorMessage, downloadUrl, downloadName,
  onRetry, onReset, progressLabel = "Processing…",
}: ProcessingCardProps) {
  if (status === "idle") return null;

  return (
    <div className="card animate-slide-up" style={{ padding: "1.25rem", marginTop: "1.5rem" }}>
      {status === "processing" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Loader2 style={{ width: 20, height: 20, color: "var(--accent)", flexShrink: 0 }} className="animate-spin" />
          <div>
            <p style={{ fontWeight: 500, color: "var(--text)" }}>{progressLabel}</p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.15rem" }}>
              Runs entirely in your browser — no upload needed.
            </p>
          </div>
        </div>
      )}

      {status === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CheckCircle style={{ width: 20, height: 20, color: "var(--success)", flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 500, color: "var(--text)" }}>Done!</p>
              {fileName && <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{fileName}</p>}
            </div>
          </div>

          {(originalSize || outputSize) && (
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {originalSize && (
                <div>
                  <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: "0.15rem" }}>Original</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>{fmt(originalSize)}</span>
                </div>
              )}
              {outputSize && (
                <div>
                  <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: "0.15rem" }}>Result</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{fmt(outputSize)}</span>
                </div>
              )}
              {originalSize && outputSize && reduction(originalSize, outputSize) && (
                <div>
                  <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", marginBottom: "0.15rem" }}>Savings</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--success)", fontWeight: 500 }}>{reduction(originalSize, outputSize)}</span>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {downloadUrl && (
              <a href={downloadUrl} download={downloadName || "download"} className="btn btn-primary">
                <Download style={{ width: 16, height: 16 }} /> Download
              </a>
            )}
            {onReset && (
              <button onClick={onReset} className="btn btn-secondary">
                <RefreshCw style={{ width: 16, height: 16 }} /> Process another
              </button>
            )}
          </div>
        </div>
      )}

      {status === "error" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <XCircle style={{ width: 20, height: 20, color: "var(--danger)", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontWeight: 500, color: "var(--danger)" }}>Processing failed</p>
              {errorMessage && <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", marginTop: "0.2rem", lineHeight: 1.5 }}>{errorMessage}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {onRetry && (
              <button onClick={onRetry} className="btn btn-secondary">
                <RefreshCw style={{ width: 16, height: 16 }} /> Try again
              </button>
            )}
            {onReset && (
              <button onClick={onReset} className="btn btn-ghost">Start over</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
