import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Production Studio",
  description: "Day-one deployment for AI frontend application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-bold text-lg text-sky-400">PromptStudio AI</div>
            <div className="flex gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-sky-400 transition">Dashboard</Link>
              <Link href="/studio" className="hover:text-sky-400 transition">Studio</Link>
              <Link href="/health" className="hover:text-sky-400 transition">Health Check</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto p-6">{children}</main>
        <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
          Deployed with Vercel CI/CD • Production Preview Active
        </footer>
      </body>
    </html>
  );
}