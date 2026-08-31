"use client";

import { useEffect, useRef } from "react";

type Family = "design" | "visual" | "creative" | "code" | "data" | null;

type Props = {
  className?: string;
  family: Family;
  hovered?: number;
};

type Node = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
};

const palette = {
  design: [214, 194, 143],
  visual: [126, 171, 186],
  creative: [224, 184, 198],
  code: [183, 199, 227],
  data: [156, 171, 148],
} as const;

export default function ToolMoleculeCanvas({ className, family, hovered = -1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const familyRef = useRef<Family>(family);
  const hoverRef = useRef(hovered);
  familyRef.current = family;
  hoverRef.current = hovered;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 760px)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let time = 0;
    let nodes: Node[] = [];

    const buildNodes = () => {
      const count = compact ? 34 : 62;
      nodes = Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.2;
        const radius = 0.18 + Math.random() * 0.28;
        const ox = 0.5 + Math.cos(a) * radius;
        const oy = 0.5 + Math.sin(a) * radius * 0.72;
        return { x: ox, y: oy, ox, oy, vx: 0, vy: 0, r: 0.8 + Math.random() * 1.8, seed: Math.random() * 10 };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio, compact ? 1.25 : 1.7);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        pointer.active = false;
        return;
      }
      pointer.active = true;
      pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.y = (event.clientY - rect.top) / Math.max(1, rect.height);
    };
    const onLeave = () => { pointer.active = false; };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const updateNode = (node: Node, index: number, current: Exclude<Family, null>) => {
      const hoverEnergy = hoverRef.current >= 0 ? 1 : 0;
      const px = pointer.x;
      const py = pointer.y;
      const dxp = node.x - px;
      const dyp = node.y - py;
      const dist = Math.max(0.015, Math.hypot(dxp, dyp));
      let tx = node.ox;
      let ty = node.oy;

      if (current === "design") {
        const snap = 0.055;
        tx = Math.round((node.ox + Math.sin(time * 0.55 + node.seed) * 0.012) / snap) * snap;
        ty = Math.round((node.oy + Math.cos(time * 0.43 + node.seed) * 0.01) / snap) * snap;
        if (pointer.active && dist < 0.24) {
          tx += dxp / dist * 0.035;
          ty += dyp / dist * 0.035;
        }
      } else if (current === "visual") {
        const a = time * 0.36 + node.seed + index * 0.08;
        const pulse = Math.sin(time * 1.15 - dist * 19) * (0.008 + hoverEnergy * 0.008);
        tx = node.ox + Math.cos(a) * 0.014 + dxp / dist * pulse;
        ty = node.oy + Math.sin(a * 0.86) * 0.014 + dyp / dist * pulse;
      } else if (current === "creative") {
        const cx = node.ox - 0.5;
        const cy = node.oy - 0.5;
        const a = Math.atan2(cy, cx) + Math.sin(time * 0.3 + node.seed) * 0.12;
        const r = Math.hypot(cx, cy) * (1 + Math.sin(time * 0.5 + index) * 0.025);
        tx = 0.5 + Math.cos(a + time * 0.045) * r;
        ty = 0.5 + Math.sin(a + time * 0.045) * r * 0.98;
      } else if (current === "code") {
        tx = node.ox + Math.sin(time * 0.38 + node.seed) * 0.008;
        ty = node.oy + Math.cos(time * 0.42 + index * 0.25) * 0.008;
        if (pointer.active && dist < 0.3) {
          tx += (px - node.x) * 0.035;
          ty += (py - node.y) * 0.035;
        }
      } else {
        const lane = (index % 7) / 7;
        tx = 0.24 + lane * 0.52 + Math.sin(time * 0.22 + node.seed) * 0.014;
        ty = node.oy + ((time * 0.018 + node.seed * 0.03) % 0.16) - 0.08;
        if (pointer.active && dist < 0.2) tx += Math.sin(time * 1.3 + node.seed) * 0.018;
      }

      const stiffness = reduced ? 0.2 : 0.055;
      node.vx += (tx - node.x) * stiffness;
      node.vy += (ty - node.y) * stiffness;
      node.vx *= 0.86;
      node.vy *= 0.86;
      node.x += node.vx;
      node.y += node.vy;
    };

    const draw = () => {
      time += reduced ? 0 : 0.016;
      ctx.clearRect(0, 0, width, height);
      const current = familyRef.current;
      if (!current) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const rgb = palette[current];
      nodes.forEach((node, index) => updateNode(node, index, current));

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const d = Math.hypot(dx, dy);
          const threshold = current === "code" ? 138 : current === "data" ? 112 : 122;
          if (d > threshold) continue;
          const alpha = (1 - d / threshold) * (hoverRef.current >= 0 ? 0.16 : 0.085);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
          ctx.lineWidth = current === "design" ? 0.55 : 0.7;
          ctx.beginPath();
          if (current === "creative") {
            const mx = (a.x + b.x) * 0.5 * width;
            const my = (a.y + b.y) * 0.5 * height;
            ctx.moveTo(a.x * width, a.y * height);
            ctx.quadraticCurveTo(mx + Math.sin(time + i) * 12, my + Math.cos(time + j) * 12, b.x * width, b.y * height);
          } else {
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
          }
          ctx.stroke();
        }
      }

      nodes.forEach((node, index) => {
        const x = node.x * width;
        const y = node.y * height;
        const active = hoverRef.current === index % Math.max(1, hoverRef.current + 2);
        const radius = node.r + (hoverRef.current >= 0 ? 0.6 : 0) + Math.sin(time * 1.1 + node.seed) * 0.3;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 8);
        glow.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${active ? 0.52 : 0.24})`);
        glow.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${active ? 0.9 : 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.7, radius), 0, Math.PI * 2);
        ctx.fill();
      });

      if (pointer.active) {
        const x = pointer.x * width;
        const y = pointer.y * height;
        if (current === "visual") {
          for (let k = 0; k < 3; k++) {
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.18 - k * 0.04})`;
            ctx.beginPath();
            ctx.arc(x, y, 24 + k * 19 + Math.sin(time * 2 + k) * 4, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (current === "design") {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.22)`;
          ctx.beginPath(); ctx.moveTo(x - 24, y); ctx.lineTo(x + 24, y); ctx.moveTo(x, y - 24); ctx.lineTo(x, y + 24); ctx.stroke();
        } else if (current === "code") {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.2)`;
          ctx.setLineDash([3, 5]);
          ctx.beginPath(); ctx.arc(x, y, 42 + Math.sin(time * 2) * 5, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        } else if (current === "creative") {
          ctx.strokeStyle = `rgba(224,184,198,0.2)`;
          ctx.beginPath(); ctx.arc(x, y, 28, time, time + Math.PI * 1.55); ctx.stroke();
        } else {
          for (let k = -2; k <= 2; k++) {
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.09 + (2 - Math.abs(k)) * 0.025})`;
            ctx.beginPath(); ctx.moveTo(x - 70, y + k * 9); ctx.lineTo(x + 70, y + k * 9); ctx.stroke();
          }
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
