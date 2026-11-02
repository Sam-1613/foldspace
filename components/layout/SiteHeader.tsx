"use client";
import Link from "next/link";
import { Search, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2DDD6",
        height: "3.5rem",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "6px",
            backgroundColor: "#2D6BE4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 3h7l3 3v7H2V3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 3v3h3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
        <span
          style={{
            fontWeight: 600,
            color: "#1C1814",
            fontSize: "15px",
            letterSpacing: "-0.01em",
          }}
        >
          Foldspace
        </span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "24rem" }}>
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "0.625rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "#9E9690",
            }}
          />
          <input
            type="search"
            placeholder="Search tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{
              paddingLeft: "2rem",
              backgroundColor: "#F5F3EF",
            }}
          />
        </div>
      </form>

      <div style={{ flex: 1 }} />

      <Link
        href="/settings"
        className="btn btn-ghost btn-sm"
        style={{ display: "inline-flex", textDecoration: "none" }}
      >
        <Settings style={{ width: 16, height: 16 }} />
        <span>Settings</span>
      </Link>

      <button
        className="btn btn-ghost"
        style={{ padding: "0.375rem" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
      </button>
    </header>
  );
}
