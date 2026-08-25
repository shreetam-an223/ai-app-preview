"use client";

import { useState } from "react";

export default function StudioPage() {
  const [prompt, setPrompt] = useState("Explain deterministic state machines in Python.");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Prompt Studio</h2>
        <p className="text-slate-400 text-sm">Interactive prompt prototyping workspace (Client Component).</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <label className="block text-sm font-medium text-slate-300">Prompt Draft</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-sky-500 font-mono text-sm"
        />
        <div className="text-xs text-slate-500">Character count: {prompt.length}</div>
      </div>
    </section>
  );
}