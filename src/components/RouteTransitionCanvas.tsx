"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { className?: string; active: boolean; phase: "idle" | "closing" | "opening" };

function beamBetween(a: THREE.Vector3, b: THREE.Vector3, width: number, material: THREE.Material) {
  const direction = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, width, direction.length()), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
  return mesh;
}

export default function RouteTransitionCanvas({ className, active, phase }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const phaseRef = useRef(phase);
  activeRef.current = active;
  phaseRef.current = phase;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090c, 0.09);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 30);
    camera.position.set(0, 0.25, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x07090c, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    const gold = new THREE.MeshStandardMaterial({ color: 0xd6c28f, metalness: 0.62, roughness: 0.28, transparent: true, opacity: 0.5, emissive: 0x3f3218, emissiveIntensity: 0.24 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x8b949b, metalness: 0.7, roughness: 0.32, transparent: true, opacity: 0.28 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x7eabba, metalness: 0.38, roughness: 0.28, transparent: true, opacity: 0.26 });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 3), gold);
    world.add(core);
    const coreWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 2)), new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.32 }));
    world.add(coreWire);

    const frame = new THREE.Group();
    world.add(frame);
    const pts = [
      new THREE.Vector3(-2.8, -1.65, -0.8), new THREE.Vector3(2.8, -1.65, -0.8),
      new THREE.Vector3(-2.8, 1.65, -0.8), new THREE.Vector3(2.8, 1.65, -0.8),
      new THREE.Vector3(-2.1, -1.15, 1.1), new THREE.Vector3(2.1, -1.15, 1.1),
      new THREE.Vector3(-2.1, 1.15, 1.1), new THREE.Vector3(2.1, 1.15, 1.1),
    ];
    [[0,1],[2,3],[0,2],[1,3],[4,5],[6,7],[4,6],[5,7],[0,6],[2,4],[1,7],[3,5],[0,3],[1,2]].forEach(([a,b], i) => frame.add(beamBetween(pts[a], pts[b], i < 8 ? 0.027 : 0.016, i % 4 === 0 ? gold : i % 3 === 0 ? blue : steel)));

    const triangles = new THREE.Group();
    world.add(triangles);
    [0.9, 1.45, 2.1, 2.8].forEach((size, i) => {
      const h = size * 0.75;
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-size / 2, -h / 2, 0),
        new THREE.Vector3(size / 2, -h / 2, 0),
        new THREE.Vector3(size / 2, h / 2, 0),
        new THREE.Vector3(-size / 2, -h / 2, 0),
      ]);
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: i % 2 ? 0x7eabba : 0xd6c28f, transparent: true, opacity: 0.16 - i * 0.02 }));
      line.rotation.set(i * 0.16, -0.35 + i * 0.24, i * 0.31);
      triangles.add(line);
    });

    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i += 1) {
      const a = i * 2.3999632297;
      const r = 1 + ((i * 17) % 100) / 100 * 3.5;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a * 1.3) * r * 0.55;
      positions[i * 3 + 2] = -1.2 + Math.sin(a) * r * 0.7;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe7dfcf, transparent: true, opacity: 0.34, size: 0.025, sizeAttenuation: true }));
    world.add(particles);

    scene.add(new THREE.HemisphereLight(0xe7dfcf, 0x06080a, 0.7));
    const key = new THREE.PointLight(0xd6c28f, 7, 12, 2);
    key.position.set(2.5, 2.7, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0x7eabba, 4, 10, 2);
    fill.position.set(-3, -1, 2.8);
    scene.add(fill);

    let energy = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const animate = () => {
      const t = clock.getElapsedTime();
      const target = activeRef.current ? 1 : 0;
      energy += (target - energy) * (phaseRef.current === "closing" ? 0.075 : 0.05);
      const closing = phaseRef.current === "closing";
      const opening = phaseRef.current === "opening";
      const bend = Math.sin(energy * Math.PI);

      world.rotation.y = t * 0.07 + energy * (closing ? 0.72 : -0.36);
      world.rotation.x = Math.sin(t * 0.3) * 0.04 + bend * 0.13;
      world.rotation.z = bend * -0.09;
      world.scale.setScalar(0.62 + energy * (closing ? 1.55 : 1.1));
      world.position.z = -1.1 + energy * (closing ? 2.65 : 1.2);
      frame.rotation.y = Math.sin(t * 0.25) * 0.04 + energy * 0.26;
      frame.scale.setScalar(0.92 + energy * 0.18);
      triangles.rotation.z = -t * 0.06 - energy * 0.42;
      triangles.rotation.y = t * 0.04 + energy * 0.2;
      core.rotation.x += reduced ? 0 : 0.006;
      core.rotation.y += reduced ? 0 : 0.009;
      coreWire.rotation.y -= reduced ? 0 : 0.004;
      particles.rotation.y = -t * 0.025;
      particles.scale.setScalar(1 + energy * 0.3);

      const opacity = Math.min(1, energy * 1.5);
      renderer.domElement.style.opacity = String(opacity);
      if (opening) camera.position.z += (7.8 - camera.position.z) * 0.025;
      else camera.position.z += ((closing ? 6.1 : 7.4) - camera.position.z) * 0.03;
      camera.lookAt(0, 0.05, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className={className} aria-hidden="true" />;
}
