"use client";

import React, { useState } from "react";
import { Modal } from "@/components/playground/Modal";
import { Tabs } from "@/components/playground/Tabs";
import { Disclosure } from "@/components/playground/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleTabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <p>
          Handcrafted W3C ARIA compliant tab system supporting Arrow key navigation, Home/End jumping, and proper focus management.
        </p>
      ),
    },
    {
      id: "specs",
      label: "W3C Specs",
      content: (
        <p>
          Implements <code>role=&quot;tablist&quot;</code>, <code>role=&quot;tab&quot;</code> with roving <code>tabIndex</code> (0 for active, -1 for inactive), and <code>role=&quot;tabpanel&quot;</code>.
        </p>
      ),
    },
    {
      id: "audit",
      label: "Audit Results",
      content: (
        <p>
          100% keyboard navigable. Screen readers correctly announce selected tab index and associated panel content.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Accessible Component Playground</h1>
        <p className="text-slate-400 text-sm mt-1">
          Handcrafted ARIA patterns built from scratch in React + TypeScript (No component libraries).
        </p>
      </div>

      {/* Component 1: Modal Dialog */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-sky-400">1. Modal Dialog (Focus Trap & Escape Close)</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          Open Accessible Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="System Confirmation Dialog"
        >
          <p>
            This modal traps keyboard focus inside. Pressing <strong>Tab</strong> or <strong>Shift+Tab</strong> will cycle through focusable elements without escaping to the background page. Press <strong>Escape</strong> to dismiss and return focus to the trigger button.
          </p>
        </Modal>
      </section>

      {/* Component 2: Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-sky-400">2. Tabs (Roving tabindex & Arrow Navigation)</h2>
        <Tabs tabs={sampleTabs} />
      </section>

      {/* Component 3: Disclosure */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-sky-400">3. Disclosure / Accordion (aria-expanded)</h2>
        <div className="space-y-3">
          <Disclosure title="What makes this component accessible?">
            It manages <code>aria-expanded</code> dynamically, associates the toggle with the content panel using <code>aria-controls</code>, and fully responds to standard <code>Enter</code> and <code>Space</code> keys.
          </Disclosure>
          <Disclosure title="Why build without libraries first?">
            Understanding underlying W3C APG patterns allows engineers to review AI-generated code critically and identify accessibility bugs before shipping.
          </Disclosure>
        </div>
      </section>
    </div>
  );
}