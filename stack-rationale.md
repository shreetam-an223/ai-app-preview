# Three Roads: Tech Stack Evaluation & Decision Rationale

---

## 1. Project Constraints & Needs

* **Cost:** 100% free-tier tooling and hosting only.
* **Skill Level:** Foundational full-stack web engineering (React, TypeScript, Next.js, Tailwind CSS).
* **Work Display Needs:** 
  * Live interactive engineering demos (streaming AI chat, accessible component playground).
  * Proof endpoints (live server-side health checks).
  * Long-form architectural notes and case study summaries.
* **Dynamic Requirements:** 
  * Needs server-side edge/node streaming for AI interactions (`ReadableStream` / SSE) and dynamic server rendering for runtime diagnostic proof. 
  * Full database persistence is "not yet" required; state is managed client-side in memory with transient API streaming.

---

## 2. Three Roads: Stack Options & Trade-Off Matrix

| Metric / Aspect | Option 1: Simplest (Static Site Generator) | Option 2: Sweet Spot (Next.js App Router) | Option 3: Most Powerful (Full-Stack + Separate DB) |
| :--- | :--- | :--- | :--- |
| **Stack** | Astro / Vite + Static Markdown | Next.js 14+ (App Router, React, Tailwind CSS, TypeScript) | Next.js + Fastify / Express + PostgreSQL (Supabase / Prisma) |
| **Hosting (Free)** | GitHub Pages / Cloudflare Pages | Vercel (Free Hobby Tier) | Vercel + Supabase Free Tier + Render |
| **Backend Needed?** | None (Static HTML/JS export) | Lightweight Route Handlers (Serverless/Edge functions only) | Dedicated API server and persistent relational database |
| **Key Advantage** | Zero maintenance, virtually instant build and load times. | Native streaming support, co-located route handlers, zero configuration deploys. | True production multi-tenant scale with permanent message persistence. |
| **The Real Trade-Off** | Cannot support live streaming route handlers or live server health checks without third-party services. | Requires managing React hydration and server vs. client component boundaries. | High configuration overhead, database migrations, connection pooling limits, and maintenance debt. |

---

## 3. Pressure-Testing the Front-Runner (Next.js App Router)

* **What breaks if I pick the simplest (Astro / Pure Static)?**  
  The core engineering proof breaks. An AI frontend portfolio cannot just *talk* about AI; it must *run* AI. Static hosting on GitHub Pages cannot execute native streaming route handlers or server-rendered runtime diagnostics without third-party external APIs.
* **What do I maintain if I pick the most powerful (Full Backend + DB)?**  
  I take on database schema migrations, environment sync issues, database connection timeouts on serverless, and session management. None of that adds immediate value to the frontend engineering showcase right now.
* **Can I finish in two weeks?**  
  Yes. Next.js App Router with Vercel deployment provides route handlers out-of-the-box without extra infrastructure scaffolding.
* **Does it show my work the way it needs to be shown?**  
  Yes. It showcases modern React Server Components, client-side accessible interactive primitives, real-time token streaming, and server diagnostics within a single coherent repository.

---

## 4. Final Decision & Rationale

**Chosen Stack:** Next.js (App Router) + TypeScript + Tailwind CSS deployed on Vercel.

**Why I chose it:**  
It hits the exact sweet spot between interactive fidelity and delivery speed. It allows me to demonstrate production AI engineering patterns (token streaming, abort controllers, accessible ARIA state machines) while remaining completely free to deploy and maintain on Vercel.

**Why I rejected Option 1 (Static):**  
Pure static sites fail to prove I can handle streaming network boundaries, asynchronous server components, and API routing.

**Why I rejected Option 3 (Dedicated Backend + Database):**  
A dedicated database adds unnecessary operational complexity when my primary objective is proving frontend AI engineering fluency and reliable UI systems. A dedicated database is a "not yet" requirement.

**Can I maintain this?**  
Yes. A single repository with zero external database dependencies ensures it will build and run reliably every time without breaking or incurring hidden costs.