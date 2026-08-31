"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { className?: string; mode?: "hero" | "journey"; step?: number };

type Beam = THREE.Mesh<THREE.BoxGeometry, THREE.Material>;

type CameraState = { position: [number, number, number]; target: [number, number, number]; fov: number };

const cameraStates: CameraState[] = [
  { position: [1.25, 1.25, 11.8], target: [0.45, 0.15, -0.2], fov: 38 },
  { position: [2.45, 1.0, 10.2], target: [0.3, 0.05, -0.45], fov: 36 },
  { position: [-2.05, 1.45, 9.6], target: [0.15, 0.2, -0.35], fov: 37 },
  { position: [0.45, 2.65, 9.2], target: [0.1, 0.4, -0.5], fov: 39 },
  { position: [2.75, 0.3, 8.9], target: [0.4, -0.05, -0.45], fov: 38 },
  { position: [-2.4, 1.05, 9.3], target: [-0.2, 0.15, -0.55], fov: 37 },
  { position: [0.2, 1.05, 12.4], target: [0.1, 0.15, -0.6], fov: 39 },
];

function vec(values: readonly number[]) {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function beamBetween(a: THREE.Vector3, b: THREE.Vector3, width: number, material: THREE.Material): Beam {
  const direction = b.clone().sub(a);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(width, width, direction.length()), material) as Beam;
  beam.position.copy(a).add(b).multiplyScalar(0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
  return beam;
}

function line(points: THREE.Vector3[], color: number, opacity: number) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function dimensionLine(a: THREE.Vector3, b: THREE.Vector3, tick: THREE.Vector3, color: number) {
  const group = new THREE.Group();
  group.add(line([a, b], color, 0.2));
  const tickA = tick.clone().multiplyScalar(0.12);
  const tickB = tick.clone().multiplyScalar(-0.12);
  group.add(line([a.clone().add(tickA), a.clone().add(tickB)], color, 0.28));
  group.add(line([b.clone().add(tickA), b.clone().add(tickB)], color, 0.28));
  return group;
}

function pythagoreanDiagram(size: number, color: number, opacity: number) {
  const h = size * 0.72;
  const a = new THREE.Vector3(-size * 0.5, -h * 0.5, 0);
  const b = new THREE.Vector3(size * 0.5, -h * 0.5, 0);
  const c = new THREE.Vector3(size * 0.5, h * 0.5, 0);
  const group = new THREE.Group();
  group.add(line([a, b, c, a], color, opacity));
  group.add(line([new THREE.Vector3(size * 0.31, -h * 0.5, 0), new THREE.Vector3(size * 0.31, -h * 0.31, 0), new THREE.Vector3(size * 0.5, -h * 0.31, 0)], color, opacity * 0.75));
  return group;
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
    scene.fog = new THREE.FogExp2(0x06080a, compact ? 0.078 : 0.045);

    const camera = new THREE.PerspectiveCamera(compact ? 47 : 38, 1, 0.1, 100);
    camera.position.set(compact ? 0.15 : 1.25, compact ? 1.35 : 1.25, compact ? 11.2 : 11.8);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const primary = new THREE.Group();
    const secondary = new THREE.Group();
    const drawings = new THREE.Group();
    const dimensions = new THREE.Group();
    const atmosphere = new THREE.Group();
    scene.add(world);
    world.add(atmosphere, secondary, primary, drawings, dimensions);

    const ivory = new THREE.MeshStandardMaterial({ color: 0xe9e2d6, metalness: 0.18, roughness: 0.42, transparent: true, opacity: 0.2 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x69737a, metalness: 0.78, roughness: 0.28, transparent: true, opacity: 0.33 });
    const champagne = new THREE.MeshStandardMaterial({ color: 0xd6c28f, metalness: 0.48, roughness: 0.32, transparent: true, opacity: 0.42, emissive: 0x352a15, emissiveIntensity: 0.18 });
    const sage = new THREE.MeshStandardMaterial({ color: 0x9cab94, metalness: 0.36, roughness: 0.42, transparent: true, opacity: 0.22 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x89aab2, roughness: 0.16, transmission: 0.2, transparent: true, opacity: 0.075, side: THREE.DoubleSide });

    // Three structural bays: this is the visual anchor of the whole Home.
    const bayX = [-2.9, 0, 2.9];
    const zFront = 0.9;
    const zBack = -2.45;
    const floor = -1.65;
    const roof = 2.15;

    bayX.forEach((x, index) => {
      const mat = index === 1 ? champagne : steel;
      primary.add(beamBetween(new THREE.Vector3(x, floor, zFront), new THREE.Vector3(x, roof, zFront), index === 1 ? 0.065 : 0.045, mat));
      primary.add(beamBetween(new THREE.Vector3(x, floor, zBack), new THREE.Vector3(x, roof, zBack), 0.038, index === 2 ? sage : ivory));
      primary.add(beamBetween(new THREE.Vector3(x, roof, zFront), new THREE.Vector3(x, roof, zBack), 0.044, mat));
    });

    for (let i = 0; i < bayX.length - 1; i += 1) {
      const xA = bayX[i];
      const xB = bayX[i + 1];
      primary.add(beamBetween(new THREE.Vector3(xA, roof, zFront), new THREE.Vector3(xB, roof, zFront), 0.055, i === 0 ? champagne : steel));
      primary.add(beamBetween(new THREE.Vector3(xA, floor, zFront), new THREE.Vector3(xB, floor, zFront), 0.035, ivory));
      primary.add(beamBetween(new THREE.Vector3(xA, roof, zBack), new THREE.Vector3(xB, roof, zBack), 0.032, sage));
      primary.add(beamBetween(new THREE.Vector3(xA, floor, zBack), new THREE.Vector3(xB, floor, zBack), 0.028, steel));
      primary.add(beamBetween(new THREE.Vector3(xA, floor, zFront), new THREE.Vector3(xB, roof, zFront), 0.018, i === 0 ? sage : champagne));
      primary.add(beamBetween(new THREE.Vector3(xA, roof, zFront), new THREE.Vector3(xB, floor, zFront), 0.015, steel));
    }

    // Roof truss / pitched section.
    const trussBaseY = 2.15;
    const trussTopY = 3.15;
    const roofNodes = [
      new THREE.Vector3(-3.5, trussBaseY, -1.15),
      new THREE.Vector3(-1.75, trussTopY, -1.15),
      new THREE.Vector3(0, trussBaseY + 0.28, -1.15),
      new THREE.Vector3(1.75, trussTopY - 0.12, -1.15),
      new THREE.Vector3(3.55, trussBaseY, -1.15),
    ];
    for (let i = 0; i < roofNodes.length - 1; i += 1) {
      secondary.add(beamBetween(roofNodes[i], roofNodes[i + 1], 0.025, i % 2 ? champagne : steel));
      const baseA = new THREE.Vector3(roofNodes[i].x, trussBaseY, -1.15);
      const baseB = new THREE.Vector3(roofNodes[i + 1].x, trussBaseY, -1.15);
      secondary.add(beamBetween(baseA, baseB, 0.015, ivory));
      secondary.add(beamBetween(baseA, roofNodes[i + 1], 0.012, sage));
    }

    // Cantilevered floor plates and wall fragments.
    const slabData: Array<[number, number, number, number, number, number, number]> = [
      [3.5, 0.075, 1.45, -1.05, 0.72, -0.25, 0.06],
      [2.75, 0.065, 1.18, 0.82, -0.15, -0.52, -0.09],
      [1.85, 0.055, 0.85, 1.7, -0.92, 0.08, 0.17],
    ];
    const slabs: THREE.Mesh[] = [];
    slabData.forEach(([w, h, d, x, y, z, ry], index) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), index === 1 ? glass : index === 2 ? champagne : ivory);
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      primary.add(mesh);
      slabs.push(mesh);
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: index === 1 ? 0x7eabba : 0xd6c28f, transparent: true, opacity: 0.22 })));
    });

    const sectionWall = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.7, 7, 5), glass);
    sectionWall.position.set(-1.65, 0.35, -1.85);
    sectionWall.rotation.y = 0.12;
    primary.add(sectionWall);

    // Stair / circulation line as an architectural section, not a decorative orbit.
    const stairPts: THREE.Vector3[] = [];
    for (let i = 0; i < 9; i += 1) {
      stairPts.push(new THREE.Vector3(-2.35 + i * 0.42, -1.15 + i * 0.24, 0.45));
      stairPts.push(new THREE.Vector3(-1.95 + i * 0.42, -1.15 + i * 0.24, 0.45));
    }
    for (let i = 0; i < stairPts.length - 1; i += 2) {
      secondary.add(beamBetween(stairPts[i], stairPts[i + 1], 0.018, champagne));
      if (i + 2 < stairPts.length) secondary.add(beamBetween(stairPts[i + 1], stairPts[i + 2], 0.014, steel));
    }

    // Drawings floating in depth: section, elevation and Pythagorean construction.
    const elevation = new THREE.Group();
    const elevationY = [-1.2, -0.2, 0.8, 1.8];
    elevationY.forEach((y, i) => elevation.add(line([new THREE.Vector3(-2.8, y, 0), new THREE.Vector3(2.8, y, 0)], i === 2 ? 0xd6c28f : 0xe7dfcf, i === 2 ? 0.16 : 0.07)));
    [-2.4, -0.8, 0.6, 2.25].forEach((x) => elevation.add(line([new THREE.Vector3(x, -1.35, 0), new THREE.Vector3(x, 2.0, 0)], 0xe7dfcf, 0.065)));
    elevation.position.set(0.9, 0.05, -3.45);
    elevation.rotation.y = -0.12;
    drawings.add(elevation);

    const triangleA = pythagoreanDiagram(2.0, 0xd6c28f, 0.15);
    triangleA.position.set(-3.4, 1.0, -2.75);
    triangleA.rotation.set(0.08, 0.14, -0.09);
    drawings.add(triangleA);

    const triangleB = pythagoreanDiagram(1.1, 0x7eabba, 0.12);
    triangleB.position.set(3.45, -0.55, -2.9);
    triangleB.rotation.set(-0.08, -0.22, 0.18);
    drawings.add(triangleB);

    // Architectural dimension lines / ticks in 3D.
    dimensions.add(dimensionLine(new THREE.Vector3(-3.5, -2.12, 1.2), new THREE.Vector3(3.55, -2.12, 1.2), new THREE.Vector3(0, 1, 0), 0xd6c28f));
    dimensions.add(dimensionLine(new THREE.Vector3(3.95, -1.65, 0.95), new THREE.Vector3(3.95, 2.15, 0.95), new THREE.Vector3(1, 0, 0), 0x7eabba));
    dimensions.add(dimensionLine(new THREE.Vector3(-3.75, 2.55, -2.45), new THREE.Vector3(3.75, 2.55, -2.45), new THREE.Vector3(0, 1, 0), 0xe7dfcf));

    // Datum / grid crossing the structure.
    const datumMat = new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.08 });
    const datum = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-6, 0, -0.8), new THREE.Vector3(6, 0, -0.8),
        new THREE.Vector3(0, -4, -0.8), new THREE.Vector3(0, 4, -0.8),
      ]), datumMat,
    );
    drawings.add(datum);

    // Sparse drafting points: no spherical centerpiece, just depth and drawing dust.
    const pointCount = compact ? 72 : 150;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i += 1) {
      const u = (i * 0.61803398875) % 1;
      const v = (i * 0.41421356237) % 1;
      positions[i * 3] = (u - 0.5) * 10.5;
      positions[i * 3 + 1] = (v - 0.5) * 6.8;
      positions[i * 3 + 2] = -3.8 + ((i * 19) % 100) / 100 * 5.2;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: 0xe7dfcf, transparent: true, opacity: 0.24, size: compact ? 0.015 : 0.019, sizeAttenuation: true }));
    atmosphere.add(points);

    // Construction floor grid, cropped by fog and camera rather than acting as a wallpaper.
    const grid = new THREE.GridHelper(compact ? 9 : 14, compact ? 18 : 28, 0x8b7c58, 0x30363a);
    (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach((material) => {
      material.transparent = true;
      material.opacity = compact ? 0.045 : 0.065;
    });
    grid.position.y = -1.67;
    grid.rotation.y = -0.08;
    atmosphere.add(grid);

    scene.add(new THREE.HemisphereLight(0xe9e2d6, 0x07090c, compact ? 0.65 : 0.58));
    const warm = new THREE.PointLight(0xd6c28f, compact ? 6 : 8.5, 18, 2);
    warm.position.set(4.1, 3.5, 4.6);
    scene.add(warm);
    const cool = new THREE.PointLight(0x7eabba, compact ? 3.8 : 5.5, 16, 2);
    cool.position.set(-4.3, 0.2, 3.2);
    scene.add(cool);

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
    let cameraTarget = new THREE.Vector3();

    const animate = () => {
      const t = clock.getElapsedTime();
      pointer.x += (targetPointer.x - pointer.x) * 0.035;
      pointer.y += (targetPointer.y - pointer.y) * 0.035;
      easedStep += (stepRef.current - easedStep) * 0.045;

      const stateIndex = Math.max(0, Math.min(cameraStates.length - 1, Math.round(easedStep)));
      const state = cameraStates[stateIndex];
      const desiredPosition = compact
        ? new THREE.Vector3(0.2 + pointer.x * 0.12, 1.35 - pointer.y * 0.1, 11.1)
        : vec(state.position).add(new THREE.Vector3(pointer.x * 0.18, -pointer.y * 0.13, 0));
      const desiredTarget = compact ? new THREE.Vector3(0, 0.12, -0.5) : vec(state.target);

      camera.position.lerp(desiredPosition, 0.026);
      cameraTarget.lerp(desiredTarget, 0.04);
      camera.fov += ((compact ? 47 : state.fov) - camera.fov) * 0.03;
      camera.updateProjectionMatrix();
      camera.lookAt(cameraTarget);

      const phase = easedStep / 6;
      world.position.x = compact ? 0 : mode === "hero" ? 0.85 : 0.45;
      world.position.y = compact ? -0.15 : -0.08;
      world.rotation.y = (mode === "hero" ? -0.08 : -0.03) + pointer.x * 0.018 + Math.sin(t * 0.09) * 0.01;
      world.rotation.x = pointer.y * 0.01;

      primary.position.y = Math.sin(t * 0.22) * 0.025;
      primary.rotation.y = Math.sin(t * 0.12) * 0.008 + phase * 0.04;
      secondary.position.x = Math.sin(t * 0.17) * 0.035;
      secondary.rotation.z = Math.sin(t * 0.14) * 0.007;
      drawings.position.z = Math.sin(t * 0.16) * 0.055 - phase * 0.2;
      drawings.rotation.y = Math.sin(t * 0.11) * 0.012;
      dimensions.position.y = Math.sin(t * 0.19) * 0.025;
      points.rotation.y = -t * 0.004;

      slabs.forEach((mesh, index) => {
        const baseY = slabData[index][4];
        mesh.position.y = baseY + Math.sin(t * 0.28 + index * 1.6) * 0.025 + (mode === "journey" ? Math.sin(phase * Math.PI) * (index - 1) * 0.12 : 0);
      });

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
