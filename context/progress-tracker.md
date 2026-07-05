# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

* **Phase:** Phase 1 — Foundation
* **Last completed:** None
* **Next:** 01 Homepage

---

## Progress

### Phase 1 — Foundation

* [ ] **01 Homepage**

* [ ] Full page UI (Navbar with context selector placeholder, Hero section with CTAs, Dashboard preview, Features grid, How It Works panel, Footer)

* [ ] Dynamic routing logic (`/login` or `/dashboard`) based on active authentication state

* [ ] **02 Auth**

* [ ] Login view layout featuring dedicated Google and GitHub OAuth trigger buttons

* [ ] InsForge OAuth token handling and session callback routing at `/app/(auth)/callback`

* [ ] Middleware access-control interceptors shielding `/dashboard` and `/projects` sub-paths

* [ ] **03 PostHog Initialization**

* [ ] Instantiate `lib/posthog-client.ts` browser routing hook engine

* [ ] Instantiate `lib/posthog-server.ts` serverless event mapping instance (`flushAt: 1`)

* [ ] Wrap main layout tree, register user identifiers upon login, and trigger clear on logout

* [ ] **04 Database Schema**

* [ ] Create InsForge tables (`projects`, `agent_runs`, `mechanics`, `agent_logs`) with precise multi-tenant filters

* [ ] Provision `drafts` S3 binary storage bucket mapped to user folder permissions

### Phase 2 — Project Profile & GDD Management

* [ ] **05 Project Form Page — Full UI**

* [ ] Dynamic form frames capturing Base Metadata, Context Keywords, and Core GDD structure text areas

* [ ] File drag-and-drop file upload framework with built-in action states and loading indicators

* [ ] **06 Project Save Logic**

* [ ] Server Action mutations inside `actions/projects.ts` mapped to profile tables

* [ ] Async PDF binary upload routines saving tracking endpoints into targeted database rows

* [ ] `revalidatePath` hooks keeping the global active dropdown selector synced dynamically

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

*Add decisions here as they are made during implementation*.

---

## Notes

*Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files*.
