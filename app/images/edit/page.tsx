"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Download,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Sun,
  Contrast,
  Palette,
  Eye,
  Crop,
  Layers,
} from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { DropZone } from "@/components/ui/DropZone";
import { downloadBlob, replaceExtension, formatBytes } from "@/lib/image-utils";
import type { OutputFormat } from "@/lib/image-utils";

type FilterPreset = "none" | "warm" | "cool" | "vintage" | "dramatic" | "bw" | "vivid";

interface PresetConfig {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia?: number;
  grayscale?: boolean;
}

const PRESETS: Record<FilterPreset, PresetConfig> = {
  none: { brightness: 0, contrast: 0, saturation: 0 },
  warm: { brightness: 5, contrast: 10, saturation: 20 },
  cool: { brightness: 0, contrast: 5, saturation: -15 },
  vintage: { brightness: 10, contrast: -10, saturation: -20, sepia: 40 },
  dramatic: { brightness: -5, contrast: 40, saturation: 10 },
  bw: { brightness: 0, contrast: 25, saturation: -100, grayscale: true },
  vivid: { brightness: 5, contrast: 20, saturation: 45 },
};

export default function EditImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Edit states
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [activePreset, setActivePreset] = useState<FilterPreset>("none");

  // Output config
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [exporting, setExporting] = useState(false);
  const [estimatedSize, setEstimatedSize] = useState<string>("");

  // Canvas ref for real-time live preview
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load image when file is selected
  useEffect(() => {
    if (!file) {
      setImgElement(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImgElement(img);
      resetControls();
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetControls = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setGrayscale(false);
    setActivePreset("none");
  };

  // Live rendering onto canvas whenever controls change
  const renderCanvas = useCallback(() => {
    if (!imgElement || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isSwapped = rotation === 90 || rotation === 270;
    const width = isSwapped ? imgElement.naturalHeight : imgElement.naturalWidth;
    const height = isSwapped ? imgElement.naturalWidth : imgElement.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply color filters
    const b = 1 + brightness / 100;
    const c = 1 + contrast / 100;
    const s = grayscale ? 0 : 1 + saturation / 100;
    const sepiaVal = PRESETS[activePreset]?.sepia ? ` sepia(${PRESETS[activePreset].sepia}%)` : "";

    ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s})${sepiaVal}`;

    // Apply transformation (rotation and flips)
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(
      imgElement,
      -imgElement.naturalWidth / 2,
      -imgElement.naturalHeight / 2,
      imgElement.naturalWidth,
      imgElement.naturalHeight
    );

    ctx.restore();
  }, [imgElement, brightness, contrast, saturation, rotation, flipH, flipV, grayscale, activePreset]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Apply quick filter presets
  const applyPreset = (preset: FilterPreset) => {
    setActivePreset(preset);
    const config = PRESETS[preset];
    setBrightness(config.brightness);
    setContrast(config.contrast);
    setSaturation(config.saturation);
    setGrayscale(!!config.grayscale);
  };

  // Export high-res image
  const handleExport = async () => {
    if (!canvasRef.current || !file) return;
    setExporting(true);
    try {
      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            downloadBlob(blob, replaceExtension(file.name, format));
          }
          setExporting(false);
        },
        format,
        quality / 100
      );
    } catch {
      setExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #E2DDD6",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1C1814" }}>
            Photo Studio & Editor
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B6560" }}>
            Real-time canvas editing with zero compression degradation until export.
          </p>
        </div>

        {file && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={resetControls}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
            >
              <Undo2 style={{ width: 14, height: 14 }} /> Reset Edits
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn btn-primary"
              style={{
                backgroundColor: "#2D6BE4",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                fontWeight: 600,
              }}
            >
              <Download style={{ width: 16, height: 16 }} />
              {exporting ? "Rendering..." : "Export Image"}
            </button>
          </div>
        )}
      </div>

      {!file ? (
        <div style={{ maxWidth: 640, margin: "3rem auto" }}>
          <DropZone
            accept={[".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"]}
            maxSize={25 * 1024 * 1024}
            onFiles={(f) => setFile(f[0] ?? null)}
            label="Upload photo to edit"
            hint="Supports JPG, PNG, WebP up to 25MB · Processed 100% locally on your GPU"
          />
        </div>
      ) : (
        /* Studio Workspace Layout */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Main Visual Viewport / Canvas */}
          <div
            style={{
              backgroundColor: "#181512",
              borderRadius: 12,
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "540px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Live interactive canvas */}
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                maxHeight: "520px",
                objectFit: "contain",
                borderRadius: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            />

            {/* Viewport Meta Bar */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "16px",
                right: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#A8A29E",
                fontSize: "0.75rem",
                background: "rgba(24, 21, 18, 0.75)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px",
                borderRadius: 20,
              }}
            >
              <span>{file.name}</span>
              <span>
                {imgElement ? `${imgElement.naturalWidth} × ${imgElement.naturalHeight} px` : ""}
              </span>
              <span>{formatBytes(file.size)}</span>
            </div>
          </div>

          {/* Right Editing Control Panel */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2DDD6",
              borderRadius: 12,
              padding: "1.25rem",
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            {/* Presets */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#1C1814",
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "#2D6BE4" }} />
                <span>Instant Presets</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.375rem",
                }}
              >
                {(Object.keys(PRESETS) as FilterPreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    style={{
                      padding: "0.375rem 0.25rem",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      borderRadius: 6,
                      textTransform: "capitalize",
                      border: activePreset === p ? "2px solid #2D6BE4" : "1px solid #E2DDD6",
                      backgroundColor: activePreset === p ? "#EBF0FC" : "#FAFAF7",
                      color: activePreset === p ? "#1E50B5" : "#524D45",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div style={{ borderTop: "1px solid #E2DDD6", paddingTop: "1rem" }}>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#1C1814",
                  marginBottom: "0.875rem",
                }}
              >
                Lighting & Color
              </div>

              {/* Brightness */}
              <div style={{ marginBottom: "0.875rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8125rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Sun style={{ width: 13, height: 13, color: "#6B6560" }} /> Brightness
                  </span>
                  <span style={{ color: "#6B6560", fontFamily: "monospace" }}>
                    {brightness > 0 ? `+${brightness}` : brightness}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => {
                    setActivePreset("none");
                    setBrightness(parseInt(e.target.value));
                  }}
                  style={{ width: "100%", accentColor: "#2D6BE4" }}
                />
              </div>

              {/* Contrast */}
              <div style={{ marginBottom: "0.875rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8125rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Contrast style={{ width: 13, height: 13, color: "#6B6560" }} /> Contrast
                  </span>
                  <span style={{ color: "#6B6560", fontFamily: "monospace" }}>
                    {contrast > 0 ? `+${contrast}` : contrast}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => {
                    setActivePreset("none");
                    setContrast(parseInt(e.target.value));
                  }}
                  style={{ width: "100%", accentColor: "#2D6BE4" }}
                />
              </div>

              {/* Saturation */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8125rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Palette style={{ width: 13, height: 13, color: "#6B6560" }} /> Saturation
                  </span>
                  <span style={{ color: "#6B6560", fontFamily: "monospace" }}>
                    {saturation > 0 ? `+${saturation}` : saturation}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={saturation}
                  onChange={(e) => {
                    setActivePreset("none");
                    setSaturation(parseInt(e.target.value));
                  }}
                  style={{ width: "100%", accentColor: "#2D6BE4" }}
                />
              </div>
            </div>

            {/* Transform */}
            <div style={{ borderTop: "1px solid #E2DDD6", paddingTop: "1rem" }}>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#1C1814",
                  marginBottom: "0.75rem",
                }}
              >
                Orientation & Flips
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setRotation(((rotation + 90) % 360) as any)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.25rem" }}
                >
                  <RotateCw style={{ width: 13, height: 13 }} /> Rotate ({rotation}°)
                </button>
                <button
                  onClick={() => setFlipH(!flipH)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: flipH ? "#EBF0FC" : "#FFFFFF",
                    borderColor: flipH ? "#2D6BE4" : "#E2DDD6",
                  }}
                >
                  <FlipHorizontal style={{ width: 14, height: 14 }} /> Flip H
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: flipV ? "#EBF0FC" : "#FFFFFF",
                    borderColor: flipV ? "#2D6BE4" : "#E2DDD6",
                  }}
                >
                  <FlipVertical style={{ width: 14, height: 14 }} /> Flip V
                </button>
              </div>
            </div>

            {/* Export Settings */}
            <div style={{ borderTop: "1px solid #E2DDD6", paddingTop: "1rem" }}>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#1C1814",
                  marginBottom: "0.625rem",
                }}
              >
                Export Format
              </div>
              <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem" }}>
                {(["image/jpeg", "image/png", "image/webp"] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    style={{
                      flex: 1,
                      padding: "0.375rem",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: format === fmt ? "2px solid #2D6BE4" : "1px solid #E2DDD6",
                      backgroundColor: format === fmt ? "#EBF0FC" : "#FFFFFF",
                      color: format === fmt ? "#1E50B5" : "#524D45",
                    }}
                  >
                    {fmt === "image/jpeg" ? "JPG" : fmt === "image/png" ? "PNG" : "WebP"}
                  </button>
                ))}
              </div>

              {format !== "image/png" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      color: "#6B6560",
                    }}
                  >
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#2D6BE4" }}
                  />
                </div>
              )}
            </div>

            {/* Replace / Remove */}
            <div style={{ borderTop: "1px solid #E2DDD6", paddingTop: "0.75rem" }}>
              <button
                onClick={() => setFile(null)}
                className="btn btn-ghost btn-sm"
                style={{ width: "100%", color: "#9E9690" }}
              >
                Upload different image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
