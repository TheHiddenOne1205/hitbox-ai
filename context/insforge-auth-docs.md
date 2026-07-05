# InsForge Next.js & SSR Authentication Integration Note

> [!IMPORTANT]
> The `@insforge/nextjs` (and `@insforge/react`, `@insforge/react-router`) packages providing pre-built authentication UI components (like `<SignIn />`, `<SignUp />`, `<UserButton />`) have been **deprecated** and should **not** be used in new projects.
>
> Instead, you should use the core `@insforge/sdk` and handle authentication custom UI, and for Next.js/SSR environments, use the SSR-specific helpers from `@insforge/sdk/ssr` (or `@insforge/ssr` as used in the project configuration).

## SSR Helper Core APIs

- **`createBrowserClient()`**: Used in **Client Components** to consume an existing SSR session. Note that this client is restricted and does *not* support auth mutations (like `signInWithPassword`, `signUp`, or `signOut`) as those must be executed on the server to set and refresh secure cookies.
- **`createServerClient()`**: Used in **Server Components**, server actions, or API route handlers to interact with the InsForge backend, passing request headers/cookies.
- **`createRefreshAuthRouter()`**: API route helper to handle refresh token rotation and session refresh requests automatically.

### Codebase Integration Example

**Client-Side Initialization (`lib/insforge-client.ts`):**
```typescript
import { createBrowserClient } from "@insforge/ssr"; // or "@insforge/sdk/ssr"

export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
);
```

**Server-Side Initialization (`lib/insforge-server.ts`):**
```typescript
import { createServerClient } from "@insforge/ssr"; // or "@insforge/sdk/ssr"
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_INSFORGE_URL!,
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Can be ignored if called from Server Component
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Can be ignored if called from Server Component
          }
        },
      },
    }
  );
};
```

---

# InsForge General Setup Instructions

# InsForge SDK Documentation - Overview

## What is InsForge?

Backend-as-a-service (BaaS) platform providing:

- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: OpenRouter key provisioning and model catalog for direct OpenAI-compatible integrations
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)

## Installation

The following is a step-by-step guide to installing and using the InsForge TypeScript SDK for Web applications. If you are building other types of applications, please refer to:
- [Swift SDK documentation](/sdks/swift/overview) for iOS, macOS, tvOS, and watchOS applications.
- [Kotlin SDK documentation](/sdks/kotlin/overview) for Android applications.
- [REST API documentation](/sdks/rest/overview) for direct HTTP API access.

### 🚨 CRITICAL: Follow these steps in order

### Step 1: Download Template

Use the `download-template` MCP tool to create a new project with your backend URL and anon key pre-configured.

### Step 2: Install SDK

```bash
npm install @insforge/sdk@latest
```

### Step 3: Create SDK Client

You must create a client instance using `createClient()` with your base URL and anon key:

```javascript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://r3krqy29.ap-southeast.insforge.app',  // Your InsForge backend URL
  anonKey: 'your-anon-key-here'       // Get this from backend metadata
});

```

**API BASE URL**: Your API base URL is `https://r3krqy29.ap-southeast.insforge.app`.

## Getting Detailed Documentation

### 🚨 CRITICAL: Always Fetch Documentation Before Writing Code

InsForge provides official SDKs and REST APIs, use them to interact with InsForge services from your application code.

- [TypeScript SDK](/sdks/typescript/overview) - JavaScript/TypeScript
- [Swift SDK](/sdks/swift/overview) - iOS, macOS, tvOS, and watchOS
- [Kotlin SDK](/sdks/kotlin/overview) - Android and Kotlin Multiplatform
- [REST API](/sdks/rest/overview) - Direct HTTP API access

Before writing or editing any InsForge integration code, you **MUST** call the `fetch-docs` or `fetch-sdk-docs` MCP tool to get the latest SDK documentation. This ensures you have accurate, up-to-date implementation patterns.

### Use the InsForge `fetch-docs` MCP tool to get specific SDK documentation:

Available documentation types:

- `"instructions"` - Essential backend setup (START HERE)
- `"real-time"` - Real-time pub/sub (database + client events) via WebSockets
- `"db-sdk-typescript"` - Database operations with TypeScript SDK
- **Authentication** - Choose based on implementation:
  - `"auth-sdk-typescript"` - TypeScript SDK methods for custom auth flows
  - `"auth-components-react"` - Pre-built auth UI for React+Vite (single-page app)
  - `"auth-components-react-router"` - Pre-built auth UI for React(Vite+React Router) (multi-page app)
  - `"auth-components-nextjs"` - Pre-built auth UI for Next.js (SSR app)
- `"storage-sdk"` - File storage operations
- `"functions-sdk"` - Serverless functions invocation
- `"ai-integration-sdk"` - AI integration with the provisioned OpenRouter key and OpenAI SDK
- `"deployment"` - Deploy frontend applications via MCP tool
- `"payments"` - Stripe Checkout, Billing Portal, webhook projections, and fulfillment patterns

These docs are mostly for the TypeScript SDK. For other languages, you can also use the `fetch-sdk-docs` MCP tool to get specific documentation.

### Use the InsForge `fetch-sdk-docs` MCP tool to get specific SDK documentation

You can fetch SDK documentation using the `fetch-sdk-docs` MCP tool with a specific feature type and language.

Available feature types:
- `db` - Database operations
- `storage` - File storage operations
- `functions` - Serverless functions invocation
- `auth` - User authentication
- `ai` - AI integration with the provisioned OpenRouter key and OpenAI SDK
- `realtime` - Real-time pub/sub (database + client events) via WebSockets
- `payments` - Stripe Checkout and Billing Portal with webhook-based fulfillment

Available languages:
- `typescript` - JavaScript/TypeScript SDK
- `swift` - Swift SDK (for iOS, macOS, tvOS, and watchOS)
- `kotlin` - Kotlin SDK (for Android and JVM applications)
- `rest-api` - REST API

Payments currently has TypeScript SDK docs only. Use the Payments API reference for non-TypeScript clients.

## When to Use SDK vs MCP Tools

### Always SDK for Application Logic:

- Authentication (register, login, logout, profiles)
- Database CRUD (select, insert, update, delete)
- Storage operations (upload, download files)
- AI integration via the provisioned OpenRouter key with the OpenAI SDK or OpenRouter HTTP API
- Serverless function invocation
- Payments checkout and customer portal session creation

### Use MCP Tools for Infrastructure:

