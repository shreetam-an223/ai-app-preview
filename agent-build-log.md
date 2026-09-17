# Agent Build Log & Deviations (FL-07)

---

## 1. Executive Summary & Core Loop Verification
* **Job Done:** Scans frontend TypeScript components (`.tsx`/`.ts`), flags accessibility holes, loose type constraints, and orphaned console logs, and outputs a non-destructive audit report to `.review/agent-audit-report.json`.
* **Live Connection:** Uses direct local filesystem I/O (`fs`, `path`) to parse production components without simulated mocks.
* **Autonomy:** Runs end-to-end in a single command without mid-run human editing or interactive manual stepping.

---

## 2. Iteration Log: What Broke & What Changed

| Iteration | Intended Feature | What Broke / Failed | Fix / Architectural Adjustment |
| :---: | :--- | :--- | :--- |
| **01** | Direct AST Code Modification | Abstract Syntax Tree modifications accidentally stripped custom JSX attributes and broke Tailwind class ordering. | Cut automated file rewriting. Adjusted to a non-destructive audit report pattern saving structured findings to `.review/`. |
| **02** | Live Child Process CLI Spawning | Invoking `npm run lint` within the script triggered child process pipe deadlocks on Windows environments. | Replaced shell subprocess piping with direct regex-based AST keyword scanning directly over component buffers. |
| **03** | Broad Directory Scanning | Initial recursive scan parsed `node_modules` and `.next`, causing heap memory exhaustion. | Hardcoded strict repository bounds (`src/components` and `src/app`). |

---

## 3. Deviations from the FL-06 Spec

1. **Self-Executing Node Engine:**  
   * *Spec Planned:* Desktop MCP bridge exclusively inside Claude Desktop.
   * *Implementation:* Shipped a reproducible standalone Node runtime runner (`npm run agent:run`) alongside MCP tool contracts to allow local automated execution and CI integration.
2. **Patch Generation Scoped Down:**  
   * *Spec Planned:* Auto-generated `.patch` unified diffs.
   * *Implementation:* Scoped to structured JSON diagnostics first to prevent accidental destructive overwrites of production React components.

---

## 4. Run Execution Transcript

```text
> ai-app-preview@0.1.0 agent:run
> node scripts/run-scout-agent.mjs

🚀 [Agent Init]: Booting Codebase Audit & Refactor Scout...
🔍 [Observation]: Scanning component repository for a11y, style tokens, and type constraints...
📂 [Tool: list_directory]: Found 4 active TypeScript components.

✅ [Agent Loop Complete]: End-to-end inspection finished without errors.
📊 Scanned: 4 files | Flagged: 2 quality items.
📝 Output saved safely to: .review/agent-audit-report.json