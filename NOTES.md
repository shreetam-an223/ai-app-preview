# Accessibility Comparison Notes: Handcrafted vs. shadcn/ui (Radix Primitives)

## 1. Concrete Gaps Identified in Handcrafted Components

### Gap 1: Edge Cases in Focus Trapping & Portals (Modal Dialog)
* **Handcrafted Implementation:**  
  Used a simple `querySelectorAll` query for standard focusable tags and placed the modal directly inside the current DOM hierarchy with `fixed` styling.
* **What shadcn/ui (Radix UI) Handles Better:**  
  * **React Portals:** Radix renders dialogs via `@radix-ui/react-portal` at the root `document.body` level, avoiding z-index collisions and `overflow:hidden` clipping from parent containers.
  * **Inert Background (`aria-hidden`):** Radix automatically sets `aria-hidden="true"` on all sibling background DOM nodes so screen readers cannot accidentally read background content while the modal is open.
  * **Dynamic DOM Elements:** Radix uses `@radix-ui/react-focus-scope` to handle dynamically rendered elements and iframe focus traps gracefully.

### Gap 2: Automatic vs. Manual Tab Activation & Multi-Directional Orientation (Tabs)
* **Handcrafted Implementation:**  
  Focused strictly on horizontal tabs with automatic selection on arrow navigation.
* **What shadcn/ui (Radix UI) Handles Better:**  
  * **Orientation Support:** Radix natively supports both `horizontal` (ArrowLeft/Right) and `vertical` (ArrowUp/Down) orientations via an `orientation` prop.
  * **Activation Modes:** Radix supports both automatic activation (focusing activates tab) and manual activation (focusing requires pressing `Enter` or `Space` to activate), conforming to both W3C APG tab patterns.
  * **Directionality (RTL):** Radix accounts for right-to-left languages, swapping `ArrowRight` and `ArrowLeft` behaviors seamlessly.

---

## 2. Key Takeaways
1. Handcrafting components from scratch builds deep intuition for ARIA roles (`role="dialog"`, `role="tablist"`, `role="tab"`, `role="tabpanel"`), roving `tabIndex`, and keyboard event handlers.
2. Production headless libraries (like Radix UI / shadcn) handle extensive low-level edge cases: portal rendering, background inertness, mobile touch interactions, and RTL language directionality.