- Project scaffolding (`download-template`) - Download starter templates with InsForge integration
- Backend setup and metadata (`get-backend-metadata`)
- Database schema management (`run-raw-sql`, `get-table-schema`)
- Storage bucket creation (`create-bucket`, `list-buckets`, `delete-bucket`)
- Serverless function deployment (`create-function`, `update-function`, `delete-function`)
- Frontend deployment (`create-deployment`) - Deploy frontend apps to InsForge hosting

## Important Notes

- For auth: use `auth-sdk` for custom UI, or framework-specific components for pre-built UI
- SDK returns `{data, error}` structure for all operations
- Database inserts require array format: `[{...}]`
- Serverless functions have one endpoint and do not support nested route paths
- Storage: Upload files to buckets, store URLs in database
- AI integrations should call OpenRouter directly with `baseURL: "https://openrouter.ai/api/v1"` and a server-side `OPENROUTER_API_KEY`
- **EXTRA IMPORTANT**: Use Tailwind CSS 3.4 (do not upgrade to v4). Lock these dependencies in `package.json`

# InsForge Auth SDK Reference (fetch-docs: auth-sdk)

---
title: Authentication SDK Reference
description: User authentication and profile management with the InsForge TypeScript SDK
---

## Installation

<CodeGroup>
```bash npm
npm install @insforge/sdk@latest
```

```bash yarn
yarn add @insforge/sdk@latest
```

```bash pnpm
pnpm add @insforge/sdk@latest
```
</CodeGroup>

```javascript
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://r3krqy29.ap-southeast.insforge.app',
  anonKey: 'your-anon-key'  // Optional: for public/unauthenticated requests
});
```

## signUp()

Create a new user account with email and password.

### Parameters

- `email` (string, required) - User's email address
- `password` (string, required) - User's password
- `name` (string, optional) - User's display name
- `redirectTo` (string, optional) - Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page.

### Returns

```typescript
{
  data: {
    user?: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata },
    accessToken: string | null,
    requireEmailVerification?: boolean,
    csrfToken?: string | null
  } | null,
  error: Error | null
}
```

<Note>
  When `requireEmailVerification` is true, `accessToken` will be null until the user verifies their email. InsForge sends a verification email with either a link or a 6-digit code, based on your dashboard configuration (`verifyEmailMethod`). For code verification, implement a page that prompts the user to enter the code (see [verifyEmail()](#verifyemail)). For link verification, provide a `redirectTo` URL that should receive the browser after InsForge verifies the token. Recommended: use your sign-in page as `redirectTo`, then show a success message and ask the user to sign in with their email and password.
</Note>

### Example

```javascript
const { data, error } = await insforge.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password123',
  name: 'John Doe',
  redirectTo: 'http://localhost:3000/sign-in',
});

if (data?.requireEmailVerification) {
  // For code verification: redirect to page where user enters the 6-digit code
  // For link verification: wait for the user to click the email link
  console.log('Please verify your email');
} else if (data?.accessToken) {
  // User is signed in (email verification disabled)
  console.log('Welcome!', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": false,
      "providers": ["email"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "profile": {
        "name": "John Doe",
        "avatar_url": null
      },
      "metadata": {}
    },
    "requireEmailVerification": true,
    "accessToken": null,
    "csrfToken": null
  },
  "error": null
}
```

---

## signInWithPassword()

Sign in an existing user with email and password.

### Parameters

- `email` (string, required) - User's email address
- `password` (string, required) - User's password

### Returns

```typescript
{
  data: {
    user: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata },
    accessToken: string,
    csrfToken?: string | null
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password123',
});

if (data) {
  console.log('Signed in as:', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true,
      "providers": ["email"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "profile": {
        "name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "metadata": {}
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "csrfToken": "5758d38259fb..."
  },
  "error": null
}
```

---

## signInWithOAuth()

Start OAuth authentication flow with configured providers (built-in providers like Google/GitHub, plus any custom provider key configured from the dashboard).

### Parameters

- `provider` (string, required) - OAuth provider key (e.g., `google`, `github`, or custom provider key like `okta-company`)
- `redirectTo` (string, required) - URL to redirect after authentication
- `additionalParams` (`Record<string, string>`, optional) - Provider-specific OAuth hints such as Google's `prompt=select_account`
- `skipBrowserRedirect` (boolean, optional) - If true, returns OAuth URL without auto-redirecting (for server-rendered or mobile flows)

### Returns

```typescript
{
  data: { url?: string, provider?: string, codeVerifier?: string },
  error: Error | null
}
```

<Note>
  After OAuth redirect, SDK automatically detects the callback `insforge_code`, exchanges it for a
  session, and saves the session automatically.
</Note>

### Example

```javascript
// Default: auto-redirect
await insforge.auth.signInWithOAuth('google', {
  redirectTo: 'http://localhost:3000/dashboard',
  additionalParams: { prompt: 'select_account' },
});
// Browser immediately redirects to Google

// skipBrowserRedirect: get URL for manual handling
const { data } = await insforge.auth.signInWithOAuth('google', {
  redirectTo: 'http://localhost:3000/dashboard',
  skipBrowserRedirect: true,
});

window.location.href = data.url; // Redirect when ready
```

<Note>
  `additionalParams` is for provider-specific optional hints only. Do not pass server-owned
  OAuth fields such as `client_id`, `redirect_uri`, `code_challenge`, `state`, `response_type`,
  or `scope`; InsForge sets those values on the server and ignores colliding client-provided keys.
</Note>

<Note>
  Custom providers must be configured first in the InsForge dashboard under `Auth Methods` with client credentials and an OIDC discovery URL.
</Note>

### Output

```json
{
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
    "provider": "google"
  },
  "error": null
}
```

---

## signOut()

Sign out the current user and clear session.

### Parameters

None

### Returns

```typescript
{
  error: Error | null;
}
```

### Example

```javascript
const { error } = await insforge.auth.signOut();
```

### Output

```json
{
  "error": null
}
```

---

## getCurrentUser()

Get the currently signed-in user.

For browser apps, call `auth.getCurrentUser()` during startup. If a valid httpOnly refresh cookie is present, the SDK will refresh the session automatically before returning the user.

For server mode, call `refreshSession({ refreshToken })` explicitly when you need to refresh an expired access token.

### Parameters

None

### Returns

```typescript
{
  data: {
    user: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata } | null
  },
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.getCurrentUser();

if (data.user) {
  console.log('User:', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "providers": ["email"],
      "profile": {
        "name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "metadata": {}
    }
  },
  "error": null
}
```

---

## getProfile()

Get any user's public profile by ID. Returns a flat profile object with all fields at the top level.

### Parameters

- `userId` (string, required) - User ID to fetch profile for

### Returns

```typescript
{
  data: {
    id: string,
    name?: string,
    avatar_url?: string,
    createdAt?: string,
    updatedAt?: string,
    ...customFields
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.getProfile('usr_xyz789');

if (data) {
  console.log(data.name);
  console.log(data.avatar_url);
}
```

### Output

```json
{
  "data": {
    "id": "usr_xyz789",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Full-stack developer",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "error": null
}
```

---

## setProfile()

Update current user's profile in users table. Supports any dynamic fields and returns the updated profile as a flat object.

### Parameters

- `profile` (object) - A key-value map of profile fields to update. Any fields are accepted.

**Common fields:**

- `name` (predefined, string) - User's display name
- `avatar_url` (predefined, string) - Profile picture URL

### Returns

```typescript
{
  data: {
    id: string,
    name?: string,
    avatar_url?: string,
    createdAt?: string,
    updatedAt?: string,
    ...customFields
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.setProfile({
  name: 'JohnDev',
  bio: 'Full-stack developer',
  avatar_url: 'https://example.com/avatar.jpg',
  custom_field: 'any value', // Any custom fields are supported
});
```

### Output

```json
{
  "data": {
    "id": "usr_abc123",
    "name": "JohnDev",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Full-stack developer",
    "custom_field": "any value",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  },
  "error": null
}
```

---

## resendVerificationEmail()

Resend email verification when the previous OTP has expired or was not received. Uses the method configured in auth settings (`verifyEmailMethod`). When method is `code`, sends a 6-digit numeric code. When method is `link`, sends a browser verification link that goes through an InsForge backend endpoint first.

<Note>
  This endpoint prevents user enumeration by returning success even if the email doesn't exist.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `redirectTo` (string, optional) - Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page.

### Returns

```typescript
{
  data: { success: boolean, message: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.resendVerificationEmail({
  email: 'user@example.com',
  redirectTo: 'http://localhost:3000/sign-in',
});

if (data?.success) {
  console.log('Verification email sent!');
}
```

### Output

```json
{
  "data": {
    "success": true,
    "message": "Verification email sent"
  },
  "error": null
}
```

---

## verifyEmail()

Verify an email address with a 6-digit code.

For link-based verification, users should click the email link, which opens `GET /api/auth/email/verify-link` in the browser.

Successfully verified users who use this code endpoint will receive a session token.

For link-based verification, your frontend should handle the browser redirect like this:

- Success: `?insforge_status=success&insforge_type=verify_email`
- Error: `?insforge_status=error&insforge_type=verify_email&insforge_error=...`
- `insforge_status`: Result of the browser link flow. For verification, values are `success` or `error`.
- `insforge_type`: Flow identifier. For verification links this is always `verify_email`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.

Recommended handling: use your sign-in page as `redirectTo`. When `insforge_status=success`, show a confirmation message and ask the user to sign in with their email and password.

### Parameters

- `email` (string, required) - User's email address
- `otp` (string, required) - 6-digit verification code

### Returns

```typescript
{
  data: {
    accessToken: string,
    user: { id, email, emailVerified, ... }
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.verifyEmail({
  email: 'user@example.com',
  otp: '123456',
});

if (data) {
  console.log('Email verified!', data.accessToken);
}
```

### Output

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true
    }
  },
  "error": null
}
```

---

## sendResetPasswordEmail()

Send password reset email using the method configured in auth settings (`resetPasswordMethod`). When method is `code`, sends a 6-digit numeric code for two-step flow. When method is `link`, sends a browser reset link that goes through an InsForge backend endpoint first.

<Note>
  This endpoint prevents user enumeration by returning success even if the email doesn't exist.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `redirectTo` (string, optional) - Used for link-based password reset. The email link always opens an InsForge backend endpoint first; InsForge then redirects the browser to this URL with the reset `token` in the query string so your app can render its own reset-password page. Required when `resetPasswordMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's dedicated reset-password page.

