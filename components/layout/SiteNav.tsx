"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Image,
  Archive,
  GitBranch,
  Clock,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  {
    label: "PDF Tools",
    icon: FileText,
    color: "#DC2626",
    children: [
      { href: "/pdf/merge", label: "Merge PDF" },
      { href: "/pdf/split", label: "Split PDF" },
      { href: "/pdf/compress", label: "Compress PDF" },
      { href: "/pdf/rotate", label: "Rotate PDF" },
      { href: "/pdf/reorder", label: "Reorder Pages" },
      { href: "/pdf/watermark", label: "Watermark" },
      { href: "/pdf/protect", label: "Protect PDF" },
      { href: "/pdf/unlock", label: "Unlock PDF" },
      { href: "/pdf/page-numbers", label: "Page Numbers" },
      { href: "/pdf/to-jpg", label: "PDF to JPG" },
      { href: "/pdf/from-jpg", label: "JPG to PDF" },
      { href: "/pdf/metadata", label: "PDF Metadata" },
    ],
  },
  {
    label: "Image Studio",
    icon: Image,
    color: "#7C3AED",
    children: [
      { href: "/images/edit", label: "Edit Image" },
      { href: "/images/compress", label: "Compress Image" },
      { href: "/images/convert", label: "Convert Image" },
      { href: "/images/resize", label: "Resize Image" },
    ],
  },
  {
    label: "File Utilities",
    icon: Archive,
    color: "#D97706",
    children: [
      { href: "/files/zip", label: "Create ZIP" },
      { href: "/files/extract", label: "Extract ZIP" },
    ],
  },
  { href: "/workflows", label: "Workflows", icon: GitBranch, color: "#0D9488" },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        width: "13.5rem",
        flexShrink: 0,
        borderRight: "1px solid #E2DDD6",
        backgroundColor: "#FFFFFF",
        paddingTop: "0.75rem",
        paddingBottom: "1.5rem",
        overflowY: "auto",
        minHeight: "calc(100vh - 3.5rem)",
      }}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.children) {
          const sectionActive = item.children.some((c) => pathname.startsWith(c.href));
          return (
            <div key={item.label} style={{ marginBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: sectionActive ? item.color || "#2D6BE4" : "#9E9690",
                }}
              >
                <Icon style={{ width: 14, height: 14 }} />
                <span>{item.label}</span>
              </div>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "1.75rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.375rem",
                    paddingBottom: "0.375rem",
                    fontSize: "0.875rem",
                    borderRadius: "6px",
                    margin: "0 0.5rem 0.125rem",
                    textDecoration: "none",
                    fontWeight: isActive(child.href) ? 500 : 400,
                    backgroundColor: isActive(child.href) ? "#EBF0FC" : "transparent",
                    color: isActive(child.href) ? "#1E50B5" : "#524D45",
                    transition: "all 0.15s ease",
                  }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href!}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.875rem",
              borderRadius: "6px",
              margin: "0 0.5rem 0.125rem",
              textDecoration: "none",
              fontWeight: isActive(item.href!, item.exact) ? 600 : 400,
              backgroundColor: isActive(item.href!, item.exact) ? "#EBF0FC" : "transparent",
              color: isActive(item.href!, item.exact) ? "#1E50B5" : "#1C1814",
              transition: "all 0.15s ease",
            }}
          >
            <Icon style={{ width: 16, height: 16, color: item.color }} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
