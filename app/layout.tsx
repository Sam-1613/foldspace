import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteNav } from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: {
    default: "Foldspace — Document & File Workspace",
    template: "%s — Foldspace",
  },
  description:
    "Free browser-based tools for PDF editing, file conversion, image compression, and archive management. No uploads required — everything runs in your browser.",
  keywords: ["PDF tools", "file converter", "image compression", "ZIP extractor", "browser tools", "free"],
  openGraph: {
    siteName: "Foldspace",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <SiteHeader />
          <div className="flex flex-1">
            <SiteNav />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
