import Link from "next/link";
import styles from "./home.module.css";

const portals = [
  { no: "01", href: "/practice", title: "Practice", text: "Architectural + luxury design, bio-design and creative project leadership — separated clearly, connected intentionally." },
  { no: "02", href: "/work", title: "Work", text: "Urban Ponics as an immersive case study: film, interactive 3D, system and space." },
  { no: "03", href: "/renders", title: "Renders", text: "A lightweight dynamic gallery of interior visualisations, optimized from original project renders." },
  { no: "04", href: "/profile", title: "Profile", text: "Identity, travel, education and the path from Caracas to Madrid through Italy, Miami and the Netherlands." },
];

const brands = ["BONTEMPI CASA", "FEBAL CASA", "SOLA COCINAS", "COLOMBINI GROUP", "GRUPO TJC"];

export default function Home() {
  return (
    <main className="pageEnter">
      <section className={styles.hero}>
        <div className={styles.heroTop} data-reveal><span>Architectural + Luxury Designer</span><span>Madrid · 2026</span></div>
        <div className={styles.stage}>
          <p className={styles.kicker} data-reveal>From bit to matter.</p>
          <h1 aria-label="Bobbio Russian"><span>BOBBIO</span><span>RUSSIAN</span></h1>
          <div className={styles.orbit} aria-hidden="true"><i /><b /></div>
          <p className={styles.statement} data-reveal>Architecture, high-end interiors, living systems and creative leadership shaped as one evolving practice.</p>
        </div>
        <div className={styles.heroBottom} data-reveal><span>Venezuelan · Italian · Madrid-based</span><span>Explore the practice ↓</span></div>
      </section>

      <section className={styles.portals}>
        <div className={styles.intro} data-reveal><p className="eyebrow">PORTFOLIO / ROUTES</p><h2>One organism.<br /><em>Five lighter pages.</em></h2><p>The portfolio is now split by intent, so the home stays fast and every heavier experience only loads when you choose it.</p></div>
        <div className={styles.portalGrid}>
          {portals.map(portal => (
            <Link prefetch={false} href={portal.href} key={portal.href} className={styles.portal} data-reveal>
              <span>{portal.no}</span><h3>{portal.title}</h3><p>{portal.text}</p><b>ENTER ↗</b><i aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.brands}>
        <div className={styles.brandIntro} data-reveal><p className="eyebrow">BRANDS / ECOSYSTEM</p><h2>Design happens<br /><em>inside a network.</em></h2></div>
        <div className={styles.brandMarquee} aria-label="Brands I work with"><div>{[...brands, ...brands].map((brand, index) => <span key={`${brand}-${index}`}>{brand}</span>)}</div></div>
      </section>

      <footer className={styles.footer}><p>Architecture · Luxury interiors · Bio-design · Creative direction</p><a href="mailto:hello@bobbiorussian.com">LET&apos;S MAKE IT <em>TANGIBLE.</em> ↗</a></footer>
    </main>
  );
}
