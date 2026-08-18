"use client";

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Color,
  DoubleSide,
  type Group,
  type Mesh,
  RingGeometry,
  type Vector3,
  Vector3 as ThreeVector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { sceneBodies, type CatalogBody } from "@/lib/catalog";

const DEFAULT_CAMERA: [number, number, number] = [0, 28, 52];

type SolarSystemProps = {
  readonly focusedBodyId: string;
  readonly orbitSpeed: number;
  readonly showDwarfs: boolean;
  readonly onSelectBody: (id: string) => void;
};

export function SolarSystem({
  focusedBodyId,
  orbitSpeed,
  showDwarfs,
  onSelectBody,
}: SolarSystemProps) {
  return (
    <Canvas
      camera={{ fov: 55, near: 0.1, far: 400, position: DEFAULT_CAMERA }}
      className="h-full w-full"
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
    >
      <color args={["#05060c"]} attach="background" />
      <fog attach="fog" args={["#05060c", 80, 220]} />
      <ambientLight intensity={0.12} />
      <Stars depth={90} factor={2.6} fade radius={220} saturation={0} speed={0.15} />
      <System
        focusedBodyId={focusedBodyId}
        onSelectBody={onSelectBody}
        orbitSpeed={orbitSpeed}
        showDwarfs={showDwarfs}
      />
    </Canvas>
  );
}

function System({ focusedBodyId, orbitSpeed, showDwarfs, onSelectBody }: SolarSystemProps) {
  const bodies = sceneBodies(showDwarfs);
  const positions = useRef<Record<string, Vector3>>({});
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const focusTarget = useRef(new ThreeVector3());
  const cameraGoal = useRef(new ThreeVector3(...DEFAULT_CAMERA));

  useFrame((state, delta) => {
    const current = positions.current[focusedBodyId] ?? positions.current.sun;
    if (!current) return;

    const body = bodies.find((item) => item.id === focusedBodyId);
    const offset = Math.max(7, (body?.size ?? 1) * 5.4);
    focusTarget.current.copy(current);
    cameraGoal.current.set(current.x + offset, current.y + offset * 0.55, current.z + offset);

    const alpha = 1 - Math.exp(-2.4 * delta);
    state.camera.position.lerp(cameraGoal.current, alpha);
    controlsRef.current?.target.lerp(focusTarget.current, alpha);
    controlsRef.current?.update();
  });

  return (
    <>
      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={160}
        minDistance={7}
        ref={controlsRef}
      />
      {bodies.map((body) =>
        body.kind === "star" ? (
          <Sun
            body={body}
            key={body.id}
            onSelect={onSelectBody}
            positions={positions.current}
            selected={focusedBodyId === body.id}
          />
        ) : (
          <OrbitingBody
            body={body}
            key={body.id}
            onSelect={onSelectBody}
            orbitSpeed={orbitSpeed}
            positions={positions.current}
            selected={focusedBodyId === body.id}
          />
        ),
      )}
    </>
  );
}

function Sun({
  body,
  onSelect,
  positions,
  selected,
}: {
  readonly body: CatalogBody;
  readonly onSelect: (id: string) => void;
  readonly positions: Record<string, Vector3>;
  readonly selected: boolean;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      positions[body.id] = meshRef.current.position;
    }
  });

  return (
    <group>
      <pointLight color="#fff1c2" decay={0.35} distance={280} intensity={5.2} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[body.size * 1.35, 32, 32]} />
        <meshBasicMaterial color={body.glow} opacity={0.16} transparent />
      </mesh>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[body.size, 64, 64]} />
        <meshBasicMaterial color={body.color} />
      </mesh>
      {selected ? <SelectionRing radius={body.size + 0.5} /> : null}
      <BodyLabel body={body} selected={selected} />
    </group>
  );
}

function OrbitingBody({
  body,
  onSelect,
  orbitSpeed,
  positions,
  selected,
}: {
  readonly body: CatalogBody;
  readonly onSelect: (id: string) => void;
  readonly orbitSpeed: number;
  readonly positions: Record<string, Vector3>;
  readonly selected: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const angle = useRef(hashAngle(body.id));
  const color = useMemo(() => new Color(body.color), [body.color]);

  useFrame((_, delta) => {
    angle.current += body.orbitSpeed * orbitSpeed * delta * 60;
    const x = Math.cos(angle.current) * body.distance;
    const z = Math.sin(angle.current) * body.distance;
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
      positions[body.id] = groupRef.current.position;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[body.distance - 0.015, body.distance + 0.015, 160]} />
        <meshBasicMaterial
          color={selected ? "#e2e8f0" : "#64748b"}
          opacity={selected ? 0.35 : body.kind === "dwarf-planet" ? 0.1 : 0.16}
          side={DoubleSide}
          transparent
        />
      </mesh>
      <group ref={groupRef}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(body.id);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[body.size, 48, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={body.glow}
            emissiveIntensity={0.08}
            metalness={0.08}
            roughness={0.42}
          />
        </mesh>
        {body.id === "earth" ? (
          <mesh>
            <sphereGeometry args={[body.size * 1.06, 32, 32]} />
            <meshBasicMaterial color="#7dd3fc" opacity={0.14} transparent />
          </mesh>
        ) : null}
        {body.hasRings ? <PlanetaryRings radius={body.size} /> : null}
        {selected ? <SelectionRing radius={body.size + 0.28} /> : null}
        <BodyLabel body={body} selected={selected} />
      </group>
    </group>
  );
}

function PlanetaryRings({ radius }: { readonly radius: number }) {
  const geometry = useMemo(() => new RingGeometry(radius * 1.35, radius * 2.15, 72), [radius]);

  return (
    <mesh geometry={geometry} rotation={[Math.PI / 2.55, 0.15, 0]}>
      <meshBasicMaterial color="#e7d3a8" opacity={0.72} side={DoubleSide} transparent />
    </mesh>
  );
}

function SelectionRing({ radius }: { readonly radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.07, 56]} />
      <meshBasicMaterial color="#f8fafc" opacity={0.92} side={DoubleSide} transparent />
    </mesh>
  );
}

function BodyLabel({
  body,
  selected,
}: {
  readonly body: CatalogBody;
  readonly selected: boolean;
}) {
  return (
    <Html center distanceFactor={32} position={[0, body.size + 0.85, 0]} zIndexRange={[20, 0]}>
      <div
        className={`whitespace-nowrap rounded-full px-2 py-0.5 font-medium text-[11px] tracking-wide ${
          selected
            ? "bg-white text-slate-950"
            : "bg-slate-950/70 text-slate-100 ring-1 ring-white/15"
        }`}
      >
        {body.name}
      </div>
    </Html>
  );
}

function hashAngle(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  }
  return (hash / 1000) * Math.PI * 2;
}
