"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  mode?: "hero" | "journey";
  step?: number;
};

type MeshWithBase = THREE.Mesh & { userData: { base?: THREE.Vector3; phase?: number } };

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
    scene.fog = new THREE.FogExp2(0x05070a, compact ? 0.062 : 0.043);

    const camera = new THREE.PerspectiveCamera(compact ? 48 : 37, 1, 0.1, 100);
    camera.position.set(compact ? 0 : 0.75, compact ? 0.7 : 0.35, compact ? 10.2 : 11.8);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const architecture = new THREE.Group();
    const organism = new THREE.Group();
    const orbitalField = new THREE.Group();
    world.add(architecture, organism, orbitalField);
    scene.add(world);

    const ivory = new THREE.MeshPhysicalMaterial({ color: 0xece5d8, metalness: 0.08, roughness: 0.38, transparent: true, opacity: 0.19, clearcoat: 0.55, clearcoatRoughness: 0.42 });
    const stone = new THREE.MeshPhysicalMaterial({ color: 0xbeb5a6, metalness: 0.04, roughness: 0.72, transparent: true, opacity: 0.14 });
    const champagne = new THREE.MeshPhysicalMaterial({ color: 0xd6c28f, metalness: 0.46, roughness: 0.25, transparent: true, opacity: 0.38, emissive: 0x49391b, emissiveIntensity: 0.42 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x86afbc, metalness: 0.02, roughness: 0.08, transparent: true, opacity: 0.11, transmission: 0.32, thickness: 0.65 });
    const living = new THREE.MeshPhysicalMaterial({ color: 0x9cab94, metalness: 0.02, roughness: 0.46, transparent: true, opacity: 0.15, emissive: 0x172018, emissiveIntensity: 0.36, side: THREE.DoubleSide });

    const slabs: MeshWithBase[] = [];
    const slabData: Array<[number, number, number, number, number, number, number]> = [
      [4.3, 0.12, 2.05, -0.6, 1.2, 0.05, 0.14],
      [3.45, 0.11, 1.6, 0.65, 0.32, -0.4, -0.3],
      [2.8, 0.1, 1.28, -0.2, -0.72, 0.36, 0.22],
      [1.55, 0.08, 0.88, 1.55, -1.15, -0.42, -0.55],
    ];
    slabData.forEach(([w, h, d, x, y, z, ry], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), i === 1 ? glass : i === 3 ? stone : ivory) as MeshWithBase;
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      mesh.userData.base = mesh.position.clone();
      mesh.userData.phase = i * 0.8;
      architecture.add(mesh);
      slabs.push(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: i === 1 ? 0x7eabba : 0xd8cba9, transparent: true, opacity: i === 1 ? 0.31 : 0.22 }));
      mesh.add(edges);
    });

    const columns: MeshWithBase[] = [];
    [[-1.72, -0.14, 0.58], [-0.25, -0.16, -0.63], [1.34, -0.1, 0.62], [0.48, -0.2, -0.1], [1.9, -0.5, -0.64]].forEach(([x, y, z], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(i === 4 ? 0.05 : 0.075, 2.45 - i * 0.13, i === 4 ? 0.05 : 0.075), i === 2 ? champagne : ivory) as MeshWithBase;
      mesh.position.set(x, y, z);
      mesh.userData.base = mesh.position.clone();
      mesh.userData.phase = i;
      architecture.add(mesh);
      columns.push(mesh);
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(compact ? 0.42 : 0.58, 3), champagne);
    core.position.set(0.02, 0.18, 0.1);
    architecture.add(core);
    const coreCage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(compact ? 0.7 : 0.9, 2)), new THREE.LineBasicMaterial({ color: 0xe3ca8c, transparent: true, opacity: 0.24 }));
    coreCage.position.copy(core.position);
    architecture.add(coreCage);

    const sectionPlanes: THREE.Mesh[] = [];
    [
      [new THREE.PlaneGeometry(2.6, 1.3, 8, 4), -1.8, 0.2, -0.9, 0.3],
      [new THREE.PlaneGeometry(1.9, 2.4, 5, 7), 1.55, 0.25, -1.05, -0.38],
    ].forEach(([geometry, x, y, z, rz], index) => {
      const plane = new THREE.Mesh(geometry as THREE.BufferGeometry, index === 0 ? living : glass);
      plane.position.set(x as number, y as number, z as number);
      plane.rotation.set(-0.15, index === 0 ? 0.58 : -0.42, rz as number);
      architecture.add(plane);
      sectionPlanes.push(plane);
    });

    const makeCurve = (seed: number, radius: number, height: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 42; i++) {
        const p = i / 42;
        const angle = p * Math.PI * 2 + seed;
        pts.push(new THREE.Vector3(Math.cos(angle) * (radius + Math.sin(angle * 3 + seed) * 0.22), Math.sin(angle * 2 + seed) * height, Math.sin(angle) * radius * 0.54 - 0.5));
      }
      return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.7);
    };

    const tubes: THREE.Mesh[] = [];
    [0, 1.7, 3.2].forEach((seed, i) => {
      const tube = new THREE.Mesh(new THREE.TubeGeometry(makeCurve(seed, 2.1 + i * 0.42, 0.7 + i * 0.12), compact ? 70 : 110, i === 1 ? 0.018 : 0.012, 5, true), i === 1 ? living : glass);
      tube.rotation.set(0.28 + i * 0.08, -0.18 + i * 0.16, 0.18 * i);
      organism.add(tube);
      tubes.push(tube);
    });

    const membrane = new THREE.Mesh(new THREE.SphereGeometry(1.68, compact ? 18 : 30, compact ? 12 : 22), new THREE.MeshBasicMaterial({ color: 0x9cab94, wireframe: true, transparent: true, opacity: 0.035 }));
    membrane.scale.set(1.32, 0.72, 0.92);
    membrane.position.set(-0.25, -0.05, -0.9);
    organism.add(membrane);

    [2.45, 3.05, 3.72, 4.35].forEach((radius, i) => {
      const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, i === 1 ? 0.009 : 0.013, 5, compact ? 76 : 150), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7eabba : 0xd6c28f, transparent: true, opacity: 0.09 - i * 0.012 }));
      torus.rotation.set(i % 2 ? 0.62 : 1.08, i === 1 ? 0.82 : -0.28 + i * 0.13, i * 0.48);
      orbitalField.add(torus);
    });

    const grid = new THREE.GridHelper(compact ? 10 : 15, compact ? 20 : 30, 0x776d55, 0x2d3236);
    (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach((m) => { m.transparent = true; m.opacity = compact ? 0.06 : 0.09; });
    grid.position.y = -1.72;
    grid.rotation.y = 0.2;
    world.add(grid);

    const groundGeometry = new THREE.PlaneGeometry(18, 18, compact ? 18 : 34, compact ? 18 : 34);
    const groundPositions = groundGeometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < groundPositions.count; i++) {
      const x = groundPositions.getX(i);
      const y = groundPositions.getY(i);
      groundPositions.setZ(i, Math.sin(x * 0.48) * 0.12 + Math.cos(y * 0.42) * 0.1);
    }
    groundGeometry.computeVertexNormals();
    const ground = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({ color: 0x6d7669, wireframe: true, transparent: true, opacity: compact ? 0.018 : 0.028 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.76, -1.6);
    world.add(ground);

    const pointCount = compact ? 135 : 320;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const cA = new THREE.Color(0xe7dfcf), cB = new THREE.Color(0xd6c28f), cC = new THREE.Color(0x7eabba);
    for (let i = 0; i < pointCount; i++) {
      const r = 2.7 + Math.random() * (compact ? 4.4 : 6.4);
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (compact ? 5.2 : 7.4);
      positions[i * 3 + 2] = Math.sin(a) * r - 1.8;
      const mix = Math.random();
      const col = mix < 0.64 ? cA : mix < 0.84 ? cB : cC;
      colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ vertexColors: true, size: compact ? 0.018 : 0.024, transparent: true, opacity: 0.43, sizeAttenuation: true }));
    world.add(points);

    scene.add(new THREE.HemisphereLight(0xe8dfce, 0x151a20, compact ? 0.75 : 0.92));
    const warm = new THREE.PointLight(0xd6c28f, compact ? 7 : 12, 18, 2);
    warm.position.set(4.2, 4.1, 4.8);
    scene.add(warm);
    const cool = new THREE.PointLight(0x7eabba, compact ? 5 : 8, 15, 2);
    cool.position.set(-4.6, -0.1, 3.4);
    scene.add(cool);
    const green = new THREE.PointLight(0x9cab94, compact ? 3 : 5, 12, 2);
    green.position.set(-2.2, 2.8, -2.2);
    scene.add(green);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let heroScroll = 0;
    const onPointer = (event: PointerEvent) => {
      target.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      target.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    const onScroll = () => {
      if (mode !== "hero") return;
      heroScroll = Math.max(0, Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

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
      easedStep += (stepRef.current - easedStep) * 0.028;
      const phase = easedStep / 6;
      const cinematic = mode === "hero" ? heroScroll : phase;

      architecture.rotation.x = 0.3 + Math.sin(t * 0.19) * 0.035 + pointer.y * 0.045 + cinematic * 0.08;
      architecture.rotation.y = -0.5 + cinematic * 1.15 + pointer.x * 0.1;
      architecture.rotation.z = Math.sin(t * 0.14) * 0.045 - cinematic * 0.12;
      architecture.position.y = Math.sin(t * 0.26) * 0.05 + (mode === "journey" ? Math.sin(phase * Math.PI) * 0.17 : heroScroll * 0.08);
      architecture.scale.setScalar((compact ? 0.77 : 1) * (1 + Math.sin(t * 0.31) * 0.014 - cinematic * 0.025));

      slabs.forEach((mesh, i) => {
        const base = mesh.userData.base!;
        const spread = mode === "journey" ? Math.sin(phase * Math.PI * 1.04) : heroScroll * 0.28;
        mesh.position.y = base.y + spread * (i - 1.4) * 0.46 + Math.sin(t * 0.35 + i) * 0.025;
        mesh.position.z = base.z + spread * (i - 1.2) * 0.3;
      });
      columns.forEach((mesh, i) => { mesh.scale.y = 0.94 + Math.sin(t * 0.32 + i * 1.2) * 0.035 + cinematic * 0.05; });

      core.rotation.x += reduced ? 0 : 0.0024;
      core.rotation.y += reduced ? 0 : 0.0037;
      coreCage.rotation.y -= reduced ? 0 : 0.0019;
      coreCage.rotation.z += reduced ? 0 : 0.0013;
      membrane.rotation.y = -t * 0.035 + cinematic * 0.45;
      membrane.rotation.z = Math.sin(t * 0.19) * 0.12;
      organism.rotation.y = t * 0.018 - cinematic * 0.3;
      organism.rotation.x = Math.sin(t * 0.12) * 0.06;
      tubes.forEach((tube, i) => { tube.scale.setScalar(1 + Math.sin(t * (0.4 + i * 0.04) + i) * 0.018 + cinematic * (i - 1) * 0.015); });
      orbitalField.rotation.y = t * 0.016 + cinematic * 0.4;
      orbitalField.rotation.x = Math.sin(t * 0.12) * 0.08;
      points.rotation.y = -t * 0.008;
      points.rotation.z = Math.sin(t * 0.07) * 0.025;
      ground.position.z = -1.6 + Math.sin(t * 0.1) * 0.12;

      const desktopX = mode === "hero" ? 0.8 : 1.15;
      world.position.x = compact ? 0 : desktopX - cinematic * 0.25;
      world.position.y = mode === "journey" ? -0.08 : 0;
      world.rotation.y = pointer.x * 0.03;
      world.rotation.x = pointer.y * -0.012;

      const baseZ = compact ? 10.2 : mode === "hero" ? 11.8 : 11.1;
      const targetZ = baseZ - cinematic * (compact ? 0.45 : 1.05);
      camera.position.z += (targetZ - camera.position.z) * 0.025;
      camera.position.x += ((compact ? 0 : 0.72 + pointer.x * 0.28 - cinematic * 0.18) - camera.position.x) * 0.028;
      camera.position.y += ((compact ? 0.72 : 0.36 - pointer.y * 0.18 + cinematic * 0.16) - camera.position.y) * 0.028;
      camera.lookAt(new THREE.Vector3(compact ? 0 : 0.62, -0.08 + cinematic * 0.05, -0.25));

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mode]);

  return <div ref={mount} className={className} aria-hidden="true" />;
}
