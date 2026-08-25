import Link from "next/link";

export default function HomePage() {
  return (
    <section className="py-12 space-y-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        AI Engineering <span className="text-sky-400">Production Workspace</span>
      </h1>
      <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg">
        Scaffolded with Next.js App Router, Tailwind CSS, and Server Components.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Link
          href="/studio"
          className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition"
        >
          Open Prompt Studio
        </Link>
        <Link
          href="/health"
          className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
        >
          Check System Status
        </Link>
      </div>
    </section>
  );
}