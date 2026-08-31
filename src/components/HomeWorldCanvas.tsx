"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  mode?: "hero" | "journey";
  step?: number;
};

export default function HomeWorldCanvas({ className, mode = "hero", step = 0 }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 760px)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090c, compact ? 0.075 : 0.055);

    const camera = new THREE.PerspectiveCamera(compact ? 46 : 39, 1, 0.1, 80);
    camera.position.set(compact ? 0.2 : 1.1, compact ? 1.1 : 0.7, compact ? 9.6 : 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.35 : 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const architecture = new THREE.Group();
    world.add(architecture);

    const ivory = new THREE.MeshPhysicalMaterial({
      color: 0xe7dfcf,
      metalness: 0.12,
      roughness: 0.42,
      transparent: true,
      opacity: 0.16,
      clearcoat: 0.4,
      clearcoatRoughness: 0.48,
    });
    const champagne = new THREE.MeshPhysicalMaterial({
      color: 0xd6c28f,
      metalness: 0.38,
      roughness: 0.32,
      transparent: true,
      opacity: 0.3,
      emissive: 0x3f3218,
      emissiveIntensity: 0.28,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x86afbc,
      metalness: 0.05,
      roughness: 0.12,
      transparent: true,
      opacity: 0.105,
      transmission: 0.15,
    });

    const slabs: THREE.Mesh[] = [];
    const slabData: Array<[number, number, number, number, number, number]> = [
      [3.7, 0.12, 1.8, -0.65, 1.05, 0.15],
      [3.05, 0.11, 1.45, 0.55, 0.25, -0.28],
      [2.5, 0.1, 1.15, -0.05, -0.65, 0.42],
    ];
    slabData.forEach(([w, h, d, x, y, z], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), i === 1 ? glass : ivory);
      mesh.position.set(x, y, z);
      mesh.rotation.y = i === 1 ? -0.28 : 0.18;
      architecture.add(mesh);
      slabs.push(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: i === 1 ? 0x7eabba : 0xd8cba9, transparent: true, opacity: 0.22 })
      );
      mesh.add(edges);
    });

    const columns: THREE.Mesh[] = [];
    [[-1.5, -0.15, 0.5], [0.15, -0.2, -0.6], [1.25, -0.1, 0.55], [-0.4, -0.2, -0.2]].forEach(([x, y, z], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.075, 2.25 - i * 0.12, 0.075), i === 2 ? champagne : ivory);
      mesh.position.set(x, y, z);
      architecture.add(mesh);
      columns.push(mesh);
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(compact ? 0.42 : 0.55, 2), champagne);
    core.position.set(0, 0.2, 0.15);
    architecture.add(core);

    const cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(compact ? 0.68 : 0.84, 1)),
      new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.21 })
    );
    cage.position.copy(core.position);
    architecture.add(cage);

    const rings = new THREE.Group();
    world.add(rings);
    [2.3, 2.85, 3.4].forEach((radius, i) => {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(radius, i === 1 ? 0.008 : 0.012, 6, compact ? 80 : 140),
        new THREE.MeshBasicMaterial({ color: i === 1 ? 0x7eabba : 0xd6c28f, transparent: true, opacity: 0.085 - i * 0.012 })
      );
      torus.rotation.set(i === 0 ? 1.05 : 0.55, i === 1 ? 0.8 : -0.34, i * 0.45);
      rings.add(torus);
    });

    const grid = new THREE.GridHelper(compact ? 9 : 12, compact ? 18 : 24, 0x756b52, 0x33373a);
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => {
      material.transparent = true;
      material.opacity = compact ? 0.075 : 0.1;
    });
    grid.position.y = -1.55;
    grid.rotation.y = 0.2;
    world.add(grid);

    const pointsCount = compact ? 105 : 210;
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i += 1) {
      const r = 2.5 + Math.random() * (compact ? 4 : 5.5);
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (compact ? 5 : 6);
      positions[i * 3 + 2] = Math.sin(a) * r - 1.5;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({ color: 0xe7dfcf, size: compact ? 0.018 : 0.022, transparent: true, opacity: 0.38, sizeAttenuation: true })
    );
    world.add(points);

    scene.add(new THREE.AmbientLight(0xe7dfcf, compact ? 0.85 : 0.7));
    const warm = new THREE.PointLight(0xd6c28f, compact ? 8 : 11, 16, 2);
    warm.position.set(3.8, 3.2, 4.5);
    scene.add(warm);
    const cool = new THREE.PointLight(0x7eabba, compact ? 5 : 7, 13, 2);
    cool.position.set(-4.5, -0.2, 2.8);
    scene.add(cool);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      target.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      target.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    let easedStep = stepRef.current;

    const animate = () => {
      const t = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.035;
      pointer.y += (target.y - pointer.y) * 0.035;
      easedStep += (stepRef.current - easedStep) * 0.035;

      const phase = easedStep / 6;
      architecture.rotation.x = 0.34 + Math.sin(t * 0.21) * 0.035 + pointer.y * 0.04;
      architecture.rotation.y = -0.54 + phase * 1.2 + pointer.x * 0.08;
      architecture.rotation.z = Math.sin(t * 0.16) * 0.045;
      architecture.position.y = mode === "hero" ? 0.15 : Math.sin(phase * Math.PI) * 0.16;
      architecture.scale.setScalar((compact ? 0.78 : 1) * (1 + Math.sin(t * 0.35) * 0.012));

      slabs.forEach((mesh, i) => {
        const spread = mode === "journey" ? Math.sin(phase * Math.PI * 1.05) : 0.16;
        mesh.position.y = slabData[i][4] + spread * (i - 1) * 0.52;
        mesh.position.z = slabData[i][5] + Math.sin(t * 0.42 + i) * 0.035 + phase * (i - 1) * 0.24;
      });
      columns.forEach((mesh, i) => {
        mesh.scale.y = 0.92 + Math.sin(t * 0.36 + i * 1.3) * 0.04 + phase * 0.05;
      });

      core.rotation.x += reduced ? 0 : 0.0026;
      core.rotation.y += reduced ? 0 : 0.0038;
      cage.rotation.y -= reduced ? 0 : 0.0022;
      cage.rotation.z += reduced ? 0 : 0.0015;
      rings.rotation.y = t * 0.018 + phase * 0.35;
      rings.rotation.x = Math.sin(t * 0.15) * 0.06;
      points.rotation.y = -t * 0.012;
      grid.position.z = Math.sin(t * 0.12) * 0.08;

      const mobileShift = compact ? 0 : 0.6;
      world.position.x = mode === "hero" ? mobileShift : compact ? 0 : 1.05;
      world.position.y = mode === "journey" ? -0.1 : 0;
      world.rotation.y = pointer.x * 0.025;

      camera.position.x += ((compact ? 0.15 : 0.9 + pointer.x * 0.26) - camera.position.x) * 0.03;
      camera.position.y += ((compact ? 0.95 : 0.75 - pointer.y * 0.18) - camera.position.y) * 0.03;
      camera.lookAt(mode === "hero" ? new THREE.Vector3(compact ? 0 : 0.75, 0, 0) : new THREE.Vector3(compact ? 0 : 0.85, 0, 0));

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mode]);

  return <div ref={mount} className={className} aria-hidden="true" />;
}
