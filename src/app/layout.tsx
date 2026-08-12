import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteNav from "../components/SiteNav";
import MotionEngine from "../components/MotionEngine";
import AmbientOrganism from "../components/AmbientOrganism";

export const metadata: Metadata = {
  title: { default: "Bobbio Russian — Architectural Designer", template: "%s — Bobbio Russian" },
  description: "Portfolio of Alessandro Bobbio Russian — architectural and luxury design, bio-design, creative project leadership and immersive visualization.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#080a0d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AmbientOrganism />
        <MotionEngine />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
