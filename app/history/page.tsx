"use client";
import { useState, useEffect } from "react";
import { Clock, Trash2 } from "lucide-react";

interface HistoryEntry {
  id: string;
  tool: string;
  fileName: string;
  status: "done" | "error";
  originalSize?: number;
  outputSize?: number;
  timestamp: number;
}

function fmt(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("foldspace_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  function clearHistory() {
    localStorage.removeItem("foldspace_history");
    setHistory([]);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, background: "var(--bg)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <Clock style={{ width: 20, height: 20, color: "var(--text-2)" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>History</h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Recent processing jobs — stored locally in your browser.</p>
          </div>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}>
            <Trash2 style={{ width: 14, height: 14 }} /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-3)" }}>
          <Clock style={{ width: 36, height: 36, margin: "0 auto 0.75rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.875rem" }}>No history yet. Process a file to see it here.</p>
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>History is stored locally and clears when you remove it or clear browser storage.</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[...history].reverse().map((entry) => (
            <li key={entry.id} className="card" style={{ padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.fileName}
                  </span>
                  <span className={`badge ${entry.status === "done" ? "badge-green" : "badge-red"}`}>
                    {entry.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", gap: "0.75rem" }}>
                  <span>{entry.tool}</span>
                  {entry.originalSize && <span>{fmt(entry.originalSize)} → {fmt(entry.outputSize)}</span>}
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
