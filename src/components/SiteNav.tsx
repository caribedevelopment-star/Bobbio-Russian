"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/", "Home"],
  ["/practice", "Practice"],
  ["/work", "Work"],
  ["/renders", "Renders"],
  ["/profile", "Profile"],
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="siteNav" aria-label="Primary navigation">
        <Link href="/" prefetch={false} className="monogram" aria-label="Bobbio Russian home">BR</Link>
        <div className="siteNavLinks">
          {items.slice(1).map(([href, label]) => (
            <Link key={href} href={href} prefetch={false} className={pathname === href ? "isActive" : undefined}>{label}</Link>
          ))}
        </div>
        <a className="navContact" href="mailto:hello@bobbiorussian.com">Contact ↗</a>
      </nav>
      <nav className="mobileDock" aria-label="Mobile navigation">
        {items.map(([href, label]) => (
          <Link key={href} href={href} prefetch={false} className={pathname === href ? "isActive" : undefined}>{label}</Link>
        ))}
      </nav>
    </>
  );
}
