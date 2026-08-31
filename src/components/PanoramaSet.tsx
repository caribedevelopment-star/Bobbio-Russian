import LazyEmbed from "./LazyEmbed";
import styles from "./PanoramaSet.module.css";

const PANO = "https://twinmotion.unrealengine.com/panorama/RNq6WfMy27Nonz23?lang=es-ES&c=7A9F8E224CB4A881FF5423932245ECBC";

export default function PanoramaSet() {
  return (
    <section className={styles.section} aria-label="Panorama Set immersive architectural environment">
      <div className={styles.sticky}>
        <div className={styles.viewer}>
          <LazyEmbed title="Architectural Twinmotion panorama" src={PANO} kind="panorama" status="Architectural environment · 360º" allow="fullscreen; accelerometer; gyroscope" />
        </div>
        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.topline}><span>PANORAMA SET / 01</span><b>360º / TWINMOTION</b><span>CAMERA HEIGHT / 1.60 m</span></div>
        <div className={styles.title}><p>IMMERSIVE ROOM / SPATIAL CHECK</p><h3>Enter the space.<br /><em>Not the image.</em></h3><span>Drag / swipe / inspect thresholds, scale and adjacency.</span></div>
        <div className={styles.compass} aria-hidden="true"><span>N</span><span>E</span><span>S</span><span>W</span><i /><b>CAM / 01</b></div>
        <div className={styles.sectionLine} aria-hidden="true"><span>A</span><i /><b>SECTION / VIEW FIELD</b><i /><span>A</span></div>
        <div className={styles.levels} aria-hidden="true"><span>+2.700 / CLG</span><span>±0.000 / FFL</span></div>
        <div className={styles.hint}><i /><span>DRAG / SWIPE TO LOOK AROUND</span></div>
        <div className={styles.progress} aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
