"use client";

import { useState, useEffect } from "react";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface SearchResult {
  title: string;
  url: string;
  excerpts?: string[];
}

interface SearchResponse {
  results: SearchResult[];
  error?: string;
}

type SearchMode = "one-shot" | "agentic";

interface StoredSearchState {
  objective: string;
  searchQueries: string;
  mode: SearchMode;
  results: SearchResult[];
  error: string | null;
}

const INITIAL_STATE: StoredSearchState = {
  objective: "",
  searchQueries: "",
  mode: "one-shot",
  results: [],
  error: null,
};

interface SearchDemoProps {
  prefillQuery?: string;
}

export default function SearchDemo({ prefillQuery }: SearchDemoProps) {
  const [storedState, setStoredState, clearStoredState, isHydrated] =
    useSessionStorage<StoredSearchState>("parallel-search-demo", INITIAL_STATE);

  const [loading, setLoading] = useState(false);

  const { objective, searchQueries, mode, results, error } = storedState;

  // Apply prefill query
  useEffect(() => {
    if (prefillQuery && isHydrated && !objective) {
      setStoredState((prev) => ({ ...prev, objective: prefillQuery }));
    }
  }, [prefillQuery, isHydrated, objective, setStoredState]);

  const setObjective = (value: string) =>
    setStoredState((prev) => ({ ...prev, objective: value }));
  const setSearchQueries = (value: string) =>
    setStoredState((prev) => ({ ...prev, searchQueries: value }));
  const setMode = (value: SearchMode) =>
    setStoredState((prev) => ({ ...prev, mode: value }));
  const setResults = (value: SearchResult[]) =>
    setStoredState((prev) => ({ ...prev, results: value }));
  const setError = (value: string | null) =>
    setStoredState((prev) => ({ ...prev, error: value }));

  const handleSearch = async () => {
    if (!objective.trim()) return;

    setStoredState((prev) => ({ ...prev, results: [], error: null }));
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective: objective.trim(),
          searchQueries: searchQueries
            .split(",")
            .map((q) => q.trim())
            .filter(Boolean),
          mode,
          maxResults: 10,
        }),
      });

      const data: SearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearStoredState();
  };

  if (!isHydrated) {
    return <div className="space-y-6" />;
  }

  return (
    <div className="space-y-5">
      {/* Objective input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="objective"
            className="text-sm font-medium text-foreground"
          >
            Search Objective
          </label>
          <a
            href="https://docs.parallel.ai/api-reference/search-beta/search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent transition-colors hover:underline"
          >
            API Docs
          </a>
        </div>
        <textarea
          id="objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Describe what you're looking for..."
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          rows={3}
        />
      </div>

      {/* Search queries */}
      <div>
        <label
          htmlFor="queries"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Search Queries{" "}
          <span className="font-normal text-muted-foreground">(optional, comma-separated)</span>
        </label>
        <input
          id="queries"
          type="text"
          value={searchQueries}
          onChange={(e) => setSearchQueries(e.target.value)}
          placeholder="AI safety, machine learning alignment"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Mode selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Mode
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("one-shot")}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
              mode === "one-shot"
                ? "border-foreground bg-foreground text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            One-shot
          </button>
          <button
            type="button"
            onClick={() => setMode("agentic")}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
              mode === "agentic"
                ? "border-foreground bg-foreground text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            Agentic
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {mode === "one-shot"
            ? "Comprehensive results with longer excerpts for single-query answers"
            : "Concise, token-efficient results for use in agentic loops"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={loading || !objective.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {loading ? "Searching..." : "Search"}
        </button>
        {(results.length > 0 || objective || searchQueries) && (
          <button
            onClick={handleClear}
            className="rounded-xl border border-input bg-background px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Results ({results.length})
          </h3>
          {results.map((result, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground/20"
            >
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {result.title}
              </a>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {result.url}
              </p>
              {result.excerpts && result.excerpts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.excerpts.slice(0, 2).map((excerpt, i) => (
                    <p
                      key={i}
                      className="rounded-lg border-l-2 border-foreground/20 bg-muted p-3 text-xs leading-relaxed text-muted-foreground"
                    >
                      {excerpt.length > 300
                        ? excerpt.slice(0, 300) + "..."
                        : excerpt}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && objective && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No results found. Try a different search objective.
        </p>
      )}
    </div>
  );
}
