import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, CookieOptions } from "@insforge/sdk/ssr";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Create wrappers matching the CookieStore (get, set, delete) expected by updateSession
  const requestCookies = {
    get(name: string) {
      return request.cookies.get(name)?.value;
    },
    set(
      ...args:
        | [name: string, value: string, options?: CookieOptions]
        | [options: { name: string; value: string } & CookieOptions]
    ) {
      if (typeof args[0] === "string") {
        request.cookies.set({ name: args[0], value: args[1] as string, ...args[2] as CookieOptions });
      } else {
        request.cookies.set(args[0] as { name: string; value: string } & CookieOptions);
      }
    },
    delete(
      ...args:
        | [name: string]
        | [options: { name: string } & CookieOptions]
    ) {
      if (typeof args[0] === "string") {
        request.cookies.delete(args[0]);
      } else {
        request.cookies.delete((args[0] as { name: string }).name);
      }
    },
  };

  const responseCookies = {
    get(name: string) {
      return response.cookies.get(name)?.value;
    },
    set(
      ...args:
        | [name: string, value: string, options?: CookieOptions]
        | [options: { name: string; value: string } & CookieOptions]
    ) {
      if (typeof args[0] === "string") {
        response.cookies.set({ name: args[0], value: args[1] as string, ...args[2] as CookieOptions });
      } else {
        response.cookies.set(args[0] as { name: string; value: string } & CookieOptions);
      }
    },
    delete(
      ...args:
        | [name: string]
        | [options: { name: string } & CookieOptions]
    ) {
      if (typeof args[0] === "string") {
        response.cookies.delete(args[0]);
      } else {
        response.cookies.delete((args[0] as { name: string }).name);
      }
    },
  };

  // Run updateSession to check/refresh the session tokens
  const { accessToken } = await updateSession({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    requestCookies,
    responseCookies,
  });

  const pathname = request.nextUrl.pathname;

  // Protect dashboard and projects paths
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/projects");

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    // Create redirection response and carry over the cookies
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        redirectResponse.headers.append(key, value);
      }
    });
    return redirectResponse;
  }

  // Redirect authenticated users away from the login page
  if (pathname === "/login" && accessToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        redirectResponse.headers.append(key, value);
      }
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