### Returns

```typescript
{
  data: { success: boolean, message: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.sendResetPasswordEmail({
  email: 'user@example.com',
  redirectTo: 'http://localhost:3000/reset-password',
});

if (data?.success) {
  console.log('Password reset email sent!');
}
```

### Output

```json
{
  "data": {
    "success": true,
    "message": "Password reset email sent"
  },
  "error": null
}
```

---

## exchangeResetPasswordToken()

Exchange a 6-digit reset password code for a reset token. This is step 1 of the two-step password reset flow (only used when `resetPasswordMethod` is `code`).

<Note>
  This endpoint is not used when `resetPasswordMethod` is `link`, because the browser reset-link flow uses the emailed link token directly.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `code` (string, required) - 6-digit code from the email

### Returns

```typescript
{
  data: { token: string, expiresAt: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.exchangeResetPasswordToken({
  email: 'user@example.com',
  code: '123456',
});

if (data) {
  // Use token to reset password
  await insforge.auth.resetPassword({
    newPassword: 'newSecurePassword123',
    otp: data.token,
  });
}
```

### Output

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-15T11:00:00Z"
  },
  "error": null
}
```

---

## resetPassword()

Reset user password with a token. The token can be:
- **Magic link token**: Provided in the reset page URL from `sendResetPasswordEmail` when method is `link`
- **Reset token**: From `exchangeResetPasswordToken` after code verification when method is `code`

### Parameters

- `newPassword` (string, required) - New password for the user
- `otp` (string, required) - Reset token or magic link token

For link-based password reset, your frontend should handle the browser redirect like this:

- Ready to reset: `?token=...&insforge_status=ready&insforge_type=reset_password`
- Error: `?insforge_status=error&insforge_type=reset_password&insforge_error=...`
- `token`: Present only when `insforge_status=ready`. Pass this value to `resetPassword({ otp })`.
- `insforge_status`: Result of the browser link flow. For reset links, values are `ready` or `error`.
- `insforge_type`: Flow identifier. For reset links this is always `reset_password`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.

Only render the reset-password form when `insforge_status=ready` and `token` is present.

### Returns

```typescript
{
  data: { message: string } | null,
  error: Error | null
}
```

### Example

```javascript
// Code method flow: after exchangeResetPasswordToken
const { data, error } = await insforge.auth.resetPassword({
  newPassword: 'newSecurePassword123',
  otp: resetToken, // Token from exchangeResetPasswordToken
});

