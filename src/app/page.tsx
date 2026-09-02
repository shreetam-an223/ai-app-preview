import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/80 text-xs text-sky-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Production Deployment • Empty but Live
      </div>

      <div className="space-y-3 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Shreetam Anand
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          I build and verify reliable, production-ready AI software interfaces with measurable execution speed and deterministic code quality.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/chat"
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition"
        >
          Open Streaming Chat →
        </Link>
        <Link
          href="/playground"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition"
        >
          Accessible Playground
        </Link>
      </div>
    </div>
  );
}