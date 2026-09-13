import { NextRequest } from "next/server";
import { executeAuditTool, AuditToolInput } from "@/lib/tools/audit-tool";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // Check if the user is triggering a tool run (or test error)
    const isToolCall = lastMessage.toLowerCase().includes("audit") || lastMessage.toLowerCase().includes("test");

    if (isToolCall) {
      const isSimulatedError = lastMessage.toLowerCase().includes("fail") || lastMessage.toLowerCase().includes("error");
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

    // Standard streaming chat fallback
    const encoder = new TextEncoder();
    const tokens = `I am ready. Type "audit" to trigger our server-side structured audit tool, or type "audit fail" to test designed error recovery!`.split(" ");

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < tokens.length; i++) {
          const chunk = (i === 0 ? "" : " ") + tokens[i];
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed chat stream" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}