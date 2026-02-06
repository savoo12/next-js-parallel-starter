"use client";

import type { ActivePanel } from "../page";

interface HeaderProps {
  activePanel: ActivePanel;
  onBack: () => void;
}

export default function Header({ activePanel, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {activePanel !== "idle" && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Go back to home"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <svg className="h-4 w-4" viewBox="0 0 1155 1000" fill="none">
              <path
                d="m577.3 0 577.4 1000H0z"
                fill="currentColor"
                className="text-primary-foreground"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Parallel
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-1">
        <a
          href="https://docs.parallel.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Docs
        </a>
      </nav>
    </header>
  );
}
