# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

* **Phase:** Phase 4 — Mechanic Details & Deep Research
* **Last completed:** 12 Mechanic Details Page — Full UI
* **Next:** 13 Competitor Research Agent

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

  * [x] Quick Actions sidebar layout for project actions and delete button

  * [x] Sticky Save Configuration footer bar with loading and success states

  * [x] Responsive two-column layout (form + sticky sidebar) at `app/projects/[id]/page.tsx`

* [x] **06 Project Save & Deletion Logic**

  * [x] Server Action mutations inside `actions/projects.ts` mapped to profile tables with SQL `INSERT`/`UPDATE` upsert behavior

  * [x] Async PDF binary upload routines saving tracking endpoints into targeted database rows under `pitch_deck_url` pointer

  * [x] `revalidatePath` hooks keeping the global active dropdown selector and dashboards synced dynamically

  * [x] Dynamic project context selection in the Navbar (reads real DB projects, routes users automatically on selection)

  * [x] Client and server-side deletion routines (`deleteProjectAction`) cleaning both relational data records and private storage folders.

* [x] **07 AI Project Extraction from Draft Document**

  * [x] Secure byte stream conversion passing layout characters out to processing systems

  * [x] Gemini parsing routine that synthesizes unstructured files into strict JSON project schema mappings



### Phase 3 — Validate Concepts Workspace

* [x] **09 Validate Concepts Page — Full UI**

  * [x] Analysis workspace input modules for Mechanic Name and Benchmark Genre ([ConceptInputs.tsx](file:///home/kalash/projects/hitbox-ai/components/validate-concepts/ConceptInputs.tsx))
  * [x] Comprehensive scannable data grid layout containing color-coded viability tags, engagement filters, search, and pagination ([validate-concepts-client.tsx](file:///home/kalash/projects/hitbox-ai/app/projects/%5Bid%5D/validate/validate-concepts-client.tsx))

* [x] **10 Objective SearXNG Concept Discovery**

  * [x] API endpoint path at `/api/agent/validate` spinning up unique `agent_runs` keys
  * [x] Aggregator logic fetching clean public Reddit/Steam review items from local/cloud SearXNG engines
  * [x] Gemini screening sweeps using `gemini-3.1-flash-lite` that determine 0–100 alignment metrics without manufacturing text reviews

* [x] **11 Filter + Sort + Pagination Wiring**

  * [x] Multi-tenant database filtration parameters isolating target concept categories

  * [x] Dynamic query sorters matching viability ranks, case-insensitive text terms, and 20-row offsets

### Phase 4 — Mechanic Details & Deep Research

* [x] **12 Mechanic Details Page — Full UI**

  * [x] High-fidelity detail view panels visualizing qualitative sentiment tags and pitfall warnings

  * [x] Research control dashboard modules presenting explicit "Research Competitors" CTA options

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
* **Object-Oriented PDF Parsing**: Used the class-based `PDFParse` API from Mehmet Kozan's modern `pdf-parse` (v2) library for parsing raw document bytes.
* **Structured Output Model**: Configured Gemini `gemini-2.5-flash` with `responseMimeType: "application/json"` and temperature `0.3` to guarantee schema-compliant JSON extraction directly from draft blueprints.
* **Cascaded Deletion Integration**: Created a `deleteProjectAction` Server Action handling both file storage removal (`insforge.storage.from("drafts").remove`) and database record deletion. Relied on PostgreSQL foreign key `ON DELETE CASCADE` constraints to automatically clean up all associated `agent_runs`, `mechanics`, and `agent_logs` records.
* **Gemini 3.1 Flash Lite Model Selection**: Specified `gemini-3.1-flash-lite` for the SearXNG concept validation agent to leverage higher rate limits.
* **SearXNG Query Strategy**: Formatted search query strings targeting Reddit and Steam Community with strict quotes and fallbacks to unquoted query queries when 0 results are returned.
* **Soft Block Handling**: Integrated blocked state indicators gracefully returning a soft indicator `blocked: true` to avoid crashes when SearXNG is unreachable.

---

## Notes

* **SSR Helper Import Path**: Imported SSR helpers from `@insforge/sdk/ssr` instead of a separate `@insforge/ssr` package since they are bundled directly in the `@insforge/sdk` package.
* **Inline SVG Brand Icons**: Replaced `Chrome` and `Github` lucide-react brand icons with custom inline SVGs in `app/(auth)/login/page.tsx` to prevent import failures.
