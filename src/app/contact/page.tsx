"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SubmissionData {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [latestSubmission, setLatestSubmission] = useState<SubmissionData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard 1: Prevent parallel duplicate requests
    if (status === "submitting") return;

    // Guard 2: Catch whitespace-only or empty strings
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setFeedback("Validation Error: Fields cannot be empty or contain only whitespace.");
      return;
    }

    // Guard 3: Strict email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus("error");
      setFeedback("Validation Error: Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server rejected payload.");
      }

      setStatus("success");
      setFeedback("Transmission Confirmed: Payload validated and logged by serverless backend.");
      setLatestSubmission(data.data);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Network Error: Failed to reach backend dispatch.";
      setFeedback(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-cyan-400 hover:text-cyan-300 font-medium"
        >
          &larr; Back to Portfolio
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
          Serverless API Route
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Contact & Message Dispatch
        </h1>
        <p className="text-sm text-slate-400">
          Full-stack message pipeline with input sanitation, serverless validation, and optimistic UI feedback.
        </p>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ada Lovelace"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-base transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ada@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-base transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Message Payload
            </label>
            <textarea
              id="message-input"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your transmission here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-base transition-colors"
            />
          </div>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`p-4 rounded-xl text-sm font-medium border transition-all ${
                status === "success"
                  ? "bg-emerald-950/50 border-emerald-700 text-emerald-300"
                  : "bg-rose-950/50 border-rose-700 text-rose-300"
              }`}
            >
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            aria-label={status === "submitting" ? "Dispatching message to backend" : "Dispatch message to backend"}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/30 cursor-pointer min-h-[44px]"
          >
            {status === "submitting" ? "Validating & Processing..." : "Dispatch to Backend"}
          </button>
        </form>

        {latestSubmission && (
          <section
            aria-label="Server Verification Output"
            aria-live="polite"
            className="mt-8 bg-slate-950/80 border border-emerald-800/40 rounded-2xl p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              Live Backend Verification
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <p><span className="text-slate-500">ID:</span> {latestSubmission.id}</p>
              <p><span className="text-slate-500">Sender:</span> {latestSubmission.name} ({latestSubmission.email})</p>
              <p><span className="text-slate-500">Timestamp:</span> {latestSubmission.timestamp}</p>
              <p><span className="text-slate-500">Message:</span> &ldquo;{latestSubmission.message}&rdquo;</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}