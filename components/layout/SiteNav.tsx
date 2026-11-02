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
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  {
    label: "PDF Tools",
    icon: FileText,
    color: "text-pdf-red",
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
    color: "text-image-purple",
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
    color: "text-archive-amber",
    children: [
      { href: "/files/zip", label: "Create ZIP" },
      { href: "/files/extract", label: "Extract ZIP" },
    ],
  },
  { href: "/workflows", label: "Workflows", icon: GitBranch, color: "text-workflow-teal" },
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
      className="hidden md:flex flex-col w-52 shrink-0 border-r border-linen-300 bg-white pt-3 pb-6 overflow-y-auto"
      style={{ minHeight: "calc(100vh - 3.5rem)" }}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.children) {
          const sectionActive = item.children.some((c) => pathname.startsWith(c.href));
          return (
            <div key={item.label} className="mb-1">
              <div
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-widest ${
                  sectionActive ? item.color || "text-accent-600" : "text-ink-400"
                } mt-2`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </div>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center gap-2 pl-7 pr-3 py-1.5 text-sm rounded mx-2 transition-colors ${
                    isActive(child.href)
                      ? "bg-accent-50 text-accent-700 font-medium"
                      : "text-ink-600 hover:text-ink-900 hover:bg-linen-100"
                  }`}
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
            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded mx-2 transition-colors mt-0.5 ${
              isActive(item.href!, item.exact)
                ? "bg-accent-50 text-accent-700 font-semibold"
                : "text-ink-700 hover:text-ink-900 hover:bg-linen-100"
            }`}
          >
            <Icon className={`w-4 h-4 ${item.color || ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
