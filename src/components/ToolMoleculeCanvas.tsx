"use client";

import { useEffect, useRef } from "react";

type Family = "design" | "visual" | "creative" | "code" | "data" | null;
type Props = { className?: string; family: Family; hovered?: number };
type Node = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
  depth: number;
  lobe: number;
  trail: Array<[number, number]>;
};

type Rgb = readonly [number, number, number];

const palette: Record<Exclude<Family, null>, Rgb> = {
  design: [214, 194, 143],
  visual: [126, 171, 186],
  creative: [224, 184, 198],
  code: [183, 199, 227],
  data: [156, 171, 148],
};

const smooth = (value: number) => value * value * (3 - 2 * value);

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

    const compact = window.matchMedia("(max-width: 760px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    let width = 1;
    let height = 1;
    let time = 0;
    let raf = 0;
    let nodes: Node[] = [];
    let lastFamily: Exclude<Family, null> | null = null;
    let previousRgb: Rgb = palette.design;
    let transition = 1;

    const buildNodes = () => {
      const count = compact ? 86 : 196;
      nodes = Array.from({ length: count }, (_, i) => {
        const lobe = i % 13;
        const lobeAngle = lobe * 2.3999632297 + (i % 5) * 0.17;
        const spreadX = compact ? 0.27 : 0.36;
        const spreadY = compact ? 0.25 : 0.32;
        const lobeRadius = 0.042 + (lobe % 5) * 0.022;
        const cx = 0.5 + Math.cos(lobeAngle) * spreadX * (0.34 + (lobe % 4) * 0.08);
        const cy = 0.51 + Math.sin(lobeAngle) * spreadY * (0.32 + (lobe % 5) * 0.06);
        const angle = i * 1.6180339887 + lobe * 0.37;
        const radius = 0.016 + ((i * 31) % 100) / 100 * lobeRadius;
        const ox = cx + Math.cos(angle) * radius + Math.sin(i * 0.73) * 0.012;
        const oy = cy + Math.sin(angle) * radius * 0.82 + Math.cos(i * 0.41) * 0.01;
        return {
          x: ox,
          y: oy,
          ox,
          oy,
          vx: 0,
          vy: 0,
          r: 0.55 + ((i * 29) % 100) / 100 * 2.95,
          seed: (i * 0.731) % 12,
          depth: 0.24 + ((i * 17) % 72) / 100,
          lobe,
          trail: [],
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75);
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

    const focusPoint = () => {
      const h = Math.max(0, hoverRef.current);
      const angle = h * 2.3999632297 - 0.65;
      const radius = compact ? 0.14 : 0.22;
      return {
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius * 0.72,
      };
    };

    const updateNode = (node: Node, index: number, current: Exclude<Family, null>, transitionEnergy: number) => {
      const focus = focusPoint();
      const dxFocus = node.x - focus.x;
      const dyFocus = node.y - focus.y;
      const focusDist = Math.max(0.018, Math.hypot(dxFocus, dyFocus));
      const dxPointer = node.x - pointer.x;
      const dyPointer = node.y - pointer.y;
      const pointerDist = Math.max(0.018, Math.hypot(dxPointer, dyPointer));
      const hot = hoverRef.current >= 0;
      let tx = node.ox;
      let ty = node.oy;

      if (current === "design") {
        const snapX = index % 3 === 0 ? 0.032 : 0.048;
        const snapY = index % 4 === 0 ? 0.038 : 0.052;
        tx = Math.round((node.ox + Math.sin(time * 0.28 + node.seed) * 0.008) / snapX) * snapX;
        ty = Math.round((node.oy + Math.cos(time * 0.31 + node.seed) * 0.007) / snapY) * snapY;
        if (hot && focusDist < 0.29) {
          const force = (0.29 - focusDist) * 0.2;
          tx += dxFocus / focusDist * force;
          ty += dyFocus / focusDist * force;
        }
      } else if (current === "visual") {
        const waveA = Math.sin(time * 1.4 - focusDist * 27 + node.seed);
        const waveB = Math.cos(time * 0.82 + (node.x + node.y) * 20 + node.seed);
        const amp = hot ? 0.026 : 0.012;
        tx = node.ox + Math.cos(time * 0.34 + node.seed) * 0.014 + (dxFocus / focusDist) * waveA * amp;
        ty = node.oy + Math.sin(time * 0.38 + node.seed) * 0.013 + (dyFocus / focusDist) * waveB * amp;
      } else if (current === "creative") {
        const cx = node.ox - 0.5;
        const cy = node.oy - 0.5;
        const baseRadius = Math.hypot(cx, cy);
        const twist = time * (0.026 + node.depth * 0.014) + Math.sin(time * 0.22 + node.seed) * 0.14;
        const a = Math.atan2(cy, cx) + twist;
        const breathing = 1 + Math.sin(time * 0.62 + index * 0.27) * 0.055;
        tx = 0.5 + Math.cos(a) * baseRadius * breathing;
        ty = 0.5 + Math.sin(a) * baseRadius * 0.9 * breathing;
        if (hot && focusDist < 0.3) {
          tx += Math.cos(a + Math.PI / 2) * (0.038 * (1 - focusDist / 0.3));
          ty += Math.sin(a + Math.PI / 2) * (0.038 * (1 - focusDist / 0.3));
        }
      } else if (current === "code") {
        const attractor = node.lobe % 4;
        const a = attractor * (Math.PI / 2) + time * 0.055;
        const ax = 0.5 + Math.cos(a) * 0.22;
        const ay = 0.5 + Math.sin(a) * 0.145;
        const pulse = Math.sin(time * 1.45 + node.seed) * 0.008;
        tx = node.ox * 0.72 + ax * 0.28 + pulse;
        ty = node.oy * 0.72 + ay * 0.28 - pulse;
        if (hot && focusDist < 0.34) {
          tx += (focus.x - node.x) * 0.12;
          ty += (focus.y - node.y) * 0.12;
        }
      } else {
        const lanes = compact ? 5 : 8;
        const lane = node.lobe % lanes;
        const xBase = 0.24 + (lane / Math.max(1, lanes - 1)) * 0.52;
        tx = xBase + Math.sin(time * 0.27 + node.seed) * 0.016;
        ty = node.oy + Math.sin(time * (0.22 + node.depth * 0.09) + node.seed) * 0.045;
        if (hot) ty += Math.sin(time * 1.8 + node.seed) * 0.012;
      }

      if (pointer.active && pointerDist < 0.19) {
        const repulse = (0.19 - pointerDist) * (current === "creative" ? -0.14 : 0.12);
        tx += dxPointer / pointerDist * repulse;
        ty += dyPointer / pointerDist * repulse;
      }

      if (transitionEnergy > 0.001 && !reduced) {
        const a = node.seed * 1.7 + index * 0.11 + time * 0.7;
        tx += Math.cos(a) * transitionEnergy * (0.026 + node.depth * 0.015);
        ty += Math.sin(a * 1.17) * transitionEnergy * (0.021 + node.depth * 0.012);
      }

      const stiffness = reduced ? 0.18 : 0.04 + node.depth * 0.018;
      node.vx += (tx - node.x) * stiffness;
      node.vy += (ty - node.y) * stiffness;
      node.vx *= 0.86;
      node.vy *= 0.86;
      node.x += node.vx;
      node.y += node.vy;

      if (!reduced) {
        node.trail.unshift([node.x, node.y]);
        if (node.trail.length > (compact ? 7 : 13)) node.trail.pop();
      }
    };

    const contour = (rgb: readonly number[], current: Exclude<Family, null>, radiusScale: number, phase: number, alpha: number) => {
      const points = 124;
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const a = (i / points) * Math.PI * 2;
        const n = Math.sin(a * 3 + time * 0.17 + phase) * 0.035 + Math.sin(a * 7 - time * 0.13 + phase) * 0.018 + Math.cos(a * 11 + time * 0.08) * 0.008;
        const rx = width * radiusScale * (1 + n);
        const ry = height * radiusScale * 0.68 * (1 + n * 0.8);
        const shear = current === "data" ? Math.sin(a * 2 + phase) * width * 0.025 : 0;
        const x = width * 0.5 + Math.cos(a) * rx + shear;
        const y = height * 0.51 + Math.sin(a) * ry;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
      ctx.lineWidth = current === "design" ? 0.55 : 0.8;
      if (current === "code") ctx.setLineDash([3, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawFlowRibbons = (current: Exclude<Family, null>, rgb: readonly number[], transitionEnergy: number) => {
      const ribbons = compact ? 7 : 14;
      for (let ribbon = 0; ribbon < ribbons; ribbon += 1) {
        ctx.beginPath();
        const points = 72;
        for (let i = 0; i <= points; i += 1) {
          const p = i / points;
          let x = width * (0.14 + p * 0.72);
          let y = height * (0.2 + (ribbon / Math.max(1, ribbons - 1)) * 0.6);
          if (current === "design") {
            y += Math.sin(p * 9 + ribbon * 0.7 + time * 0.35) * 2.2;
          } else if (current === "visual") {
            y += Math.sin(p * 10 + time * 1.05 + ribbon * 0.65) * (8 + ribbon % 4 * 2.4);
            x += Math.cos(p * 6 + time * 0.45 + ribbon) * 4;
          } else if (current === "creative") {
            const a = p * Math.PI * 1.65 + ribbon * 0.46 + time * 0.12;
            const r = p * Math.min(width, height) * 0.36;
            x = width * 0.5 + Math.cos(a) * r;
            y = height * 0.5 + Math.sin(a) * r * 0.73;
          } else if (current === "code") {
            const lane = ribbon % 4;
            const ax = width * (0.34 + lane * 0.105);
            const ay = height * (0.35 + (lane % 2) * 0.28);
            x = width * (0.13 + p * 0.74);
            y += (ay - y) * Math.sin(p * Math.PI) * 0.48 + Math.sin(p * 18 + time + ribbon) * 3;
            x += (ax - x) * Math.sin(p * Math.PI) * 0.08;
          } else {
            y += Math.sin(p * 13 + ribbon * 0.55 + time * 0.72) * 5;
            x += Math.sin(time * 0.28 + ribbon) * 7;
          }
          y += Math.sin(p * 17 + ribbon + time * 0.4) * transitionEnergy * 18;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const alpha = 0.014 + (ribbon % 5) * 0.006 + transitionEnergy * 0.02;
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.lineWidth = ribbon % 4 === 0 ? 1.05 : 0.48;
        ctx.stroke();
      }
    };

    const drawTransitionBurst = (rgb: readonly number[], energy: number) => {
      if (energy < 0.012) return;
      const rays = compact ? 18 : 32;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxR = Math.min(width, height) * (0.16 + energy * 0.32);
      for (let i = 0; i < rays; i += 1) {
        const a = (i / rays) * Math.PI * 2 + time * 0.05;
        const inner = maxR * (0.18 + (i % 5) * 0.025);
        const outer = maxR * (0.58 + (i % 7) * 0.05);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${energy * (0.022 + (i % 3) * 0.01)})`;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner * 0.72);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer * 0.72);
        ctx.stroke();
      }
    };

    const drawFamilyField = (current: Exclude<Family, null>, rgb: readonly number[], transitionEnergy: number) => {
      const hot = hoverRef.current >= 0;
      contour(rgb, current, compact ? 0.28 : 0.27, 0, hot ? 0.12 : 0.055);
      contour(rgb, current, compact ? 0.34 : 0.35, 1.7, hot ? 0.08 : 0.035);
      contour(rgb, current, compact ? 0.4 : 0.43, 3.1, hot ? 0.055 : 0.024);
      drawFlowRibbons(current, rgb, transitionEnergy);
      drawTransitionBurst(rgb, transitionEnergy);

      if (current === "design") {
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.13 : 0.06})`;
        ctx.lineWidth = 0.5;
        const stepX = compact ? 70 : 92;
        const stepY = compact ? 62 : 78;
        for (let x = width * 0.2; x <= width * 0.8; x += stepX) { ctx.beginPath(); ctx.moveTo(x, height * 0.18); ctx.lineTo(x, height * 0.83); ctx.stroke(); }
        for (let y = height * 0.22; y <= height * 0.78; y += stepY) { ctx.beginPath(); ctx.moveTo(width * 0.17, y); ctx.lineTo(width * 0.83, y); ctx.stroke(); }
      }

      if (current === "visual") {
        const cx = (pointer.active ? pointer.x : 0.52) * width;
        const cy = (pointer.active ? pointer.y : 0.5) * height;
        for (let k = 0; k < 9; k += 1) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.max(0.012, 0.135 - k * 0.013)})`;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 34 + k * 27 + Math.sin(time * 1.7 + k) * 8, 22 + k * 18, time * 0.025, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (current === "creative") {
        for (let arm = 0; arm < 7; arm += 1) {
          ctx.beginPath();
          for (let i = 0; i < 86; i += 1) {
            const p = i / 85;
            const a = arm * Math.PI / 3.5 + p * Math.PI * 1.6 + time * 0.08;
            const r = p * Math.min(width, height) * 0.34;
            const x = width * 0.5 + Math.cos(a) * r;
            const y = height * 0.5 + Math.sin(a) * r * 0.72;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.075 : 0.03})`;
          ctx.stroke();
        }
      }

      if (current === "code") {
        const attractors = compact ? 3 : 4;
        for (let i = 0; i < attractors; i += 1) {
          const a = i * (Math.PI * 2 / attractors) + time * 0.04;
          const x = width * (0.5 + Math.cos(a) * 0.22);
          const y = height * (0.5 + Math.sin(a) * 0.15);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.14 : 0.055})`;
          ctx.setLineDash([2, 8]);
          ctx.beginPath(); ctx.arc(x, y, 24 + Math.sin(time * 1.5 + i) * 7, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (current === "data") {
        const rows = compact ? 8 : 13;
        for (let r = 0; r < rows; r += 1) {
          const y = height * (0.2 + (r / Math.max(1, rows - 1)) * 0.62);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.022 + (r % 4) * 0.012})`;
          ctx.beginPath();
          for (let i = 0; i <= 50; i += 1) {
            const p = i / 50;
            const x = width * (0.17 + p * 0.68);
            const yy = y + Math.sin(p * 12 + time * 0.8 + r) * (4 + r % 3);
            if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
          }
          ctx.stroke();
        }
      }
    };

    const draw = () => {
      time += reduced ? 0 : 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.065;
      pointer.y += (pointer.ty - pointer.y) * 0.065;
      ctx.clearRect(0, 0, width, height);
      const current = familyRef.current;
      if (!current) {
        raf = requestAnimationFrame(draw);
        return;
      }

      if (lastFamily !== current) {
        previousRgb = lastFamily ? palette[lastFamily] : palette[current];
        lastFamily = current;
        transition = 0;
        if (!reduced) {
          nodes.forEach((node, index) => {
            const a = index * 2.3999632297 + node.seed;
            node.vx += Math.cos(a) * (0.002 + node.depth * 0.0015);
            node.vy += Math.sin(a) * (0.002 + node.depth * 0.0015);
          });
        }
      }

      transition = reduced ? 1 : Math.min(1, transition + 0.018);
      const blend = smooth(transition);
      const targetRgb = palette[current];
      const rgb = [
        previousRgb[0] + (targetRgb[0] - previousRgb[0]) * blend,
        previousRgb[1] + (targetRgb[1] - previousRgb[1]) * blend,
        previousRgb[2] + (targetRgb[2] - previousRgb[2]) * blend,
      ];
      const transitionEnergy = Math.sin(Math.PI * transition);

      nodes.forEach((node, index) => updateNode(node, index, current, transitionEnergy));

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      drawFamilyField(current, rgb, transitionEnergy);

      nodes.forEach((node) => {
        if (node.trail.length < 2) return;
        const points = node.trail;
        ctx.beginPath();
        ctx.moveTo(points[0][0] * width, points[0][1] * height);
        for (let i = 1; i < points.length - 1; i += 1) {
          const currentPoint = points[i];
          const next = points[i + 1];
          const mx = (currentPoint[0] + next[0]) * 0.5 * width;
          const my = (currentPoint[1] + next[1]) * 0.5 * height;
          ctx.quadraticCurveTo(currentPoint[0] * width, currentPoint[1] * height, mx, my);
        }
        const trailAlpha = 0.014 + node.depth * 0.034 + transitionEnergy * 0.012;
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${trailAlpha})`;
        ctx.lineWidth = 0.42 + node.depth * 0.44;
        ctx.stroke();
      });

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        let links = 0;
        const maxLinks = current === "code" ? 6 : current === "creative" ? 3 : 4;
        for (let j = i + 1; j < nodes.length && links < maxLinks; j += 1) {
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const distance = Math.hypot(dx, dy);
          const threshold = compact ? 82 : current === "code" ? 145 : current === "creative" ? 120 : 132;
          if (distance > threshold) continue;
          links += 1;
          const alpha = (1 - distance / threshold) * (hoverRef.current >= 0 ? 0.17 : 0.07) * (0.6 + a.depth * 0.45);
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
          ctx.lineWidth = current === "design" ? 0.45 : 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          if (current === "creative" || current === "visual") {
            const mx = (a.x + b.x) * width * 0.5;
            const my = (a.y + b.y) * height * 0.5;
            ctx.quadraticCurveTo(mx + Math.sin(time + i) * 14, my + Math.cos(time * 0.8 + j) * 14, b.x * width, b.y * height);
          } else ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }

      nodes.forEach((node, index) => {
        const x = node.x * width;
        const y = node.y * height;
        const hot = hoverRef.current >= 0 && (index + hoverRef.current * 3) % 13 < 3;
        const pulse = Math.sin(time * (0.72 + node.depth * 0.9) + node.seed) * 0.48;
        const radius = Math.max(0.5, node.r + pulse + (hot ? 1.1 : 0));
        const glowRadius = radius * (9 + node.depth * 7);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        glow.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.46 : 0.17 + node.depth * 0.095})`);
        glow.addColorStop(0.36, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.095 : 0.035})`);
        glow.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, glowRadius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hot ? 0.92 : 0.34 + node.depth * 0.24})`;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * (0.95 + node.depth * 0.3), radius * (0.55 + node.depth * 0.24), node.seed + time * 0.03, 0, Math.PI * 2);
        ctx.fill();
        if (!compact && index % 11 === 0) {
          ctx.fillStyle = `rgba(242,237,228,${0.11 + node.depth * 0.12})`;
          ctx.beginPath(); ctx.arc(x + radius * 1.8, y - radius * 1.4, 0.45 + node.depth * 0.35, 0, Math.PI * 2); ctx.fill();
        }
      });

      if (pointer.active) {
        const x = pointer.x * width;
        const y = pointer.y * height;
        const size = hoverRef.current >= 0 ? 56 : 38;
        for (let ring = 0; ring < 3; ring += 1) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.17 - ring * 0.045})`;
          ctx.beginPath();
          ctx.arc(x, y, size + ring * 17 + Math.sin(time * (1.7 + ring * 0.2)) * 7, 0, Math.PI * 2);
          ctx.stroke();
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
