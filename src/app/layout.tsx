import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Alessandro Bobbio Russian — Architectural Designer", template: "%s — Alessandro Bobbio Russian" },
  description: "Architectural Designer in Madrid working across luxury interiors, digital visualization and bio-design.",
  metadataBase: new URL("https://bobbio-russian.vercel.app"),
  openGraph: { title: "Alessandro Bobbio Russian", description: "Architectural Designer · Luxury Interiors · Bio-Designer", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
