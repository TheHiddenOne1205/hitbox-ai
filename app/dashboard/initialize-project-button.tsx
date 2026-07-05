"use client";

import posthog from "posthog-js";
import { useRouter } from "next/navigation";

export function InitializeProjectButton() {
  const router = useRouter();

  const handleClick = () => {
    posthog.capture("initialize_project_clicked");
    router.push("/projects/1");
  };

  return (
    <button
      onClick={handleClick}
      className="px-5 py-2.5 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all"
    >
      Initialize Project
    </button>
  );
}
