// lib/image-utils.ts
// All image operations run client-side using the Canvas API.

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Load an image File into an HTMLImageElement */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image.")); };
    img.src = url;
  });
}

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export interface CompressOptions {
  quality: number;          // 0–1
  format: OutputFormat;
  maxWidth?: number;
  maxHeight?: number;
}

/** Compress/convert an image and return a Blob */
export async function compressImage(file: File, opts: CompressOptions): Promise<Blob> {
  const img = await loadImage(file);

  let { width, height } = img;
  if (opts.maxWidth && width > opts.maxWidth) {
    height = Math.round((height * opts.maxWidth) / width);
    width = opts.maxWidth;
  }
  if (opts.maxHeight && height > opts.maxHeight) {
    width = Math.round((width * opts.maxHeight) / height);
    height = opts.maxHeight;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed."))),
      opts.format,
      opts.quality
    );
  });
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspect: boolean;
  format: OutputFormat;
  quality: number;
}

export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> {
  const img = await loadImage(file);

  let { width, height } = opts;
  if (opts.maintainAspect) {
    const ratio = img.width / img.height;
    if (width / height > ratio) width = Math.round(height * ratio);
    else height = Math.round(width / ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed."))),
      opts.format,
      opts.quality
    );
  });
}

export interface EditOptions {
  brightness: number;  // -100 to 100
  contrast: number;    // -100 to 100
  saturation: number;  // -100 to 100
  rotation: number;    // degrees: 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  grayscale: boolean;
  format: OutputFormat;
  quality: number;
}

export async function editImage(file: File, opts: EditOptions): Promise<Blob> {
  const img = await loadImage(file);

  const rad = (opts.rotation * Math.PI) / 180;
  const swapped = opts.rotation === 90 || opts.rotation === 270;
  const canvasW = swapped ? img.height : img.width;
  const canvasH = swapped ? img.width : img.height;

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // Apply CSS filters via the filter property
  const brightnessF = 1 + opts.brightness / 100;
  const contrastF = 1 + opts.contrast / 100;
  const saturateF = opts.grayscale ? 0 : 1 + opts.saturation / 100;
  ctx.filter = `brightness(${brightnessF}) contrast(${contrastF}) saturate(${saturateF})`;

  ctx.translate(canvasW / 2, canvasH / 2);
  ctx.rotate(rad);
  ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed."))),
      opts.format,
      opts.quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function replaceExtension(name: string, format: OutputFormat): string {
  const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
  return name.replace(/\.(jpe?g|png|webp|gif|bmp|tiff?)$/i, `.${ext}`) || `${name}.${ext}`;
}
