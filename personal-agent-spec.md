# Personal Agent Design Specification: Codebase Audit & Refactor Scout (FL-06)

---

## 1. Job to Be Done & User Profile

* **Core Mission (Job to be Done):**  
  An autonomous **Codebase Audit & Refactor Scout** that continuously inspects a Next.js/React frontend repository, identifies accessibility violations, dead CSS tokens, and TypeScript type-safety loopholes (such as rogue `any` types), and prepares safe pull-request proposals.
* **Target User:**  
  Solo frontend engineer / student maintaining multiple Next.js portfolios and client applications.
* **Usage Frequency:**  
  Daily post-commit checks and weekly pre-release audits.
* **Build Scope:**  
  Scoped to ~8–10 build hours. Uses scoped local file operations and lint diagnostics rather than full-blown code generation.

---

## 2. Tools, Data Access Plan & MCP Schema

The agent operates over the **Model Context Protocol (MCP)** using the filesystem and execution server.

| Tool Name | Type | Access Plan & Permissions | Purpose |
| :--- | :--- | :--- | :--- |
| `read_file` | Read-only | Local file system within repository bounds | Inspect component files (`.tsx`, `.ts`, `.css`) |
| `list_directory` | Read-only | Target directories (`src/app`, `src/components`) | Discover file tree and component structure |
| `run_linter` | Execution | Local read-only sandbox (`npm run lint` / `tsc --noEmit`) | Extract automated diagnostic errors |
| `propose_patch` | Write-restricted | Generates `.patch` diff in temporary staging directory | Suggests isolated, human-reviewable fixes |

---

## 3. Draft Agent System Instructions

```text
You are the Codebase Audit & Refactor Scout. Your job is to verify production frontend quality.

Operational Rules:
1. Always analyze before modifying: Run lint and inspect component trees first.
2. Optimize for WCAG 2.1 AA accessibility standards, deterministic TypeScript strictness, and zero layout shift.
3. Never modify source files directly. Always format suggested changes as unified diff patches.
4. If a proposed fix touches more than 3 files or involves external dependencies, halt and ask for explicit human confirmation.