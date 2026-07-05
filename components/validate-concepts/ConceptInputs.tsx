"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import posthog from "posthog-js";

interface ConceptInputsProps {
  projectId: string;
  projectTitle: string;
  onValidateStart: (mechanicName: string, genreBaseline: string) => void;
  isLoading: boolean;
}

export function ConceptInputs({
  projectId,
  projectTitle,
  onValidateStart,
  isLoading,
}: ConceptInputsProps) {
  const [mechanicName, setMechanicName] = useState("");
  const [genreBaseline, setGenreBaseline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mechanicName.trim() || !genreBaseline.trim() || isLoading) return;

    posthog.capture("mechanic_search_started", {
      userId: "user-id-placeholder", // Will be tracked on the server/client properly
      projectTitle,
      mechanicName: mechanicName.trim(),
    });

    onValidateStart(mechanicName.trim(), genreBaseline.trim());
  };

  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] hover:border-border-gold transition-all duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
        {/* Mechanic Input */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="font-mono text-xs text-accent-gold uppercase tracking-wider">
            Gameplay Mechanic
          </label>
          <input
            type="text"
            value={mechanicName}
            onChange={(e) => setMechanicName(e.target.value)}
            placeholder="e.g. Deckbuilding, Permadeath, Dash Mechanic"
            required
            disabled={isLoading}
            className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner"
          />
        </div>

        {/* Target Genre Baseline constraint */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="font-mono text-xs text-accent-gold uppercase tracking-wider">
            Benchmark Genre / Constraint
          </label>
          <input
            type="text"
            value={genreBaseline}
            onChange={(e) => setGenreBaseline(e.target.value)}
            placeholder="e.g. Roguelike, Metroidvania, RPG"
            required
            disabled={isLoading}
            className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner"
          />
        </div>

        {/* Validate Concept Button */}
        <button
          type="submit"
          disabled={isLoading || !mechanicName.trim() || !genreBaseline.trim()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-text-light" />
              <span>Scanning Threads...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-text-light group-hover:scale-110 transition-transform" />
              <span>Validate Concept</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
