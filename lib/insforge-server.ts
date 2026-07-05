import { createServerClient, createAuthActions, CookieOptions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

export const createInsforgeAuth = async () => {
  const cookieStore = await cookies();
  return createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(
        ...args:
          | [name: string, value: string, options?: CookieOptions]
          | [options: { name: string; value: string } & CookieOptions]
      ) {
        try {
          if (typeof args[0] === "string") {
            const [name, value, options] = args as [string, string, CookieOptions?];
            cookieStore.set(name, value, options);
          } else {
            const [options] = args as [{ name: string; value: string } & CookieOptions];
            cookieStore.set(options);
          }
        } catch {
          // Ignored if called during pre-render
        }
      },
      delete(
        ...args:
          | [name: string]
          | [options: { name: string } & CookieOptions]
      ) {
        try {
          if (typeof args[0] === "string") {
            cookieStore.delete(args[0]);
          } else {
            const [options] = args as [{ name: string } & CookieOptions];
            cookieStore.delete(options.name);
          }
        } catch {
          // Ignored if called during pre-render
        }
      },
    },
  });
};
