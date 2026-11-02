import { GitBranch, Plus, ArrowRight, Merge, Minimize2, Hash } from "lucide-react";

const examples = [
  {
    name: "Merge & Compress",
    steps: ["Upload PDFs", "Merge into one document", "Compress file size", "Download result"],
    tools: ["/pdf/merge", "/pdf/compress"],
  },
  {
    name: "Image Batch Convert",
    steps: ["Upload images", "Convert to WebP format", "Download all"],
    tools: ["/images/convert"],
  },
  {
    name: "Archive & Organise",
    steps: ["Upload files", "Create ZIP archive", "Download archive"],
    tools: ["/files/zip"],
  },
];

export default function WorkflowsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ width: 40, height: 40, background: "#F0FDFA", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GitBranch style={{ width: 20, height: 20, color: "#0D9488" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>Workflows</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Chain multiple operations into reusable sequences.</p>
        </div>
      </div>

      <div style={{ padding: "1rem", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: 8, marginBottom: "1.5rem", fontSize: "0.8125rem", color: "#134E4A" }}>
        <strong>Coming soon:</strong> The visual workflow builder is in development. For now, use individual tools in sequence — each tool&apos;s output can be used as input to the next.
      </div>

      <h2 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Example workflows
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {examples.map((ex) => (
          <div key={ex.name} className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.75rem" }}>{ex.name}</h3>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              {ex.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.375rem 0.625rem", fontSize: "0.8125rem", color: "var(--text)" }}>
                    <span style={{ width: 18, height: 18, background: "#0D9488", color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    {step}
                  </span>
                  {i < ex.steps.length - 1 && <ArrowRight style={{ width: 14, height: 14, color: "var(--text-3)", flexShrink: 0 }} />}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
