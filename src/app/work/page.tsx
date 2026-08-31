import type { Metadata } from "next";
import Link from "next/link";
import LazyEmbed from "../../components/LazyEmbed";
import Lexicon from "../../components/Lexicon";
import UrbanSystemFlow from "../../components/UrbanSystemFlow";
import UrbanFilmStage from "../../components/UrbanFilmStage";
import styles from "./work.module.css";
import refine from "./work-refinement.module.css";

export const metadata: Metadata = { title: "Cultivated Matter", description: "Urban Ponics immersive case study by Bobbio Russian." };

const TOWER = "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const NFT = "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const thumb = (id: string, width = 1800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

const visualFrames = [
  { id: "1I4naD0-rjA3w8v-KAvKebwca4ka4wrXn", no: "01", title: "Full-Spectrum Farming", caption: "Brand + spatial proposition" },
  { id: "1kJw8QPOCwdknjX4MGl5ChomtXiC96_8N", no: "02", title: "Farms for Cities", caption: "Urban greenhouse system" },
  { id: "1bMz-_KByWZbRQ9fJ2AmhMYYsiCyYUT9Y", no: "03", title: "Smart Systems", caption: "AgTech + vertical growing" },
  { id: "1zNwNWwNEawNWhWBD14DHF7uAUbxpTX8Q", no: "04", title: "Project Language", caption: "System translated into image" },
];

export default function WorkPage() {
  return (
    <main className="pageEnter pagePadTop">
      <header className={`${styles.header} ${refine.header}`}>
        <p className="eyebrow" data-reveal>02 / <Lexicon term="matter" /></p>
        <h1 data-reveal><Lexicon term="matter" /><br /><em>Urban Ponics.</em></h1>
        <p data-reveal>A bio-design project understood first as a bioclimatic system, then as atmosphere, image and interactive object. The technical logic becomes the entrance to the experience.</p>
      </header>

      <UrbanSystemFlow />
      <UrbanFilmStage />

      <section className={`${styles.narrative} ${refine.narrative}`}>
        <div className={styles.narrativeIndex} data-reveal><span>03</span><i /><b>THE IDEA / SYSTEM</b></div>
        <div className={styles.narrativeStatement} data-reveal><p>“Cities should not only consume landscapes. They can become productive landscapes themselves.”</p></div>
        <div className={styles.narrativeGrid}>
          <article data-reveal><span>WHY</span><h3>Food closer to people.</h3><p>Urban Ponics explores compact growing systems as part of the city rather than infrastructure hidden far outside it.</p></article>
          <article data-reveal><span>HOW</span><h3>Modular by design.</h3><p>The greenhouse, tower and NFT system operate as a family: scalable pieces capable of adapting to climate, crop and available space.</p></article>
          <article data-reveal><span>MY ROLE</span><h3>Designing the translation.</h3><p>From digital objects and spatial visualisation to the project language, the work connects system logic with an experience people can understand.</p></article>
        </div>
        <div className={`${styles.systemDrawing} ${refine.systemDrawing}`} aria-hidden="true"><span /><span /><span /><i /><b /></div>
      </section>

      <section className={`${styles.visualSection} ${refine.visual}`}>
        <div className={styles.sectionLead} data-reveal>
          <div><span>04</span><p>PROJECT FRAMES / VISUAL WORLD</p></div>
          <h2>A system needs<br /><em>a visual language.</em></h2>
          <p>These frames are treated as editorial plates rather than thumbnails: city, agriculture, product and identity are composed as one ecosystem.</p>
        </div>
        <div className={`${styles.visualRail} ${refine.visualRail}`}>
          {visualFrames.map((frame, index) => (
            <figure className={`${styles.visualFrame} ${refine.visualFrame} ${index % 2 ? styles.visualOffset : ""}`} key={frame.id} data-reveal>
              <div className={styles.visualImage}><img src={thumb(frame.id, 2200)} alt={`Urban Ponics ${frame.title}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" /><span className={styles.frameMarks} /></div>
              <figcaption><i>{frame.no}</i><div><b>{frame.title}</b><small>{frame.caption}</small></div><em>PLATE {String(index + 1).padStart(2,"0")}</em></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${styles.catalogue} ${refine.catalogue}`}>
        <div className={styles.catalogueHeader} data-reveal>
          <div><span>05</span><p>3D CATALOGUE / OBJECTS</p></div>
          <h2>Touch the<br /><em>system itself.</em></h2>
          <p>The current models remain live and explorable while the portfolio prepares for direct WebGL integration. Drag to rotate and zoom to inspect each object.</p>
        </div>
        <div className={styles.catalogueGrid}>
          <article data-reveal>
            <div className={styles.modelMeta}><span>OBJECT / UP—01</span><b>TOWER</b><i>Interactive 3D</i></div>
            <div className={`${styles.modelStage} ${refine.modelStage}`}><div className={styles.modelHud}><span>DRAG ↔ ROTATE</span><span>SCROLL / PINCH · ZOOM</span><b>LIVE 3D</b></div><LazyEmbed title="Urban Ponics Tower interactive 3D" src={TOWER} kind="model" status="Tower · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" /></div>
            <p>A vertical growing object conceived as architecture, product and biological infrastructure at the same time.</p>
          </article>
          <article className={styles.catalogueOffset} data-reveal>
            <div className={styles.modelMeta}><span>SYSTEM / UP—02</span><b>NFT SYSTEM</b><i>Interactive 3D</i></div>
            <div className={`${styles.modelStage} ${refine.modelStage}`}><div className={styles.modelHud}><span>DRAG ↔ ROTATE</span><span>SCROLL / PINCH · ZOOM</span><b>LIVE 3D</b></div><LazyEmbed title="Urban Ponics NFT System interactive 3D" src={NFT} kind="model" status="NFT System · live 3D" allow="autoplay; fullscreen; xr-spatial-tracking" /></div>
            <p>The nutrient-film system exposes the technical logic behind the living layer — infrastructure made visible.</p>
          </article>
        </div>
      </section>

      <section className={styles.renderCta} data-reveal><span>NEXT / 03</span><h2>From cultivated matter<br /><em>to studies in light.</em></h2><Link prefetch={false} href="/renders">Enter the visual archive ↗</Link></section>
    </main>
  );
}
