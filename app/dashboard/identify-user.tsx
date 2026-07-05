"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

type Props = {
  userId: string;
  email?: string | null;
  username?: string | null;
};

export function IdentifyUser({ userId, email, username }: Props) {
  useEffect(() => {
    posthog.identify(userId, {
      email: email ?? undefined,
      username: username ?? undefined,
    });
  }, [userId, email, username]);

  return null;
}
