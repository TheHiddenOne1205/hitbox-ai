"use client";

import { useState } from "react";
import { FileOutput, Loader2, Download, CheckCircle2 } from "lucide-react";

type Props = {
  projectTitle?: string;
  hasPitchDeckUrl?: boolean;
  onGenerate?: () => void;
  isGenerating?: boolean;
};

export function GDDPreview({ projectTitle, hasPitchDeckUrl, onGenerate, isGenerating = false }: Props) {
  const [generated, setGenerated] = useState(hasPitchDeckUrl ?? false);

  const handleGenerate = async () => {
    if (onGenerate) {
      onGenerate();
    }
    // Simulate completion for mock state
    setGenerated(true);
  };

  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-5 hover:border-border-gold transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">
            Document Output
          </span>
          <h2 className="font-sans text-base font-semibold text-text-light">
            GDD / Pitch Deck PDF
          </h2>
          <p className="text-sm text-text-muted">
            Compile a high-fidelity Game Design Document or Pitch Deck outline from your current project profile using Gemini.
          </p>
        </div>
        <div className="shrink-0 w-11 h-11 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold">
          <FileOutput className="w-5 h-5" />
        </div>
      </div>

      {/* Status row */}
      {generated ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-pixel-green/10 border border-pixel-green/30 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-pixel-green shrink-0" />
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="font-sans text-sm font-semibold text-pixel-green">Document Ready</span>
            <span className="font-mono text-xs text-text-muted">
              {projectTitle ? `"${projectTitle}"` : "Your project"} — GDD compiled and stored.
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-panel-secondary border border-card-border rounded-md font-mono text-xs text-text-muted hover:border-border-gold hover:text-text-light transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 bg-panel-secondary/40 border border-card-border/60 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-text-muted/50 shrink-0" />
          <span className="font-mono text-xs text-text-muted">
            No document generated yet. Fill in your project profile and click generate.
          </span>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2.5 w-full px-5 py-3 bg-panel-secondary border border-card-border text-text-light font-sans font-bold rounded-xl hover:border-border-gold hover:bg-panel-active transition-all disabled:opacity-40 disabled:pointer-events-none group"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
        ) : (
          <FileOutput className="w-4 h-4 text-accent-gold group-hover:scale-110 transition-transform" />
        )}
        <span className={isGenerating ? "text-text-muted" : "text-text-light"}>
          {isGenerating ? "Generating Document..." : generated ? "Regenerate PDF Outline" : "Generate Pitch Deck Outline"}
        </span>
      </button>
    </div>
  );
}
