import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Production Preview | Shreetam",
  description: "AI Frontend Engineering Portfolio and Interactive Prototypes",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b14] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-white">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070b14]/80 border-b border-slate-800/80">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-sm tracking-wide text-white min-h-[44px] py-1"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span>AI Production Preview</span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full text-xs font-medium text-slate-300">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
              <Link
                href="/buttons"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] flex items-center"
              >
                Buttons
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] flex items-center"
              >
                Contact
              </Link>
              <Link
                href="/3d"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] flex items-center"
              >
                3D Experience
              </Link>
              <a
                href="https://github.com/shreetam-an223"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/50 transition-colors min-h-[44px] flex items-center ml-1"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}