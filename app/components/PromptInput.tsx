"use client";

import { useState } from "react";
import type { ActivePanel } from "../page";

interface PromptInputProps {
  onSubmit: (panel: ActivePanel) => void;
  onPanelSelect: (panel: ActivePanel) => void;
}

const MODES: { id: ActivePanel; label: string; icon: React.ReactNode }[] = [
  {
    id: "search",
    label: "Search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    id: "extract",
    label: "Extract",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    ),
  },
];

export default function PromptInput({ onPanelSelect }: PromptInputProps) {
  const [hoveredMode, setHoveredMode] = useState<ActivePanel | null>(null);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md">
        <div className="flex items-center gap-2 px-5 py-4">
          <svg
            className="h-5 w-5 shrink-0 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="flex-1 text-base text-muted-foreground">
            What are you looking for?
          </span>
        </div>

        {/* Mode selector row */}
        <div className="flex items-center gap-2 border-t border-border px-5 py-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onPanelSelect(mode.id)}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                hoveredMode === mode.id
                  ? "bg-foreground text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            Choose a mode to get started
          </span>
        </div>
      </div>
    </div>
  );
}
