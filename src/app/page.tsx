import Link from "next/link";
import Lexicon, { type LexiconTerm } from "../components/Lexicon";
import styles from "./home.module.css";

const portals: Array<{
  no: string;
  href: string;
  term: LexiconTerm;
  eyebrow: string;
  prose: string;
  text: string;
  accent: string;
}> = [
  {
    no: "01",
    href: "/practice",
    term: "convergence",
    eyebrow: "DISCIPLINES / OVERLAP / DIRECTION",
    prose: "Where different disciplines stop competing and begin to speak the same language.",
    text: "Architectural + luxury design, bio-design and creative project leadership — distinct disciplines, connected through one point of view.",
    accent: "champagne",
  },
  {
    no: "02",
    href: "/work",
    term: "matter",
    eyebrow: "FILM / OBJECT / SYSTEM / SPACE",
    prose: "An idea becomes real long before it becomes physical.",
    text: "Urban Ponics unfolds as a living case study: moving image, interactive objects, a designed system and an immersive spatial world.",
    accent: "sage",
  },
  {
    no: "03",
    href: "/renders",
    term: "visions",
    eyebrow: "LIGHT / MATERIAL / UNBUILT SPACE",
    prose: "Before a room exists, it can already have temperature, silence and weight.",
    text: "A curated visual archive of interiors and atmospheres — not as documentation, but as a way to test what space might feel like.",
    accent: "blue",
  },
  {
    no: "04",
    href: "/profile",
    term: "genesis",
    eyebrow: "ORIGIN / IDENTITY / FORMATION",
    prose: "Every practice begins somewhere. Mine begins between places.",
    text: "Caracas, Italy and Madrid; travel through Miami and the Netherlands; La Salle, UCAB and IED — one continuous biography of how I learned to see.",
    accent: "ivory",
  },
];

const brands = ["BONTEMPI CASA", "FEBAL CASA", "COLOMBINI GROUP", "GRUPO TJC"];

export default function Home() {
  return (
    <main className="pageEnter">
      <section className={styles.hero}>
        <div className={styles.heroTop} data-reveal><span>Architectural + Luxury Designer</span><span>Madrid · 2026</span></div>
        <div className={styles.stage}>
          <p className={styles.kicker} data-reveal>From bit to matter.</p>
          <h1 aria-label="Bobbio Russian"><span>BOBBIO</span><span>RUSSIAN</span></h1>
          <div className={styles.orbit} aria-hidden="true"><i /><b /><em /></div>
          <p className={styles.statement} data-reveal>Architecture, high-end interiors, living systems and creative leadership — not shown as categories, but as parts of one evolving organism.</p>
        </div>
        <div className={styles.heroBottom} data-reveal><span>Venezuelan · Italian · Madrid-based</span><span>Enter the chapters ↓</span></div>
      </section>

      <section className={styles.portals}>
        <div className={styles.intro} data-reveal>
          <p className="eyebrow">THE PORTFOLIO / FOUR CHAPTERS</p>
          <h2>Choose a door.<br /><em>The organism changes with you.</em></h2>
          <p>Each chapter lives on its own route so the portfolio stays fast. The heavier worlds — 3D, film, maps and galleries — only wake up when you enter them.</p>
        </div>

        <div className={styles.portalList}>
          {portals.map(portal => (
            <Link prefetch={false} href={portal.href} key={portal.href} className={`${styles.portal} ${styles[portal.accent]}`} data-reveal>
              <div className={styles.portalGhost}>{portal.no}</div>
              <div className={styles.portalIndex}><span>{portal.no}</span><i /></div>
              <div className={styles.portalCopy}>
                <p>{portal.eyebrow}</p>
                <h3><Lexicon term={portal.term} /></h3>
                <blockquote>{portal.prose}</blockquote>
                <p className={styles.portalText}>{portal.text}</p>
              </div>
              <div className={styles.portalOrganism} aria-hidden="true"><span /><i /><b /></div>
              <div className={styles.portalEnter}>ENTER CHAPTER <b>↗</b></div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.brands}>
        <div className={styles.brandIntro} data-reveal><p className="eyebrow">PROFESSIONAL ECOSYSTEM</p><h2>Design also lives<br /><em>inside relationships.</em></h2></div>
        <div className={styles.brandMarquee} aria-label="Selected brands and groups"><div>{[...brands, ...brands, ...brands].map((brand, index) => <span key={`${brand}-${index}`}>{brand}</span>)}</div></div>
      </section>

      <footer className={styles.footer}><p>Architecture · Luxury interiors · Bio-design · Creative direction</p><a href="mailto:hello@bobbiorussian.com">LET&apos;S MAKE IT <em>TANGIBLE.</em> ↗</a></footer>
    </main>
  );
}
