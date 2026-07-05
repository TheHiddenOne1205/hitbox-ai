# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

* **Phase:** Phase 2 — Project Profile & GDD Management
* **Last completed:** 06 Project Save Logic
* **Next:** 07 AI Project Extraction from Draft Document

---

## Progress

### Phase 1 — Foundation

* [x] **01 Homepage**

* [x] Full page UI (Navbar with context selector placeholder, Hero section with CTAs, Dashboard preview, Features grid, How It Works panel, Footer)

* [x] Dynamic routing logic (`/login` or `/dashboard`) based on active authentication state

* [x] **02 Auth**

* [x] Login view layout featuring dedicated Google and GitHub OAuth trigger buttons

* [x] InsForge OAuth token handling and session callback routing at `/app/(auth)/callback`

* [x] Proxy access-control interceptors (`proxy.ts`) shielding `/dashboard` and `/projects` sub-paths

* [x] **03 PostHog Initialization**

* [x] Instantiate `lib/posthog-client.tsx` browser routing hook engine

* [x] Instantiate `lib/posthog-server.ts` serverless event mapping instance (`flushAt: 1`)

* [x] Wrap main layout tree, register user identifiers upon login, and trigger clear on logout

* [x] **04 Database Schema**

* [x] Create InsForge tables (`projects`, `agent_runs`, `mechanics`, `agent_logs`) with precise multi-tenant filters

* [x] Provision `drafts` S3 binary storage bucket mapped to user folder permissions

### Phase 2 — Project Profile & GDD Management

* [x] **05 Project Form Page — Full UI**

  * [x] Dynamic form frames capturing Base Metadata (title, genre, art style, platform toggles, audience), Context Keywords chip input, and Core GDD structure (player loop, mechanics tags, monetization)

  * [x] File drag-and-drop upload zone with three visual states (idle / dragging / file-selected), file preview, clear action, Extract and Skip buttons

  * [x] ProfileStatusIndicator warning banner (dismissable, yellow severity)

  * [x] GDDPreview card with generation status, trigger button, and download link

  * [x] Sticky Save Configuration footer bar with loading and success states

  * [x] Responsive two-column layout (form + sticky sidebar) at `app/projects/[id]/page.tsx`

* [x] **06 Project Save Logic**

  * [x] Server Action mutations inside `actions/projects.ts` mapped to profile tables with SQL `INSERT`/`UPDATE` upsert behavior

  * [x] Async PDF binary upload routines saving tracking endpoints into targeted database rows under `pitch_deck_url` pointer

  * [x] `revalidatePath` hooks keeping the global active dropdown selector and dashboards synced dynamically

  * [x] Dynamic project context selection in the Navbar (reads real DB projects, routes users automatically on selection)

* [ ] **07 AI Project Extraction from Draft Document**

* [ ] Secure byte stream conversion passing layout characters out to processing systems

* [ ] Gemini parsing routine that synthesizes unstructured files into strict JSON project schema mappings

* [ ] **08 GDD / Pitch Deck PDF Generation from Project**

* [ ] POST route at `/api/gdd/generate` extracting active project configurations

* [ ] `@react-pdf/renderer` structure formatting that saves PDF byte buffers natively to cloud buckets

### Phase 3 — Validate Concepts Workspace

* [ ] **09 Validate Concepts Page — Full UI**

* [ ] Analysis workspace input modules for Mechanic Name and Benchmark Genre

* [ ] Comprehensive scannable data grid layout containing color-coded viability rings and engagement filters

* [ ] **10 Objective SearXNG Concept Discovery**

* [ ] API endpoint path at `/api/agent/validate` spinning up unique `agent_runs` keys

* [ ] Aggregator logic fetching clean public Reddit/Steam review items from cloud SearXNG engines

* [ ] Gemini screening sweeps that determine 0–100 alignment metrics without manufacturing text reviews

* [ ] **11 Filter + Sort + Pagination Wiring**

