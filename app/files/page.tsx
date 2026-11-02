import Link from "next/link";
import { Archive, FilePlus2, FolderOpen, ArrowUpRight } from "lucide-react";

const tools = [
  { href: "/files/zip",     label: "Create ZIP",  desc: "Compress multiple files into a single ZIP archive.",          icon: FilePlus2 },
  { href: "/files/extract", label: "Extract ZIP", desc: "Extract files from a ZIP archive — preview before you save.", icon: FolderOpen },
];

export default function FilesPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ width: 40, height: 40, background: "#FFFBEB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Archive style={{ width: 20, height: 20, color: "#D97706" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>File Utilities</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Create and extract archives in your browser.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.25rem", cursor: "pointer", transition: "box-shadow 0.15s" }}>
                <div style={{ width: 36, height: 36, background: "#FFFBEB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <Icon style={{ width: 18, height: 18, color: "#D97706" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>
                  {tool.label}
                  <ArrowUpRight style={{ width: 14, height: 14, color: "var(--text-3)" }} />
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>{tool.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
