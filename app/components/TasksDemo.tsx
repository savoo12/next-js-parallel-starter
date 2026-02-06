"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { parseTaskOutput } from "@/lib/parallel";

interface TaskEvent {
  type: string;
  timestamp?: string;
  message?: string;
  data?: Record<string, unknown>;
}

interface TaskRun {
  run_id: string;
  status: string;
  processor: string;
  input: string;
  createdAt: string;
}

interface StoredTask {
  taskRun: TaskRun;
  events: TaskEvent[];
  finalOutput: string | null;
  status: "running" | "completed" | "failed";
  error?: string;
}

const STORAGE_KEY = "parallel-tasks";

const PROCESSORS = [
  { value: "lite", label: "Lite", description: "$5/1000 runs" },
  { value: "base", label: "Base", description: "$10/1000 runs" },
  { value: "core", label: "Core", description: "$25/1000 runs" },
  { value: "pro", label: "Pro", description: "$100/1000 runs" },
  { value: "ultra", label: "Ultra", description: "$300/1000 runs" },
];

function getStoredTasks(): StoredTask[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore
  }
  return [];
}

function saveTasksToStorage(tasks: StoredTask[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore
  }
}

// Collapsible accordion
function Accordion({
  title,
  children,
  defaultOpen = false,
  badge,
  variant = "default",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  variant?: "default" | "success" | "error";
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: "border-border",
    success: "border-foreground/10 bg-muted/50",
    error: "border-destructive/20 bg-destructive/5",
  };

  return (
    <div className={`overflow-hidden rounded-xl border ${variantStyles[variant]}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        {badge}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

interface TasksDemoProps {
  prefillQuery?: string;
}

export default function TasksDemo({ prefillQuery }: TasksDemoProps) {
  const [input, setInput] = useState("");
  const [processor, setProcessor] = useState("lite");
  const [tasks, setTasks] = useState<StoredTask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<StoredTask[]>(tasks);

  // Apply prefill
  useEffect(() => {
    if (prefillQuery && isHydrated && !input) {
      setInput(prefillQuery);
    }
  }, [prefillQuery, isHydrated, input]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const checkTaskStatus = useCallback(async (runId: string) => {
    try {
      const response = await fetch(`/api/tasks/${runId}/status`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to check status");
      return data;
    } catch (err) {
      console.error("Error checking task status:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedTasks = getStoredTasks();
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
      const runningTasks = storedTasks.filter((t) => t.status === "running");
      if (runningTasks.length > 0) {
        runningTasks.forEach(async (task) => {
          const statusData = await checkTaskStatus(task.taskRun.run_id);
          if (statusData) {
            if (statusData.status === "completed") {
              const output = parseTaskOutput(statusData.output);
              setTasks((prev) =>
                prev.map((t) =>
                  t.taskRun.run_id === task.taskRun.run_id
                    ? { ...t, status: "completed" as const, finalOutput: output }
                    : t
                )
              );
            } else if (statusData.status === "failed") {
              setTasks((prev) =>
                prev.map((t) =>
                  t.taskRun.run_id === task.taskRun.run_id
                    ? { ...t, status: "failed" as const, error: statusData.error?.message || "Task failed" }
                    : t
                )
              );
            } else if (statusData.status === "running" || statusData.status === "queued") {
              setActiveTaskId(task.taskRun.run_id);
            }
          }
        });
      }
    }
    setIsHydrated(true);
  }, [checkTaskStatus]);

  useEffect(() => {
    if (isHydrated) saveTasksToStorage(tasks);
  }, [tasks, isHydrated]);

  useEffect(() => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollTop = eventsContainerRef.current.scrollHeight;
    }
  }, [tasks, activeTaskId]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  const updateTask = useCallback((runId: string, updates: Partial<StoredTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.taskRun.run_id === runId ? { ...t, ...updates } : t))
    );
  }, []);

  const addEventToTask = useCallback((runId: string, event: TaskEvent) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.taskRun.run_id === runId ? { ...t, events: [...t.events, event] } : t
      )
    );
  }, []);

  const startEventStream = useCallback(
    (runId: string) => {
      if (eventSourceRef.current) eventSourceRef.current.close();

      const eventSource = new EventSource(`/api/tasks/${runId}/events`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addEventToTask(runId, {
            type: data.type || "unknown",
            timestamp: new Date().toISOString(),
            message: data.message || data.progress_message,
            data,
          });

          const status = data.run?.status || data.status;

          if (data.type === "task_run.state" && status === "completed") {
            const output = parseTaskOutput(data.output);
            updateTask(runId, { status: "completed", finalOutput: output });
            eventSource.close();
            eventSourceRef.current = null;
          }

          if (data.type === "task_run.state" && status === "failed") {
            updateTask(runId, {
              status: "failed",
              error: data.run?.error?.message || data.error?.message || "Task failed",
            });
            eventSource.close();
            eventSourceRef.current = null;
          }
        } catch {
          // Non-JSON event
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        eventSourceRef.current = null;
      };
    },
    [addEventToTask, updateTask]
  );

  useEffect(() => {
    if (isHydrated && activeTaskId) {
      const activeTask = tasks.find((t) => t.taskRun.run_id === activeTaskId);
      if (activeTask?.status === "running" && !eventSourceRef.current) {
        startEventStream(activeTaskId);
      }
    }
  }, [isHydrated, activeTaskId, tasks, startEventStream]);

  const handleCreateTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim(), processor }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Task creation failed");

      const newTask: StoredTask = {
        taskRun: {
          run_id: data.run_id,
          status: data.status,
          processor,
          input: input.trim(),
          createdAt: new Date().toISOString(),
        },
        events: [],
        finalOutput: null,
        status: "running",
      };

      setTasks((prev) => [newTask, ...prev]);
      setActiveTaskId(data.run_id);
      setInput("");
      setLoading(false);
      startEventStream(data.run_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const deleteTask = (runId: string) => {
    if (activeTaskId === runId && eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setTasks((prev) => prev.filter((t) => t.taskRun.run_id !== runId));
    if (activeTaskId === runId) setActiveTaskId(null);
  };

  const clearAllTasks = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setTasks([]);
    setActiveTaskId(null);
  };

  const activeTask = tasks.find((t) => t.taskRun.run_id === activeTaskId);
  const isStreaming = activeTask?.status === "running" && eventSourceRef.current !== null;

  if (!isHydrated) {
    return <div className="space-y-6" />;
  }

  return (
    <div className="space-y-5">
      {/* Task input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="task-input"
            className="text-sm font-medium text-foreground"
          >
            Research Task
          </label>
          <span className="text-xs text-muted-foreground">Powered by Parallel</span>
        </div>
        <textarea
          id="task-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your research task..."
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          rows={4}
          disabled={loading || isStreaming}
        />
      </div>

      {/* Processor selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Processor
        </label>
        <div className="flex flex-wrap gap-2">
          {PROCESSORS.map((p) => (
            <button
              key={p.value}
              onClick={() => setProcessor(p.value)}
              disabled={loading || isStreaming}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                processor === p.value
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground disabled:opacity-40"
              }`}
            >
              {p.label}
              <span className="ml-1 opacity-60">{p.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleCreateTask}
        disabled={loading || isStreaming || !input.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {(loading || isStreaming) && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {loading ? "Creating Task..." : isStreaming ? "Task Running..." : "Start Task"}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Task list */}
      {tasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Tasks ({tasks.length})
            </h3>
            <button
              onClick={clearAllTasks}
              className="text-xs text-destructive transition-colors hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.taskRun.run_id}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  task.status === "running"
                    ? "border-accent/40"
                    : task.status === "completed"
                    ? "border-foreground/10"
                    : "border-destructive/30"
                }`}
              >
                {/* Task header */}
                <div className="bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-foreground">
                        {task.taskRun.input}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">{task.taskRun.run_id.slice(0, 8)}...</span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
                          {task.taskRun.processor}
                        </span>
                        <span>{new Date(task.taskRun.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status === "running" && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                          Running
                        </span>
                      )}
                      {task.status === "completed" && (
                        <span className="rounded-lg bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground">
                          Completed
                        </span>
                      )}
                      {task.status === "failed" && (
                        <span className="rounded-lg bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                          Failed
                        </span>
                      )}
                      <button
                        onClick={() => deleteTask(task.taskRun.run_id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordions */}
                <div className="space-y-2 border-t border-border bg-muted/30 p-3">
                  {task.events.length > 0 && (
                    <Accordion
                      title="Events"
                      badge={
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {task.events.length}
                        </span>
                      }
                      defaultOpen={task.status === "running"}
                    >
                      <div
                        ref={task.taskRun.run_id === activeTaskId ? eventsContainerRef : undefined}
                        className="mt-2 max-h-48 space-y-2 overflow-y-auto"
                      >
                        {task.events.map((event, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-border bg-card p-2.5 text-sm"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">
                                {event.type}
                              </span>
                              {event.timestamp && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                            {event.message && (
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {event.message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {task.finalOutput && (
                    <Accordion title="Output" variant="success" defaultOpen={true}
                      badge={
                        <span className="rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground">
                          Ready
                        </span>
                      }
                    >
                      <div className="mt-2 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-foreground">
                          {task.finalOutput}
                        </pre>
                      </div>
                    </Accordion>
                  )}

                  {task.error && (
                    <Accordion title="Error" variant="error" defaultOpen={true}>
                      <p className="mt-2 text-sm text-destructive">{task.error}</p>
                    </Accordion>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No tasks yet. Start a research task above.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tasks are saved locally and persist across page refreshes.
          </p>
        </div>
      )}
    </div>
  );
}
