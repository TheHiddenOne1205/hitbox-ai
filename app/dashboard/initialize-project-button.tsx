"use client";

import posthog from "posthog-js";

export function InitializeProjectButton() {
  return (
    <button
      onClick={() => posthog.capture("initialize_project_clicked")}
      className="px-5 py-2.5 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all"
    >
      Initialize Project
    </button>
  );
}
