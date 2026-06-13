import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Hall — What We Will",
  description: "A worker-led platform for people navigating layoffs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
