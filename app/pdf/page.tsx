import Link from "next/link";
import { FileText, Merge, Scissors, Minimize2, Shield, Lock, Droplets, RotateCw, FileImage, Hash, AlignLeft, Info, ArrowUpRight } from "lucide-react";

const tools = [
  { href: "/pdf/merge",        label: "Merge PDF",      desc: "Combine multiple PDFs into one document.",              icon: Merge,      tag: "Organize" },
  { href: "/pdf/split",        label: "Split PDF",      desc: "Split a PDF into multiple files by page ranges.",       icon: Scissors,   tag: "Organize" },
  { href: "/pdf/compress",     label: "Compress PDF",   desc: "Reduce PDF file size while preserving quality.",        icon: Minimize2,  tag: "Optimize" },
  { href: "/pdf/rotate",       label: "Rotate Pages",   desc: "Rotate selected pages in a PDF.",                       icon: RotateCw,   tag: "Organize" },
  { href: "/pdf/reorder",      label: "Reorder Pages",  desc: "Drag and drop to reorder PDF pages.",                   icon: AlignLeft,  tag: "Organize" },
  { href: "/pdf/watermark",    label: "Watermark PDF",  desc: "Add a text watermark to every page.",                   icon: Droplets,   tag: "Edit" },
  { href: "/pdf/page-numbers", label: "Page Numbers",   desc: "Add page numbers with configurable placement.",          icon: Hash,       tag: "Edit" },
  { href: "/pdf/protect",      label: "Protect PDF",    desc: "Password-protect a PDF to restrict access.",            icon: Shield,     tag: "Security" },
  { href: "/pdf/unlock",       label: "Unlock PDF",     desc: "Remove password from a PDF you are authorised to use.", icon: Lock,       tag: "Security" },
  { href: "/pdf/to-jpg",       label: "PDF to JPG",     desc: "Convert each PDF page to a JPG image.",                 icon: FileImage,  tag: "Convert" },
  { href: "/pdf/from-jpg",     label: "JPG to PDF",     desc: "Convert images into a single PDF document.",            icon: FileText,   tag: "Convert" },
  { href: "/pdf/metadata",     label: "PDF Metadata",   desc: "View document metadata and properties.",                icon: Info,       tag: "Inspect" },
];

const tagColors: Record<string, string> = {
  Organize: "badge-blue",
  Optimize: "badge-green",
  Edit:     "badge-amber",
  Security: "badge-red",
  Convert:  "badge-gray",
  Inspect:  "badge-gray",
};

export default function PDFToolsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ width: 40, height: 40, background: "#FEF2F2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText style={{ width: 20, height: 20, color: "#DC2626" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>PDF Tools</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>All processing runs in your browser — no uploads.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1rem" }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.25rem", cursor: "pointer", transition: "box-shadow 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ width: 36, height: 36, background: "#FEF2F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color: "#DC2626" }} />
                  </div>
                  <span className={`badge ${tagColors[tool.tag] || "badge-gray"}`}>{tool.tag}</span>
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
