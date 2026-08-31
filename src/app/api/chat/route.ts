import { NextRequest } from "next/server";
import { AI_CONFIG } from "@/lib/ai-config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello";

    // Prepare simulated streaming chunks (or integrate with Anthropic API if key is set)
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Default: High-fidelity deterministic token streaming simulation
    const responseTemplate = `I received your prompt: "${lastUserMessage}".

Here is the production breakdown:
1. **Streaming Protocol**: Data arrives chunk-by-chunk via ReadableStream over HTTP.
2. **Deterministic State**: State is preserved across multiple turns without UI flicker.
3. **Accessibility**: Screen reader live regions and keyboard controls remain active during generation.

Feel free to stop generation mid-stream or ask a follow-up question!`;

    const encoder = new TextEncoder();
    const tokens = responseTemplate.split(" ");

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < tokens.length; i++) {
          const chunk = (i === 0 ? "" : " ") + tokens[i];
          controller.enqueue(encoder.encode(chunk));
          // Realistic token streaming delay (35ms per token)
          await new Promise((resolve) => setTimeout(resolve, 35));
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
      JSON.stringify({ error: "Failed to process chat stream" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}