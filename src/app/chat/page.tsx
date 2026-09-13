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
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: 'Hello! I support both streaming responses and server-side tools. Type "audit" to run a system audit, or "audit fail" to test our error card.',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsThinking(true);

    const assistantMsgId = (Date.now() + 1).toString();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const contentType = response.headers.get("content-type");

      // Handle structured tool results
      if (contentType && contentType.includes("application/json")) {
        setIsThinking(false);
        const data = await response.json();

        // 1. Morph to input-streaming state
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "Invoking server-side diagnostic tool...",
            toolData: { toolName: data.toolName, state: "input-streaming" },
          },
        ]);

        await new Promise((r) => setTimeout(r, 400));

        // 2. Morph to input-available state
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

        await new Promise((r) => setTimeout(r, 600));

        // 3. Final state: output-available or output-error
        if (data.type === "tool-response") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: "Tool completed execution successfully.",
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
                    content: "Tool encountered a runtime constraint.",
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
        // Handle streaming text
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="font-semibold text-white text-base">Generative UI & Tools</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInput("audit playground")}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
          >
            Run Audit
          </button>
          <button
            onClick={() => setInput("audit fail")}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition"
          >
            Trigger Error
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-sm ${
                msg.role === "user"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800/90 text-slate-100 border border-slate-700/60"
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                {msg.role === "user" ? "You" : "Assistant"}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>

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

        {isThinking && (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Processing request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask a question, or try "audit" / "audit fail"...'
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}