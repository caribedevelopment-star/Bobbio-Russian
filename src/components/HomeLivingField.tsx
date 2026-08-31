"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; z: number; vx: number; vy: number; phase: number };

export default function HomeLivingField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let nodes: Node[] = [];
    let last = performance.now();

    const createNodes = () => {
      const count = width < 700 ? 24 : 42;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: ((i * 0.6180339887) % 1) * width,
        y: (((i * 0.3819660113) + 0.17) % 1) * height,
        z: 0.25 + ((i * 17) % 70) / 100,
        vx: ((i % 5) - 2) * 0.014,
        vy: (((i * 3) % 7) - 3) * 0.011,
        phase: i * 0.71,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(1, window.innerWidth);
      pointer.ty = event.clientY / Math.max(1, window.innerHeight);
    };

    const drawGrid = () => {
      ctx.save();
      ctx.translate((pointer.x - 0.5) * -10, (pointer.y - 0.5) * -7);
      ctx.strokeStyle = "rgba(242,237,228,.035)";
      ctx.lineWidth = 1;
      const step = width < 700 ? 72 : 94;
      for (let x = -step; x < width + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + width * 0.12, height);
        ctx.stroke();
      }
      for (let y = -step; y < height + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + height * 0.04);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawContours = (time: number) => {
      const cx = width * (0.69 + (pointer.x - 0.5) * 0.035);
      const cy = height * (0.49 + (pointer.y - 0.5) * 0.025);
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        const points = 92;
        for (let i = 0; i <= points; i++) {
          const a = (i / points) * Math.PI * 2;
          const wobble = Math.sin(a * (3 + ring) + time * 0.00022 + ring) * (5 + ring * 2);
          const rx = width * (0.12 + ring * 0.047) + wobble;
          const ry = height * (0.16 + ring * 0.055) + wobble * 0.6;
          const x = cx + Math.cos(a) * rx;
          const y = cy + Math.sin(a) * ry;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = ring === 1 ? "rgba(214,194,143,.105)" : "rgba(126,171,186,.055)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const render = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;

      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawContours(now);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!reduced) {
          node.x += node.vx * dt * (0.8 + node.z);
          node.y += node.vy * dt * (0.8 + node.z);
          node.x += Math.sin(now * 0.00018 + node.phase) * 0.018;
          node.y += Math.cos(now * 0.00014 + node.phase) * 0.014;
        }
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;

        const px = node.x + (pointer.x - 0.5) * (node.z - 0.45) * 42;
        const py = node.y + (pointer.y - 0.5) * (node.z - 0.45) * 30;

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ox = other.x + (pointer.x - 0.5) * (other.z - 0.45) * 42;
          const oy = other.y + (pointer.y - 0.5) * (other.z - 0.45) * 30;
          const dx = px - ox;
          const dy = py - oy;
          const dist = Math.hypot(dx, dy);
          const threshold = width < 700 ? 82 : 118;
          if (dist < threshold) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = `rgba(214,194,143,${(1 - dist / threshold) * 0.055})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, 0.7 + node.z * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = node.z > 0.62 ? "rgba(214,194,143,.34)" : "rgba(242,237,228,.16)";
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    render(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