// Link method flow: token from the reset page URL
const { data, error } = await insforge.auth.resetPassword({
  newPassword: 'newSecurePassword123',
  otp: 'a1b2c3d4e5f6...', // Token from the magic link URL
});

if (data) {
  console.log('Password reset successful!');
}
```

### Output

```json
{
  "data": {
    "message": "Password reset successfully. Please login with your new password."
  },
  "error": null
}
```

---

## Error Handling

All auth methods return structured errors:

```javascript
const { data, error } = await insforge.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'wrong_password',
});

if (error) {
  console.error(error.statusCode); // 401
  console.error(error.error); // 'INVALID_CREDENTIALS'
  console.error(error.message); // 'Invalid login credentials'
  console.error(error.nextActions); // 'Check email and password'
}
```

# InsForge Auth TypeScript SDK Reference (fetch-sdk-docs: auth + typescript)

---
title: Authentication SDK Reference
description: User authentication and profile management with the InsForge TypeScript SDK
---

## Installation

<CodeGroup>
```bash npm
npm install @insforge/sdk@latest
```

```bash yarn
yarn add @insforge/sdk@latest
```

```bash pnpm
pnpm add @insforge/sdk@latest
```
</CodeGroup>

```javascript
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://r3krqy29.ap-southeast.insforge.app',
  anonKey: 'your-anon-key'  // Optional: for public/unauthenticated requests
});
```

## signUp()

Create a new user account with email and password.

### Parameters

- `email` (string, required) - User's email address
- `password` (string, required) - User's password
- `name` (string, optional) - User's display name
- `redirectTo` (string, optional) - Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page.

### Returns

```typescript
{
  data: {
    user?: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata },
    accessToken: string | null,
    requireEmailVerification?: boolean,
    csrfToken?: string | null
  } | null,
  error: Error | null
}
```

<Note>
  When `requireEmailVerification` is true, `accessToken` will be null until the user verifies their email. InsForge sends a verification email with either a link or a 6-digit code, based on your dashboard configuration (`verifyEmailMethod`). For code verification, implement a page that prompts the user to enter the code (see [verifyEmail()](#verifyemail)). For link verification, provide a `redirectTo` URL that should receive the browser after InsForge verifies the token. Recommended: use your sign-in page as `redirectTo`, then show a success message and ask the user to sign in with their email and password.
</Note>

### Example

```javascript
const { data, error } = await insforge.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password123',
  name: 'John Doe',
  redirectTo: 'http://localhost:3000/sign-in',
});

if (data?.requireEmailVerification) {
  // For code verification: redirect to page where user enters the 6-digit code
  // For link verification: wait for the user to click the email link
  console.log('Please verify your email');
} else if (data?.accessToken) {
  // User is signed in (email verification disabled)
  console.log('Welcome!', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": false,
      "providers": ["email"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "profile": {
        "name": "John Doe",
        "avatar_url": null
      },
      "metadata": {}
    },
    "requireEmailVerification": true,
    "accessToken": null,
    "csrfToken": null
  },
  "error": null
}
```

---

## signInWithPassword()

Sign in an existing user with email and password.

### Parameters

- `email` (string, required) - User's email address
- `password` (string, required) - User's password

### Returns

```typescript
{
  data: {
    user: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata },
    accessToken: string,
    csrfToken?: string | null
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password123',
});

