import Link from "next/link";
import { Image, Sliders, Minimize2, RefreshCw, Maximize, ArrowUpRight } from "lucide-react";

const tools = [
  { href: "/images/edit",     label: "Edit Image",     desc: "Crop, rotate, flip, adjust brightness, contrast, and apply filters.", icon: Sliders  },
  { href: "/images/compress", label: "Compress Image", desc: "Reduce image file size with configurable quality and format output.",   icon: Minimize2 },
  { href: "/images/convert",  label: "Convert Image",  desc: "Convert between JPG, PNG, and WebP formats in your browser.",          icon: RefreshCw },
  { href: "/images/resize",   label: "Resize Image",   desc: "Resize images to exact dimensions or by percentage.",                  icon: Maximize  },
];

export default function ImagesPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ width: 40, height: 40, background: "#F5F3FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image style={{ width: 20, height: 20, color: "#7C3AED" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>Image Studio</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Edit, compress, and convert images — all in your browser.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.25rem", cursor: "pointer", transition: "box-shadow 0.15s" }}>
                <div style={{ width: 36, height: 36, background: "#F5F3FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <Icon style={{ width: 18, height: 18, color: "#7C3AED" }} />
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
