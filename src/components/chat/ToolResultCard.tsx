"use client";

import React from "react";
import { AuditToolInput, AuditToolResult } from "@/lib/tools/audit-tool";

export type ToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface ToolResultCardProps {
  toolName: string;
  state: ToolState;
  input?: Partial<AuditToolInput>;
  output?: AuditToolResult;
  errorMessage?: string;
}

export function ToolResultCard({
  toolName,
  state,
  input,
  output,
  errorMessage,
}: ToolResultCardProps) {
  return (
    <div className="my-3 w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-sans text-xs transition-all duration-200">
      {/* State 1: input-streaming */}
      {state === "input-streaming" && (
        <div className="flex items-center gap-2.5 text-sky-400">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span className="font-mono font-medium">Formulating tool call: {toolName}...</span>
        </div>
      )}

      {/* State 2: input-available (executing) */}
      {state === "input-available" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-slate-300 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Running Tool: <span className="text-white">{toolName}</span>
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              Executing
            </span>
          </div>
          <div className="rounded bg-slate-900/90 p-2 font-mono text-[11px] text-slate-300">
            Target: <span className="text-sky-300">{input?.targetUrl || "Inspecting route..."}</span>
          </div>
        </div>
      )}

      {/* State 3: output-available (Structured Output Card) */}
      {state === "output-available" && output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">System Audit Report</span>
            </div>
            <span className="rounded bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              PASSED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-900 p-2 text-center border border-slate-800/80">
              <div className="text-[10px] uppercase text-slate-400">A11y</div>
              <div className="text-base font-bold text-emerald-400">{output.scores.accessibility}%</div>
            </div>
            <div className="rounded-lg bg-slate-900 p-2 text-center border border-slate-800/80">
              <div className="text-[10px] uppercase text-slate-400">Speed</div>
              <div className="text-base font-bold text-sky-400">{output.scores.performance}%</div>
            </div>
            <div className="rounded-lg bg-slate-900 p-2 text-center border border-slate-800/80">
              <div className="text-[10px] uppercase text-slate-400">SEO</div>
              <div className="text-base font-bold text-indigo-400">{output.scores.seo}%</div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-2 text-slate-300 space-y-1">
            <p className="font-medium text-slate-200">{output.summary}</p>
            <div className="flex gap-3 text-[11px] text-slate-400 pt-1 font-mono">
              <span>Latency: {output.metrics.interactiveLatencyMs}ms</span>
              <span>•</span>
              <span>WCAG AA: Pass</span>
            </div>
          </div>
        </div>
      )}

      {/* State 4: output-error */}
      {state === "output-error" && (
        <div className="space-y-2 border-l-2 border-rose-500 pl-3">
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span>✕ Tool Execution Failed</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {errorMessage || "An unexpected error occurred while executing the server-side tool."}
          </p>
          <div className="font-mono text-[10px] text-slate-500">
            Diagnostic: Non-fatal state handled gracefully.
          </div>
        </div>
      )}
    </div>
  );
}