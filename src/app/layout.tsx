import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { identity } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bobbio-russian.vercel.app"),
  title: { default: identity.name, template: `%s — ${identity.name}` },
  description: `${identity.title}. ${identity.statement}`,
  openGraph: { title: identity.name, description: identity.statement, type: "website", locale: "en_US" },
  alternates: { canonical: "/" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = { "@context": "https://schema.org", "@type": "Person", name: identity.name, jobTitle: "Architectural Designer", address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "Spain" }, sameAs: [identity.linkedin] };
  return <html lang="en"><body><a className="skip-link" href="#content">Skip to content</a><SiteHeader /><div id="content">{children}</div><footer><span>© {new Date().getFullYear()} Alessandro Bobbio Russian</span><span>Madrid · From Bit to Matter</span></footer><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} /></body></html>;
}
