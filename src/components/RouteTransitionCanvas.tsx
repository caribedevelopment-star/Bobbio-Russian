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

function portal(width: number, height: number, depth: number, material: THREE.Material, brace: THREE.Material) {
  const group = new THREE.Group();
  const leftBottom = new THREE.Vector3(-width / 2, -height / 2, 0);
  const leftTop = new THREE.Vector3(-width / 2, height / 2, 0);
  const rightBottom = new THREE.Vector3(width / 2, -height / 2, 0);
  const rightTop = new THREE.Vector3(width / 2, height / 2, 0);
  group.add(beamBetween(leftBottom, leftTop, depth, material));
  group.add(beamBetween(rightBottom, rightTop, depth, material));
  group.add(beamBetween(leftTop, rightTop, depth, material));
  group.add(beamBetween(leftBottom, rightBottom, depth * 0.72, material));
  group.add(beamBetween(leftBottom, rightTop, depth * 0.42, brace));
  return group;
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
    const compact = window.matchMedia("(max-width: 700px)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080a, compact ? 0.095 : 0.07);
    const camera = new THREE.PerspectiveCamera(compact ? 51 : 43, 1, 0.1, 40);
    camera.position.set(0, 0.2, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.45));
    renderer.setClearColor(0x06080a, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const corridor = new THREE.Group();
    const drawings = new THREE.Group();
    scene.add(world);
    world.add(corridor, drawings);

    const gold = new THREE.MeshStandardMaterial({ color: 0xd6c28f, metalness: 0.58, roughness: 0.3, transparent: true, opacity: 0.5, emissive: 0x302713, emissiveIntensity: 0.15 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x758087, metalness: 0.72, roughness: 0.32, transparent: true, opacity: 0.31 });
    const ivory = new THREE.MeshStandardMaterial({ color: 0xe7dfcf, metalness: 0.2, roughness: 0.42, transparent: true, opacity: 0.22 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x7eabba, metalness: 0.38, roughness: 0.34, transparent: true, opacity: 0.24 });

    const zPositions = [-5.4, -3.6, -1.8, 0, 1.8, 3.55];
    const portals: THREE.Group[] = [];
    zPositions.forEach((z, index) => {
      const scale = 1.02 - index * 0.035;
      const p = portal((compact ? 4.5 : 6.4) * scale, (compact ? 6.8 : 4.2) * scale, index === 3 ? 0.052 : 0.034, index === 3 ? gold : index % 2 ? steel : ivory, index % 2 ? blue : gold);
      p.position.z = z;
      p.position.y = Math.sin(index * 1.4) * 0.08;
      p.rotation.z = (index - 2.5) * 0.006;
      corridor.add(p);
      portals.push(p);
    });

    const front = zPositions[zPositions.length - 1];
    const back = zPositions[0];
    const halfW = compact ? 2.05 : 2.95;
    const halfH = compact ? 3.0 : 1.78;
    [
      [-halfW, -halfH], [halfW, -halfH], [-halfW, halfH], [halfW, halfH],
    ].forEach(([x, y], index) => {
      corridor.add(beamBetween(new THREE.Vector3(x, y, back), new THREE.Vector3(x, y, front), 0.018, index === 2 ? gold : index === 1 ? blue : steel));
    });

    const sectionMaterial = new THREE.LineBasicMaterial({ color: 0xd6c28f, transparent: true, opacity: 0.18 });
    const coolLine = new THREE.LineBasicMaterial({ color: 0x7eabba, transparent: true, opacity: 0.13 });
    for (let i = 0; i < 4; i += 1) {
      const size = 1.25 + i * 0.42;
      const h = size * 0.72;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-size / 2, -h / 2, 0),
        new THREE.Vector3(size / 2, -h / 2, 0),
        new THREE.Vector3(size / 2, h / 2, 0),
        new THREE.Vector3(-size / 2, -h / 2, 0),
      ]);
      const triangle = new THREE.Line(geometry, i % 2 ? coolLine.clone() : sectionMaterial.clone());
      triangle.position.set(i % 2 ? -1.4 : 1.4, i * 0.28 - 0.4, -4.6 + i * 2.2);
      triangle.rotation.set(0.05 * i, -0.12 + i * 0.08, i % 2 ? -0.08 : 0.08);
      drawings.add(triangle);
    }

    const cutPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(compact ? 4.6 : 6.8, compact ? 7.1 : 4.5, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xe7dfcf, wireframe: true, transparent: true, opacity: 0.045, side: THREE.DoubleSide }),
    );
    cutPlane.position.z = -1.1;
    cutPlane.rotation.y = 0.04;
    drawings.add(cutPlane);

    const pointsCount = compact ? 54 : 90;
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i += 1) {
      positions[i * 3] = (((i * 37) % 100) / 100 - 0.5) * (compact ? 4.8 : 7.2);
      positions[i * 3 + 1] = (((i * 61) % 100) / 100 - 0.5) * (compact ? 7.2 : 4.8);
      positions[i * 3 + 2] = -5.8 + ((i * 17) % 100) / 100 * 10;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe7dfcf, transparent: true, opacity: 0.27, size: 0.018, sizeAttenuation: true }));
    world.add(particles);

    scene.add(new THREE.HemisphereLight(0xe7dfcf, 0x06080a, 0.62));
    const key = new THREE.PointLight(0xd6c28f, 7, 15, 2);
    key.position.set(2.6, 2.8, 5.2);
    scene.add(key);
    const fill = new THREE.PointLight(0x7eabba, 4, 12, 2);
    fill.position.set(-3.1, -0.7, 2.8);
    scene.add(fill);

    let energy = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    const resize = () => {
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const animate = () => {
      const t = clock.getElapsedTime();
      const target = activeRef.current ? 1 : 0;
      energy += (target - energy) * (phaseRef.current === "closing" ? 0.072 : 0.052);
      const closing = phaseRef.current === "closing";
      const opening = phaseRef.current === "opening";
      const eased = energy * energy * (3 - 2 * energy);

      world.position.z = closing ? eased * 3.8 : opening ? 3.1 - eased * 3.1 : 0;
      world.rotation.y = Math.sin(t * 0.18) * 0.015 + (closing ? eased * 0.08 : -eased * 0.035);
      world.rotation.x = Math.sin(t * 0.22) * 0.008;

      portals.forEach((p, index) => {
        p.position.x = Math.sin(t * 0.33 + index * 0.8) * (reduced ? 0 : 0.025);
        p.scale.setScalar(1 + Math.sin(t * 0.27 + index) * (reduced ? 0 : 0.004));
      });
      drawings.position.z = Math.sin(t * 0.22) * 0.04;
      drawings.rotation.z = Math.sin(t * 0.16) * 0.01;
      particles.position.z = closing ? eased * 1.6 : 0;

      const desiredZ = closing ? 7.95 - eased * 2.15 : opening ? 6.0 + eased * 2.15 : 8.2;
      camera.position.z += (desiredZ - camera.position.z) * 0.07;
      camera.position.x = Math.sin(eased * Math.PI) * (compact ? 0.08 : 0.22);
      camera.position.y = 0.2 + Math.sin(eased * Math.PI) * 0.08;
      camera.lookAt(0, 0.05, -1.3);

      renderer.domElement.style.opacity = String(Math.min(1, energy * 1.45));
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
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className={className} aria-hidden="true" />;
}
