import { Settings, Shield, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ width: 40, height: 40, background: "var(--bg)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
          <Settings style={{ width: 20, height: 20, color: "var(--text-2)" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>Settings</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>Preferences and privacy information.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Privacy */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
            <Shield style={{ width: 16, height: 16, color: "var(--success)" }} />
            <h2 style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>Privacy</h2>
          </div>
          <dl style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { term: "Local processing", def: "All PDF, image, and ZIP operations run in your browser using JavaScript and WebAssembly. Your files never leave your device for these operations." },
              { term: "No server uploads", def: "No file data is transmitted to any server. No accounts, no tracking, no analytics." },
              { term: "Local history", def: "Processing history is stored in your browser's localStorage only and is never sent anywhere. You can clear it at any time from the History page." },
              { term: "External fonts", def: "Google Fonts (Inter) is loaded from Google's CDN for typography. No document data is included in these requests." },
            ].map(({ term, def }) => (
              <div key={term}>
                <dt style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--text)" }}>{term}</dt>
                <dd style={{ fontSize: "0.8125rem", color: "var(--text-2)", marginTop: "0.2rem", lineHeight: 1.55 }}>{def}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Limitations */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
            <Info style={{ width: 16, height: 16, color: "var(--accent)" }} />
            <h2 style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>Known limitations</h2>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              "PDF password encryption — not supported by pdf-lib in the browser. Use LibreOffice or Acrobat.",
              "Office document conversion (DOCX/XLSX/PPTX ↔ PDF) — requires LibreOffice, not available in-browser.",
              "OCR / text recognition — requires Tesseract, not available in-browser.",
              "RAR, 7z, TAR archives — only ZIP is supported.",
              "Very large files (> 100 MB) may be slow due to browser memory limits.",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-2)" }}>
                <span style={{ color: "var(--warning)", flexShrink: 0 }}>⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h2 style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>About Foldspace</h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.6 }}>
            Foldspace is a free, open-source document workspace. Core libraries: <strong>pdf-lib</strong> (PDF operations),
            <strong> pdfjs-dist</strong> (PDF rendering), <strong>JSZip</strong> (archive creation/extraction),
            and the browser <strong>Canvas API</strong> (image editing).
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.75rem" }}>Version 1.0.0 · Hosted on Cloudflare Pages</p>
        </div>
      </div>
    </div>
  );
}
