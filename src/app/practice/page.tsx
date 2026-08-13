import type { Metadata } from "next";
import Link from "next/link";
import RoleSystem from "../../components/RoleSystem";
import LazyEmbed from "../../components/LazyEmbed";
import Lexicon from "../../components/Lexicon";
import styles from "./practice.module.css";

export const metadata: Metadata = { title: "Convergence", description: "Architectural and luxury design, bio-design and creative project leadership." };

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
        <h1 data-reveal><Lexicon term="convergence" /><br /><em>Three disciplines orbit one practice.</em></h1>
        <p data-reveal>I do not see architecture, biology and leadership as separate identities. They are different instruments: the work becomes more precise when they are allowed to influence one another.</p>
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
        <div className={styles.panoramaFrame} data-reveal>
          <div className={styles.panoramaTop}><span>IMMERSIVE SPATIAL STUDY</span><b>360º / TWINMOTION</b><i>DRAG TO LOOK AROUND ↔</i></div>
          <LazyEmbed title="Architectural Twinmotion panorama" src={PANO} kind="panorama" status="Architectural environment · 360º" allow="fullscreen; accelerometer; gyroscope" />
          <div className={styles.panoramaAxis} aria-hidden="true"><span /><i /><b /></div>
        </div>
      </section>

      <section className={styles.next} data-reveal><span>NEXT / 02</span><h2>Ideas become convincing<br /><em>when they begin to move.</em></h2><Link prefetch={false} href="/work">Enter the next chapter ↗</Link></section>
    </main>
  );
}
