"use client";

import { CONCEPT_VIABILITY_THRESHOLD } from "@/lib/utils";

interface ViabilityScoreProps {
  score: number;
  reason: string;
}

export function ViabilityScore({ score, reason }: ViabilityScoreProps) {
  // Score thresholds styling
  const getScoreConfig = (score: number) => {
    if (score >= 80) {
      return {
        colorClass: "text-pixel-green",
        bgClass: "bg-pixel-green/10",
        borderClass: "border-pixel-green/30",
        label: "STRONG ALIGNMENT",
        desc: "Highly viable mechanic. Players demonstrate highly receptive sentiment matches.",
      };
    }
    if (score >= CONCEPT_VIABILITY_THRESHOLD) {
      return {
        colorClass: "text-pixel-yellow",
        bgClass: "bg-pixel-yellow/10",
        borderClass: "border-pixel-yellow/30",
        label: "STABLE VARIANT",
        desc: "Viable mechanic with minor execution considerations required.",
      };
    }
    if (score >= 50) {
      return {
        colorClass: "text-pixel-orange",
        bgClass: "bg-pixel-orange/10",
        borderClass: "border-pixel-orange/30",
        label: "IMPROVING GAPS",
        desc: "Design friction present. Actionable gaps or adjustments recommended.",
      };
    }
    return {
      colorClass: "text-pixel-red",
      bgClass: "bg-pixel-red/10",
      borderClass: "border-pixel-red/30",
      label: "CRITICAL FIT",
      desc: "Severe player complaints or major structural pitfalls identified.",
    };
  };

  const config = getScoreConfig(score);

  // SVG dimensions & circle properties
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center gap-6">
      {/* Circle Ring Tracker */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center bg-panel-secondary rounded-full border border-card-border shadow-inner">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="var(--color-panel-secondary)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-40"
          />
          {/* Active indicator fill */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ease-out ${config.colorClass}`}
          />
        </svg>
        {/* Absolute center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-text-light">{score}%</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Viability</span>
        </div>
      </div>

      {/* Narrative Info */}
      <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-accent-gold uppercase tracking-widest">
            AI Evaluation Output
          </span>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${config.bgClass} ${config.borderClass} ${config.colorClass}`}>
              {config.label}
            </span>
          </div>
        </div>

        <p className="font-sans text-sm text-text-light leading-relaxed">
          {reason}
        </p>

        <p className="font-sans text-xs text-text-muted italic">
          {config.desc}
        </p>
      </div>
    </div>
  );
}
