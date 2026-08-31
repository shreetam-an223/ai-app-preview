"use client";

import React, { useState, useId } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const contentId = useId();

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-100 hover:bg-slate-800/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className={`transform transition-transform duration-200 text-slate-400 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      <div
        id={contentId}
        hidden={!isOpen}
        role="region"
        className="p-4 pt-2 border-t border-slate-800/50 text-sm text-slate-300"
      >
        {children}
      </div>
    </div>
  );
}