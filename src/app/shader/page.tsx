"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Lazy-load the WebGL shader canvas with no SSR penalty
const ShaderHero = dynamic(() => import("../../components/3d/ShaderHero"), {
  ssr: false,
});

export default function ShaderHeroPage() {
  const [contrastBoost, setContrastBoost] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden bg-transparent text-slate-100">
      {/* Fullscreen Background Fragment Shader */}
      <ShaderHero />

      {/* Top Header Navigation */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          &larr; Return to Dashboard
        </Link>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-800/60 backdrop-blur-md">
          FE-AA3: Signature Fullscreen Shader
        </span>
      </header>

      {/* Hero Content Section - Verified High Contrast Typography */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center my-auto">
        <div className={`p-8 sm:p-12 rounded-3xl transition-all ${contrastBoost ? "bg-slate-950/85 backdrop-blur-md border border-slate-800" : ""}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-xs font-mono text-cyan-300 mb-6 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            GLSL Procedural Flow Field &bull; Dynamic u_mouse / u_time
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-2xl">
            Deterministic Interfaces.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent">
              Computational Elegance.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 font-normal leading-relaxed drop-shadow-md">
            Written by hand in OpenGL Shading Language (GLSL). Real-time noise fields respond seamlessly to pointer trajectories with zero external asset payload.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-950 cursor-pointer min-h-[44px] flex items-center"
            >
              Dispatch Transmission
            </Link>
            <button
              onClick={() => setContrastBoost(!contrastBoost)}
              className="px-5 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer min-h-[44px]"
            >
              {contrastBoost ? "Disable Scrim" : "Toggle Contrast Scrim"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer Breakdown of Shader Specs */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full px-4 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 text-center shadow-2xl">
          <div>
            <p className="text-[10px] uppercase font-mono text-slate-400">Uniform 1</p>
            <p className="text-xs font-semibold text-cyan-400">u_time (Delta)</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono text-slate-400">Uniform 2</p>
            <p className="text-xs font-semibold text-cyan-400">u_mouse (XY Vector)</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono text-slate-400">Uniform 3</p>
            <p className="text-xs font-semibold text-cyan-400">u_resolution (Aspect)</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono text-slate-400">A11y Fallback</p>
            <p className="text-xs font-semibold text-emerald-400">Reduced Motion Clean</p>
          </div>
        </div>
      </footer>
    </div>
  );
}