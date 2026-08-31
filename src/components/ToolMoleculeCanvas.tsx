"use client";

import { useEffect, useRef } from "react";

type Family = "design" | "visual" | "creative" | "code" | "data" | null;
type Props = { className?: string; family: Family; hovered?: number };
type Node = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; seed: number; depth: number; lobe: number };

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
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let time = 0;
    let nodes: Node[] = [];

    const buildNodes = () => {
      const count = compact ? 44 : 86;
      nodes = Array.from({ length: count }, (_, i) => {
        const lobe = i % 7;
        const lobeAngle = lobe * 2.3999632297 + (i % 3) * 0.13;
        const lobeRadius = 0.07 + (lobe % 3) * 0.026;
        const cx = 0.5 + Math.cos(lobeAngle) * (0.10 + (lobe % 2) * 0.075);
        const cy = 0.5 + Math.sin(lobeAngle) * (0.07 + (lobe % 3) * 0.035);
        const localAngle = i * 1.618 + lobe * 0.7;
        const localRadius = 0.025 + ((i * 17) % 100) / 100 * 0.11;
        const ox = cx + Math.cos(localAngle) * localRadius + Math.sin(i * 0.77) * 0.012;
        const oy = cy + Math.sin(localAngle) * localRadius * 0.72 + Math.cos(i * 0.53) * 0.009;
        return {
          x: ox,
          y: oy,
          ox,
          oy,
          vx: 0,
          vy: 0,
          r: 0.65 + ((i * 29) % 100) / 100 * 2.35,
          seed: (i * 0.731) % 11,
          depth: 0.35 + ((i * 13) % 60) / 100,
          lobe,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.active = inside;
      if (!inside) return;
      pointer.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const updateNode = (node: Node, index: number, current: Exclude<Family, null>) => {
      const hoveredIndex = hoverRef.current;
      const hoverAngle = Math.max(0, hoveredIndex) * 2.3999632297 + time * 0.08;
      const focusX = 0.5 + Math.cos(hoverAngle) * 0.13;
      const focusY = 0.5 + Math.sin(hoverAngle) * 0.095;
      const dxFocus = node.x - focusX;
      const dyFocus = node.y - focusY;
      const focusDist = Math.max(0.02, Math.hypot(dxFocus, dyFocus));
      const dxPointer = node.x - pointer.x;
      const dyPointer = node.y - pointer.y;
      const pointerDist = Math.max(0.018, Math.hypot(dxPointer, dyPointer));
      let tx = node.ox;
      let ty = node.oy;

      if (current === "design") {
        const snap = index % 4 === 0 ? 0.035 : 0.052;
        tx = Math.round((node.ox + Math.sin(time * 0.4 + node.seed) * 0.009) / snap) * snap;
        ty = Math.round((node.oy + Math.cos(time * 0.36 + node.seed) * 0.008) / snap) * snap;
        if (hoveredIndex >= 0 && focusDist < 0.22) {
          tx += dxFocus / focusDist * 0.032;
          ty += dyFocus / focusDist * 0.032;
        }
        if (pointer.active && pointerDist < 0.18) {
          tx += dxPointer / pointerDist * 0.018;
          ty += dyPointer / pointerDist * 0.018;
        }
      } else if (current === "visual") {
        const wave = Math.sin(time * 1.35 - focusDist * 24 + node.seed) * (hoveredIndex >= 0 ? 0.018 : 0.008);
        tx = node.ox + Math.cos(time * 0.32 + node.seed) * 0.012 + dxFocus / focusDist * wave;
        ty = node.oy + Math.sin(time * 0.37 + node.seed) * 0.011 + dyFocus / focusDist * wave;
      } else if (current === "creative") {
        const cx = node.ox - 0.5;
        const cy = node.oy - 0.5;
        const a = Math.atan2(cy, cx) + time * (0.022 + node.depth * 0.012) + Math.sin(time * 0.24 + node.seed) * 0.1;
        const r = Math.hypot(cx, cy) * (1 + Math.sin(time * 0.55 + index * 0.31) * 0.035);
        tx = 0.5 + Math.cos(a) * r;
        ty = 0.5 + Math.sin(a) * r * 0.88;
        if (hoveredIndex >= 0 && focusDist < 0.2) {
          tx += Math.cos(a + Math.PI * 0.5) * 0.025;
          ty += Math.sin(a + Math.PI * 0.5) * 0.025;
        }
      } else if (current === "code") {
        const attractor = node.lobe % 3;
        const ax = 0.5 + Math.cos(attractor * 2.094 + time * 0.06) * 0.13;
        const ay = 0.5 + Math.sin(attractor * 2.094 + time * 0.06) * 0.085;
        tx = node.ox * 0.78 + ax * 0.22 + Math.sin(time * 0.4 + node.seed) * 0.007;
        ty = node.oy * 0.78 + ay * 0.22 + Math.cos(time * 0.43 + node.seed) * 0.007;
        if (hoveredIndex >= 0 && focusDist < 0.23) {
          tx += (focusX - node.x) * 0.06;
          ty += (focusY - node.y) * 0.06;
        }
      } else {
        const lane = (node.lobe % 5) / 4;
        tx = 0.33 + lane * 0.34 + Math.sin(time * 0.2 + node.seed) * 0.014;
        ty = node.oy + Math.sin(time * (0.18 + node.depth * 0.08) + node.seed) * 0.035;
        if (hoveredIndex >= 0) tx += Math.sin(time * 1.4 + node.seed) * 0.01;
      }

      const stiffness = reduced ? 0.18 : 0.045 + node.depth * 0.014;
      node.vx += (tx - node.x) * stiffness;
      node.vy += (ty - node.y) * stiffness;
      node.vx *= 0.87;
      node.vy *= 0.87;
      node.x += node.vx;
      node.y += node.vy;
    };

    const drawOrganicContours = (current: Exclude<Family, null>, rgb: readonly number[]) => {
      const hoveredIndex = hoverRef.current;
      const energy = hoveredIndex >= 0 ? 1 : 0;
      for (let ring = 0; ring < 3; ring += 1) {
        const points = 84;
        ctx.beginPath();
        for (let i = 0; i <= points; i += 1) {
          const a = (i / points) * Math.PI * 2;
          const harmonics = Math.sin(a * (3 + ring) + time * (0.18 + ring * 0.05)) * 0.018 + Math.sin(a * 7 - time * 0.11) * 0.009;
          const rx = width * (0.18 + ring * 0.075 + harmonics + energy * 0.004);
          const ry = height * (0.16 + ring * 0.072 + harmonics * 0.8);
          const x = width * 0.5 + Math.cos(a) * rx;
          const y = height * 0.5 + Math.sin(a) * ry;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.032 + ring * 0.012 + energy * 0.018})`;
        ctx.lineWidth = ring === 1 ? 0.8 : 0.55;
        if (current === "code" && ring === 1) ctx.setLineDash([3, 7]); else ctx.setLineDash([]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    };

    const draw = () => {
      time += reduced ? 0 : 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
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
      drawOrganicContours(current, rgb);

      for (let i = 0; i < nodes.length; i += 1) {
        const maxLinks = current === "code" ? 5 : current === "creative" ? 3 : 4;
        let links = 0;
        for (let j = i + 1; j < nodes.length && links < maxLinks; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const d = Math.hypot(dx, dy);
          const threshold = current === "code" ? 126 : current === "creative" ? 108 : current === "data" ? 92 : 112;
          if (d > threshold) continue;
          links += 1;
          const alpha = (1 - d / threshold) * (hoverRef.current >= 0 ? 0.15 : 0.065) * (0.65 + a.depth * 0.45);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
          ctx.lineWidth = current === "design" ? 0.45 : 0.65;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          if (current === "creative" || current === "visual") {
            const mx = (a.x + b.x) * 0.5 * width;
            const my = (a.y + b.y) * 0.5 * height;
            ctx.quadraticCurveTo(mx + Math.sin(time + i * 0.4) * 9, my + Math.cos(time + j * 0.35) * 9, b.x * width, b.y * height);
          } else {
            ctx.lineTo(b.x * width, b.y * height);
          }
          ctx.stroke();
        }
      }

      nodes.forEach((node, index) => {
        const x = node.x * width;
        const y = node.y * height;
        const hot = hoverRef.current >= 0 && (index + hoverRef.current) % 11 < 2;
        const pulse = Math.sin(time * (0.7 + node.depth * 0.8) + node.seed) * 0.35;
        const radius = node.r + pulse + (hot ? 0.8 : 0);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, Math.max(5, radius * (7 + node.depth * 5)));
        glow.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.42 : 0.17 + node.depth * 0.08})`);
        glow.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(5, radius * (7 + node.depth * 5)), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.85 : 0.32 + node.depth * 0.22})`;
        ctx.beginPath();
        ctx.ellipse(x, y, Math.max(0.65, radius * (0.85 + node.depth * 0.25)), Math.max(0.55, radius * (0.6 + node.depth * 0.18)), node.seed, 0, Math.PI * 2);
        ctx.fill();
      });

      if (pointer.active) {
        const x = pointer.x * width;
        const y = pointer.y * height;
        if (current === "visual") {
          for (let k = 0; k < 4; k += 1) {
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.14 - k * 0.025})`;
            ctx.beginPath();
            ctx.arc(x, y, 20 + k * 18 + Math.sin(time * 2.1 + k) * 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (current === "design") {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.2)`;
          ctx.beginPath();
          ctx.moveTo(x - 32, y); ctx.lineTo(x + 32, y);
          ctx.moveTo(x, y - 32); ctx.lineTo(x, y + 32);
          ctx.moveTo(x - 22, y + 22); ctx.lineTo(x + 22, y - 22);
          ctx.stroke();
        } else if (current === "code") {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.2)`;
          ctx.setLineDash([2, 6]);
          ctx.beginPath(); ctx.arc(x, y, 38 + Math.sin(time * 2) * 6, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        } else if (current === "creative") {
          for (let k = 0; k < 3; k += 1) {
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.17 - k * 0.035})`;
            ctx.beginPath(); ctx.ellipse(x, y, 30 + k * 13, 18 + k * 8, time * 0.2 + k, time, time + Math.PI * 1.6); ctx.stroke();
          }
        } else {
          for (let k = -3; k <= 3; k += 1) {
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.055 + (3 - Math.abs(k)) * 0.018})`;
            ctx.beginPath(); ctx.moveTo(x - 74, y + k * 8); ctx.lineTo(x + 74, y + k * 8); ctx.stroke();
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
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
