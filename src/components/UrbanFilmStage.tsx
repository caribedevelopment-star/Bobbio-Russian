import LazyEmbed from "./LazyEmbed";
import styles from "./UrbanFilmStage.module.css";

const FILM = "https://player.vimeo.com/video/1211006561?badge=0&autopause=0&background=1&autoplay=1&muted=1&loop=1";

export default function UrbanFilmStage() {
  return (
    <section className={styles.section} aria-label="Urban Ponics film atmosphere">
      <div className={styles.sticky}>
        <div className={styles.film}>
          <LazyEmbed title="Urban Ponics film" src={FILM} kind="film" status="Film · atmosphere" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" />
        </div>
        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.top}><span>02 / FILM / ATMOSPHERE</span><span>URBAN PONICS / MOVING IMAGE</span><b>16:9 / FULL FIELD</b></div>
        <div className={styles.copy}><p>AFTER THE SYSTEM / FEEL THE PROJECT</p><h2>Infrastructure<br /><em>becomes atmosphere.</em></h2><span>The technical model gives the logic first. The film then lets movement, sound and rhythm turn that logic into experience.</span></div>
        <div className={styles.sectionLine} aria-hidden="true"><span>A</span><i /><b>MOVING SECTION / PRODUCTIVE LANDSCAPE</b><i /><span>A</span></div>
        <div className={styles.hint}><i /><span>SCROLL / CONTINUE INTO THE CASE STUDY</span></div>
      </div>
    </section>
  );
}
