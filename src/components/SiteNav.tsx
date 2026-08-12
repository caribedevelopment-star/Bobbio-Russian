"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Lexicon, { LanguageCode, type LexiconTerm } from "./Lexicon";

const items: Array<{ href: string; term: LexiconTerm; no: string }> = [
  { href: "/practice", term: "convergence", no: "01" },
  { href: "/work", term: "matter", no: "02" },
  { href: "/renders", term: "visions", no: "03" },
  { href: "/profile", term: "genesis", no: "04" },
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
              <Lexicon term={item.term} />
            </Link>
          ))}
        </div>
        <a className="navContact" href="mailto:hello@bobbiorussian.com"><span style={{ opacity: .55, marginRight: 7 }}><LanguageCode /></span>Contact ↗</a>
      </nav>
      <nav className="mobileDock" aria-label="Mobile chapter navigation">
        <Link href="/" prefetch={false} className={pathname === "/" ? "isActive" : undefined}>BR</Link>
        {items.map(item => (
          <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href ? "isActive" : undefined} aria-label={`Chapter ${item.no}`}>
            {item.no}
          </Link>
        ))}
      </nav>
    </>
  );
}
