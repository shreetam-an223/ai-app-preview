# AI Production Preview (ai-app-preview)

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F_&_WebGL-black?logo=three.js)](https://docs.pmnd.rs/react-three-fiber/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-performance personal engineering portfolio and interactive systems laboratory built with **Next.js (App Router)**, **React Three Fiber (R3F)**, **raw WebGL/GLSL shaders**, and **Tailwind CSS**. Deployed globally on Vercel over automated HTTPS.

* **Live Deployment:** [https://shreetam-dev.vercel.app](https://shreetam-dev.vercel.app)
* **Interactive Shader Hero:** [https://shreetam-dev.vercel.app/shader](https://shreetam-dev.vercel.app/shader)
* **Credential Verification:** [FlyRank Certified Graduate](https://internship.flyrank.ai/verify?id=FR-D1-T668H-R789R&first_name=Shreetam)

---

## 1. Core Architecture & Feature Matrix

```
ai-app-preview/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts      # Rate-limited serverless endpoint (maxDuration=10)
│   │   ├── layout.tsx                # Root layout with SEO/OpenGraph & FlyRank Badge
│   │   ├── page.tsx                  # Primary portfolio dashboard
│   │   ├── not-found.tsx             # Resilient custom 404 handler
│   │   ├── contact/page.tsx          # Sanitized form with optimistic feedback
│   │   ├── 3d/page.tsx               # Interactive R3F canvas playground
│   │   └── shader/page.tsx           # Signature fullscreen GLSL Hero (FE-AA3)
│   └── components/
│       ├── 3d/
│       │   ├── ShaderHero.tsx        # Domain-warped harmonic shader engine
│       │   └── InteractiveCanvas.tsx # 3D mesh configurator with touch handling
│       └── ui/                       # Reusable, accessible UI components
```

### Feature Highlights
- **Mathematical GLSL Hero (`/shader`)**: 60 FPS raw WebGL fragment shader featuring 4-octave domain-warped sine ridges, dynamic `u_mouse` spotlighting, procedural noise, and film grain dither.
- **Interactive 3D Configurator (`/3d`)**: Orbit-controlled geometries with real-time roughness/metalness modifiers and touch support.
- **Hardened Serverless Pipeline (`/api/contact`)**: Sliding-window IP rate limiting (5 req/min), character input ceilings (80/120/2000 chars), and strict format sanitization.
- **Accessibility & Compliance (FE-10)**: Mobile Lighthouse scores $\ge 90$, zero WCAG errors, semantic HTML5 landmarks, visible focus rings, and automated `prefers-reduced-motion` fallbacks.
- **Edge Resilience**: Custom `not-found.tsx` preventing runtime drops, and battery-friendly GPU pausing via `document.visibilitychange`.

---

## 2. Environment Variables

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Base canonical domain for OpenGraph images and links | Optional | `https://shreetam-dev.vercel.app` |
| `VERCEL_ANALYTICS_ID` | Automatically populated when deploying on Vercel | Optional | Injected by platform |

*Note: The project runs completely self-contained without requiring private third-party database keys for basic local evaluation.*

---

## 3. Local Development & Run Instructions

Ensure Node.js (version 18 or later) is installed.

```bash
# 1. Clone repository
git clone https://github.com/shreetam-an223/ai-app-preview.git

# 2. Enter project directory
cd ai-app-preview

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Linting
```bash
# Run ESLint validation
npm run lint

# Generate production standalone build
npm run build

# Preview production build locally
npm run start
```

---

## 4. Key Engineering Decisions & Trade-Offs

1. **Raw WebGL Canvas vs. Heavy Abstraction Libraries for the Hero:**
   - *Decision:* Implemented `ShaderHero.tsx` using native WebGL shader compilation rather than full scene-graph setups for the primary hero.
   - *Reasoning:* Reduced bundle overhead by bypassing unnecessary lighting and shadow calculations, guaranteeing an exact 60 FPS update loop with zero camera-clipping edge cases.
2. **In-Memory Rate Limiting vs. External Redis (Upstash):**
   - *Decision:* Configured sliding window tracking directly inside the Node.js serverless route with a 10s execution cap (`maxDuration = 10`).
   - *Trade-Off:* In multi-region cold-start lambdas, state is ephemeral; however, it eliminates external network latency for evaluation while preventing local denial-of-service spam.
3. **Responsive Visual Contrast Fallbacks:**
   - *Decision:* Injected a manual "Contrast Scrim" toggle and calibrated dark radial vignettes into the GLSL color ramp.
   - *Reasoning:* Ensured text readability always passes WCAG AA criteria ($\ge 4.5:1$ contrast ratio) regardless of cursor position or dynamic wave luminosity.

---

## 5. Honest "How AI Tools Built This"

This project was built leveraging collaborative pair-programming with AI language models:

- **What AI Accelerated:**
  - Generating initial boilerplate configurations for Next.js App Router metadata definitions (`OpenGraph` and `Twitter Card` structures).
  - Assisting with the trigonometry math for domain-warped fractional Brownian motion (`fBm`) iterations in the fragment shader.
  - Designing regex checks and edge-case boundary scenarios during the form breakdown tests.
- **Where Human Oversight Was Critical:**
  - **WebGL Clipping & Viewport Stacking:** AI initially placed the shader plane inside standard Three.js perspective coordinates, which caused Z-index and camera projection clipping. Refactoring to a direct screen-space WebGL quad resolved this.
  - **Accessibility Fine-Tuning:** AI suggestions frequently omitted `aria-live` regions or forgot to test mobile hamburger touch-target hitboxes ($44\times 44\text{px}$). Manual auditing was required to achieve clean scores.
  - **Performance Clamping:** Added DPR clamps (`Math.min(devicePixelRatio, 2)`) and visibility change event listeners to prevent thermal throttling on high-DPI displays.