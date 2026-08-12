"use client";

import { useEffect, useState } from "react";
import styles from "./RenderGallery.module.css";

export type RenderItem = {
  id: string;
  series: string;
  frame: string;
  alt: string;
};

const thumb = (id: string, width = 1400) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

export default function RenderGallery({ items }: { items: RenderItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((selected + 1) % items.length);
      if (event.key === "ArrowLeft") setSelected((selected - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, items.length]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <button
            type="button"
            className={`${styles.tile} ${index % 5 === 0 ? styles.wide : ""} ${index % 7 === 3 ? styles.tall : ""}`}
            key={item.id}
            onClick={() => setSelected(index)}
            aria-label={`Open ${item.series} ${item.frame}`}
          >
            <img
              className={styles.image}
              src={thumb(item.id)}
              alt={item.alt}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
            />
            <span className={styles.scrim} />
            <span className={styles.meta}><b>{item.series}</b><i>{item.frame}</i></span>
            <span className={styles.open}>VIEW ↗</span>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Render viewer" onClick={() => setSelected(null)}>
          <button className={styles.close} onClick={() => setSelected(null)} aria-label="Close viewer">×</button>
          <button className={`${styles.arrow} ${styles.prev}`} onClick={event => { event.stopPropagation(); setSelected((selected - 1 + items.length) % items.length); }} aria-label="Previous render">←</button>
          <div className={styles.stage} onClick={event => event.stopPropagation()}>
            <img className={styles.stageImage} src={thumb(items[selected].id, 2400)} alt={items[selected].alt} decoding="async" />
            <div className={styles.caption}><span>{String(selected + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><b>{items[selected].series}</b><small>{items[selected].frame}</small></div>
          </div>
          <button className={`${styles.arrow} ${styles.next}`} onClick={event => { event.stopPropagation(); setSelected((selected + 1) % items.length); }} aria-label="Next render">→</button>
        </div>
      )}
    </>
  );
}
