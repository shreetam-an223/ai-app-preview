import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 1. Tool Result Component
interface ToolResultProps {
  toolName: string;
  result: string;
  status: "idle" | "running" | "complete" | "failed";
}

function ToolResultCard({ toolName, result, status }: ToolResultProps) {
  return (
    <div role="region" aria-label={`Tool execution: ${toolName}`}>
      <span className="font-semibold">{toolName}</span>
      <span aria-label="tool status">{status}</span>
      {status === "complete" && <pre aria-label="tool output">{result}</pre>}
      {status === "failed" && <p role="alert">Execution failed</p>}
    </div>
  );
}

// 2. Chat Interface Component
interface ChatInterfaceProps {
  onSendMessage: (msg: string) => Promise<void>;
  status: "idle" | "streaming" | "error";
  errorMessage?: string;
  lastMessage?: string;
}

function ChatInterface({ onSendMessage, status, errorMessage, lastMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setValidationError("Message cannot be empty");
      return;
    }
    setValidationError("");
    onSendMessage(input);
    setInput("");
  };

  return (
    <section aria-label="AI Chat Session">
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Your Prompt</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" disabled={status === "streaming"}>
          {status === "streaming" ? "Streaming response..." : "Send Prompt"}
        </button>
      </form>

      {validationError && <p role="alert">{validationError}</p>}
      {status === "error" && <p role="alert">{errorMessage || "Service disruption"}</p>}

      {status === "streaming" && (
        <div role="status" aria-live="polite">
          Generating tokens...
        </div>
      )}

      {lastMessage && (
        <article aria-label="Assistant response">
          <p>{lastMessage}</p>
        </article>
      )}
    </section>
  );
}

// --- TEST SUITE: 6 Meaningful Component Tests ---
describe("Chat Interface & Tool Execution Suite (FE-09)", () => {
  it("1. renders initial idle chat state with accessible label and button", () => {
    render(<ChatInterface onSendMessage={vi.fn()} status="idle" />);
    expect(screen.getByLabelText(/your prompt/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send prompt/i })).toBeEnabled();
  });

  it("2. enforces validation when submitting empty input", async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<ChatInterface onSendMessage={handleSend} status="idle" />);

    await user.click(screen.getByRole("button", { name: /send prompt/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/message cannot be empty/i);
    expect(handleSend).not.toHaveBeenCalled();
  });

  it("3. handles streaming state by disabling submit and displaying live token status", () => {
    render(<ChatInterface onSendMessage={vi.fn()} status="streaming" />);
    expect(screen.getByRole("button", { name: /streaming response/i })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/generating tokens/i);
  });

  it("4. displays accessible alert on error state without API crash", () => {
    render(
      <ChatInterface
        onSendMessage={vi.fn()}
        status="error"
        errorMessage="HTTP 429: Rate limit exceeded"
      />
    );
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/rate limit exceeded/i);
  });

  it("5. renders tool result component with completed status and output", () => {
    render(
      <ToolResultCard
        toolName="CodebaseScout"
        result='{"dependencies": 12, "health": "clean"}'
        status="complete"
      />
    );
    const region = screen.getByRole("region", { name: /tool execution: codebasescout/i });
    expect(region).toBeInTheDocument();
    expect(screen.getByLabelText(/tool output/i)).toHaveTextContent(/dependencies/i);
  });

  it("6. renders tool result component failure alert on error", () => {
    render(<ToolResultCard toolName="VectorSync" result="" status="failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent(/execution failed/i);
  });
});