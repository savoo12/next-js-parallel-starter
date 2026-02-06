"use client";

import { useState } from "react";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import SuggestionCards from "./components/SuggestionCards";
import ActiveView from "./components/ActiveView";
import Footer from "./components/Footer";

export type ActivePanel = "idle" | "search" | "extract" | "tasks";

export default function Home() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("idle");
  const [prefillQuery, setPrefillQuery] = useState("");

  const handleSuggestionClick = (panel: ActivePanel, query: string) => {
    setPrefillQuery(query);
    setActivePanel(panel);
  };

  const handleBack = () => {
    setActivePanel("idle");
    setPrefillQuery("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header activePanel={activePanel} onBack={handleBack} />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        {activePanel === "idle" ? (
          <div className="flex w-full max-w-3xl flex-col items-center gap-10">
            {/* Hero */}
            <div className="text-center">
              <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                What can I do for you?
              </h1>
              <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
                Search the web, extract content, or run deep research tasks.
              </p>
            </div>

            {/* Prompt Input */}
            <PromptInput
              onSubmit={(panel) => setActivePanel(panel)}
              onPanelSelect={(panel) => setActivePanel(panel)}
            />

            {/* Suggestion Cards */}
            <SuggestionCards onCardClick={handleSuggestionClick} />
          </div>
        ) : (
          <ActiveView
            activePanel={activePanel}
            prefillQuery={prefillQuery}
            onBack={handleBack}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
