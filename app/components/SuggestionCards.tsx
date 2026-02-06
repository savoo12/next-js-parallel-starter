"use client";

import type { ActivePanel } from "../page";

interface SuggestionCardsProps {
  onCardClick: (panel: ActivePanel, query: string) => void;
}

const SUGGESTIONS = [
  {
    title: "Search the Web",
    description: "Find recent news about AI safety research and developments.",
    panel: "search" as ActivePanel,
    query: "Find recent news about AI safety research",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    title: "Extract Content",
    description: "Pull structured data from any webpage or article.",
    panel: "extract" as ActivePanel,
    query: "https://example.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: "Research Task",
    description: "Run a deep research task with real-time progress updates.",
    panel: "tasks" as ActivePanel,
    query: "Research the top 5 AI companies and their latest announcements",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  {
    title: "Agentic Search",
    description: "Use agentic mode for multi-step, iterative web research.",
    panel: "search" as ActivePanel,
    query: "Compare the latest features of Next.js and Remix frameworks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: "Batch Extract",
    description: "Extract and compare content from multiple URLs at once.",
    panel: "extract" as ActivePanel,
    query: "https://nextjs.org\nhttps://remix.run",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </svg>
    ),
  },
  {
    title: "Deep Research",
    description: "Use the Pro processor for thorough, multi-step investigations.",
    panel: "tasks" as ActivePanel,
    query: "Analyze the current state of autonomous AI agents and their market impact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function SuggestionCards({ onCardClick }: SuggestionCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion.title}
          onClick={() => onCardClick(suggestion.panel, suggestion.query)}
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-foreground/20 hover:shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-primary-foreground">
            {suggestion.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {suggestion.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {suggestion.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
