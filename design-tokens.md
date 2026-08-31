# Portfolio Design System & Intentional Tokens

## 1. Color Palette (60-30-10 Rule)
- **Dominant Base (60%):** `#020617` (Deep Slate / Dark Foundation)
  - Used for: Full page backgrounds.
- **Surface / Container (30%):** `#0F172A` (Neutral Dark Slate)
  - Used for: Cards, navigation bars, modal dialogs, and section wrappers.
- **Accent Highlight (10%):** `#38BDF8` (Sky Blue)
  - Used for: Primary action buttons, active navigation links, and key focus states only.
- **Subtle Borders:** `#1E293B` (1px solid boundaries for clean visual separation).

---

## 2. Typography Scale & Font Families
- **Body & UI Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Body text: `15px` / Line-height: `1.5` / Regular weight (`400`).
  - Section headers: `24px` / Bold weight (`700`).
- **Code & Proof Font:** `ui-monospace, "Fira Code", monospace`
  - Terminal logs, code blocks, and system metrics: `13px` / Regular weight (`400`).

---

## 3. Spacing & Framing Constraints ("Frame, Not Upstage")
- **Spacing Grid:** Multiples of 8px (`8px`, `16px`, `24px`, `32px`, `48px`).
- **Border Treatment:** Crisp `1px solid` container lines to frame interactive components.
- **Rule of Restraint:** Zero decorative background gradients, 3D floating icons, or flashy animations. The UI acts purely as a clear frame for authentic code proof and working prototypes.