import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  backHref?: string;
  backLabel?: string;
  badge?: string;
  children: React.ReactNode;
}

export function ToolLayout({
  title, description, icon: Icon,
  iconColor = "var(--accent)",
  backHref, backLabel = "Back",
  badge, children,
}: ToolLayoutProps) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "2rem 1rem" }}>
      {backHref && (
        <Link
          href={backHref}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem", color: "var(--text-2)", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.12s" }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
          {backLabel}
        </Link>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 24, height: 24, color: iconColor }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>{title}</h1>
            {badge && <span className="badge badge-blue">{badge}</span>}
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginTop: "0.2rem", lineHeight: 1.5 }}>{description}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "2rem", textAlign: "center" }}>
        All processing happens in your browser. Files are never uploaded to any server.
      </p>
    </div>
  );
}
