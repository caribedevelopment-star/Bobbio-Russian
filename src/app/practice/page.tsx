import type { Metadata } from "next";
import Link from "next/link";
import RoleSystem from "../../components/RoleSystem";
import LazyEmbed from "../../components/LazyEmbed";
import Lexicon from "../../components/Lexicon";
import styles from "./practice.module.css";

export const metadata: Metadata = { title: "Atelier", description: "Architectural and luxury design, bio-design and creative project leadership." };

const PANO = "https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES&c=7A9F8E224CB4A881FF5423932245ECBC";

const roles = [
  ["01", "SPACE / MATERIAL / DETAIL", "Architectural + Luxury Design", "I design space from the inside out: proportion, circulation, furniture, light, kitchens and material decisions resolved as one architectural language."],
  ["02", "LIVING / DIGITAL / EXPERIMENTAL", "Bio-Designer", "I explore what happens when design stops treating nature as inspiration and begins working with living systems, fabrication and technology as active materials."],
  ["03", "VISION / COORDINATION / DELIVERY", "Creative Project Lead", "I protect the central idea while it passes through clients, teams, drawings, visualisations and technical constraints — keeping the project coherent from intuition to delivery."],
] as const;

export default function PracticePage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>01 / <Lexicon term="convergence" /></p>
        <h1 data-reveal><Lexicon term="convergence" /><br /><em>Three disciplines. One practice.</em></h1>
        <p data-reveal>Architecture, biology and creative direction are not separate identities here. They are different instruments inside the same spatial practice.</p>
      </header>

      <section className={styles.diagram} data-reveal><RoleSystem /></section>

      <section className={styles.roles}>
        {roles.map(([no, meta, title, text], index) => (
          <article className={`${styles.roleCard} ${styles[`card${index + 1}`]}`} key={no} data-reveal>
            <span>{no}</span><div><p>{meta}</p><h2>{title}</h2></div><p>{text}</p><i aria-hidden="true" />
          </article>
        ))}
      </section>

      <section className={styles.architecture}>
        <div className={styles.archGrid} aria-hidden="true">
          <span className={styles.gridA} /><span className={styles.gridB} /><span className={styles.gridC} /><span className={styles.gridD} />
          <div className={styles.axon}><i /><i /><i /><b /><b /><b /></div>
          <div className={styles.columnA} /><div className={styles.columnB} />
        </div>
        <div className={styles.archHeader} data-reveal>
          <div><span>SPATIAL PRACTICE / 01A</span><i /></div>
          <h2>Architectural designer.<br /><em>Space as a living system.</em></h2>
          <p>My architectural work begins before style: circulation, proportion, section, thresholds, structure and the sequence of how a body moves through a place. Visualisation is then used to test the architecture — not to hide it.</p>
        </div>
        <div className={styles.archMetrics} data-reveal>
          <div><span>01</span><b>PLAN</b><small>Organisation + circulation</small></div>
          <div><span>02</span><b>SECTION</b><small>Volume + proportion</small></div>
          <div><span>03</span><b>MATERIAL</b><small>Weight + atmosphere</small></div>
          <div><span>04</span><b>EXPERIENCE</b><small>Movement + perception</small></div>
        </div>

        <div className={styles.panoramaIntro} data-reveal>
          <div><span>PANORAMA SET / 01</span><i /></div>
          <h3>Enter the space.<br /><em>Not the image.</em></h3>
          <p>A still frame fixes one point of view. The panorama removes that decision and lets the body read scale, thresholds and adjacency directly. Drag on desktop; swipe or use device orientation where supported.</p>
        </div>

        <div className={styles.panoramaFrame} data-reveal>
          <div className={styles.panoramaTop}><span>SET 01 / IMMERSIVE ROOM</span><b>360º / TWINMOTION</b><i>DRAG / SWIPE TO LOOK ↔</i></div>
          <div className={styles.panoramaStage}>
            <LazyEmbed title="Architectural Twinmotion panorama" src={PANO} kind="panorama" status="Architectural environment · 360º" allow="fullscreen; accelerometer; gyroscope" />
            <div className={styles.panoramaPlan} aria-hidden="true">
              <span className={styles.pNorth}>N</span><span className={styles.pEast}>E</span><span className={styles.pSouth}>S</span><span className={styles.pWest}>W</span>
              <i /><i /><i /><i />
              <b>CAM / 01</b>
            </div>
            <div className={styles.panoramaSection} aria-hidden="true"><span>A</span><i /><b>SECTION / VIEW FIELD</b><i /><span>A</span></div>
            <div className={styles.panoramaLevels} aria-hidden="true"><span>+2.700 / CLG</span><span>±0.000 / FFL</span></div>
          </div>
          <div className={styles.panoramaFooter}><span>LOOK / TURN / INSPECT</span><b>CAMERA HEIGHT / 1.60 m</b><span>FULLSCREEN AVAILABLE ↗</span></div>
        </div>
      </section>

      <section className={styles.next} data-reveal><span>NEXT / 02</span><h2>Ideas become convincing<br /><em>when they begin to move.</em></h2><Link prefetch={false} href="/work">Enter the next chapter ↗</Link></section>
    </main>
  );
}
