"use client";

import type { ActivePanel } from "../page";
import SearchDemo from "./SearchDemo";
import ExtractDemo from "./ExtractDemo";
import TasksDemo from "./TasksDemo";

interface ActiveViewProps {
  activePanel: ActivePanel;
  prefillQuery: string;
  onBack: () => void;
}

const PANEL_META: Record<
  Exclude<ActivePanel, "idle">,
  { title: string; description: string }
> = {
  search: {
    title: "Search",
    description: "Search the web with natural language",
  },
  extract: {
    title: "Extract",
    description: "Pull structured content from any URL",
  },
  tasks: {
    title: "Tasks",
    description: "Run deep research with real-time progress",
  },
};

export default function ActiveView({
  activePanel,
  prefillQuery,
  onBack,
}: ActiveViewProps) {
  if (activePanel === "idle") return null;

  const meta = PANEL_META[activePanel];

  return (
    <div className="w-full max-w-3xl">
      {/* Back + Panel header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
        </button>
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
            {meta.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Panel content */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {activePanel === "search" && <SearchDemo prefillQuery={prefillQuery} />}
        {activePanel === "extract" && (
          <ExtractDemo prefillQuery={prefillQuery} />
        )}
        {activePanel === "tasks" && <TasksDemo prefillQuery={prefillQuery} />}
      </div>
    </div>
  );
}
