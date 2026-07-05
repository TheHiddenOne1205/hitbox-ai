"use client";

import { AlertTriangle } from "lucide-react";

interface DesignActionsProps {
  pitfalls: string[];
}

export function DesignActions({ pitfalls }: DesignActionsProps) {
  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border-light">
        <AlertTriangle className="w-4 h-4 text-pixel-orange animate-pulse" />
        <h3 className="font-sans text-sm font-semibold text-text-light">
          Critical Structural Pitfalls to Avoid
        </h3>
      </div>
      
      {pitfalls.length === 0 ? (
        <p className="text-xs text-text-muted italic">No critical design warnings identified.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pitfalls.map((pitfall, idx) => (
            <div
              key={idx}
              className="bg-panel-secondary/40 border border-pixel-orange/20 rounded-lg p-4 flex gap-3 items-start"
            >
              <span className="text-pixel-orange text-xs font-mono select-none font-bold shrink-0 mt-0.5">
                [!WAR]
              </span>
              <p className="text-xs text-text-muted leading-relaxed">
                {pitfall}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
