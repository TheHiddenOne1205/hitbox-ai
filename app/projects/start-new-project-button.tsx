"use client";

import posthog from "posthog-js";

export function StartNewProjectButton() {
  return (
    <button
      onClick={() => posthog.capture("start_new_project_clicked")}
      className="mt-2 px-5 py-2.5 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all"
    >
      Start New Project
    </button>
  );
}
