"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/site";

export function MediaFrame({ media, className = "" }: { media: Media; className?: string }) {
  return <figure className={`media-frame tone-${media.tone} ${className}`} role="img" aria-label={media.alt}>
    {media.src ? <Image src={media.src} alt={media.alt} fill sizes="(max-width: 760px) 100vw, 70vw" /> : <div className="spatial-mark" aria-hidden="true"><i /><i /><i /></div>}<figcaption>{media.caption}{!media.src && <span>Original media requested</span>}</figcaption>
  </figure>;
}

export function PanoramaExperience({ url, media }: { url?: string; media: Media }) {
  const [open, setOpen] = useState(false); const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; closeRef.current?.focus(); const fn = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); addEventListener("keydown", fn); return () => removeEventListener("keydown", fn); }, [open]);
  return <div className="panorama"><MediaFrame media={media} /><div className="panorama-action"><span>360° experience</span>{url ? <button onClick={() => setOpen(true)}>Enter 360°</button> : <span>Verified link pending</span>}</div>
    {open && url && <div className="panorama-modal" role="dialog" aria-modal="true" aria-label="360 degree panorama"><button ref={closeRef} onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button><iframe src={url} title="Interactive Twinmotion panorama" allowFullScreen /><a href={url} target="_blank" rel="noreferrer">Open externally</a></div>}
  </div>;
}
