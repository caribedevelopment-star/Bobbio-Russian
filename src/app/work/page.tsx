import type { Metadata } from "next";
import Link from "next/link";
import LazyEmbed from "../../components/LazyEmbed";
import styles from "./work.module.css";

export const metadata: Metadata = { title: "Selected Work", description: "Urban Ponics immersive case study by Bobbio Russian." };

const TOWER = "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const NFT = "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const FILM = "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&background=1&autoplay=1&muted=1&loop=1";
const PANO = "https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES&c=7A9F8E224CB4A881FF5423932245ECBC";

export default function WorkPage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={styles.header}>
        <p className="eyebrow" data-reveal>02 / SELECTED WORK</p>
        <h1 data-reveal>Urban<br /><em>Ponics.</em></h1>
        <p data-reveal>The heavy media no longer exists on Home. It is loaded only on this route, and each embed activates shortly before it enters the viewport.</p>
      </header>

      <section className={styles.caseStudy}>
        <article className={styles.chapter} data-reveal><div className={styles.meta}><span>ACT I</span><b>THE FILM</b><i>01 / 04</i></div><LazyEmbed title="Urban Ponics film" src={FILM} kind="film" status="Film · autoplay when ready" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" /></article>
        <div className={styles.grid}>
          <article className={styles.chapter} data-reveal><div className={styles.meta}><span>ACT II</span><b>THE OBJECT</b><i>02 / 04</i></div><LazyEmbed title="Urban Ponics Tower interactive 3D" src={TOWER} kind="model" status="Tower · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" /><div className={styles.caption}><b>Tower</b><span>Sketchfab · interactive</span></div></article>
          <article className={`${styles.chapter} ${styles.offset}`} data-reveal><div className={styles.meta}><span>ACT III</span><b>THE SYSTEM</b><i>03 / 04</i></div><LazyEmbed title="Urban Ponics NFT System interactive 3D" src={NFT} kind="model" status="NFT System · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" /><div className={styles.caption}><b>NFT System</b><span>Sketchfab · interactive</span></div></article>
        </div>
        <article className={`${styles.chapter} ${styles.panorama}`} data-reveal><div className={styles.meta}><span>ACT IV</span><b>THE SPACE</b><i>04 / 04</i></div><LazyEmbed title="Urban Ponics Twinmotion panorama" src={PANO} kind="panorama" status="360º environment" allow="fullscreen; accelerometer; gyroscope" /><div className={styles.caption}><b>Enter the environment</b><span>Twinmotion · 360º</span></div></article>
      </section>

      <section className={styles.renderCta} data-reveal><span>VISUALISATION / NEXT</span><h2>From immersive systems<br /><em>to rendered space.</em></h2><Link prefetch={false} href="/renders">Open render gallery ↗</Link></section>
    </main>
  );
}
