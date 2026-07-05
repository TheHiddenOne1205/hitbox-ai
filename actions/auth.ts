"use server";

import { createInsforgeAuth, createInsforgeServer } from "@/lib/insforge-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export async function signInWithProvider(provider: "google" | "github") {
  const auth = await createInsforgeAuth();
  const cookieStore = await cookies();

  // Determine site URL for redirect callback
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = `${origin}/callback`;

  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url) {
    console.error(`[actions/auth] OAuth sign-in error for ${provider}:`, error);
    return {
      success: false,
      error: error?.message || "Failed to initialize OAuth authentication flow.",
    };
  }

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: "anonymous",
    event: "sign_in_initiated",
    properties: { provider },
  });
  await shutdownPostHog();

  // Save the code verifier in a secure, HTTP-only cookie for PKCE verification in the callback
  if (data.codeVerifier) {
    cookieStore.set("insforge_code_verifier", data.codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
      sameSite: "lax",
    });
  }

  redirect(data.url);
}

export async function handleOAuthCallback(code: string) {
  try {
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("insforge_code_verifier")?.value;

    if (!codeVerifier) {
      return {
        success: false,
        error: "Authorization verifier cookie expired or not found. Please log in again.",
      };
    }

    const auth = await createInsforgeAuth();
    const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);

    // Clean up the PKCE verifier cookie
    cookieStore.delete("insforge_code_verifier");

    if (error) {
      console.error("[actions/auth] OAuth code exchange failed:", error);
      return {
        success: false,
        error: error.message || "Failed to complete authentication exchange.",
      };
    }

    return {
      success: true,
      onboardingRequired: !data?.user?.profile?.username,
      userId: data?.user?.id ?? null,
      userEmail: data?.user?.email ?? null,
      username: (data?.user?.profile?.username as string | null) ?? null,
    };
  } catch (err) {
    console.error("[actions/auth] Unexpected callback error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during authentication exchange.",
    };
  }
}

export async function updateUserUsername(username: string) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized: User not signed in." };
    }

    const { error } = await insforge.auth.setProfile({
      username,
    });

    if (error) {
      console.error("[actions/auth] setProfile error:", error);
      return { success: false, error: error.message || "Failed to update profile." };
    }

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id ?? "anonymous",
      event: "user_profile_updated",
      properties: { username_length: username.length },
    });
    posthog.identify({
      distinctId: user.id ?? "anonymous",
      properties: { username },
    });
    await shutdownPostHog();

    return { success: true };
  } catch (err) {
    console.error("[actions/auth] Unexpected error updating profile:", err);
    return { success: false, error: "Failed to update profile." };
  }
}

export async function signOutAction() {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    const auth = await createInsforgeAuth();
    await auth.signOut();

    if (user?.id) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: user.id,
        event: "sign_out_completed",
      });
      await shutdownPostHog();
    }

    return { success: true };
  } catch (error) {
    console.error("[actions/auth] Sign out error:", error);
    return { success: false, error: "Failed to sign out." };
  }
}
