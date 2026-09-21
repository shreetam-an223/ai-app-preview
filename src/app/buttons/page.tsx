"use client";

import React, { useState } from "react";
import { SmartButton } from "@/components/SmartButton";

export default function ButtonMicroInteractionsPage() {
  const [outcomeMode, setOutcomeMode] = useState<"random" | "success" | "error">("random");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (entry: string) => {
    setLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${entry}`,
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header & Intent */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-mono">
          FE-AA1 Deliverable • Micro-Interactions
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Buttons with a Brain
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
          Choreographed interactive button states (<code className="text-sky-300">idle</code> &rarr; <code className="text-sky-300">hover/focus</code> &rarr; <code className="text-sky-300">loading</code> &rarr; <code className="text-emerald-400">success</code> / <code className="text-rose-400">error</code> &rarr; <code className="text-sky-300">idle</code>) animating hardware-composited properties with accessible motion fallbacks.
        </p>
      </div>

      {/* Simulator Control Rig */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Simulation Trigger Controls
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOutcomeMode("random")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              outcomeMode === "random"
                ? "bg-sky-600 border-sky-400 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Random (30% Error Rate)
          </button>
          <button
            type="button"
            onClick={() => setOutcomeMode("success")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              outcomeMode === "success"
                ? "bg-emerald-600 border-emerald-400 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Force Success
          </button>
          <button
            type="button"
            onClick={() => setOutcomeMode("error")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              outcomeMode === "error"
                ? "bg-rose-600 border-rose-400 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Force Error (Test Shake)
          </button>
        </div>
      </div>

      {/* Interactive Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Button 1: Primary Action */}
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center space-y-4 min-h-[220px]">
          <span className="text-xs font-mono text-slate-400">Action: Async Model Deployment</span>
          <SmartButton
            label="Deploy Model"
            loadingText="Deploying Container..."
            successText="Deployment Live"
            errorText="Failed • Retry Deploy"
            variant="primary"
            forcedOutcome={outcomeMode}
            onComplete={(res) => addLog(`Primary Button triggered outcome: ${res.toUpperCase()}`)}
          />
        </div>

        {/* Button 2 (Flex item): Secondary Action Sharing Same Motion Language */}
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center space-y-4 min-h-[220px]">
          <span className="text-xs font-mono text-slate-400">Action: Run Agent Sync</span>
          <SmartButton
            label="Sync Agent Knowledge"
            loadingText="Indexing Vectors..."
            successText="Index Synchronized"
            errorText="Sync Timeout • Retry"
            variant="secondary"
            forcedOutcome={outcomeMode}
            onComplete={(res) => addLog(`Secondary Button triggered outcome: ${res.toUpperCase()}`)}
          />
        </div>
      </div>

      {/* Activity Log */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
        <div className="text-xs font-mono text-slate-500 mb-2">Micro-Interaction Execution Log:</div>
        {log.length === 0 ? (
          <div className="text-xs font-mono text-slate-600 italic">Click a button above to run lifecycle choreography...</div>
        ) : (
          log.map((item, i) => (
            <div key={i} className="text-xs font-mono text-slate-400">
              {item}
            </div>
          ))
        )}
      </div>

      {/* Rationale & Design Decision Writeup (Deliverable Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h2 className="text-lg font-semibold text-white">Motion Choreography & Easing Rationale</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li>
            <strong>Duration Choice (200ms Active / 350ms Shake):</strong> 200ms was selected for press and hover transitions as it aligns with human perceptual response limits—feeling instantaneous without being jarring. The 350ms error shake provides clear behavioral rejection without delaying input readiness.
          </li>
          <li>
            <strong>Easing Selection:</strong> Standard transitions use <code>cubic-bezier(0, 0, 0.2, 1)</code> (ease-out) to start rapidly and settle gently. The shake animation leverages <code>cubic-bezier(0.36, 0.07, 0.19, 0.97)</code> to simulate physical spring tension.
          </li>
          <li>
            <strong>Compositor-Only Animations:</strong> Transforms (<code>scale-95</code>, <code>translateX</code>) and opacity are animated exclusively to avoid browser layout recalculation or paint thrashing.
          </li>
          <li>
            <strong>Reduced Motion & Accessibility:</strong> Enforces <code>aria-live=&quot;polite&quot;</code> and <code>aria-busy</code> to inform assistive technology. Under <code>prefers-reduced-motion: reduce</code>, positional shake is stripped, relying purely on color tokens and semantic text.
          </li>
        </ul>
      </div>
    </div>
  );
}