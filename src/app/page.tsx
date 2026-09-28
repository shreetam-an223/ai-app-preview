import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Hi, I&apos;m <span className="text-sky-400">Shreetam Anand</span>.
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
          I build and verify reliable, production-ready AI software interfaces with measurable execution speed and deterministic code quality.
        </p>
      </div>

      {/* Action Links Required by Assignment */}
      <div className="flex flex-wrap gap-3 mt-8">
        <a
          href="https://github.com/shreetam-an223"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/shreetam-anand-ba6147372" 
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition"
        >
          LinkedIn
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
        >
          CV / Resume
        </a>
        <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=anandshreetam.223@gmail.com&su=Engineering%20Inquiry"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 text-sm font-medium border border-sky-500/30 transition"
        >
        Contact Me
        </a>
      </div>

      {/* Your Existing Project Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
        {/* Card 1: Micro-interactions */}
        <Link
          href="/buttons"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all group block"
          >
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">
          Interactive Feature & Motion
          </span>
          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300">
           Buttons with a Brain &rarr;
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Deterministic micro-interactions, optimistic state changes, and error recovery choreography.
           </p>
        </Link>

           {/* Card 2: Serverless Dispatch */}
        <Link
            href="/contact"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all group block"
            >
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">
           Full-Stack Serverless Route
         </span>
          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300">
            Interactive Message Dispatch &rarr;
          </h3>
          <p className="text-xs text-slate-400 mt-2">
           Live payload validation, ISO timestamping, and server-side state persistence.
           </p>
           </Link>
        </div>
    </main>
  );
}