if (data) {
  console.log('Signed in as:', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true,
      "providers": ["email"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "profile": {
        "name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "metadata": {}
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "csrfToken": "5758d38259fb..."
  },
  "error": null
}
```

---

## signInWithOAuth()

Start OAuth authentication flow with configured providers (built-in providers like Google/GitHub, plus any custom provider key configured from the dashboard).

### Parameters

- `provider` (string, required) - OAuth provider key (e.g., `google`, `github`, or custom provider key like `okta-company`)
- `redirectTo` (string, required) - URL to redirect after authentication
- `additionalParams` (`Record<string, string>`, optional) - Provider-specific OAuth hints such as Google's `prompt=select_account`
- `skipBrowserRedirect` (boolean, optional) - If true, returns OAuth URL without auto-redirecting (for server-rendered or mobile flows)

### Returns

```typescript
{
  data: { url?: string, provider?: string, codeVerifier?: string },
  error: Error | null
}
```

<Note>
  After OAuth redirect, SDK automatically detects the callback `insforge_code`, exchanges it for a
  session, and saves the session automatically.
</Note>

### Example

```javascript
// Default: auto-redirect
await insforge.auth.signInWithOAuth('google', {
  redirectTo: 'http://localhost:3000/dashboard',
  additionalParams: { prompt: 'select_account' },
});
// Browser immediately redirects to Google

// skipBrowserRedirect: get URL for manual handling
const { data } = await insforge.auth.signInWithOAuth('google', {
  redirectTo: 'http://localhost:3000/dashboard',
  skipBrowserRedirect: true,
});

window.location.href = data.url; // Redirect when ready
```

<Note>
  `additionalParams` is for provider-specific optional hints only. Do not pass server-owned
  OAuth fields such as `client_id`, `redirect_uri`, `code_challenge`, `state`, `response_type`,
  or `scope`; InsForge sets those values on the server and ignores colliding client-provided keys.
</Note>

<Note>
  Custom providers must be configured first in the InsForge dashboard under `Auth Methods` with client credentials and an OIDC discovery URL.
</Note>

### Output

```json
{
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
    "provider": "google"
  },
  "error": null
}
```

---

## signOut()

Sign out the current user and clear session.

### Parameters

None

### Returns

```typescript
{
  error: Error | null;
}
```

### Example

```javascript
const { error } = await insforge.auth.signOut();
```

### Output

```json
{
  "error": null
}
```

---

## getCurrentUser()

Get the currently signed-in user.

For browser apps, call `auth.getCurrentUser()` during startup. If a valid httpOnly refresh cookie is present, the SDK will refresh the session automatically before returning the user.

For server mode, call `refreshSession({ refreshToken })` explicitly when you need to refresh an expired access token.

### Parameters

None

### Returns

```typescript
{
  data: {
    user: { id, email, emailVerified, providers, createdAt, updatedAt, profile, metadata } | null
  },
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.getCurrentUser();

if (data.user) {
  console.log('User:', data.user.email);
}
```

### Output

```json
{
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "providers": ["email"],
      "profile": {
        "name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "metadata": {}
    }
  },
  "error": null
}
```

---

## getProfile()

Get any user's public profile by ID. Returns a flat profile object with all fields at the top level.

### Parameters

- `userId` (string, required) - User ID to fetch profile for

### Returns

```typescript
{
  data: {
    id: string,
    name?: string,
    avatar_url?: string,
    createdAt?: string,
    updatedAt?: string,
    ...customFields
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.getProfile('usr_xyz789');

if (data) {
  console.log(data.name);
  console.log(data.avatar_url);
}
```

### Output

```json
{
  "data": {
    "id": "usr_xyz789",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Full-stack developer",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "error": null
}
```

---

## setProfile()

Update current user's profile in users table. Supports any dynamic fields and returns the updated profile as a flat object.

### Parameters

- `profile` (object) - A key-value map of profile fields to update. Any fields are accepted.

**Common fields:**

- `name` (predefined, string) - User's display name
- `avatar_url` (predefined, string) - Profile picture URL

### Returns

```typescript
{
  data: {
    id: string,
    name?: string,
    avatar_url?: string,
    createdAt?: string,
    updatedAt?: string,
    ...customFields
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.setProfile({
  name: 'JohnDev',
  bio: 'Full-stack developer',
  avatar_url: 'https://example.com/avatar.jpg',
  custom_field: 'any value', // Any custom fields are supported
});
```

### Output

```json
{
  "data": {
    "id": "usr_abc123",
    "name": "JohnDev",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Full-stack developer",
    "custom_field": "any value",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  },
  "error": null
}
```

---

## resendVerificationEmail()

Resend email verification when the previous OTP has expired or was not received. Uses the method configured in auth settings (`verifyEmailMethod`). When method is `code`, sends a 6-digit numeric code. When method is `link`, sends a browser verification link that goes through an InsForge backend endpoint first.

<Note>
  This endpoint prevents user enumeration by returning success even if the email doesn't exist.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `redirectTo` (string, optional) - Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page.

### Returns

```typescript
{
  data: { success: boolean, message: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.resendVerificationEmail({
  email: 'user@example.com',
  redirectTo: 'http://localhost:3000/sign-in',
});

if (data?.success) {
  console.log('Verification email sent!');
}
```

### Output

```json
{
  "data": {
    "success": true,
    "message": "Verification email sent"
  },
  "error": null
}
```

---

## verifyEmail()

Verify an email address with a 6-digit code.

For link-based verification, users should click the email link, which opens `GET /api/auth/email/verify-link` in the browser.

Successfully verified users who use this code endpoint will receive a session token.

For link-based verification, your frontend should handle the browser redirect like this:

- Success: `?insforge_status=success&insforge_type=verify_email`
- Error: `?insforge_status=error&insforge_type=verify_email&insforge_error=...`
- `insforge_status`: Result of the browser link flow. For verification, values are `success` or `error`.
- `insforge_type`: Flow identifier. For verification links this is always `verify_email`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.

Recommended handling: use your sign-in page as `redirectTo`. When `insforge_status=success`, show a confirmation message and ask the user to sign in with their email and password.

### Parameters

- `email` (string, required) - User's email address
- `otp` (string, required) - 6-digit verification code

### Returns

```typescript
{
  data: {
    accessToken: string,
    user: { id, email, emailVerified, ... }
  } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.verifyEmail({
  email: 'user@example.com',
  otp: '123456',
});

if (data) {
  console.log('Email verified!', data.accessToken);
}
```

### Output

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "emailVerified": true
    }
  },
  "error": null
}
```

---

## sendResetPasswordEmail()

Send password reset email using the method configured in auth settings (`resetPasswordMethod`). When method is `code`, sends a 6-digit numeric code for two-step flow. When method is `link`, sends a browser reset link that goes through an InsForge backend endpoint first.

<Note>
  This endpoint prevents user enumeration by returning success even if the email doesn't exist.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `redirectTo` (string, optional) - Used for link-based password reset. The email link always opens an InsForge backend endpoint first; InsForge then redirects the browser to this URL with the reset `token` in the query string so your app can render its own reset-password page. Required when `resetPasswordMethod` is set to `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's dedicated reset-password page.

### Returns

```typescript
{
  data: { success: boolean, message: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.sendResetPasswordEmail({
  email: 'user@example.com',
  redirectTo: 'http://localhost:3000/reset-password',
});

if (data?.success) {
  console.log('Password reset email sent!');
}
```

### Output

```json
{
  "data": {
    "success": true,
    "message": "Password reset email sent"
  },
  "error": null
}
```

---

## exchangeResetPasswordToken()

Exchange a 6-digit reset password code for a reset token. This is step 1 of the two-step password reset flow (only used when `resetPasswordMethod` is `code`).

<Note>
  This endpoint is not used when `resetPasswordMethod` is `link`, because the browser reset-link flow uses the emailed link token directly.
</Note>

### Parameters

- `email` (string, required) - User's email address
- `code` (string, required) - 6-digit code from the email

### Returns

```typescript
{
  data: { token: string, expiresAt: string } | null,
  error: Error | null
}
```

### Example

```javascript
const { data, error } = await insforge.auth.exchangeResetPasswordToken({
  email: 'user@example.com',
  code: '123456',
});

if (data) {
  // Use token to reset password
  await insforge.auth.resetPassword({
    newPassword: 'newSecurePassword123',
    otp: data.token,
  });
}
```

### Output

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-15T11:00:00Z"
  },
  "error": null
}
```

---

## resetPassword()

Reset user password with a token. The token can be:
- **Magic link token**: Provided in the reset page URL from `sendResetPasswordEmail` when method is `link`
- **Reset token**: From `exchangeResetPasswordToken` after code verification when method is `code`

### Parameters

- `newPassword` (string, required) - New password for the user
- `otp` (string, required) - Reset token or magic link token

For link-based password reset, your frontend should handle the browser redirect like this:

- Ready to reset: `?token=...&insforge_status=ready&insforge_type=reset_password`
- Error: `?insforge_status=error&insforge_type=reset_password&insforge_error=...`
- `token`: Present only when `insforge_status=ready`. Pass this value to `resetPassword({ otp })`.
- `insforge_status`: Result of the browser link flow. For reset links, values are `ready` or `error`.
- `insforge_type`: Flow identifier. For reset links this is always `reset_password`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.

Only render the reset-password form when `insforge_status=ready` and `token` is present.

### Returns

```typescript
{
  data: { message: string } | null,
  error: Error | null
}
```

### Example

```javascript
// Code method flow: after exchangeResetPasswordToken
const { data, error } = await insforge.auth.resetPassword({
  newPassword: 'newSecurePassword123',
  otp: resetToken, // Token from exchangeResetPasswordToken
});

// Link method flow: token from the reset page URL
const { data, error } = await insforge.auth.resetPassword({
  newPassword: 'newSecurePassword123',
  otp: 'a1b2c3d4e5f6...', // Token from the magic link URL
});

if (data) {
  console.log('Password reset successful!');
}
```

### Output

```json
{
  "data": {
    "message": "Password reset successfully. Please login with your new password."
  },
  "error": null
}
```

---

## Error Handling

All auth methods return structured errors:

```javascript
const { data, error } = await insforge.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'wrong_password',
});

if (error) {
  console.error(error.statusCode); // 401
  console.error(error.error); // 'INVALID_CREDENTIALS'
  console.error(error.message); // 'Invalid login credentials'
  console.error(error.nextActions); // 'Check email and password'
}
```

# InsForge Auth REST API Reference (fetch-sdk-docs: auth + rest-api)

---
title: Authentication API Reference
description: User authentication and session management via REST API
---

## Overview

The Authentication API provides endpoints for user registration, login, email verification, password reset, and OAuth integration.

## Headers

For authenticated function invocations:
```bash
Authorization: Bearer your-jwt-token-or-anon-key
Content-Type: application/json
```

For admin endpoints:
```bash
Authorization: Bearer admin-jwt-token-Or-API-Key
Content-Type: application/json
```

---

## Register User

Create a new user account.

```
POST /api/auth/users
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_type` | string | No | Client type: `web` (default), `mobile`, `desktop`, or `server` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `password` | string | Yes | Password (must meet configured requirements) |
| `name` | string | No | User display name |
| `redirectTo` | string | No | Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page. |

### Example (Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe",
    "redirectTo": "http://localhost:3000/sign-in"
  }'
```

### Example (Non-Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/users?client_type=mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe",
    "redirectTo": "myapp://sign-in"
  }'
```

### Response (Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": false,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "csrfToken": "abc123...",
  "requireEmailVerification": false
}
```

### Response (Non-Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": false,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "requireEmailVerification": false
}
```

<Note>
- For **web clients**: A `csrfToken` is returned and the refresh token is stored in an httpOnly cookie.
- For **non-web clients** (`mobile`, `desktop`, `server`): A `refreshToken` is returned directly in the response. Store it securely in your client or server runtime.
- Use **`server`** for trusted server-side callers such as SSR apps, BFFs, or CLIs that cannot rely on browser cookies.
- If `requireEmailVerification` is `true`, `accessToken` and tokens will be `null` and the user must verify their email before logging in.
</Note>

---

## Sign In

Authenticate user and get access token.

```
POST /api/auth/sessions
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_type` | string | No | Client type: `web` (default), `mobile`, `desktop`, or `server` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `password` | string | Yes | User password |

### Example (Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Example (Non-Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/sessions?client_type=mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Response (Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "csrfToken": "abc123..."
}
```

### Response (Non-Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

<Note>
- For **web clients**: A `csrfToken` is returned and the refresh token is stored in an httpOnly cookie. Include the `csrfToken` in the `X-CSRF-Token` header when calling `/api/auth/refresh`.
- For **non-web clients** (`mobile`, `desktop`, `server`): A `refreshToken` is returned directly. Store it securely and include it in the request body when calling `/api/auth/refresh`.
</Note>

---

## Refresh Token

Refresh access token using refresh token.

```
POST /api/auth/refresh
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_type` | string | No | Client type: `web` (default), `mobile`, `desktop`, or `server` |

### Headers (Web Client)

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `X-CSRF-Token` | string | Yes | CSRF token received from login/register response |

### Request Body (Non-Web Client)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | Yes | Refresh token received from login/register response |

### Example (Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/refresh" \
  -H "X-CSRF-Token: abc123..." \
  --cookie "refresh_token=..."
```

### Example (Non-Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/refresh?client_type=mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### Response (Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "csrfToken": "def456..."
}
```

### Response (Non-Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true,
    "providers": ["email"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

<Note>
Token rotation is implemented for security:
- **Web clients**: Each refresh returns a new `csrfToken` that must be used for subsequent refresh requests.
- **Non-web clients** (`mobile`, `desktop`, `server`): Each refresh returns a new `refreshToken`. You must persist this new token and use it for the next refresh. Update the `accessToken` in memory.
</Note>

---

## Logout

Logout and clear refresh token cookie.

```
POST /api/auth/logout
```

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/logout"
```

### Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Get Current User

Get the currently authenticated user's info from JWT token.

This REST endpoint does not refresh expired access tokens by itself.

- For raw REST clients, call `POST /api/auth/refresh` when needed.
- For browser apps using the TypeScript SDK, call `auth.getCurrentUser()` during startup. The SDK will use the httpOnly refresh cookie automatically when it can refresh the session.
- This automatic refresh behavior is browser-only. Server, mobile, and other non-browser clients should refresh explicitly.

```
GET /api/auth/sessions/current
```

### Example

```bash
curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/sessions/current" \
  -H "Authorization: Bearer your-jwt-token"
```

### Response

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "role": "authenticated"
  }
}
```

---

## Update Profile

Update the current user's profile.

```
PATCH /api/auth/profiles/current
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `profile` | object | Yes | Profile data (name, avatar_url, custom fields) |

### Example

```bash
curl -X PATCH "https://r3krqy29.ap-southeast.insforge.app/api/auth/profiles/current" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg"
    }
  }'
```

### Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "profile": {
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

---

## Get User Profile

Get public profile information for a user by ID.

```
GET /api/auth/profiles/{userId}
```

### Example

```bash
curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/profiles/123e4567-e89b-12d3-a456-426614174000"
```

### Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "profile": {
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

---

## Email Verification

### Send Verification Email

```
POST /api/auth/email/send-verification
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `redirectTo` | string | No | Used for link-based email verification. The email link always opens an InsForge backend endpoint first; after the token is verified, InsForge redirects the browser to this URL with the verification result. Required when `verifyEmailMethod` is `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's sign-in page. |

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/send-verification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "redirectTo": "http://localhost:3000/sign-in"
  }'
```

### Response

```json
{
  "success": true,
  "message": "If your email is registered, we have sent you a verification code/link."
}
```

### Verify Email

```
POST /api/auth/email/verify
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_type` | string | No | Client type: `web` (default), `mobile`, `desktop`, or `server` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `otp` | string | Yes | 6-digit verification code |

For link-based verification, email clicks use:

```
GET /api/auth/email/verify-link?token=...
```

That browser-oriented GET flow verifies the token on the backend and redirects to the stored `redirectTo` URL. `POST /api/auth/email/verify` is the JSON API for 6-digit code submission.

Handle the browser redirect like this:

- Success: `?insforge_status=success&insforge_type=verify_email`
- Error: `?insforge_status=error&insforge_type=verify_email&insforge_error=...`
- `insforge_status`: Result of the browser link flow. For verification, values are `success` or `error`.
- `insforge_type`: Flow identifier. For verification links this is always `verify_email`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.
- Recommended handling: use your sign-in page as `redirectTo`. When `insforge_status=success`, show a confirmation message and ask the user to sign in with their email and password.
- If `redirectTo` is not allowlisted, InsForge returns a `400` error whose message includes the rejected URL and whose `nextActions` tells you to add it to `allowedRedirectUrls`.

### Example (Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### Example (Non-Web Client)

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/verify?client_type=mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### Response (Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "csrfToken": "abc123..."
}
```

### Response (Non-Web Client)

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Password Reset

### Send Reset Email

```
POST /api/auth/email/send-reset-password
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `redirectTo` | string | No | Used for link-based password reset. The email link always opens an InsForge backend endpoint first; InsForge then redirects the browser to this URL with the reset `token` in the query string so your app can render its own reset-password page. Required when `resetPasswordMethod` is `link`. This URL must be included in `allowedRedirectUrls`. Recommended: use your app's dedicated reset-password page. |

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/send-reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "redirectTo": "http://localhost:3000/reset-password"
  }'
