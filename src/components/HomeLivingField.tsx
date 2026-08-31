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
      const count = width < 700 ? 22 : 38;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: ((i * 0.6180339887 + Math.sin(i * 1.7) * 0.08) % 1) * width,
        y: (((i * 0.3819660113) + 0.17 + Math.cos(i * 1.13) * 0.06) % 1) * height,
        z: 0.25 + ((i * 17) % 70) / 100,
        vx: ((i % 5) - 2) * 0.012,
        vy: (((i * 3) % 7) - 3) * 0.009,
        phase: i * 0.71,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.45);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(1, window.innerWidth);
      pointer.ty = event.clientY / Math.max(1, window.innerHeight);
    };

    const line = (a: [number, number], b: [number, number], color: string, dash: number[] = []) => {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawStructure = (time: number) => {
      ctx.save();
      const px = (pointer.x - 0.5) * -13;
      const py = (pointer.y - 0.5) * -9;
      ctx.translate(px, py);

      const structural = [
        { a: [-0.06, 0.23], b: [0.54, 0.13], c: "rgba(242,237,228,.038)" },
        { a: [0.18, -0.05], b: [0.31, 1.05], c: "rgba(214,194,143,.045)" },
        { a: [0.61, -0.08], b: [0.94, 1.04], c: "rgba(126,171,186,.04)" },
        { a: [-0.03, 0.77], b: [1.04, 0.61], c: "rgba(242,237,228,.032)" },
        { a: [0.43, 0.08], b: [0.92, 0.87], c: "rgba(156,171,148,.033)" },
        { a: [0.07, 0.93], b: [0.78, 0.34], c: "rgba(214,194,143,.032)" },
      ];
      structural.forEach((s, i) => {
        const drift = reduced ? 0 : Math.sin(time * 0.00013 + i * 1.4) * 3.5;
        line([s.a[0] * width, s.a[1] * height + drift], [s.b[0] * width, s.b[1] * height - drift], s.c, i % 3 === 2 ? [3, 9] : []);
      });

      // Pythagorean / section triangles placed as construction annotations rather than a repeating grid.
      const triangles = [
        { x: 0.11, y: 0.18, s: Math.min(width, height) * 0.12, a: -0.12 },
        { x: 0.72, y: 0.19, s: Math.min(width, height) * 0.17, a: 0.18 },
        { x: 0.68, y: 0.68, s: Math.min(width, height) * 0.1, a: -0.32 },
      ];
      triangles.forEach((tri, i) => {
        ctx.save();
        ctx.translate(tri.x * width, tri.y * height);
        ctx.rotate(tri.a + (reduced ? 0 : Math.sin(time * 0.00008 + i) * 0.015));
        const s = tri.s;
        ctx.beginPath();
        ctx.moveTo(-s * 0.5, s * 0.34);
        ctx.lineTo(s * 0.5, s * 0.34);
        ctx.lineTo(s * 0.5, -s * 0.4);
        ctx.closePath();
        ctx.strokeStyle = i === 1 ? "rgba(214,194,143,.07)" : "rgba(242,237,228,.042)";
        ctx.setLineDash(i === 2 ? [4, 7] : []);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(s * 0.39, s * 0.34);
        ctx.lineTo(s * 0.39, s * 0.23);
        ctx.lineTo(s * 0.5, s * 0.23);
        ctx.strokeStyle = "rgba(126,171,186,.055)";
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore();
    };

    const drawContours = (time: number) => {
      const cx = width * (0.65 + (pointer.x - 0.5) * 0.035);
      const cy = height * (0.49 + (pointer.y - 0.5) * 0.025);
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath();
        const points = 88;
        for (let i = 0; i <= points; i += 1) {
          const a = (i / points) * Math.PI * 2;
          const wobble = Math.sin(a * (3 + ring) + time * 0.00018 + ring) * (5 + ring * 2.4) + Math.sin(a * 7 - time * 0.0001) * 3;
          const rx = width * (0.105 + ring * 0.052) + wobble;
          const ry = height * (0.14 + ring * 0.058) + wobble * 0.58;
          const x = cx + Math.cos(a) * rx;
          const y = cy + Math.sin(a) * ry;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = ring === 1 ? "rgba(214,194,143,.08)" : "rgba(126,171,186,.044)";
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
      drawStructure(now);
      drawContours(now);

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!reduced) {
          node.x += node.vx * dt * (0.75 + node.z);
          node.y += node.vy * dt * (0.75 + node.z);
          node.x += Math.sin(now * 0.00016 + node.phase) * 0.014;
          node.y += Math.cos(now * 0.00013 + node.phase) * 0.011;
        }
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;

        const px = node.x + (pointer.x - 0.5) * (node.z - 0.45) * 38;
        const py = node.y + (pointer.y - 0.5) * (node.z - 0.45) * 27;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const other = nodes[j];
          const ox = other.x + (pointer.x - 0.5) * (other.z - 0.45) * 38;
          const oy = other.y + (pointer.y - 0.5) * (other.z - 0.45) * 27;
          const dist = Math.hypot(px - ox, py - oy);
          const threshold = width < 700 ? 76 : 104;
          if (dist < threshold && ((i + j) % 3 !== 0)) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = `rgba(214,194,143,${(1 - dist / threshold) * 0.042})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.ellipse(px, py, 0.55 + node.z * 1.25, 0.45 + node.z * 0.8, node.phase, 0, Math.PI * 2);
        ctx.fillStyle = node.z > 0.62 ? "rgba(214,194,143,.29)" : "rgba(242,237,228,.13)";
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
