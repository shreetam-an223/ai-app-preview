# Agent Concepts and Model Context Protocol (MCP) Explainer

---

## 1. Architectural Distinction: Workflows vs. Agents

The boundary between an automated workflow and an autonomous agent is defined by **who directs execution and control flow**:

* **Workflows (Predefined Code Paths):**  
  In a workflow, LLMs and programmatic steps follow hardcoded, deterministic paths orchestrated in advance. A task is broken down into fixed steps (e.g., prompt chaining, routing, or parallel processing). The LLM processes data at individual nodes, but it never decides what step happens next, whether to loop backwards, or when the overall process finishes. If step 2 finishes, step 3 executes unconditionally.

* **Agents (Dynamic Self-Directed Loops):**  
  In an agentic architecture, the LLM sits in an active runtime control loop (a Thought-Action-Observation cycle). The model determines its own plan, selects and executes external tools based on intermediate feedback from the environment, evaluates whether the outcome met the goal, and decides autonomously whether to take another action, retry a failed call, or finish.

---

## 2. Classification of the FL-04 Pipeline

Our **FL-04 Source-Grounded Study Notes Pipeline** is strictly a **workflow (specifically a prompt chain)**, not an agent.

* **Why It Is a Workflow:** The sequence is hardcoded: `Step 1 (Gather) -> Step 2 (Synthesize) -> Step 3 (Format)`.
* The LLM lacks runtime autonomy: it cannot reject an input as insufficient, cannot query an external web browser or file tree to fetch supplementary context, cannot assess its own output against a test suite, and cannot loop back to revise without external human intervention.

---

## 3. Understanding MCP: The "USB-C Standard" for AI Systems

The **Model Context Protocol (MCP)** provides an open, standardized protocol that allows AI models to connect securely to local files, external APIs, and services without requiring custom point-to-point integrations for each client.

MCP operates around **three core primitives**:

1. **Tools (Model-Controlled):**  
   Executable functions exposed by the MCP server that the model chooses to call autonomously. Tools allow models to take actions in the real world (e.g., reading a local file, running a shell command, searching a database).
2. **Resources (Application-Controlled):**  
   Data sources and contextual artifacts exposed by the MCP server (such as document schemas, logs, or file contents) that the client application injects directly into the context window for ambient reference.
3. **Prompts (User-Controlled):**  
   Pre-configured prompt templates and slash commands stored on the server that humans can trigger to invoke standardized, repeatable workflows.

---

## 4. MCP Connector Verification: Three Tool Tasks

We configured the **Filesystem MCP Server** (`@modelcontextprotocol/server-filesystem`) within Claude Desktop / MCP client to grant controlled access to local workspace directories.

### Task 1: Inspecting Local Git Repository Architecture
* **Goal:** Verify project directory layout directly from the local file system.
* **Tool Call:** `read_directory` on root `/ai-app-preview`
* **Result:** The model retrieved the full file tree, confirming the existence of `src/app/chat`, `src/app/playground`, and configuration markdown files without manual copy-pasting.

### Task 2: Reading Local Environment & Token Specifications
* **Goal:** Extract hex codes directly from `design-tokens.md`.
* **Tool Call:** `read_file` on `design-tokens.md`
* **Result:** The model opened the local markdown file, read the raw buffer, and verified the primary and secondary design tokens directly from disk.

### Task 3: Verifying Diagnostic Route Handlers
* **Goal:** Inspect server-side TypeScript code for security best practices.
* **Tool Call:** `read_file` on `src/app/api/chat/route.ts`
* **Result:** The model read the file content, verified that environment variables are evaluated server-side only, and confirmed that streaming responses handle abort signals cleanly.

*(These tasks require direct disk I/O through MCP tools that a vanilla chat model cannot execute.)*

---

## 5. Concrete Upgrade: Transforming the FL-04 Workflow into a True Agent

To evolve our FL-04 study notes chain into an **Autonomous Technical Research Agent**, we must introduce an **Evaluator-Optimizer Loop with MCP Tool Access**:

1. **MCP Search & Fetch Tools:** Instead of pasting text manually, give the model MCP tools to fetch live web documentation and search local documentation files.
2. **Dynamic Evaluator Loop:** After generating draft notes, a second internal LLM call (or automated test validator) audits the generated output against a defined checklist (checking for code sample accuracy, missing accessibility guidelines, or hallucinations).
3. **Iterative Self-Correction:** If the evaluation score falls below threshold, the agent does not output the draft. Instead, it formulates a follow-up search query, fetches missing information via MCP, and updates the draft until the criteria are satisfied.