```

### Exchange Code for Token (Code Method Only)

```
POST /api/auth/email/exchange-reset-password-token
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `code` | string | Yes | 6-digit code from email |

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/exchange-reset-password-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456"
  }'
```

### Response

```json
{
  "token": "abc123...",
  "expiresAt": "2024-01-15T11:00:00Z"
}
```

### Reset Password

```
POST /api/auth/email/reset-password
```

For link-based password reset, email clicks use:

```
GET /api/auth/email/reset-password-link?token=...
```

That browser-oriented GET flow validates the token on the backend and redirects to the stored `redirectTo` URL with the reset token in the query string. `POST /api/auth/email/reset-password` remains the JSON API that accepts the new password.

Handle the browser redirect like this:

- Ready to reset: `?token=...&insforge_status=ready&insforge_type=reset_password`
- Error: `?insforge_status=error&insforge_type=reset_password&insforge_error=...`
- `token`: Present only when `insforge_status=ready`. Pass this value to `POST /api/auth/email/reset-password` as `otp`.
- `insforge_status`: Result of the browser link flow. For reset links, values are `ready` or `error`.
- `insforge_type`: Flow identifier. For reset links this is always `reset_password`.
- `insforge_error`: Present only when `insforge_status=error`. Human-readable error message for display or logging.
- Your app should only render the reset-password form when `insforge_status=ready` and `token` is present.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newPassword` | string | Yes | New password |
| `otp` | string | Yes | Reset token from either the code exchange endpoint or the magic link URL |

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/email/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "newSecurePassword123",
    "otp": "abc123..."
  }'
