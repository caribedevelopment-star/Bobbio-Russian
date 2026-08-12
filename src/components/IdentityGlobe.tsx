"use client";

import { useEffect, useRef } from "react";
import styles from "./IdentityGlobe.module.css";

type Marker = { lat: number; lon: number; label: string; group: "heritage" | "journey"; role: string };
const markers: Marker[] = [
  { lat: 10.48, lon: -66.90, label: "CARACAS", group: "heritage", role: "Origin" },
  { lat: 41.90, lon: 12.50, label: "ITALY", group: "heritage", role: "Identity" },
  { lat: 40.42, lon: -3.70, label: "MADRID", group: "heritage", role: "Base" },
  { lat: 25.76, lon: -80.19, label: "MIAMI", group: "journey", role: "Travel" },
  { lat: 52.37, lon: 4.90, label: "NETHERLANDS", group: "journey", role: "Work / Travel" },
];
const HERITAGE = "#d6c28f";
const JOURNEY = "#7eabba";

export default function IdentityGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, rotation = -10, dragging = false, lastX = 0, raf = 0, phase = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = Math.max(1, Math.floor(width * dpr)); canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const project = (lat: number, lon: number, radius: number) => {
      const phi = lat * Math.PI / 180, lambda = (lon + rotation) * Math.PI / 180;
      return { x: width / 2 + radius * Math.cos(phi) * Math.sin(lambda), y: height / 2 - radius * Math.sin(phi), z: Math.cos(phi) * Math.cos(lambda) };
    };
    const path = (points: Array<[number, number]>, radius: number, color: string, alpha: number, lw = 1) => {
      ctx.beginPath(); let active = false;
      for (const [lat, lon] of points) {
        const p = project(lat, lon, radius);
        if (p.z <= 0) { active = false; continue; }
        if (!active) { ctx.moveTo(p.x, p.y); active = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); ctx.globalAlpha = 1;
    };
    const route = (a: Marker, b: Marker, radius: number, color: string, offset: number) => {
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= 84; i++) {
        const t = i / 84;
        pts.push([a.lat + (b.lat - a.lat) * t + Math.sin(Math.PI * t) * 9, a.lon + (b.lon - a.lon) * t]);
      }
      path(pts, radius, color, .12, 5.5); path(pts, radius, color, .92, 1.35);
      const idx = Math.floor(((phase + offset) % 1) * (pts.length - 1));
      const p = project(pts[idx][0], pts[idx][1], radius);
      if (p.z > 0) {
        ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5 + Math.sin(phase * 30) * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
    };
    const marker = (m: Marker, radius: number) => {
      const p = project(m.lat, m.lon, radius); if (p.z <= 0) return;
      const color = m.group === "heritage" ? HERITAGE : JOURNEY;
      ctx.strokeStyle = color; ctx.globalAlpha = .32; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 10 + Math.sin(phase * 25) * 2, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.font = "800 9px Arial"; const tw = ctx.measureText(m.label).width;
      const x = p.x + 10, y = p.y - 12;
      ctx.fillStyle = "rgba(8,10,13,.82)"; ctx.strokeStyle = m.group === "heritage" ? "rgba(214,194,143,.28)" : "rgba(126,171,186,.32)";
      ctx.beginPath(); ctx.roundRect(x, y, tw + 18, 23, 11); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(242,237,228,.94)"; ctx.fillText(m.label, x + 9, y + 15);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const r = Math.min(width, height) * .39, cx = width / 2, cy = height / 2;
      const halo = ctx.createRadialGradient(cx-r*.36,cy-r*.34,0,cx,cy,r*1.3);
      halo.addColorStop(0,"rgba(214,194,143,.2)"); halo.addColorStop(.4,"rgba(126,171,186,.08)"); halo.addColorStop(1,"rgba(8,10,13,0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx,cy,r*1.3,0,Math.PI*2); ctx.fill();
      const globe = ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.04,cx,cy,r);
      globe.addColorStop(0,"#2a343a"); globe.addColorStop(.58,"#151a1f"); globe.addColorStop(1,"#080a0d");
      ctx.fillStyle=globe; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,.14)"; ctx.stroke();
      for(let lat=-75;lat<=75;lat+=15){const pts:Array<[number,number]>=[];for(let lon=-180;lon<=180;lon+=3)pts.push([lat,lon]);path(pts,r,"rgba(255,255,255,.09)",1,.6)}
      for(let lon=-180;lon<180;lon+=15){const pts:Array<[number,number]>=[];for(let lat=-90;lat<=90;lat+=3)pts.push([lat,lon]);path(pts,r,"rgba(255,255,255,.065)",1,.6)}
      const [caracas, italy, madrid, miami, netherlands] = markers;
      route(caracas, madrid, r, HERITAGE, 0);
      route(caracas, italy, r, HERITAGE, .46);
      route(madrid, miami, r, JOURNEY, .18);
      route(madrid, netherlands, r, JOURNEY, .7);
      markers.forEach(m => marker(m, r));
      if (!dragging) rotation += .017; phase = (phase + .0028) % 1; raf = requestAnimationFrame(draw);
    };
    const down=(e:PointerEvent)=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};
    const move=(e:PointerEvent)=>{if(!dragging)return;rotation+=(e.clientX-lastX)*.28;lastX=e.clientX};
    const up=()=>{dragging=false};
    resize(); window.addEventListener("resize",resize); canvas.addEventListener("pointerdown",down); canvas.addEventListener("pointermove",move); canvas.addEventListener("pointerup",up); canvas.addEventListener("pointercancel",up); raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up)};
  }, []);

  return <canvas ref={ref} className={styles.canvas} aria-label="Interactive globe connecting Caracas, Italy, Madrid, Miami and the Netherlands" />;
}
