import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptMB AI - Generate Apps with AI",
  description: "Build production-ready applications instantly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
