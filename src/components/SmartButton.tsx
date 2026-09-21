"use client";

import React, { useState } from "react";

export type ButtonState = "idle" | "loading" | "success" | "error";

interface SmartButtonProps {
  label?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  variant?: "primary" | "secondary";
  forcedOutcome?: "random" | "success" | "error";
  onComplete?: (status: "success" | "error") => void;
}

export function SmartButton({
  label = "Deploy Model",
  loadingText = "Deploying...",
  successText = "Deployed Successfully",
  errorText = "Deployment Failed — Retry",
  variant = "primary",
  forcedOutcome = "random",
  onComplete,
}: SmartButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");

  const handleClick = async () => {
    if (state === "loading") return; // Interrupt guard

    setState("loading");

    // Simulate async execution (1.2s delay)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let outcome: "success" | "error" = "success";
    if (forcedOutcome === "error") {
      outcome = "error";
    } else if (forcedOutcome === "random") {
      outcome = Math.random() < 0.3 ? "error" : "success"; // 30% failure rate
    }

    setState(outcome);
    onComplete?.(outcome);

    // Auto-return to idle after displaying state feedback
    setTimeout(() => {
      setState("idle");
    }, 2400);
  };

  const bgStyles = {
    primary: {
      idle: "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-950/40 border-sky-400/30",
      loading: "bg-sky-700 text-sky-100 cursor-wait border-sky-500/40",
      success: "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border-emerald-400/40",
      error: "bg-rose-600 text-white shadow-lg shadow-rose-950/40 border-rose-400/40 animate-shake",
    },
    secondary: {
      idle: "bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700",
      loading: "bg-slate-800 text-slate-400 cursor-wait border-slate-700",
      success: "bg-teal-700 text-teal-100 border-teal-500/40",
      error: "bg-amber-700 text-amber-100 border-amber-500/40 animate-shake",
    },
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      aria-live="polite"
      aria-busy={state === "loading"}
      className={`
        relative inline-flex items-center justify-center min-w-[200px] h-12 px-6 rounded-xl font-medium text-sm border
        transition-all duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        ${bgStyles[state]}
      `}
    >
      {/* Label and Transition Container */}
      <span className="flex items-center gap-2 transition-transform duration-200">
        {state === "loading" && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}

        {state === "success" && (
          <svg
            className="h-4 w-4 text-current transition-transform duration-200 scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}

        {state === "error" && (
          <svg
            className="h-4 w-4 text-current transition-transform duration-200 scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}

        {/* Dynamic Label Text */}
        <span>
          {state === "idle" && label}
          {state === "loading" && loadingText}
          {state === "success" && successText}
          {state === "error" && errorText}
        </span>
      </span>
    </button>
  );
}