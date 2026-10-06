import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full mb-4">
        Edge Case Handled: 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
        Page Does Not Exist
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        You navigated to an unmapped path. The application runtime caught the route cleanly without crashing.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-lg shadow-cyan-950 min-h-[44px] flex items-center"
      >
        Return to Safe Harbor
      </Link>
    </main>
  );
}