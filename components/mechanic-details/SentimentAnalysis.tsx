"use client";

import { Frown, Sparkles, Trophy, CheckSquare } from "lucide-react";

interface SentimentAnalysisProps {
  gripes: string[];
  desires: string[];
  competitors: string[];
  alignedFeatures: string[];
}

export function SentimentAnalysis({
  gripes,
  desires,
  competitors,
  alignedFeatures,
}: SentimentAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* complaints/gripes */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-light">
          <Frown className="w-4 h-4 text-pixel-red" />
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Player Gripes & Friction
          </h3>
        </div>
        {gripes.length === 0 ? (
          <p className="text-xs text-text-muted italic">No explicit gripes identified in scan data.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {gripes.map((gripe, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-pixel-red select-none shrink-0">•</span>
                <span>{gripe}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* desires */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-light">
          <Sparkles className="w-4 h-4 text-pixel-yellow" />
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Player Desires & Expectations
          </h3>
        </div>
        {desires.length === 0 ? (
          <p className="text-xs text-text-muted italic">No distinct desires identified in scan data.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {desires.map((desire, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-pixel-yellow select-none shrink-0">•</span>
                <span>{desire}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* cited competitors */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-light">
          <Trophy className="w-4 h-4 text-accent-gold" />
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Cited Competitor References
          </h3>
        </div>
        {competitors.length === 0 ? (
          <p className="text-xs text-text-muted italic">No competitor titles cited in scanned discussions.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {competitors.map((game, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-panel-secondary border border-card-border font-mono text-[10px] font-semibold text-accent-gold uppercase tracking-wider"
              >
                {game}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* aligned features */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-light">
          <CheckSquare className="w-4 h-4 text-pixel-green" />
          <h3 className="font-sans text-sm font-semibold text-text-light">
            Easy Win Opportunities
          </h3>
        </div>
        {alignedFeatures.length === 0 ? (
          <p className="text-xs text-text-muted italic">No explicit opportunity vectors mapped.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {alignedFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                <span className="text-pixel-green select-none shrink-0">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
