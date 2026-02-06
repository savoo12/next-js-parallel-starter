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
}: ActiveViewProps) {
  if (activePanel === "idle") return null;

  const meta = PANEL_META[activePanel];

  return (
    <div className="w-full max-w-3xl">
      {/* Panel header */}
      <div className="mb-6">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {meta.description}
        </p>
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
