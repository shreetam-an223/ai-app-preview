import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shreetam-dev.vercel.app"),
  title: {
    default: "Shreetam Anand | AI Frontend Engineer",
    template: "%s | Shreetam Anand",
  },
  description:
    "AI Software Interface Engineer building deterministic, accessible, and high-performance web systems.",
  keywords: [
    "AI Frontend Engineering",
    "Next.js",
    "React Three Fiber",
    "Accessibility",
    "Performance Optimization",
    "Three.js",
    "Shreetam Anand",
  ],
  authors: [{ name: "Shreetam Anand", url: "https://github.com/shreetam-an223" }],
  creator: "Shreetam Anand",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shreetam-dev.vercel.app",
    title: "Shreetam Anand | AI Frontend Engineer",
    description:
      "Production-ready AI web systems verified with deterministic speed, zero-error accessibility, and WebGL.",
    siteName: "Shreetam Anand Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreetam Anand | AI Frontend Engineer",
    description:
      "Deterministic, accessible, and high-performance AI frontend interfaces.",
  },
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
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <header role="banner" className="sticky top-0 z-50 backdrop-blur-md bg-[#070b14]/80 border-b border-slate-800/80">
          <nav aria-label="Main Navigation" className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-sm tracking-wide text-white min-h-[44px] py-1"
              aria-label="AI Production Preview Home"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" aria-hidden="true"></span>
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
                aria-label="Visit Shreetam's GitHub Profile"
                className="px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/50 transition-colors min-h-[44px] flex items-center ml-1"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <main id="main-content" role="main" className="w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}