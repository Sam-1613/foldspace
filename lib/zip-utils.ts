// lib/zip-utils.ts
// Browser-side ZIP creation and extraction using JSZip

export async function createZip(files: File[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const file of files) {
    const buf = await file.arrayBuffer();
    zip.file(file.name, buf);
  }
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export interface ZipEntry {
  name: string;
  size: number;
  compressedSize: number;
  isDir: boolean;
}

export async function inspectZip(file: File): Promise<ZipEntry[]> {
  const JSZip = (await import("jszip")).default;
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const entries: ZipEntry[] = [];
  zip.forEach((relativePath, zipEntry) => {
    entries.push({
      name: relativePath,
      // JSZip exposes _data internally; fall back to 0 for dirs
      size: (zipEntry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? 0,
      compressedSize: (zipEntry as unknown as { _data?: { compressedSize?: number } })._data?.compressedSize ?? 0,
      isDir: zipEntry.dir,
    });
  });
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function extractZip(
  file: File,
  selected?: string[] // if undefined, extract all
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    if (selected && !selected.includes(path)) continue;

    const blob = await entry.async("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    // Use only the filename (not path) to avoid path traversal issues in the download
    const safeName = path.split("/").pop() || path;
    a.href = url;
    a.download = safeName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    // Small delay so the browser can handle the download
    await new Promise((r) => setTimeout(r, 80));
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
