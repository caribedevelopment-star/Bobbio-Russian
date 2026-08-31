"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  mode?: "hero" | "journey";
  step?: number;
};

const cameraStates = [
  { p: [0.3, 0.65, 11.7], t: [0.25, 0.05, -0.35], fov: 38 },
  { p: [2.25, 1.15, 9.8], t: [0.35, 0.1, -0.25], fov: 36 },
  { p: [-2.1, 0.9, 9.2], t: [-0.1, 0.15, -0.2], fov: 35 },
  { p: [0.35, 2.45, 8.85], t: [0.2, 0.15, -0.25], fov: 34 },
  { p: [2.6, 0.15, 8.7], t: [0.35, -0.05, -0.1], fov: 35 },
  { p: [-2.45, 1.35, 9.1], t: [-0.25, 0.1, -0.25], fov: 36 },
  { p: [0.15, 0.75, 11.9], t: [0, 0, -0.4], fov: 39 },
] as const;

function vector(values: readonly number[]) {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function beamBetween(a: THREE.Vector3, b: THREE.Vector3, width: number, material: THREE.Material) {
  const direction = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, width, direction.length()), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  return mesh;
}

function lineBetween(a: THREE.Vector3, b: THREE.Vector3, material: THREE.LineBasicMaterial) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), material);
}

function rectangleLines(width: number, height: number, material: THREE.LineBasicMaterial) {
  const hw = width / 2;
  const hh = height / 2;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-hw, -hh, 0),
    new THREE.Vector3(hw, -hh, 0),
    new THREE.Vector3(hw, hh, 0),
    new THREE.Vector3(-hw, hh, 0),
    new THREE.Vector3(-hw, -hh, 0),
  ]);
  return new THREE.Line(geometry, material);
}

function rightTriangle(size: number, material: THREE.LineBasicMaterial) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-size * 0.5, -size * 0.36, 0),
    new THREE.Vector3(size * 0.5, -size * 0.36, 0),
    new THREE.Vector3(size * 0.5, size * 0.39, 0),
    new THREE.Vector3(-size * 0.5, -size * 0.36, 0),
  ]);
  return new THREE.Line(geometry, material);
}

