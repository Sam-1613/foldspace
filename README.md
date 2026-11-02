# Foldspace

A free, browser-based document and file workspace. All processing runs in your browser — your files never leave your device.

## Features

### PDF Tools
- **Merge PDF** — Combine multiple PDFs into one
- **Split PDF** — Split by page ranges or extract every page
- **Compress PDF** — Object-stream optimisation via pdf-lib
- **Rotate Pages** — Rotate by 90°, 180°, or 270°
- **Reorder Pages** — Drag-and-drop page ordering
- **Watermark PDF** — Diagonal text watermark on every page
- **Add Page Numbers** — Configurable position and formatting
- **Protect PDF** — *(limitation noted — browser encryption not supported)*
- **Unlock PDF** — Remove password with pdf-lib
- **PDF to JPG** — Render pages using PDF.js
- **JPG to PDF** — Embed images into a PDF
- **PDF Metadata** — View embedded document properties

### Image Studio
- **Edit Image** — Brightness, contrast, saturation, rotation, flip, greyscale
- **Compress Image** — Canvas-based quality/format compression
- **Convert Image** — JPG ↔ PNG ↔ WebP
- **Resize Image** — Pixel dimensions with optional aspect lock

### File Utilities
- **Create ZIP** — DEFLATE compression via JSZip
- **Extract ZIP** — Preview and selectively extract files

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline styles |
| PDF processing | pdf-lib, pdfjs-dist |
| Image processing | Canvas API |
| Archives | JSZip |
| Hosting | Cloudflare Pages (free tier) |

## Local development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

The build output is in `out/` — a fully static site with no server requirements.

## Deployment on Cloudflare Pages (free, no credit card for basic use)

1. Push this repository to GitHub or GitLab.
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/).
3. Create a new project → connect your repository.
4. Set build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Click **Save and Deploy**.
6. Your site will be live at `https://<project>.pages.dev` within minutes.

### Environment variables
No environment variables are required for the core application.

### Custom domain (optional)
In your Cloudflare Pages project → Custom domains → add your domain. DNS propagates automatically if the domain is on Cloudflare.

## Known limitations

| Feature | Status | Reason |
|---|---|---|
| PDF password encryption | ⚠ Unavailable in browser | pdf-lib does not implement AES encryption |
| Office conversion (DOCX/XLSX ↔ PDF) | ⚠ Requires server | Needs LibreOffice |
| OCR | ⚠ Requires server | Needs Tesseract |
| RAR / 7z / TAR archives | ⚠ Not supported | Only ZIP is implemented |
| Files > 100 MB | ⚠ May be slow | Browser memory limitations |

## Privacy

- All processing runs in-browser (pdf-lib, Canvas API, JSZip).
- No files are ever uploaded to a server.
- History is stored in `localStorage` only.
- The only external network request is Google Fonts for the Inter typeface.
