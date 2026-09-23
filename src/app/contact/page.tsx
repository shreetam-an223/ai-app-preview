"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [latestSubmission, setLatestSubmission] = useState<StoredMessage | null>(null);
  const [dispatches, setDispatches] = useState<StoredMessage[]>([]);

  // Fetch initial message logs from backend on load
  const loadMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && data.messages) {
        setDispatches(data.messages);
      }
    } catch {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus("success");
        setFeedback("Success! Submission validated and persisted by the backend.");
        setLatestSubmission(result.record);
        setDispatches((prev) => [result.record, ...prev]);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setFeedback(result.error || "Submission failed validation.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error: unable to reach backend endpoint.");
    }
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 py-16 px-6 sm:px-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-cyan-400 hover:text-cyan-300 font-medium"
          >
            &larr; Back to Portfolio
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
            Self-Hosted Serverless Backend
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Interactive Message Dispatch
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          A full-stack dynamic feature wired end-to-end to an asynchronous Next.js route handler.
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-sm"
        >
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <input
              id="name"
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Shreetam"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Email Address
            </label>
            <input
              id="email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="shreetam@example.com"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Message Payload
            </label>
            <textarea
              id="message"
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Transmit a verified message into the backend..."
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/30 cursor-pointer"
          >
            {status === "submitting" ? "Validating & Processing..." : "Dispatch to Backend"}
          </button>

          {feedback && (
            <div
              role="alert"
              className={`p-4 rounded-xl text-sm font-medium border ${
                status === "success"
                  ? "bg-emerald-950/50 border-emerald-700 text-emerald-300"
                  : "bg-rose-950/50 border-rose-700 text-rose-300"
              }`}
            >
              {feedback}
            </div>
          )}
        </form>

        {/* Live Backend Confirmation & State Viewer */}
        {latestSubmission && (
          <div className="mt-8 bg-slate-900/40 border border-emerald-800/40 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Backend Verification
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <p><span className="text-slate-500">ID:</span> {latestSubmission.id}</p>
              <p><span className="text-slate-500">Sender:</span> {latestSubmission.name} ({latestSubmission.email})</p>
              <p><span className="text-slate-500">Timestamp:</span> {latestSubmission.timestamp}</p>
              <p><span className="text-slate-500">Message:</span> &ldquo;{latestSubmission.message}&rdquo;</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}