import Link from "next/link";
import {
  FileText, Image, Archive, GitBranch,
  Merge, Scissors, Minimize2, Shield,
  Droplets, RotateCw, ImagePlus, FileImage,
  FilePlus2, Zap, ArrowRight, Lock,
} from "lucide-react";

const popularTools = [
  { href: "/pdf/merge",    label: "Merge PDF",        icon: Merge,      bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/split",    label: "Split PDF",        icon: Scissors,   bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/compress", label: "Compress PDF",     icon: Minimize2,  bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/protect",  label: "Protect PDF",      icon: Shield,     bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/watermark",label: "Watermark",        icon: Droplets,   bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/rotate",   label: "Rotate Pages",     icon: RotateCw,   bg: "#FEF2F2", color: "#DC2626" },
  { href: "/images/compress",label: "Compress Image", icon: Minimize2,  bg: "#F5F3FF", color: "#7C3AED" },
  { href: "/images/convert", label: "Convert Image",  icon: ImagePlus,  bg: "#F5F3FF", color: "#7C3AED" },
  { href: "/pdf/from-jpg", label: "JPG to PDF",       icon: FileImage,  bg: "#FEF2F2", color: "#DC2626" },
  { href: "/pdf/to-jpg",   label: "PDF to JPG",       icon: FileImage,  bg: "#FEF2F2", color: "#DC2626" },
  { href: "/files/zip",    label: "Create ZIP",       icon: FilePlus2,  bg: "#FFFBEB", color: "#D97706" },
  { href: "/files/extract",label: "Extract ZIP",      icon: Archive,    bg: "#FFFBEB", color: "#D97706" },
];

const categories = [
  {
    href: "/pdf", label: "PDF Tools", icon: FileText,
    color: "#DC2626", bg: "#FEF2F2", border: "#FECACA",
    description: "Merge, split, compress, protect, and organise your PDF documents.",
    count: 12,
  },
  {
    href: "/images", label: "Image Studio", icon: Image,
    color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE",
    description: "Edit, compress, resize, and convert images entirely in your browser.",
    count: 4,
  },
  {
    href: "/files", label: "File Utilities", icon: Archive,
    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A",
    description: "Create and extract ZIP archives with full directory support.",
    count: 2,
  },
  {
    href: "/workflows", label: "Workflows", icon: GitBranch,
    color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4",
    description: "Chain multiple operations into reusable automated sequences.",
    count: null,
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 3rem" }}>
        <div className="badge badge-blue" style={{ marginBottom: "1rem" }}>
          <Zap style={{ width: 12, height: 12 }} />
          Runs entirely in your browser
        </div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.25, marginBottom: "0.75rem" }}>
          Your document workspace,{" "}
          <span style={{ color: "var(--accent)" }}>no uploads required</span>
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.6 }}>
          Free PDF tools, image editing, and file utilities that run completely in your browser.
          Your files never leave your device.
        </p>
      </section>

      {/* Categories */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem" }}>
          Tool categories
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.href} href={cat.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "1.25rem", border: `1px solid ${cat.border}`, transition: "box-shadow 0.15s", cursor: "pointer" }}>
                  <div style={{ width: 40, height: 40, background: cat.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                    <Icon style={{ width: 20, height: 20, color: cat.color }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <h3 style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>{cat.label}</h3>
                    {cat.count && <span className="badge badge-gray">{cat.count}</span>}
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>{cat.description}</p>
                  <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 500, color: "var(--accent)" }}>
                    Explore <ArrowRight style={{ width: 12, height: 12 }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular tools */}
      <section>
        <h2 style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem" }}>
          Popular tools
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "0.875rem", display: "flex", alignItems: "center", gap: "0.75rem", transition: "box-shadow 0.15s", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, background: tool.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 16, height: 16, color: tool.color }} />
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text)" }}>{tool.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Privacy note */}
      <div style={{ marginTop: "3rem", padding: "1rem", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
          <strong style={{ color: "var(--text)" }}>Your files stay private.</strong>{" "}
          All document processing runs in your browser using WebAssembly and JavaScript.
          No file data is ever transmitted to any server.
        </p>
      </div>
    </div>
  );
}
