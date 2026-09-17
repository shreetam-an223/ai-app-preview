import { NextRequest } from "next/server";
import { executeAuditTool, AuditToolInput } from "@/lib/tools/audit-tool";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = (messages[messages.length - 1]?.content || "").trim().toLowerCase();

    // 1. Sabotage Case: Rate Limit (HTTP 429)
    if (lastMessage.includes("sabotage 429") || lastMessage.includes("rate limit")) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Standard quota allows 5 requests/min." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Sabotage Case: Immediate Server / Network Failure (HTTP 500)
    if (lastMessage.includes("sabotage network") || lastMessage.includes("server error")) {
      return new Response(
        JSON.stringify({ error: "Upstream gateway connection dropped mid-handshake." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Tool execution flow
    const isToolCall = lastMessage.includes("audit") || lastMessage.includes("test");
    if (isToolCall) {
      const isSimulatedError = lastMessage.includes("fail") || lastMessage.includes("error");
      const targetUrl = isSimulatedError ? "https://fail.local/api" : "https://ai-app-preview.vercel.app/playground";

      const toolInput: AuditToolInput = {
        targetUrl,
        auditScope: "accessibility",
      };

      try {
        const result = await executeAuditTool(toolInput);
        return new Response(
          JSON.stringify({
            type: "tool-response",
            toolName: "auditFrontendRoute",
            input: toolInput,
            output: result,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            type: "tool-error",
            toolName: "auditFrontendRoute",
            input: toolInput,
            errorMessage: err instanceof Error ? err.message : "Failed to execute audit tool",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 4. Sabotage Case: Interrupted Mid-Stream Abort
    const willKillMidStream = lastMessage.includes("sabotage stream");

    const responseTemplate = willKillMidStream
      ? "Initiating stream transmission... Token 1... Token 2... [Simulated Network Disconnect Occurred]"
      : `Streaming response for: "${lastMessage}". All core streaming protocols operational. Try testing edge cases using the quick buttons or sabotage prompts.`;

    const encoder = new TextEncoder();
    const tokens = responseTemplate.split(" ");

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < tokens.length; i++) {
          if (willKillMidStream && i >= 4) {
            controller.error(new Error("Stream terminated unexpectedly: socket reset by peer."));
            return;
          }
          const chunk = (i === 0 ? "" : " ") + tokens[i];
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server execution failure." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}