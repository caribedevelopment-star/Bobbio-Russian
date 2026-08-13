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
  cue: string;
}> = [
  {
    no: "01",
    href: "/practice",
    term: "convergence",
    eyebrow: "DISCIPLINES / OVERLAP / ARCHITECTURE",
    prose: "The practice begins where disciplines meet.",
    text: "Architectural + luxury design, bio-design and creative project leadership — three instruments, one design language.",
    accent: "champagne",
    cue: "Practice / Architecture",
  },
  {
    no: "02",
    href: "/work",
    term: "matter",
    eyebrow: "FILM / SYSTEM / VISUAL FRAMES / 3D",
    prose: "An idea becomes real long before it becomes physical.",
    text: "Urban Ponics unfolds as a complete case study: moving image, narrative, project visuals and an interactive 3D catalogue.",
    accent: "sage",
    cue: "Urban Ponics / Case Study",
  },
  {
    no: "03",
    href: "/renders",
    term: "visions",
    eyebrow: "LIGHT / MATERIAL / UNBUILT SPACE",
    prose: "Before a room exists, it can already have temperature, silence and weight.",
    text: "A cinematic archive of interiors and atmospheres — visualisation used as a design instrument, not simply an image.",
    accent: "blue",
    cue: "Visual Archive / Renders",
  },
  {
    no: "04",
    href: "/profile",
    term: "genesis",
    eyebrow: "ORIGIN / IDENTITY / FORMATION",
    prose: "Every practice begins somewhere. Mine begins between places.",
    text: "Caracas, Italy and Madrid; Miami and the Netherlands; La Salle, UCAB and IED — one continuous biography of how I learned to see.",
    accent: "ivory",
    cue: "Identity / Education",
  },
];

const brands = ["BONTEMPI CASA", "FEBAL CASA", "COLOMBINI GROUP", "GRUPO TJC"];

export default function Home() {
  return (
    <main className="pageEnter">
      <section className={styles.hero}>
        <div className={styles.cinemaFrame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.scan} aria-hidden="true" />
        <div className={styles.heroTop} data-reveal>
          <span>Architectural + Luxury Designer</span>
          <span>Madrid · 2026</span>
        </div>

        <div className={styles.stage}>
          <p className={styles.kicker} data-reveal>From bit to matter.</p>
          <h1 aria-label="Bobbio Russian"><span>BOBBIO</span><span>RUSSIAN</span></h1>
          <div className={styles.orbit} aria-hidden="true"><i /><b /><em /></div>
          <div className={styles.heroGrid} aria-hidden="true"><span /><span /><span /><span /></div>
          <p className={styles.statement} data-reveal>Architecture, high-end interiors, living systems and creative leadership — one practice told through four distinct cinematic chapters.</p>
        </div>

        <div className={styles.chapterMap} data-reveal>
          <div className={styles.chapterMapIntro}><span>PORTFOLIO STRUCTURE</span><b>04 CHAPTERS</b></div>
          {portals.map(portal => (
            <Link prefetch={false} href={portal.href} key={`map-${portal.href}`} className={styles.chapterMapItem}>
              <span>{portal.no}</span>
              <strong><Lexicon term={portal.term} /></strong>
              <small>{portal.cue}</small>
            </Link>
          ))}
        </div>

        <div className={styles.heroBottom} data-reveal>
          <span>Venezuelan · Italian · Madrid-based</span>
          <span>Choose a chapter ↓</span>
        </div>
      </section>

      <section className={styles.prologue}>
        <div className={styles.prologueIndex} data-reveal><span>00</span><i /></div>
        <div className={styles.prologueCopy} data-reveal>
          <p>THE PORTFOLIO AS AN ORGANISM</p>
          <h2>Not a menu.<br /><em>A sequence of rooms.</em></h2>
        </div>
        <p className={styles.prologueText} data-reveal>Each chapter has its own rhythm and weight. Enter the practice first, move through a living project, cross the visual archive, then arrive at the places and education that formed the person behind the work.</p>
        <div className={styles.prologueAxis} aria-hidden="true"><span /><i /><b /></div>
      </section>

      <section className={styles.portals}>
        <div className={styles.intro} data-reveal>
          <p className="eyebrow">THE FOUR CHAPTERS</p>
          <h2>Four doors.<br /><em>One evolving body of work.</em></h2>
          <p>The site is deliberately segmented: each world can become richer and more immersive without forcing the landing page to carry every heavy element at once.</p>
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
