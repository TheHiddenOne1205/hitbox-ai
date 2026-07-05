"use client";

import { useState, useTransition } from "react";
import { updateUserUsername } from "@/actions/auth";
import { Terminal, AlertTriangle, Disc, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

export default function OnboardingForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Username cannot be empty.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError("Username can only contain alphanumeric characters and underscores.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await updateUserUsername(cleanUsername);
      if (res.success) {
        posthog.identify(posthog.get_distinct_id(), { username: cleanUsername });
        posthog.capture("onboarding_completed", { username_length: cleanUsername.length });
        window.location.href = "/dashboard";
      } else {
        const errorMessage = res.error || "Failed to save username. Please try again.";
        setError(errorMessage);
        posthog.capture("onboarding_failed", { error: errorMessage });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans selection:bg-panel-active selection:text-text-light">
      <div className="w-full max-w-md bg-panel border border-card-border rounded-xl p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-8 relative overflow-hidden">
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border-gold"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-border-gold"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-border-gold"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border-gold"></div>

        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold shadow-inner">
            <Disc className="w-8 h-8 animate-pulse text-accent-gold" />
          </div>
          
          <div className="flex flex-col gap-1">
            <h1 className="font-mono text-2xl font-bold tracking-wider text-text-light">
              CHOOSE_HANDLE
            </h1>
            <p className="font-sans text-xs uppercase tracking-widest text-text-muted font-semibold animate-pulse">
              what should we call you?
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-panel-secondary/40 border border-card-border/60 rounded-md p-4 flex gap-3 items-start">
          <Terminal className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-text-muted leading-relaxed">
            Provide a username to register your active profile identifier. This name will represent you in validation logs and telemetry profiles.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-pixel-red/10 border border-pixel-red/40 rounded-md p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="w-5 h-5 text-pixel-red shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-pixel-red font-bold uppercase">Validation Error</span>
              <p className="font-sans text-xs text-text-muted leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">
              Enter Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. gamer_1337"
              disabled={isPending}
              maxLength={20}
              autoComplete="off"
              className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-3 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !username.trim()}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none group"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-text-light border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-sans text-sm">Save & Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
