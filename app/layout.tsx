import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Agent Studio",
  description: "AI-powered design workspace with multimodal generation on an infinite canvas"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas text-slate-900 antialiased">{children}</body>
    </html>
  );
}
