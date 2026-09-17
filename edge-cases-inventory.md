# Edge Cases, Error States & Sabotage Inventory (FE-08)

---

## 1. Inventory of Handled Edge Cases

| Failure Scenario | Trigger in App | Designed System Behavior | Recovery Path |
| :--- | :--- | :--- | :--- |
| **First-Run Empty State** | Page load or "Reset Session" | Onboarding cards with 4 clickable preset prompt chips. No blank-screen dead end. | User clicks any starter chip to trigger immediate streaming. |
| **Mid-Stream Network Kill** | Prompt: `"sabotage stream"` | ReadableStream throws mid-transmission; stream halts cleanly without wiping prior text. | Non-blocking inline error card displayed with single-click "Retry Prompt" action. |
| **Rate Limit (HTTP 429)** | Prompt: `"sabotage 429"` | Server rejects connection with 429 status and JSON error payload. | Error banner displays exact quota context with retry option. |
| **Server Gateway Crash (HTTP 500)** | Prompt: `"sabotage network"` | Route handler returns status 500. UI stays mounted without white-screen crash. | Preserves conversation history; user retries without re-typing. |
| **Client Route Crash** | Uncaught JS exception | `error.tsx` boundary intercepts render crash; provides friendly fallback card. | "Recover Session" resets error boundary; "Hard Reload" refreshes page. |
| **Layout Shift (CLS)** | Pre-token latency | Fixed-height skeleton loader mounts during `isThinking` phase, matching assistant card dimensions. | Eliminates layout jump when first token streams in. |
| **Mobile Safari Keyboards** | Small screens / mobile browsers | Styled with `h-[calc(100dvh-120px)]` to prevent iOS address bar cutoff. | Maintains pin-to-bottom auto-scroll smoothly on resize. |

---

## 2. Test By Sabotage Verification Protocol

1. **Happy Path:**
   * Entered: *"Tell me about Next.js"*
   * Outcome: Tokens stream smoothly token-by-token with zero console errors.
2. **Mid-Stream Failure Test:**
   * Entered: *"sabotage stream"*
   * Outcome: Controller enqueues 3 tokens and terminates connection. Inline error banner renders; partial text remains visible. Clicked **"Retry Prompt"** to successfully resume.
3. **HTTP 429 Rate Limit Test:**
   * Entered: *"sabotage 429"*
   * Outcome: API returns HTTP 429; custom banner surfaces rate limit feedback directly to user.