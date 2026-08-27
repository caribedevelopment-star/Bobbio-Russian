"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./RenderGallery.module.css";
import controls from "./RenderGalleryControls.module.css";

export type RenderItem = {
  id: string;
  series: string;
  frame: string;
  alt: string;
};

type Filter = "All" | "Residences" | "Studies";

const thumb = (id: string, width = 1400) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

export default function RenderGallery({ items }: { items: RenderItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    if (filter === "Residences") return items.filter((item) => item.series.startsWith("Residence"));
    if (filter === "Studies") return items.filter((item) => item.series.startsWith("Study"));
    return items;
  }, [filter, items]);

  const selectedIndex = selectedId ? filtered.findIndex((item) => item.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowRight") setSelectedId(filtered[(selectedIndex + 1) % filtered.length].id);
      if (event.key === "ArrowLeft") setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length].id);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, selectedIndex, filtered]);

  const changeFilter = (next: Filter) => {
    setSelectedId(null);
    setFilter(next);
  };

  return (
    <>
      <div className={controls.toolbar}>
        <div className={controls.filters} aria-label="Render archive filters">
          {(["All", "Residences", "Studies"] as Filter[]).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => changeFilter(option)}
              className={`${controls.filter} ${filter === option ? controls.filterActive : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={controls.count}>{String(filtered.length).padStart(2, "0")} FRAMES / CONTACT SHEET</div>
      </div>

      <div className={styles.grid}>
        {filtered.map((item, index) => (
          <button
            type="button"
            className={`${styles.tile} ${index % 5 === 0 ? styles.wide : ""} ${index % 7 === 3 ? styles.tall : ""}`}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
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

      <div className={controls.contactSheet}><span>ARCHIVE MODE / {filter.toUpperCase()}</span><span>LIGHT · MATERIAL · SPACE · DETAIL</span></div>

      {selected && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Render viewer" onClick={() => setSelectedId(null)}>
          <button className={styles.close} onClick={() => setSelectedId(null)} aria-label="Close viewer">×</button>
          <button className={`${styles.arrow} ${styles.prev}`} onClick={event => { event.stopPropagation(); setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length].id); }} aria-label="Previous render">←</button>
          <div className={styles.stage} onClick={event => event.stopPropagation()}>
            <img className={styles.stageImage} src={thumb(selected.id, 2400)} alt={selected.alt} decoding="async" />
            <div className={styles.caption}><span>{String(selectedIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}</span><b>{selected.series}</b><small>{selected.frame}</small></div>
          </div>
          <button className={`${styles.arrow} ${styles.next}`} onClick={event => { event.stopPropagation(); setSelectedId(filtered[(selectedIndex + 1) % filtered.length].id); }} aria-label="Next render">→</button>
        </div>
      )}
    </>
  );
}
