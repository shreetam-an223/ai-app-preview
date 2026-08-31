"use client";

import React, { useState, useRef } from "react";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTabId || tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = index;

    if (e.key === "ArrowRight") {
      targetIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveTab(tabs[targetIndex].id);
    tabRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div role="tablist" aria-label="Playground Tabs" className="flex border-b border-slate-800 space-x-2">
        {tabs.map((tab, idx) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isSelected
                  ? "border-sky-400 text-sky-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
            className="text-slate-300 text-sm focus:outline-none"
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}