"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  mode?: "hero" | "journey";
  step?: number;
};

type Beam = THREE.Mesh<THREE.BoxGeometry, THREE.Material>;

const cameraStates = [
  { p: [0.35, 0.85, 10.6], t: [0, 0.05, 0] },
  { p: [1.7, 1.05, 9.35], t: [0.35, 0.1, 0] },
  { p: [-1.55, 0.75, 8.85], t: [0.1, 0.15, 0] },
  { p: [0.1, 1.9, 8.55], t: [0, 0.1, 0] },
  { p: [1.9, 0.25, 8.35], t: [0.25, -0.05, 0] },
  { p: [-1.7, 1.2, 8.7], t: [-0.1, 0.05, 0] },
  { p: [0.05, 0.75, 10.9], t: [0, 0, 0] },
] as const;

function v3(values: readonly number[]) {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function beamBetween(a: THREE.Vector3, b: THREE.Vector3, width: number, material: THREE.Material): Beam {
  const direction = b.clone().sub(a);
  const length = direction.length();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, width, length), material) as Beam;
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
  return mesh;
}

function triangleLine(size: number, color: number, opacity: number) {
  const h = size * 0.75;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-size * 0.5, -h * 0.5, 0),
    new THREE.Vector3(size * 0.5, -h * 0.5, 0),
    new THREE.Vector3(size * 0.5, h * 0.5, 0),
    new THREE.Vector3(-size * 0.5, -h * 0.5, 0),
  ]);
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

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
    scene.fog = new THREE.FogExp2(0x07090c, compact ? 0.075 : 0.047);

    const camera = new THREE.PerspectiveCamera(compact ? 47 : 38, 1, 0.1, 90);
    camera.position.set(compact ? 0.1 : 0.35, compact ? 1.05 : 0.85, compact ? 10.2 : 10.6);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.3 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const architecture = new THREE.Group();
    const structure = new THREE.Group();
    const trusses = new THREE.Group();
    const diagrams = new THREE.Group();
    const atmosphere = new THREE.Group();
    scene.add(world);
    world.add(atmosphere, structure, architecture, trusses, diagrams);

    const ivory = new THREE.MeshPhysicalMaterial({ color: 0xe7dfcf, metalness: 0.12, roughness: 0.42, transparent: true, opacity: 0.15, clearcoat: 0.42, clearcoatRoughness: 0.48 });
    const champagne = new THREE.MeshPhysicalMaterial({ color: 0xd6c28f, metalness: 0.36, roughness: 0.3, transparent: true, opacity: 0.34, emissive: 0x3f3218, emissiveIntensity: 0.32 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x86afbc, metalness: 0.04, roughness: 0.1, transparent: true, opacity: 0.09, transmission: 0.18 });
    const darkSteel = new THREE.MeshStandardMaterial({ color: 0x596066, metalness: 0.72, roughness: 0.34, transparent: true, opacity: 0.24 });
    const sageSteel = new THREE.MeshStandardMaterial({ color: 0x9cab94, metalness: 0.5, roughness: 0.38, transparent: true, opacity: 0.2 });

    // Architectural slabs / massing.
    const slabData: Array<[number, number, number, number, number, number, number]> = [
      [3.8, 0.1, 1.7, -0.72, 1.06, 0.04, 0.15],
      [3.12, 0.1, 1.42, 0.5, 0.24, -0.25, -0.26],
      [2.55, 0.1, 1.12, -0.14, -0.68, 0.42, 0.23],
      [1.62, 0.08, 0.72, 0.92, -1.05, -0.62, -0.15],
    ];
    const slabs: THREE.Mesh[] = [];
    slabData.forEach(([w, h, d, x, y, z, ry], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), i === 1 ? glass : i === 3 ? champagne : ivory);
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      architecture.add(mesh);
      slabs.push(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: i === 1 ? 0x7eabba : 0xd8cba9, transparent: true, opacity: 0.2 }));
      mesh.add(edges);
    });

    // Vertical cores and columns.
    const columns: THREE.Mesh[] = [];
    [[-1.54, -0.05, 0.52], [0.12, -0.16, -0.58], [1.28, -0.06, 0.54], [-0.5, -0.18, -0.24], [0.82, -0.2, 0.08]].forEach(([x, y, z], i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(i === 4 ? 0.11 : 0.07, 2.3 - i * 0.11, i === 4 ? 0.11 : 0.07), i === 2 ? champagne : i === 4 ? sageSteel : ivory);
      mesh.position.set(x, y, z);
      architecture.add(mesh);
      columns.push(mesh);
    });

    // Structural frame: beams + braces. This stays visible behind the organic layer.
    const frameA = [
      new THREE.Vector3(-3.6, -1.7, -2.25), new THREE.Vector3(3.45, -1.7, -2.25),
      new THREE.Vector3(-3.6, 2.35, -2.25), new THREE.Vector3(3.45, 2.35, -2.25),
      new THREE.Vector3(-3.6, -1.7, 1.5), new THREE.Vector3(3.45, -1.7, 1.5),
      new THREE.Vector3(-3.6, 2.35, 1.5), new THREE.Vector3(3.45, 2.35, 1.5),
    ];
    const edgePairs = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
    edgePairs.forEach(([a,b], i) => structure.add(beamBetween(frameA[a], frameA[b], i < 4 ? 0.045 : 0.032, i % 3 === 0 ? darkSteel : ivory)));
    [[0,3],[1,2],[4,7],[5,6],[0,6],[2,4],[1,7],[3,5]].forEach(([a,b], i) => {
      const brace = beamBetween(frameA[a], frameA[b], 0.018, i % 2 ? sageSteel : champagne);
      brace.material.transparent = true;
      structure.add(brace);
    });

    // A suspended truss line, referencing architectural sections rather than generic sci-fi rings.
    const trussPts = [
      new THREE.Vector3(-3.25, 1.65, -0.8),
      new THREE.Vector3(-1.7, 2.6, -0.8),
      new THREE.Vector3(0, 1.78, -0.8),
      new THREE.Vector3(1.65, 2.5, -0.8),
      new THREE.Vector3(3.2, 1.55, -0.8),
    ];
    for (let i = 0; i < trussPts.length - 1; i += 1) {
      trusses.add(beamBetween(trussPts[i], trussPts[i + 1], 0.026, champagne));
      const baseA = new THREE.Vector3(trussPts[i].x, 0.92, trussPts[i].z);
      const baseB = new THREE.Vector3(trussPts[i + 1].x, 0.92, trussPts[i + 1].z);
      trusses.add(beamBetween(baseA, baseB, 0.018, darkSteel));
      trusses.add(beamBetween(trussPts[i], baseB, 0.014, ivory));
      trusses.add(beamBetween(baseA, trussPts[i + 1], 0.014, sageSteel));
    }

    // Pythagorean / section diagrams float through the world like construction geometry.
    [1.2, 1.75, 2.45].forEach((size, i) => {
      const tri = triangleLine(size, i === 1 ? 0xd6c28f : i === 2 ? 0x7eabba : 0xe7dfcf, 0.11 - i * 0.018);
      tri.position.set(-3.1 + i * 2.8, -0.15 + i * 0.75, -1.4 - i * 0.55);
      tri.rotation.set(0.2 + i * 0.18, -0.35 + i * 0.31, -0.12 + i * 0.21);
      diagrams.add(tri);
    });

    const sectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 4.2, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7eabba, wireframe: true, transparent: true, opacity: 0.035 }));
    sectionPlane.position.set(0.5, 0.25, -2.7);
    sectionPlane.rotation.y = -0.14;
    diagrams.add(sectionPlane);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(compact ? 0.4 : 0.52, 3), champagne);
    core.position.set(0.02, 0.2, 0.12);
    architecture.add(core);
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(compact ? 0.67 : 0.82, 2)), new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.2 }));
    cage.position.copy(core.position);
    architecture.add(cage);

    // Sparse sectional curves instead of repeated perfect circles.
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.08 });
    const coolCurveMaterial = new THREE.LineBasicMaterial({ color: 0x7eabba, transparent: true, opacity: 0.06 });
    const curves: THREE.Line[] = [];
    for (let i = 0; i < 5; i += 1) {
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j < 56; j += 1) {
        const u = j / 55;
        const angle = u * Math.PI * 2;
        const r = 2.5 + i * 0.36 + Math.sin(angle * (2 + (i % 3)) + i) * 0.18;
        pts.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * (1.18 + i * 0.05), Math.sin(angle * 1.4 + i) * 0.72 - 0.9));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), i % 2 ? coolCurveMaterial.clone() : curveMaterial.clone());
      line.rotation.set(0.38 + i * 0.08, -0.2 + i * 0.11, i * 0.19);
      atmosphere.add(line);
      curves.push(line);
    }

    const grid = new THREE.GridHelper(compact ? 9 : 13, compact ? 18 : 26, 0x756b52, 0x34383b);
    (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach((m) => { m.transparent = true; m.opacity = compact ? 0.06 : 0.085; });
    grid.position.y = -1.58;
    grid.rotation.y = 0.22;
    atmosphere.add(grid);

    const pointsCount = compact ? 90 : 185;
    const positions = new Float32Array(pointsCount * 3);
    const scales = new Float32Array(pointsCount);
    for (let i = 0; i < pointsCount; i += 1) {
      const r = 2.2 + Math.random() * (compact ? 4.4 : 6.3);
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (compact ? 4.7 : 6.5);
      positions[i * 3 + 2] = Math.sin(a) * r - 1.5;
      scales[i] = Math.random();
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    const points = new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ color: 0xe7dfcf, size: compact ? 0.018 : 0.021, transparent: true, opacity: 0.31, sizeAttenuation: true }));
    atmosphere.add(points);

    scene.add(new THREE.HemisphereLight(0xe9e1d2, 0x0d1115, compact ? 0.7 : 0.62));
    const warm = new THREE.PointLight(0xd6c28f, compact ? 6.5 : 9.5, 18, 2);
    warm.position.set(4.2, 3.5, 4.8);
    scene.add(warm);
    const cool = new THREE.PointLight(0x7eabba, compact ? 4 : 5.8, 15, 2);
    cool.position.set(-4.8, -0.4, 2.4);
    scene.add(cool);
    const sage = new THREE.PointLight(0x9cab94, 3.2, 13, 2);
    sage.position.set(0.2, -3.5, 1.8);
    scene.add(sage);

    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      targetPointer.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetPointer.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
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
    const lookTarget = new THREE.Vector3();

    const animate = () => {
      const t = clock.getElapsedTime();
      pointer.x += (targetPointer.x - pointer.x) * 0.035;
      pointer.y += (targetPointer.y - pointer.y) * 0.035;
      easedStep += (stepRef.current - easedStep) * 0.03;
      const bounded = Math.max(0, Math.min(6, easedStep));
      const floor = Math.floor(bounded);
      const ceil = Math.min(6, floor + 1);
      const mix = bounded - floor;
      const phase = bounded / 6;

      architecture.rotation.x = 0.28 + Math.sin(t * 0.19) * 0.026 + pointer.y * 0.025;
      architecture.rotation.y = -0.38 + phase * 1.05 + pointer.x * 0.055;
      architecture.rotation.z = Math.sin(t * 0.13) * 0.028;
      architecture.scale.setScalar((compact ? 0.76 : 0.93) * (1 + Math.sin(t * 0.34) * 0.009));

      slabs.forEach((mesh, i) => {
        const spread = mode === "journey" ? Math.sin(phase * Math.PI) : 0.1;
        mesh.position.y = slabData[i][4] + spread * (i - 1.4) * 0.48;
        mesh.position.z = slabData[i][5] + Math.sin(t * 0.37 + i) * 0.025 + phase * (i - 1.2) * 0.2;
      });
      columns.forEach((mesh, i) => { mesh.scale.y = 0.94 + Math.sin(t * 0.31 + i) * 0.025 + phase * 0.035; });

      structure.rotation.y = -0.08 + Math.sin(t * 0.07) * 0.025 - phase * 0.14;
      structure.position.z = -0.45 + Math.sin(t * 0.11) * 0.06;
      trusses.position.y = Math.sin(t * 0.17) * 0.06 - phase * 0.15;
      trusses.rotation.y = Math.sin(t * 0.09) * 0.04;
      diagrams.rotation.y = t * 0.008 + phase * 0.18;
      diagrams.rotation.x = Math.sin(t * 0.12) * 0.035;
      curves.forEach((line, i) => {
        line.rotation.z += reduced ? 0 : (i % 2 ? -0.00022 : 0.00018);
        line.scale.setScalar(1 + Math.sin(t * 0.2 + i * 0.7) * 0.012);
      });
      points.rotation.y = -t * 0.006;
      grid.position.z = Math.sin(t * 0.1) * 0.06;
      core.rotation.x += reduced ? 0 : 0.0022;
      core.rotation.y += reduced ? 0 : 0.0032;
      cage.rotation.y -= reduced ? 0 : 0.0018;
      cage.rotation.z += reduced ? 0 : 0.0012;

      const heroShift = compact ? 0 : 0.2;
      world.position.x = mode === "hero" ? heroShift : compact ? 0 : 0.15;
      world.position.y = mode === "journey" ? -0.05 : 0;
      world.rotation.y = pointer.x * 0.018;
      world.rotation.x = pointer.y * -0.01;

      if (mode === "journey") {
        const a = cameraStates[floor];
        const b = cameraStates[ceil];
        const pos = v3(a.p).lerp(v3(b.p), mix);
        const tar = v3(a.t).lerp(v3(b.t), mix);
        pos.x += pointer.x * (compact ? 0.08 : 0.22);
        pos.y -= pointer.y * (compact ? 0.06 : 0.16);
        camera.position.lerp(pos, 0.045);
        lookTarget.lerp(tar, 0.05);
      } else {
        const desired = new THREE.Vector3(compact ? 0.1 : 0.35 + pointer.x * 0.18, compact ? 1.05 : 0.85 - pointer.y * 0.13, compact ? 10.2 : 10.6);
        camera.position.lerp(desired, 0.04);
        lookTarget.lerp(new THREE.Vector3(compact ? 0 : 0.18, 0.05, 0), 0.05);
      }
      camera.lookAt(lookTarget);

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
