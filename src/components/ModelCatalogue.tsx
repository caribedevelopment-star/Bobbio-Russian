import LazyEmbed from "./LazyEmbed";
import styles from "./ModelCatalogue.module.css";

const TOWER = "https://sketchfab.com/models/1accfef6146640308048131fe7f0ca1d/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";
const NFT = "https://sketchfab.com/models/d8f12e0f476247adb94ecf52a1573637/embed?ui_theme=dark&ui_infos=0&ui_controls=1&autostart=1&preload=1&ui_hint=0";

const items = [
  {
    no: "01",
    code: "UP-TWR",
    title: "Tower",
    type: "Vertical growing object",
    text: "Architecture, product and biological infrastructure compressed into one modular vertical object.",
    src: TOWER,
    status: "Rotate · zoom · inspect",
  },
  {
    no: "02",
    code: "UP-NFT",
    title: "NFT System",
    type: "Nutrient-film infrastructure",
    text: "The technical layer behind the living surface: a designed system where water, structure and growth become visible.",
    src: NFT,
    status: "Rotate · zoom · inspect",
  },
] as const;

export default function ModelCatalogue() {
  return (
    <section className={styles.catalogue}>
      <header className={styles.header} data-reveal>
        <div><span>04</span><p>3D CATALOGUE / DESIGNED OBJECTS</p></div>
        <h2>Inspect the system<br /><em>as an object.</em></h2>
        <p>The models stay interactive, but the interface around them behaves like a product archive: clear hierarchy, object data and simple instructions before interaction.</p>
      </header>

      <div className={styles.stack}>
        {items.map((item, index) => (
          <article className={`${styles.item} ${index % 2 ? styles.reverse : ""}`} key={item.code} data-reveal>
            <div className={styles.data}>
              <div className={styles.dataTop}><span>{item.no}</span><b>{item.code}</b></div>
              <p>{item.type}</p>
              <h3>{item.title}</h3>
              <p className={styles.description}>{item.text}</p>
              <div className={styles.instructions}>
                <span>DRAG</span><i />
                <span>ROTATE</span><i />
                <span>ZOOM</span>
              </div>
              <div className={styles.specs}>
                <div><span>MODE</span><b>LIVE 3D</b></div>
                <div><span>VIEW</span><b>360º</b></div>
                <div><span>STATUS</span><b>INTERACTIVE</b></div>
              </div>
            </div>

            <div className={styles.viewer}>
              <div className={styles.viewerTop}><span>URBAN PONICS / {item.code}</span><b>{item.status}</b></div>
              <LazyEmbed title={`Urban Ponics ${item.title} interactive 3D`} src={item.src} kind="model" status={`${item.title} · live 3D`} allow="autoplay; fullscreen; xr-spatial-tracking" />
              <div className={styles.cornerA} /><div className={styles.cornerB} />
              <div className={styles.axis} aria-hidden="true"><span>X</span><i /><span>Y</span></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
