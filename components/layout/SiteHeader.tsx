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
    <header className="sticky top-0 z-50 bg-white border-b border-linen-300 h-14 flex items-center px-4 gap-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 group">
        <span className="w-7 h-7 rounded bg-accent-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 3h7l3 3v7H2V3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 3v3h3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-semibold text-ink-950 text-[15px] tracking-tight group-hover:text-accent-600 transition-colors">
          Foldspace
        </span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" />
          <input
            type="search"
            placeholder="Search tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-linen-100 border border-linen-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-500 focus:bg-white transition-all"
          />
        </div>
      </form>

      <div className="flex-1" />

      <Link href="/settings" className="btn-ghost btn-sm hidden sm:flex">
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </Link>

      {/* Mobile menu toggle */}
      <button
        className="sm:hidden btn-ghost p-1.5"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </header>
  );
}