* [ ] Multi-tenant database filtration parameters isolating target concept categories

* [ ] Dynamic query sorters matching viability ranks, case-insensitive text terms, and 20-row offsets

### Phase 4 — Mechanic Details & Deep Research

* [ ] **12 Mechanic Details Page — Full UI**

* [ ] High-fidelity detail view panels visualizing qualitative sentiment tags and pitfall warnings

* [ ] Research control dashboard modules presenting explicit "Research Competitors" CTA options

* [ ] **13 Competitor Research Agent**

* [ ] API endpoint at `/api/agent/research` instantiating secure Stagehand automation loops

* [ ] Browserbase Cloud proxy execution sequences gathering features from competitor platforms

* [ ] Gemini synthesis routine storing completed competitor dossiers inside `mechanics.competitor_research`

### Phase 5 — Dashboard Analytics

* [ ] **14 Dashboard Page — Full UI**

* [ ] Workspace analytics frame rendering incomplete warnings, stat blocks, and transaction cards

* [ ] Recharts visualization panels sketching mock telemetry trends and score ranges

* [ ] **15 Stats Bar Integration**

* [ ] Real data trackers executing user-scoped query counts for active insights and search counters

* [ ] **16 Recent Activity Data Loop**

* [ ] Combined activity streams sorting records descending by date arrays into informational HUD logs

* [ ] **17 Analytics Charts Integration via PostHog Telemetry**

* [ ] Live PostHog event properties feeding volume lines, score ranges, and weekly scraping counters

---

## Decisions Made During Build

* **InsForge SSR Cookies API**: Prioritized latest InsForge MCP documentation over `architecture.md` cookie management templates. Used the `get/set/delete` CookieStore interface for `@insforge/sdk/ssr` integration.
* **Secure Server-Side PKCE**: Stored PKCE `codeVerifier` in a secure `insforge_code_verifier` cookie on the server during `signInWithOAuth` redirection, and retrieved it inside the callback Server Action. This avoids exposing PKCE secrets to client-side storage in Next.js SSR apps.
* **Suspense Prerender Protection**: Wrapped `LoginPage` and `CallbackPage` search parameter hooks in React `<Suspense>` boundaries to prevent static HTML generation bailout failures during Next.js production builds.
* **Next.js 16 Proxy Migration**: Replaced the deprecated `middleware.ts` convention with Next.js 16's new `proxy.ts` convention to handle request interception and cookie rotation at the server boundaries.
* **Client-Side Token Refresh Route**: Added `/api/auth/refresh` API route handler to allow `createBrowserClient` to exchange HttpOnly cookies and verify user sessions on the client side.
* **Redirect Try-Catch Bypass**: Refactored `signOutAction` Server Action to return a status payload instead of calling `redirect()` directly, preventing Next.js's redirect exception from getting trapped and suppressed in the Navbar components.
* **Full Reload Redirection for Auth Changes**: Configured both callback and sign-out pages to redirect using `window.location.href` rather than client-side `router.push`. This triggers a complete browser reload, clearing/reinitializing the client-side JavaScript memory context and forcing the browser SDK to read the new cookie states.
* **Server-Side Session Prop Passing**: Converted homepage to a Server Component and fetched session states directly on the server to pass them down to the client-side `Navbar` and `Hero` as props, bypassing browser cross-domain cookie check limits.
* **Onboarding Username Setup Screen**: Added a `/onboarding` step post-authentication where users configure their handle (stored in user profile metadata), shielding main dashboards from users who bypass onboarding.

---

## Notes

* **SSR Helper Import Path**: Imported SSR helpers from `@insforge/sdk/ssr` instead of a separate `@insforge/ssr` package since they are bundled directly in the `@insforge/sdk` package.
* **Inline SVG Brand Icons**: Replaced `Chrome` and `Github` lucide-react brand icons with custom inline SVGs in `app/(auth)/login/page.tsx` to prevent import failures.
