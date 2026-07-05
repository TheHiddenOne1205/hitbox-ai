"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

type Props = {
  isComplete: boolean;
};

export function ProfileStatusIndicator({ isComplete }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (isComplete || dismissed) return null;

  return (
    <div className="flex items-start gap-3 px-5 py-4 bg-pixel-yellow/10 border border-pixel-yellow/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="mt-0.5 w-8 h-8 rounded-md bg-pixel-yellow/15 border border-pixel-yellow/30 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4 h-4 text-pixel-yellow" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="font-mono text-xs uppercase tracking-widest text-pixel-yellow font-semibold">
          Profile Incomplete
        </span>
        <p className="text-sm text-text-muted leading-relaxed">
          Your game design profile is missing required fields. Complete the form below to unlock concept validation capabilities.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-light hover:bg-panel-secondary transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
