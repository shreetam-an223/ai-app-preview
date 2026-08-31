import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Production Preview Workspace",
  description: "Next.js App Router workspace with streaming AI chat, accessible components, and system health checks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              AI Production Preview
            </Link>

            <div className="flex gap-4 sm:gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-sky-400 transition">
                Dashboard
              </Link>
              <Link href="/chat" className="hover:text-sky-400 transition">
                Streaming Chat
              </Link>
              <Link href="/playground" className="hover:text-sky-400 transition">
                Playground
              </Link>
              <Link href="/health" className="hover:text-sky-400 transition">
                Health Check
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}