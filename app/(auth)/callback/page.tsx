"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleOAuthCallback } from "@/actions/auth";
import { AlertTriangle, Loader2 } from "lucide-react";
import posthog from "posthog-js";

// Track processed codes to prevent double-execution in React Strict Mode / remounts
const processedCodes = new Set<string>();

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("insforge_code");
    if (!code) {
      router.push("/login");
      return;
    }

    if (processedCodes.has(code)) {
      return;
    }
    processedCodes.add(code);

    const exchangeCode = async () => {
      const result = await handleOAuthCallback(code);
      if (result.success) {
        if (result.userId) {
          posthog.identify(result.userId, {
            email: result.userEmail ?? undefined,
            username: result.username ?? undefined,
          });
        }
        posthog.capture("oauth_callback_succeeded", {
          onboarding_required: result.onboardingRequired ?? false,
        });
        if (result.onboardingRequired) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        const errorMessage = result.error || "Failed to complete authentication exchange.";
        setError(errorMessage);
        posthog.capture("oauth_callback_failed", { error: errorMessage });
        posthog.captureException(new Error(errorMessage));
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans">
        <div className="w-full max-w-md bg-panel border border-card-border rounded-xl p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-6 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-pixel-red/10 border border-pixel-red/30 flex items-center justify-center text-pixel-red">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-mono text-xl font-bold text-text-light">Authentication Failed</h1>
            <p className="font-sans text-sm text-text-muted">{error}</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 px-4 bg-panel-secondary border border-card-border rounded-md text-text-light font-sans font-bold hover:border-border-gold transition-all duration-300 active:translate-y-[1px]"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 text-accent-gold animate-spin" />
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm text-text-light tracking-wider uppercase animate-pulse">
            Syncing Relational Session...
          </p>
          <p className="font-sans text-xs text-text-muted">
            Exchanging secure OAuth tokens with InsForge
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-accent-gold animate-spin" />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-sm text-text-light tracking-wider uppercase animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
