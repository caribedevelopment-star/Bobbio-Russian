"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Lexicon, { LanguageCode, type LexiconTerm } from "./Lexicon";

const items: Array<{ href: string; term: LexiconTerm; no: string; short: string }> = [
  { href: "/practice", term: "convergence", no: "01", short: "ATL" },
  { href: "/work", term: "matter", no: "02", short: "MAT" },
  { href: "/renders", term: "visions", no: "03", short: "LGT" },
  { href: "/profile", term: "genesis", no: "04", short: "PRV" },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="siteNav" aria-label="Primary navigation">
        <Link href="/" prefetch={false} className="monogram" aria-label="Bobbio Russian home">BR</Link>
        <div className="siteNavLinks">
          {items.map(item => (
            <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href ? "isActive" : undefined}>
              <span className="navNo">{item.no}</span><Lexicon term={item.term} />
            </Link>
          ))}
        </div>
        <a className="navContact" href="mailto:hello@bobbiorussian.com"><span style={{ opacity: .55, marginRight: 7 }}><LanguageCode /></span>Contact ↗</a>
      </nav>
      <nav className="mobileDock" aria-label="Mobile chapter navigation">
        <Link href="/" prefetch={false} className={pathname === "/" ? "isActive" : undefined} aria-label="Home"><span>00</span><b>BR</b></Link>
        {items.map(item => (
          <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href ? "isActive" : undefined} aria-label={`Chapter ${item.no}`}>
            <span>{item.no}</span><b>{item.short}</b>
          </Link>
        ))}
        <i className="dockRail" aria-hidden="true" />
      </nav>
    </>
  );
}
