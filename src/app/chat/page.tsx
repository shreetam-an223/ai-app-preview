"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolResultCard, ToolState } from "@/components/chat/ToolResultCard";
import { AuditToolInput, AuditToolResult } from "@/lib/tools/audit-tool";

interface ToolData {
  toolName: string;
  state: ToolState;
  input?: Partial<AuditToolInput>;
  output?: AuditToolResult;
  errorMessage?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolData?: ToolData;
  error?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollPinned = useRef(true);

  const starterChips = [
    { label: "⚡ Audit Frontend Route", prompt: "audit playground" },
    { label: "💥 Test Mid-Stream Sabotage", prompt: "sabotage stream" },
    { label: "🚫 Test HTTP 429 Limit", prompt: "sabotage 429" },
    { label: "🔌 Test Network Failure", prompt: "sabotage network" },
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    isAutoScrollPinned.current = isAtBottom;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAutoScrollPinned.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isThinking, errorMessage]);

  const sendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    setErrorMessage(null);
    setLastFailedPrompt(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: promptText.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsThinking(true);
    isAutoScrollPinned.current = true;

    const assistantMsgId = (Date.now() + 1).toString();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errDesc = `HTTP ${response.status}: Failed to fetch response.`;
        try {
          const errData = await response.json();
          if (errData.error) errDesc = errData.error;
        } catch (_) {}
        throw new Error(errDesc);
      }

      const contentType = response.headers.get("content-type");

      // Structured JSON Tool Response
      if (contentType && contentType.includes("application/json")) {
        setIsThinking(false);
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "Invoking server-side diagnostic tool...",
            toolData: { toolName: data.toolName, state: "input-streaming" },
          },
        ]);

        await new Promise((r) => setTimeout(r, 350));

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  toolData: {
                    toolName: data.toolName,
                    state: "input-available",
                    input: data.input,
                  },
                }
              : msg
          )
        );

        await new Promise((r) => setTimeout(r, 500));

        if (data.type === "tool-response") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: "Tool completed successfully.",
                    toolData: {
                      toolName: data.toolName,
                      state: "output-available",
                      input: data.input,
                      output: data.output,
                    },
                  }
                : msg
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: "Tool encountered a runtime error.",
                    toolData: {
                      toolName: data.toolName,
                      state: "output-error",
                      input: data.input,
                      errorMessage: data.errorMessage,
                    },
                  }
                : msg
            )
          );
        }
      } else if (response.body) {
        // SSE / ReadableStream Text Response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamedText = "";
        let firstChunk = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (!firstChunk) {
            firstChunk = true;
            setIsThinking(false);
            setMessages((prev) => [
              ...prev,
              { id: assistantMsgId, role: "assistant", content: "" },
            ]);
          }

          streamedText += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: streamedText } : msg
            )
          );
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Stream stopped intentionally by user.");
      } else {
        const errorText = err instanceof Error ? err.message : "Connection dropped mid-stream.";
        setErrorMessage(errorText);
        setLastFailedPrompt(promptText.trim());
      }
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedPrompt) {
      sendPrompt(lastFailedPrompt);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="font-semibold text-white text-base">Production Chat & Edge Scenarios</h1>
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          Reset Session
        </button>
      </div>

      {/* Main Conversation Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {/* Designed Empty State with Onboarding Chips */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              ✦
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System Ready & Awaiting Input</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                No active messages in this session. Select a sample prompt below or type your own test case.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-md pt-2">
              {starterChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => sendPrompt(chip.prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sky-600 text-white rounded-br-xs"
                  : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-xs"
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                {msg.role === "user" ? "You" : "Assistant"}
              </div>
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {msg.toolData && (
                <ToolResultCard
                  toolName={msg.toolData.toolName}
                  state={msg.toolData.state}
                  input={msg.toolData.input}
                  output={msg.toolData.output}
                  errorMessage={msg.toolData.errorMessage}
                />
              )}
            </div>
          </div>
        ))}

        {/* Anti-CLS Skeleton / Thinking State */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 w-64 space-y-2 animate-pulse">
              <div className="h-3 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-700/60 rounded w-1/2" />
            </div>
          </div>
        )}

        {/* Designed In-Line Error State with Retry */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-base text-rose-400">⚠</span>
              <div>
                <p className="font-semibold text-rose-300">Stream Connection Interrupted</p>
                <p className="text-slate-300 text-[11px]">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-xs transition self-end sm:self-auto shrink-0 shadow"
            >
              Retry Prompt
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Jump to Latest Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 z-10 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-full text-xs shadow-lg flex items-center gap-1 transition"
        >
          ↓ Jump to latest
        </button>
      )}

      {/* Form Input Container */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form onSubmit={(e) => { e.preventDefault(); sendPrompt(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type message or test sabotage (e.g. "sabotage 429")...'
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 disabled:opacity-50"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 bg-white rounded-xs" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium rounded-xl transition"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}