```

### Response

```json
{
  "message": "Password reset successfully"
}
```

---

## OAuth Authentication

OAuth authentication now uses the PKCE (Proof Key for Code Exchange) flow for enhanced security. Instead of returning tokens directly in the redirect URL, an authorization code is returned which must be exchanged for tokens.

### Initiate OAuth Flow

```
GET /api/auth/oauth/{provider}
```

For custom providers configured in the dashboard, use:

```
GET /api/auth/oauth/custom/{key}
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `redirect_uri` | string | Yes | URL to redirect after authentication |
| `code_challenge` | string | Yes | PKCE code challenge (Base64 URL-encoded SHA256 hash of code_verifier) |
| Other string query params | string | No | Provider-specific OAuth hints, such as Google's `prompt=select_account` |

<Note>
  Extra query params are forwarded as provider-specific hints only when they do not collide with
  server-owned OAuth fields. Do not pass `client_id`, `redirect_uri`, `code_challenge`, `state`,
  `response_type`, or `scope`; InsForge/provider-generated values win and colliding client
  values are ignored.
</Note>

### Supported Providers

- `google`
- `github`
- `discord`
- `linkedin`
- `facebook`
- `apple`
- `microsoft`
- `x`
- `spotify`
- Any custom provider key returned by `GET /api/auth/public-config` in `customOAuthProviders`

### Example

```bash
# Generate code_verifier (random string, 43-128 characters)
CODE_VERIFIER=$(openssl rand -base64 32 | tr -d '=' | tr '/+' '_-')

# Generate code_challenge (SHA256 hash of code_verifier, Base64 URL-encoded)
CODE_CHALLENGE=$(echo -n $CODE_VERIFIER | openssl dgst -sha256 -binary | base64 | tr -d '=' | tr '/+' '_-')

curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/oauth/google?redirect_uri=https://myapp.com/callback&code_challenge=$CODE_CHALLENGE&prompt=select_account"
```

```bash
# Custom provider example
curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/oauth/custom/acme?redirect_uri=https://myapp.com/callback&code_challenge=$CODE_CHALLENGE"
```

### Response

```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

### OAuth Callback

After the user authenticates with the provider, they will be redirected to your `redirect_uri` with an authorization code:

```
https://myapp.com/callback?insforge_code=abc123...
```

<Note>
The `insforge_code` is a temporary authorization code that must be exchanged for tokens using the `/api/auth/oauth/exchange` endpoint.
</Note>

---

### Exchange Code for Tokens

Exchange the authorization code for access and refresh tokens.

```
POST /api/auth/oauth/exchange
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_type` | string | No | Client type: `web` (default), `mobile`, `desktop`, or `server` |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | The `insforge_code` received in the callback |
| `code_verifier` | string | Yes | The original code_verifier used to generate the code_challenge |

### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/oauth/exchange?client_type=mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "abc123...",
    "code_verifier": "your-original-code-verifier"
  }'
```

