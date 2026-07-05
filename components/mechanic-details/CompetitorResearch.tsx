"use client";

import { useState } from "react";
import { CompetitorResearchDossier } from "@/types";
import { Search, Compass, AlertCircle, Info, HelpCircle, FileText, CheckCircle } from "lucide-react";

interface CompetitorResearchProps {
  mechanicId: string;
  projectId: string;
  researchData: CompetitorResearchDossier | null;
  onStartResearch?: () => Promise<void>;
}

export function CompetitorResearch({
  mechanicId,
  projectId,
  researchData,
  onStartResearch,
}: CompetitorResearchProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleResearchTrigger = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (onStartResearch) {
        await onStartResearch();
      } else {
        const res = await fetch("/api/agent/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mechanicId }),
        });
        const result = await res.json();
        if (!result.success) {
          setErrorMsg(result.error || "Stagehand scraping run failed. Returning synthesized brief.");
        }
      }
    } catch (err) {
      setErrorMsg("Network error trying to instantiate agent sweep.");
      console.error("[CompetitorResearch]", err);
    } finally {
      setLoading(false);
    }
  };

  // If no research data exists, show the gaming themed empty state
  if (!researchData) {
    return (
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center py-12 gap-5">
        <div className="w-12 h-12 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center text-text-muted">
          <Search className="w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-1 max-w-md">
          <span className="font-mono text-[10px] text-accent-gold uppercase tracking-widest">
            Deep Browser Crawler
          </span>
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Competitor Game Hub Analysis
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Dispatch a remote Stagehand browser execution to scrape player balance parameters, structural adjustments, and strategic details from live gaming communities.
          </p>
        </div>

        {errorMsg && (
          <div className="flex gap-2 text-left bg-pixel-red/10 border border-pixel-red/30 rounded-lg p-3 max-w-md">
            <AlertCircle className="w-4 h-4 text-pixel-red shrink-0" />
            <span className="text-xs text-pixel-red">{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleResearchTrigger}
          disabled={loading}
          className="bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold text-sm px-6 py-3 rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          {loading ? "Running Browser Agent (Stagehand)..." : "Research Competitors"}
        </button>
      </div>
    );
  }

  // Display structured competitor dossier
  return (
    <div className="flex flex-col gap-6">
      {/* Overview Block */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border-light">
          <Compass className="w-4 h-4 text-accent-gold" />
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Competitor Deep Research Dossier
          </h3>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          {researchData.competitorOverview}
        </p>
      </div>

      {/* Feature Breakdown + Community Culture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-light">
            <FileText className="w-4 h-4 text-text-green" />
            <h3 className="font-sans text-sm font-semibold text-text-light">Competitor Game Loop Features</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {researchData.featureBreakdown.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-text-green select-none shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-light">
            <Info className="w-4 h-4 text-accent-gold" />
            <h3 className="font-sans text-sm font-semibold text-text-light">Community Culture & Playstyles</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {researchData.communityCulture.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-accent-gold select-none shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Adjustments + Pitfalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-light">
            <CheckCircle className="w-4 h-4 text-pixel-green" />
            <h3 className="font-sans text-sm font-semibold text-text-light">Actionable Adjustments</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {researchData.actionableDesignAdjustments.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-pixel-green select-none shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-light">
            <AlertCircle className="w-4 h-4 text-pixel-orange" />
            <h3 className="font-sans text-sm font-semibold text-text-light">Why Competitor Execution Failed</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            {researchData.whyExecutionFailed}
          </p>
        </div>
      </div>

      {/* Strategic Questions */}
      {researchData.strategicQuestions && researchData.strategicQuestions.length > 0 && (
        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-light">
            <HelpCircle className="w-4 h-4 text-pixel-yellow" />
            <h3 className="font-sans text-sm font-semibold text-text-light">
              Strategic Design Questions
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {researchData.strategicQuestions.map((question, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-pixel-yellow select-none shrink-0">?</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {researchData.sources && researchData.sources.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">
            Scraped Research Nodes:
          </span>
          <div className="flex flex-wrap gap-2">
            {researchData.sources.map((src, idx) => (
              <a
                key={idx}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-panel-secondary border border-card-border font-mono text-[10px] text-accent-gold hover:border-border-gold transition-all truncate max-w-xs"
              >
                {src}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
