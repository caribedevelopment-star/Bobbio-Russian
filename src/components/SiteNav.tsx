"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Lexicon, { LanguageCode, type LexiconTerm } from "./Lexicon";

const items: Array<{ href: string; term: LexiconTerm }> = [
  { href: "/practice", term: "convergence" },
  { href: "/work", term: "matter" },
  { href: "/renders", term: "visions" },
  { href: "/profile", term: "genesis" },
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
      <nav className="mobileDock" aria-label="Mobile navigation">
        <Link href="/" prefetch={false} className={pathname === "/" ? "isActive" : undefined}>BR</Link>
        {items.map(item => (
          <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href ? "isActive" : undefined}>
            <Lexicon term={item.term} />
          </Link>
        ))}
      </nav>
    </>
  );
}
