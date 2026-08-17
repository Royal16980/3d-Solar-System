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
import { BODIES, type CelestialBody } from "@/lib/solar-system";

const DEFAULT_CAMERA: [number, number, number] = [0, 30, 50];

type SolarSystemProps = {
  readonly focusedBodyId: string;
  readonly orbitSpeed: number;
  readonly onSelectBody: (id: string) => void;
};

export function SolarSystem({ focusedBodyId, orbitSpeed, onSelectBody }: SolarSystemProps) {
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, position: DEFAULT_CAMERA }}
      className="h-full w-full"
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color args={["#030712"]} attach="background" />
      <ambientLight intensity={0.18} />
      <Stars depth={80} factor={3} fade radius={180} saturation={0} speed={0.2} />
      <System
        focusedBodyId={focusedBodyId}
        onSelectBody={onSelectBody}
        orbitSpeed={orbitSpeed}
      />
    </Canvas>
  );
}

function System({ focusedBodyId, orbitSpeed, onSelectBody }: SolarSystemProps) {
  const positions = useRef<Record<string, Vector3>>({});
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const focusTarget = useRef(new ThreeVector3());
  const cameraGoal = useRef(new ThreeVector3(...DEFAULT_CAMERA));

  useFrame((state, delta) => {
    const current = positions.current[focusedBodyId] ?? positions.current.sun;
    if (!current) {
      return;
    }

    const body = BODIES.find((item) => item.id === focusedBodyId);
    const offset = Math.max(8, (body?.size ?? 1) * 6);
    focusTarget.current.copy(current);
    cameraGoal.current.set(current.x + offset, current.y + offset * 0.7, current.z + offset);

    const alpha = 1 - Math.exp(-2.2 * delta);
    state.camera.position.lerp(cameraGoal.current, alpha);
    controlsRef.current?.target.lerp(focusTarget.current, alpha);
    controlsRef.current?.update();
  });

  return (
    <>
      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={120}
        minDistance={8}
        ref={controlsRef}
      />
      {BODIES.map((body) =>
        body.kind === "star" ? (
          <Sun
            body={body}
            key={body.id}
            onSelect={onSelectBody}
            positions={positions.current}
            selected={focusedBodyId === body.id}
          />
        ) : (
          <Planet
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
  readonly body: CelestialBody;
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
      <pointLight color="#fff4cc" decay={0.4} distance={300} intensity={4} />
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body.id);
        }}
        ref={meshRef}
      >
        <sphereGeometry args={[body.size, 48, 48]} />
        <meshBasicMaterial color={body.color} />
      </mesh>
      {selected ? <SelectionRing radius={body.size + 0.45} /> : null}
      <BodyLabel body={body} selected={selected} />
    </group>
  );
}

function Planet({
  body,
  onSelect,
  orbitSpeed,
  positions,
  selected,
}: {
  readonly body: CelestialBody;
  readonly onSelect: (id: string) => void;
  readonly orbitSpeed: number;
  readonly positions: Record<string, Vector3>;
  readonly selected: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const angle = useRef(Math.random() * Math.PI * 2);
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
        <ringGeometry args={[body.distance - 0.02, body.distance + 0.02, 128]} />
        <meshBasicMaterial color="#94a3b8" opacity={0.18} side={DoubleSide} transparent />
      </mesh>
      <group ref={groupRef}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(body.id);
          }}
        >
          <sphereGeometry args={[body.size, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.05} roughness={0.45} />
        </mesh>
        {body.id === "saturn" ? <SaturnRings radius={body.size} /> : null}
        {selected ? <SelectionRing radius={body.size + 0.28} /> : null}
        <BodyLabel body={body} selected={selected} />
      </group>
    </group>
  );
}

function SaturnRings({ radius }: { readonly radius: number }) {
  const geometry = useMemo(() => new RingGeometry(radius * 1.4, radius * 2.2, 64), [radius]);

  return (
    <mesh geometry={geometry} rotation={[Math.PI / 2.6, 0, 0]}>
      <meshBasicMaterial color="#d6c4a3" opacity={0.7} side={DoubleSide} transparent />
    </mesh>
  );
}

function SelectionRing({ radius }: { readonly radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.08, 48]} />
      <meshBasicMaterial color="#f8fafc" opacity={0.9} side={DoubleSide} transparent />
    </mesh>
  );
}

function BodyLabel({
  body,
  selected,
}: {
  readonly body: CelestialBody;
  readonly selected: boolean;
}) {
  return (
    <Html center distanceFactor={28} position={[0, body.size + 0.8, 0]} zIndexRange={[10, 0]}>
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