export default function HomeWorldCanvas({ className, mode = "hero", step = 0 }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const compact = window.matchMedia("(max-width: 760px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080a, compact ? 0.073 : 0.045);

    const camera = new THREE.PerspectiveCamera(compact ? 46 : 38, 1, 0.1, 80);
    camera.position.set(compact ? 0 : 0.3, compact ? 1.15 : 0.65, compact ? 12.2 : 11.7);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const frame = new THREE.Group();
    const drawing = new THREE.Group();
    const surfaces = new THREE.Group();
    const trusses = new THREE.Group();
    const atmosphere = new THREE.Group();
    world.add(frame, drawing, surfaces, trusses, atmosphere);
    scene.add(world);

    const ivory = new THREE.MeshStandardMaterial({ color: 0xe8e0d1, metalness: 0.3, roughness: 0.46, transparent: true, opacity: 0.22 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x7d858a, metalness: 0.82, roughness: 0.28, transparent: true, opacity: 0.31 });
    const champagne = new THREE.MeshStandardMaterial({ color: 0xd6c28f, metalness: 0.62, roughness: 0.26, transparent: true, opacity: 0.46, emissive: 0x302612, emissiveIntensity: 0.22 });
    const sage = new THREE.MeshStandardMaterial({ color: 0x9cab94, metalness: 0.42, roughness: 0.4, transparent: true, opacity: 0.22 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x83aab7, roughness: 0.12, transparent: true, opacity: 0.07, transmission: 0.18, side: THREE.DoubleSide });

    const warmLine = new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.22 });
    const coolLine = new THREE.LineBasicMaterial({ color: 0x7eabba, transparent: true, opacity: 0.16 });
    const faintLine = new THREE.LineBasicMaterial({ color: 0xe8e0d1, transparent: true, opacity: 0.105 });

    // Primary structural bays — a legible architectural frame, not a central object.
    const xs = [-4.25, -2.1, 0.05, 2.2, 4.35];
    const zFront = 1.15;
    const zBack = -2.1;
    const yBase = -1.65;
    const yBeam = 1.05;
    const yRoof = 2.35;

    xs.forEach((x, index) => {
      frame.add(beamBetween(new THREE.Vector3(x, yBase, zFront), new THREE.Vector3(x, yRoof, zFront), index % 2 ? 0.055 : 0.072, index === 2 ? champagne : steel));
      frame.add(beamBetween(new THREE.Vector3(x, yBase, zBack), new THREE.Vector3(x, yRoof, zBack), 0.045, ivory));
      frame.add(beamBetween(new THREE.Vector3(x, yRoof, zBack), new THREE.Vector3(x, yRoof, zFront), 0.052, index % 2 ? steel : ivory));
    });

    for (let i = 0; i < xs.length - 1; i += 1) {
      const a = xs[i];
      const b = xs[i + 1];
      frame.add(beamBetween(new THREE.Vector3(a, yRoof, zFront), new THREE.Vector3(b, yRoof, zFront), 0.07, i === 1 ? champagne : steel));
      frame.add(beamBetween(new THREE.Vector3(a, yBeam, zFront), new THREE.Vector3(b, yBeam, zFront), 0.044, ivory));
      frame.add(beamBetween(new THREE.Vector3(a, yBase, zFront), new THREE.Vector3(b, yBase, zFront), 0.035, steel));
      frame.add(beamBetween(new THREE.Vector3(a, yRoof, zBack), new THREE.Vector3(b, yRoof, zBack), 0.038, ivory));
      if (i !== 2) {
        frame.add(beamBetween(new THREE.Vector3(a, yBase, zFront), new THREE.Vector3(b, yRoof, zFront), 0.018, i % 2 ? sage : champagne));
        frame.add(beamBetween(new THREE.Vector3(a, yRoof, zFront), new THREE.Vector3(b, yBase, zFront), 0.014, ivory));
      }
    }

    // Pythagorean roof truss: repeated 3/4/5 reading without decorative circles.
    const trussBaseY = 2.45;
    for (let i = 0; i < 4; i += 1) {
      const x0 = -4.2 + i * 2.1;
      const x1 = x0 + 2.1;
      const peakX = x0 + 1.26;
      const peakY = trussBaseY + 1.15;
      trusses.add(beamBetween(new THREE.Vector3(x0, trussBaseY, -0.2), new THREE.Vector3(x1, trussBaseY, -0.2), 0.022, steel));
      trusses.add(beamBetween(new THREE.Vector3(x0, trussBaseY, -0.2), new THREE.Vector3(peakX, peakY, -0.2), 0.024, champagne));
      trusses.add(beamBetween(new THREE.Vector3(peakX, peakY, -0.2), new THREE.Vector3(x1, trussBaseY, -0.2), 0.024, ivory));
      trusses.add(beamBetween(new THREE.Vector3(peakX, peakY, -0.2), new THREE.Vector3(peakX, trussBaseY, -0.2), 0.014, sage));
    }

    // Floor / section planes represent measured surface, not sculptural mass.
    const floorA = new THREE.Mesh(new THREE.PlaneGeometry(8.55, 3.25), glass);
    floorA.rotation.x = -Math.PI / 2;
    floorA.position.set(0.05, yBase + 0.025, -0.45);
    surfaces.add(floorA);
    const floorEdges = new THREE.LineSegments(new THREE.EdgesGeometry(floorA.geometry), warmLine.clone());
    floorA.add(floorEdges);

    const mezz = new THREE.Mesh(new THREE.PlaneGeometry(4.25, 2.5), new THREE.MeshBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.035, side: THREE.DoubleSide }));
    mezz.rotation.x = -Math.PI / 2;
    mezz.position.set(1.05, yBeam + 0.035, -0.45);
    surfaces.add(mezz);
    mezz.add(new THREE.LineSegments(new THREE.EdgesGeometry(mezz.geometry), faintLine.clone()));

    const sectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(8.7, 4.7, 14, 8), new THREE.MeshBasicMaterial({ color: 0x7eabba, wireframe: true, transparent: true, opacity: 0.026, side: THREE.DoubleSide }));
    sectionPlane.position.set(0.1, 0.15, -2.55);
    drawing.add(sectionPlane);

    // Drawing axes, levels and dimension ticks floating in the same 3D field.
    [-4.25, -2.1, 0.05, 2.2, 4.35].forEach((x, i) => {
      drawing.add(lineBetween(new THREE.Vector3(x, -2.15, 1.38), new THREE.Vector3(x, 3.95, 1.38), i === 2 ? warmLine.clone() : faintLine.clone()));
      const tick = lineBetween(new THREE.Vector3(x - 0.08, -1.95, 1.42), new THREE.Vector3(x + 0.08, -1.95, 1.42), warmLine.clone());
      drawing.add(tick);
    });
    [-1.65, 1.05, 2.35, 3.6].forEach((y, i) => {
      drawing.add(lineBetween(new THREE.Vector3(-4.75, y, 1.45), new THREE.Vector3(4.75, y, 1.45), i === 1 ? coolLine.clone() : faintLine.clone()));
    });

    const dimTop = lineBetween(new THREE.Vector3(-4.25, 3.82, 1.52), new THREE.Vector3(4.35, 3.82, 1.52), warmLine.clone());
    drawing.add(dimTop);
    [-4.25, 4.35].forEach((x) => drawing.add(lineBetween(new THREE.Vector3(x, 3.68, 1.52), new THREE.Vector3(x, 3.96, 1.52), warmLine.clone())));

    const planRect = rectangleLines(5.4, 2.45, faintLine.clone());
    planRect.rotation.x = -Math.PI / 2;
    planRect.rotation.z = 0.12;
    planRect.position.set(-0.7, -1.38, 0.05);
    drawing.add(planRect);

    [1.1, 1.65, 2.2].forEach((size, i) => {
      const tri = rightTriangle(size, (i === 1 ? warmLine : i === 2 ? coolLine : faintLine).clone());
      tri.position.set(-3 + i * 2.65, 0.2 + i * 0.62, -1.3 - i * 0.35);
      tri.rotation.set(0.08 + i * 0.08, -0.22 + i * 0.16, -0.08 + i * 0.11);
      drawing.add(tri);
    });

    // Sparse drafting particles: points live around structure, never forming an orb.
    const pointCount = compact ? 70 : 150;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i += 1) {
      const bay = i % 5;
      positions[i * 3] = xs[bay] + (Math.random() - 0.5) * 1.8;
      positions[i * 3 + 1] = -1.8 + Math.random() * 5.9;
      positions[i * 3 + 2] = -2.7 + Math.random() * 4.7;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe8e0d1, size: compact ? 0.016 : 0.019, transparent: true, opacity: 0.26, sizeAttenuation: true }));
    atmosphere.add(particles);

    scene.add(new THREE.HemisphereLight(0xe8e0d1, 0x07090c, compact ? 0.72 : 0.62));
    const warm = new THREE.PointLight(0xd6c28f, compact ? 5 : 7.5, 18, 2);
    warm.position.set(3.8, 3.4, 4.6);
    scene.add(warm);
    const cool = new THREE.PointLight(0x7eabba, compact ? 3 : 4.4, 16, 2);
    cool.position.set(-4.2, 0.4, 3.2);
    scene.add(cool);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      pointer.y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let raf = 0;
    const clock = new THREE.Clock();
    const targetPosition = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    const animate = () => {
      const t = clock.getElapsedTime();
      const index = Math.max(0, Math.min(6, stepRef.current));
      const state = cameraStates[index];
      const mobileOffset = compact ? new THREE.Vector3(0, 0.45, 1.5) : new THREE.Vector3();
      targetPosition.copy(vector(state.p)).add(mobileOffset);
      targetLook.copy(vector(state.t));

      camera.position.lerp(targetPosition, reduced ? 0.2 : 0.035);
      camera.fov += ((compact ? Math.max(42, state.fov + 5) : state.fov) - camera.fov) * 0.035;
      camera.updateProjectionMatrix();

      const parallaxX = compact ? 0 : pointer.x * 0.22;
      const parallaxY = compact ? 0 : -pointer.y * 0.12;
      world.rotation.y += ((index - 3) * 0.017 + parallaxX * 0.08 - world.rotation.y) * 0.025;
      world.rotation.x += ((mode === "hero" ? -0.02 : 0.01) + parallaxY * 0.045 - world.rotation.x) * 0.025;
      world.position.x += ((index === 1 ? 0.45 : index === 2 ? -0.35 : 0) - world.position.x) * 0.02;
      world.position.y += ((index === 3 ? -0.2 : 0) - world.position.y) * 0.02;

      if (!reduced) {
        trusses.position.y = Math.sin(t * 0.42) * 0.025;
        drawing.position.z = Math.sin(t * 0.27) * 0.035;
        particles.position.x = Math.sin(t * 0.09) * 0.055;
        surfaces.rotation.z = Math.sin(t * 0.12) * 0.002;
      }

      // Each workflow phase changes the architectural reading rather than swapping decorative effects.
      const drawEnergy = index === 1 ? 1 : index === 5 ? 0.7 : 0.42;
      drawing.scale.lerp(new THREE.Vector3(0.96 + drawEnergy * 0.05, 0.96 + drawEnergy * 0.05, 1), 0.03);
      frame.scale.lerp(new THREE.Vector3(index === 2 ? 1.035 : 1, index === 2 ? 1.02 : 1, 1), 0.025);
      trusses.rotation.z += (((index === 4 ? -0.028 : 0) - trusses.rotation.z) * 0.025);
      surfaces.position.z += (((index === 2 || index === 3 ? 0.18 : 0) - surfaces.position.z) * 0.025);

      const look = targetLook.clone().add(new THREE.Vector3(parallaxX * 0.18, parallaxY * 0.12, 0));
      camera.lookAt(look);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        const item = object as THREE.Mesh;
        item.geometry?.dispose?.();
        const material = item.material as THREE.Material | THREE.Material[] | undefined;
        if (material) (Array.isArray(material) ? material : [material]).forEach((entry) => entry.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mode]);

  return <div ref={mount} className={className} aria-hidden="true" />;
}
