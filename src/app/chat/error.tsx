"use client";

import React, { useEffect } from "react";

export default function ChatErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route-level chat boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 text-xl">
        ⚠
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Interface Session Interrupted</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        A client-side execution anomaly occurred. Your session state has been preserved safely without data corruption.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition"
        >
          Recover Session
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700 transition"
        >
          Hard Reload
        </button>
      </div>
    </div>
  );
}