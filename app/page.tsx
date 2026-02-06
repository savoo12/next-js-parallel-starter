"use client";

import { useState } from "react";
import PromptInput from "./components/PromptInput";
import SuggestionCards from "./components/SuggestionCards";
import ActiveView from "./components/ActiveView";
import Footer from "./components/Footer";
import PixelGrid from "./components/PixelGrid";
import PixelText from "./components/PixelText";

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
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      {/* Pixelated background animation */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <PixelGrid />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
          {activePanel === "idle" ? (
            <div className="flex w-full max-w-3xl flex-col items-center gap-10">
              {/* Animated pixel heading */}
              <div className="flex flex-col items-center gap-5">
                <PixelText
                  text="What can I do for you?"
                  pixelSize={6}
                  className="hidden md:flex"
                />
                <PixelText
                  text="What can I"
                  pixelSize={6}
                  className="flex md:hidden"
                />
                <PixelText
                  text="do for you?"
                  pixelSize={6}
                  className="flex md:hidden"
                />
                <p className="text-pretty text-center text-base text-muted-foreground md:text-lg">
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
    </div>
  );
}