### Response

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "emailVerified": true,
    "providers": ["google"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

<Note>
- For **web clients**: The `refreshToken` will be `null` and a `csrfToken` is returned instead. The refresh token is stored in an httpOnly cookie.
- For **non-web clients** (`mobile`, `desktop`, `server`): A `refreshToken` is returned directly. Store it securely.
</Note>

---

### Complete OAuth Flow Example (Non-Web)

```swift
// 1. Generate PKCE code verifier and challenge
let codeVerifier = generateRandomString(length: 43)
let codeChallenge = sha256(codeVerifier).base64URLEncoded()

// 2. Initiate OAuth flow
let authURL = "https://r3krqy29.ap-southeast.insforge.app/api/auth/oauth/google" +
    "?redirect_uri=myapp://callback" +
    "&code_challenge=\(codeChallenge)"

// 3. Open browser/WebView and wait for callback
// User completes authentication...

// 4. Handle callback with insforge_code
// myapp://callback?insforge_code=abc123...

// 5. Exchange code for tokens
let response = POST("/api/auth/oauth/exchange?client_type=mobile", body: {
    "code": insforgeCode,
    "code_verifier": codeVerifier
})

// 6. Store tokens
accessToken = response.accessToken
refreshToken = response.refreshToken  // Persist securely
```

---

## Public Configuration

Get public authentication settings (no auth required).

```
GET /api/auth/public-config
```

### Example

```bash
curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/public-config"
```

### Response

```json
{
  "oAuthProviders": ["google", "github"],
  "customOAuthProviders": ["acme"],
  "requireEmailVerification": true,
  "passwordMinLength": 8,
  "requireNumber": true,
  "requireLowercase": true,
  "requireUppercase": false,
  "requireSpecialChar": false,
  "verifyEmailMethod": "code",
  "resetPasswordMethod": "link"
}
```

---

## Admin Endpoints

These endpoints require `project_admin` role.

### List All Users

```
GET /api/auth/users?offset=0&limit=10&search=john
```

### Get User by ID

```
GET /api/auth/users/{userId}
```

### Delete Users

```bash
curl -X DELETE "https://r3krqy29.ap-southeast.insforge.app/api/auth/users" \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"userIds": ["user-id-1", "user-id-2"]}'
```

### Generate Anonymous Token

```
POST /api/auth/tokens/anon
```

### Get Auth Configuration

Get current authentication settings (admin only).

```
GET /api/auth/config
```

#### Example

```bash
curl "https://r3krqy29.ap-southeast.insforge.app/api/auth/config" \
  -H "Authorization: Bearer admin-jwt-token"
```

#### Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "requireEmailVerification": true,
  "passwordMinLength": 8,
  "requireNumber": true,
  "requireLowercase": true,
  "requireUppercase": false,
  "requireSpecialChar": false,
  "verifyEmailMethod": "code",
  "resetPasswordMethod": "link",
  "allowedRedirectUrls": ["https://myapp.com/dashboard", "https://*.myapp.com"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

`allowedRedirectUrls` entries are matched against the full `redirectTo` value, including scheme, host, optional port, and path.

- Exact entries must match exactly, such as `https://myapp.com/dashboard`.
- Wildcards are supported only in the host portion, such as `https://*.myapp.com/callback`.
- Deep links are allowed when explicitly listed, such as `com.example.app:/oauth2redirect` or `myapp://auth/callback`.
- If `allowedRedirectUrls` is empty, InsForge allows all redirects for developer convenience. This is insecure for production and should be avoided outside local development.

### Update Auth Configuration

Update authentication settings (admin only).

```
PUT /api/auth/config
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requireEmailVerification` | boolean | No | Whether email verification is required |
| `passwordMinLength` | integer | No | Minimum password length (4-128) |
| `requireNumber` | boolean | No | Require numbers in password |
| `requireLowercase` | boolean | No | Require lowercase in password |
| `requireUppercase` | boolean | No | Require uppercase in password |
| `requireSpecialChar` | boolean | No | Require special characters in password |
| `verifyEmailMethod` | string | No | Email verification method (`code` or `link`) |
| `resetPasswordMethod` | string | No | Password reset method (`code` or `link`) |
| `allowedRedirectUrls` | array | No | List of allowed redirect URLs. Entries are matched against the full `redirectTo` value. Exact URLs must match exactly, host wildcards such as `https://*.domain.com/callback` are supported, and custom deep links such as `com.example.app:/oauth2redirect` are allowed when explicitly listed. If empty, all redirects are allowed, which is insecure for production. |

#### Example

```bash
curl -X PUT "https://r3krqy29.ap-southeast.insforge.app/api/auth/config" \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "requireEmailVerification": true,
    "passwordMinLength": 10,
    "verifyEmailMethod": "link"
  }'
```

### Exchange Admin Session

Exchange a cloud provider authorization code for an admin session.

```
POST /api/auth/admin/sessions/exchange
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Authorization code or JWT from Insforge Cloud |

#### Example

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/admin/sessions/exchange" \
  -H "Content-Type: application/json" \
  -d '{"code": "eyJhbGciOiJIUzI1NiIs..."}'
```

#### Response

```json
{
  "admin": {
    "sub": "cloud:user_123"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "csrfToken": "abc123..."
}
```

### Get Current Admin Session

Get the current dashboard admin session from a project admin access token.

```
GET /api/auth/admin/sessions/current
```

#### Response

```json
{
  "admin": {
    "sub": "local:admin"
  }
}
```

### Refresh Admin Session

Refresh a dashboard admin access token. This endpoint uses the dashboard-only
`insforge_admin_refresh_token` httpOnly cookie and does not share the app/user
refresh cookie.

```
POST /api/auth/admin/refresh
```

```bash
curl -X POST "https://r3krqy29.ap-southeast.insforge.app/api/auth/admin/refresh" \
  -H "X-CSRF-Token: abc123..." \
  --cookie "insforge_admin_refresh_token=..."
```

### Logout Admin Session

```
POST /api/auth/admin/logout
```

---

## Error Responses

### Invalid Credentials (401)

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "statusCode": 401,
  "nextActions": "Check your email and password"
}
```

### User Already Exists (409)

```json
{
  "error": "USER_EXISTS",
  "message": "User with this email already exists",
  "statusCode": 409,
  "nextActions": "Use a different email or sign in"
}
```

### Email Not Verified (403)

```json
{
  "error": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before signing in",
  "statusCode": 403,
  "nextActions": "Check your inbox for verification email"
}
```

