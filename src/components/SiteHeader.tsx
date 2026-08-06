"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <header className="site-header">
    <Link className="monogram" href="/" aria-label="Alessandro Bobbio Russian — home">ABR<span>Madrid</span></Link>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-nav"><span>{open ? "Close" : "Menu"}</span></button>
    <nav id="site-nav" className={open ? "nav open" : "nav"} aria-label="Main navigation">
      {navigation.map(([label, href], i) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={href} href={href} aria-current={active ? "page" : undefined}><small>0{i + 1}</small>{label}</Link>; })}
    </nav>
  </header>;
}
