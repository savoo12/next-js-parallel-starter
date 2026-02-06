"use client";

import { useState, useEffect } from "react";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface ExtractResult {
  url: string;
  title?: string;
  excerpts?: string[];
  full_content?: string;
}

interface ExtractResponse {
  results: ExtractResult[];
  error?: string;
}

interface StoredExtractState {
  urls: string;
  objective: string;
  results: ExtractResult[];
  error: string | null;
}

const INITIAL_STATE: StoredExtractState = {
  urls: "",
  objective: "",
  results: [],
  error: null,
};

interface ExtractDemoProps {
  prefillQuery?: string;
}

export default function ExtractDemo({ prefillQuery }: ExtractDemoProps) {
  const [storedState, setStoredState, clearStoredState, isHydrated] =
    useSessionStorage<StoredExtractState>(
      "parallel-extract",
      INITIAL_STATE
    );

  const [loading, setLoading] = useState(false);

  const { urls, objective, results, error } = storedState;

  // Apply prefill query
  useEffect(() => {
    if (prefillQuery && isHydrated && !urls) {
      setStoredState((prev) => ({ ...prev, urls: prefillQuery }));
    }
  }, [prefillQuery, isHydrated, urls, setStoredState]);

  const setUrls = (value: string) =>
    setStoredState((prev) => ({ ...prev, urls: value }));
  const setObjective = (value: string) =>
    setStoredState((prev) => ({ ...prev, objective: value }));
  const setResults = (value: ExtractResult[]) =>
    setStoredState((prev) => ({ ...prev, results: value }));
  const setError = (value: string | null) =>
    setStoredState((prev) => ({ ...prev, error: value }));

  const handleExtract = async () => {
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlList.length === 0) return;

    setStoredState((prev) => ({ ...prev, results: [], error: null }));
    setLoading(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: urlList,
          objective: objective.trim() || undefined,
        }),
      });

      const data: ExtractResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Extract failed");
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
      {/* URL input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="urls"
            className="text-sm font-medium text-foreground"
          >
            URLs to Extract{" "}
            <span className="font-normal text-muted-foreground">(one per line)</span>
          </label>
          <span className="text-xs text-muted-foreground">Powered by Parallel</span>
        </div>
        <textarea
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"https://example.com/article\nhttps://another-site.com/page"}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          rows={3}
        />
      </div>

      {/* Objective */}
      <div>
        <label
          htmlFor="extract-objective"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Extraction Objective{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="extract-objective"
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="What information are you looking for?"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Providing an objective focuses the extraction on relevant content
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleExtract}
          disabled={loading || !urls.trim()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {loading ? "Extracting..." : "Extract Content"}
        </button>
        {(results.length > 0 || urls || objective) && (
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
            Extracted Content ({results.length})
          </h3>
          {results.map((result, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {result.title && (
                    <h4 className="text-sm font-semibold text-foreground">
                      {result.title}
                    </h4>
                  )}
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block truncate text-xs text-accent hover:underline"
                  >
                    {result.url}
                  </a>
                </div>
              </div>

              {result.excerpts && result.excerpts.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">
                    Excerpts
                  </h5>
                  {result.excerpts.map((excerpt, i) => (
                    <div
                      key={i}
                      className="whitespace-pre-wrap rounded-lg border-l-2 border-foreground/20 bg-muted p-3 text-xs leading-relaxed text-muted-foreground"
                    >
                      {excerpt}
                    </div>
                  ))}
                </div>
              )}

              {result.full_content && (
                <div className="mt-3">
                  <h5 className="mb-2 text-xs font-medium text-muted-foreground">
                    Full Content
                  </h5>
                  <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                    {result.full_content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
