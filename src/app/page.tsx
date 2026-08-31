import Link from "next/link";
import Lexicon, { type LexiconTerm } from "../components/Lexicon";
import SpatialCore from "../components/SpatialCore";
import ArchitecturalOverlay from "../components/ArchitecturalOverlay";
import HomeLoader from "../components/HomeLoader";
import HomeJourney from "../components/HomeJourney";
import styles from "./home.module.css";
import enhanced from "./landing-enhancements.module.css";

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
    eyebrow: "SPACE / DETAIL / SYSTEM / DIRECTION",
    prose: "Design begins by organising relationships.",
    text: "Architectural + luxury design, bio-design and creative project leadership — three instruments connected through one design language.",
    accent: "champagne",
    cue: "Practice / Architecture",
  },
  {
    no: "02",
    href: "/work",
    term: "matter",
    eyebrow: "FILM / IDEA / VISUAL FRAMES / 3D",
    prose: "A project becomes understandable when its layers are allowed to separate.",
    text: "Urban Ponics unfolds through film, narrative, project imagery and an interactive catalogue of designed objects.",
    accent: "sage",
    cue: "Urban Ponics / Case Study",
  },
  {
    no: "03",
    href: "/renders",
    term: "visions",
    eyebrow: "DRAW / MODEL / CLAY / LIGHT / FINAL",
    prose: "Visualisation is part of designing the room, not only presenting it.",
    text: "A cinematic archive of interiors plus the workflow behind them: drawings, modelling, clay studies, material decisions, light and final render.",
    accent: "blue",
    cue: "Visualisation / Process",
  },
  {
    no: "04",
    href: "/profile",
    term: "genesis",
    eyebrow: "ORIGIN / IDENTITY / FORMATION",
    prose: "Every design language is shaped by the places that formed it.",
    text: "Caracas, Italy and Madrid; Miami and the Netherlands; La Salle, UCAB and IED — one continuous biography of how I learned to see.",
    accent: "ivory",
    cue: "Identity / Education",
  },
];

const brands = ["BONTEMPI CASA", "FEBAL CASA", "COLOMBINI GROUP", "GRUPO TJC"];

export default function Home() {
  return (
    <main className="pageEnter">
      <HomeLoader />
      <section className={styles.hero}>
        <div className={styles.cinemaFrame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={styles.scan} aria-hidden="true" />
        <div className={styles.heroTop} data-reveal>
          <span>Architectural Designer · Luxury Interiors · Bio-Design</span>
          <span>Madrid · 2026</span>
        </div>

        <SpatialCore />
        <ArchitecturalOverlay />

        <div className={styles.stage}>
          <p className={styles.kicker} data-reveal>From bit to matter.</p>
          <h1 aria-label="Bobbio Russian"><span>BOBBIO</span><span>RUSSIAN</span></h1>
          <div className={styles.heroGrid} aria-hidden="true"><span /><span /><span /><span /></div>
          <p className={styles.statement} data-reveal>Architecture, interiors and living systems developed through drawing, modelling, light, computation and immersive space. Scroll to enter the digital atelier.</p>
        </div>

        <div className={enhanced.designSequence} data-reveal>
          <span>01 DRAW</span><i />
          <span>02 MODEL</span><i />
          <span>03 MATERIAL</span><i />
          <span>04 LIGHT</span><i />
          <span>05 EXPERIENCE</span>
        </div>

        <div className={styles.heroBottom} data-reveal>
          <span>Venezuelan · Italian · Madrid-based</span>
          <span>Scroll ↓ / Enter the atelier</span>
        </div>
      </section>

      <HomeJourney />

      <section className={styles.prologue}>
        <div className={styles.prologueIndex} data-reveal><span>00</span><i /></div>
        <div className={styles.prologueCopy} data-reveal>
          <p>THE PORTFOLIO AS A DESIGN PROCESS</p>
          <h2>Not a menu.<br /><em>A sequence from idea to matter.</em></h2>
        </div>
        <p className={styles.prologueText} data-reveal>The site follows the same logic as a project: understand the practice, enter a living case study, inspect the visual development, then arrive at the origins and education behind the work.</p>
        <div className={styles.prologueAxis} aria-hidden="true"><span /><i /><b /></div>
      </section>

      <section className={styles.portals}>
        <div className={styles.intro} data-reveal>
          <p className="eyebrow">THE FOUR CHAPTERS</p>
          <h2>Four rooms.<br /><em>One design practice.</em></h2>
          <p>Each chapter is independent so the experience can remain fast while the heavier elements — interactive models, panorama, film and high-resolution imagery — only appear when they are relevant.</p>
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
