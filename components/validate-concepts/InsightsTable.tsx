"use client";

import Link from "next/link";
import { Mechanic } from "@/types";
import { MessageSquare, ExternalLink, Calendar, Flame } from "lucide-react";
import { CONCEPT_VIABILITY_THRESHOLD } from "@/lib/utils";

interface InsightsTableProps {
  insights: Mechanic[];
  projectId: string;
}

export function InsightsTable({ insights, projectId }: InsightsTableProps) {
  // Helpers to map viability score to style tokens
  const getScoreStyles = (score: number) => {
    if (score >= 80) {
      return {
        bg: "bg-pixel-green/10 border-pixel-green/30 text-pixel-green",
        text: "text-pixel-green",
        label: "STRONG",
      };
    }
    if (score >= CONCEPT_VIABILITY_THRESHOLD) {
      return {
        bg: "bg-pixel-yellow/10 border-pixel-yellow/30 text-pixel-yellow",
        text: "text-pixel-yellow",
        label: "STABLE",
      };
    }
    if (score >= 50) {
      return {
        bg: "bg-pixel-orange/10 border-pixel-orange/30 text-pixel-orange",
        text: "text-pixel-orange",
        label: "IMPROVING",
      };
    }
    return {
      bg: "bg-pixel-red/10 border-pixel-red/30 text-pixel-red",
      text: "text-pixel-red",
      label: "CRITICAL",
    };
  };

  const getSourceStyles = (source: string) => {
    if (source === "Reddit") {
      return {
        color: "#FF4500",
        label: "r/gaming",
      };
    }
    return {
      color: "var(--color-accent-gold)",
      label: "Steam Community",
    };
  };

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-panel-secondary/20 border border-card-border rounded-xl">
        <MessageSquare className="w-8 h-8 text-text-muted mb-3" />
        <h4 className="font-sans text-sm font-semibold text-text-light">No Matching Insights Discovered</h4>
        <p className="text-xs text-text-muted mt-1 max-w-md">
          Adjust your filters or run a new scan to discover organic community discussion footprint indices.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-light pb-2">
            <th className="pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider pl-4">
              Origin
            </th>
            <th className="pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider">
              Post/Thread Title
            </th>
            <th className="pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider text-center">
              Viability Rating
            </th>
            <th className="pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider text-center">
              Engagement
            </th>
            <th className="pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider pr-4">
              Post Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {insights.map((insight) => {
            const scoreStyle = getScoreStyles(insight.viability_score);
            const sourceStyle = getSourceStyles(insight.source_url.includes("reddit.com") ? "Reddit" : "Steam Community");

            return (
              <tr
                key={insight.id}
                className="hover:bg-panel-secondary transition-colors duration-200 group bg-panel"
              >
                {/* Forum Origin Badge */}
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded bg-panel-secondary border border-card-border font-mono text-[10px] font-semibold tracking-wider"
                      style={{ color: sourceStyle.color }}
                    >
                      {insight.source_url.includes("reddit.com") ? "REDDIT" : "STEAM"}
                    </span>
                    <a
                      href={insight.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-light transition-colors"
                      title="Open source forum page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>

                {/* Concept Title & Subtext */}
                <td className="py-4 max-w-xs md:max-w-md">
                  <Link
                    href={`/projects/${projectId}/validate/${insight.id}`}
                    className="flex flex-col gap-1 text-left cursor-pointer"
                  >
                    <span className="font-sans text-sm font-bold text-text-light group-hover:text-accent-gold transition-colors truncate">
                      {insight.mechanic_name}
                    </span>
                    <span className="font-sans text-xs text-text-muted truncate">
                      {insight.qualitative_meta}
                    </span>
                  </Link>
                </td>

                {/* Viability Score Ring */}
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2.5">
                    {/* Tiny gauge indicator */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${scoreStyle.bg}`}
                    >
                      {insight.viability_score}% {scoreStyle.label}
                    </span>
                  </div>
                </td>

                {/* Engagement Upvote Weight */}
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-mono text-xs text-text-light">
                    <Flame className="w-3.5 h-3.5 text-accent-orange shrink-0" />
                    <span>{insight.community_upvotes}</span>
                  </div>
                </td>

                {/* Date Found */}
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{new Date(insight.found_at).toLocaleDateString()}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
