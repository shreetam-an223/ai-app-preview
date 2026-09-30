"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ShapeProps {
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  distort: number;
  speed: number;
  geometryType: "torus" | "icosahedron" | "sphere";
}

function ConfigurableMesh({
  color,
  wireframe,
  roughness,
  metalness,
  distort,
  speed,
  geometryType,
}: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} castShadow receiveShadow scale={1.6}>
        {geometryType === "torus" && <torusGeometry args={[1, 0.4, 32, 64]} />}
        {geometryType === "icosahedron" && <icosahedronGeometry args={[1.2, 4]} />}
        {geometryType === "sphere" && <sphereGeometry args={[1.2, 64, 64]} />}

        <MeshDistortMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          distort={distort}
          speed={speed}
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeScene({
  color,
  wireframe,
  roughness,
  metalness,
  distort,
  speed,
  geometryType,
}: ShapeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} color="#38bdf8" intensity={1} />

      <ConfigurableMesh
        color={color}
        wireframe={wireframe}
        roughness={roughness}
        metalness={metalness}
        distort={distort}
        speed={speed}
        geometryType={geometryType}
      />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.6}
        scale={10}
        blur={1.5}
        far={4}
      />
      <OrbitControls enableZoom={true} enablePan={false} minDistance={2.5} maxDistance={8} />
    </Canvas>
  );
}