"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Terminal, AlertTriangle, Disc } from "lucide-react";
import { signInWithProvider } from "@/actions/auth";
import posthog from "posthog-js";

function LoginContent() {
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");
  const [error, setError] = useState<string | null>(rawError);
  
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();

  const handleLogin = (provider: "google" | "github") => {
    setError(null);
    posthog.capture("login_provider_selected", { provider });
    const transition = provider === "google" ? startGoogleTransition : startGithubTransition;

    transition(async () => {
      const result = await signInWithProvider(provider);
      if (result && !result.success) {
        const errorMessage = result.error || "An error occurred during authentication.";
        setError(errorMessage);
        posthog.capture("login_failed", { provider, error: errorMessage });
      }
    });
  };

  const isPending = isGooglePending || isGithubPending;

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
          <div className="w-16 h-16 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold relative group hover:border-border-gold transition-all duration-300 shadow-inner">
            <Disc className="w-8 h-8 animate-pulse text-accent-gold" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pixel-green rounded-full border border-card-border"></div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h1 className="font-mono text-3xl font-bold tracking-wider text-text-light">
              HITBOX<span className="text-accent-gold">_AI</span>
            </h1>
            <p className="font-sans text-xs uppercase tracking-widest text-text-muted font-semibold">
              game design validator
            </p>
          </div>
        </div>

        {/* Introduction text */}
        <div className="bg-panel-secondary/40 border border-card-border/60 rounded-md p-4 flex gap-3 items-start">
          <Terminal className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-text-muted leading-relaxed">
            Define your active design project parameters once and index Organic Player Gripe and sentiment records directly from live web forums.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-pixel-red/10 border border-pixel-red/40 rounded-md p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertTriangle className="w-5 h-5 text-pixel-red shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-pixel-red font-bold uppercase">System Error</span>
              <p className="font-sans text-xs text-text-muted leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons Action Grid */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleLogin("google")}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-panel-secondary border border-card-border rounded-md text-text-light font-sans font-bold hover:border-border-gold transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none group shadow-[0px_4px_10px_rgba(0,0,0,0.4)]"
          >
            {isGooglePending ? (
              <div className="w-5 h-5 border-2 border-text-light border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-text-muted group-hover:text-text-light transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.44-2.885-6.44-6.44s2.885-6.44 6.44-6.44c1.603 0 3.07.586 4.205 1.554l3.15-3.15C19.07 2.222 15.89 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.845 0 10.825-4.218 10.825-11.24 0-.765-.078-1.5-.225-2.222H12.24z" />
              </svg>
            )}
            <span className="font-sans text-sm">
              {isGooglePending ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          <button
            onClick={() => handleLogin("github")}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-panel-secondary border border-card-border rounded-md text-text-light font-sans font-bold hover:border-border-gold transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none group shadow-[0px_4px_10px_rgba(0,0,0,0.4)]"
          >
            {isGithubPending ? (
              <div className="w-5 h-5 border-2 border-text-light border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-text-muted group-hover:text-text-light transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            )}
            <span className="font-sans text-sm">
              {isGithubPending ? "Connecting..." : "Continue with GitHub"}
            </span>
          </button>
        </div>

        {/* Subtext info */}
        <div className="flex flex-col gap-1 text-center font-mono text-[10px] text-text-muted uppercase tracking-wider">
          <span>Environment Secure</span>
          <span>Access Multi-Tenant Relational Relays</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans">
        <div className="w-8 h-8 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
