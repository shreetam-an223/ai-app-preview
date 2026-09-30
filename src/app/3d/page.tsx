"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the 3D scene so it only executes in the browser
const ThreeScene = dynamic(() => import("../../components/3d/InteractiveMesh"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800">
      <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
        Spinning Up WebGL Pipeline...
      </p>
    </div>
  ),
});

const COLOR_PALETTES = [
  { name: "Cyan Neo", hex: "#06b6d4" },
  { name: "Electric Indigo", hex: "#6366f1" },
  { name: "Emerald Signal", hex: "#10b981" },
  { name: "Amber Blaze", hex: "#f59e0b" },
  { name: "Rose Chrome", hex: "#f43f5e" },
];

export default function ThreeExperiencePage() {
  const [color, setColor] = useState("#06b6d4");
  const [geometryType, setGeometryType] = useState<"torus" | "icosahedron" | "sphere">("torus");
  const [wireframe, setWireframe] = useState(false);
  const [distort, setDistort] = useState(0.4);
  const [metalness, setMetalness] = useState(0.7);
  const [roughness, setRoughness] = useState(0.2);

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-cyan-400 hover:text-cyan-300 font-medium"
        >
          &larr; Back to Portfolio
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
          FE-AA2: 3D WebGL Configurator
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Real-Time 3D Material Configurator
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Hardware-accelerated WebGL scene running React Three Fiber. Inspect geometry, alter procedural mesh distortion, modulate roughness/specular lighting, or isolate topological wireframes in real time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 3D Viewport */}
        <div className="lg:col-span-2 h-[420px] sm:h-[520px] w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-2 relative shadow-2xl overflow-hidden backdrop-blur-sm">
          <ThreeScene
            color={color}
            wireframe={wireframe}
            roughness={roughness}
            metalness={metalness}
            distort={distort}
            speed={2}
            geometryType={geometryType}
          />
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono pointer-events-none">
            Rotate: Drag | Zoom: Pinch/Scroll
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6 backdrop-blur-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Mesh & Material Controls
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Geometry Primitive
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["torus", "icosahedron", "sphere"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGeometryType(type)}
                  className={`py-2 text-xs font-medium rounded-xl capitalize border transition-all cursor-pointer ${
                    geometryType === type
                      ? "bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-950"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Pigment Tone
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_PALETTES.map((p) => (
                <button
                  key={p.hex}
                  onClick={() => setColor(p.hex)}
                  title={p.name}
                  style={{ backgroundColor: p.hex }}
                  className={`h-8 w-8 rounded-full border-2 transition-transform cursor-pointer ${
                    color === p.hex ? "scale-110 border-white ring-2 ring-cyan-500/50" : "border-slate-700 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Vertex Distortion</span>
              <span className="font-mono text-cyan-400">{distort.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={distort}
              onChange={(e) => setDistort(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Metalness / Specular</span>
              <span className="font-mono text-cyan-400">{metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Wireframe Topology
            </span>
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                wireframe
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {wireframe ? "ACTIVE" : "DISABLED"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}