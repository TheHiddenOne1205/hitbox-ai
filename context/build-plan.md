# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation

### 01 Homepage

Build the complete homepage UI.

**UI:**

* Navbar — logo, Dashboard, Validate Concepts, My Projects links, Dropdown selector placeholder


* Hero section — headline, subheadline, Get Started CTA, and Validate First Concept CTA


* Dashboard preview screenshot embedded below hero


* Features section — three value props (Scraping, AI Matching, Document Extraction) with descriptions


* How It Works walkthrough panel


* Footer



**Logic:**

* Get Started and CTAs → `/login` if not authenticated, `/dashboard` if authenticated



---

### 02 Auth

InsForge authentication — Google and GitHub OAuth.

**UI:**

* Login page — Google OAuth button, GitHub OAuth button



**Logic:**

* Google OAuth via InsForge


* GitHub OAuth via InsForge


* OAuth callback handler exposed at `/app/(auth)/callback`

* Session management using `@insforge/ssr` middleware framework


* Middleware protecting `/dashboard`, `/projects`, `/projects/[id]`, `/projects/[id]/validate`, and sub-routes


* After login → redirect to `/dashboard`


---

### 03 PostHog Initialization

Set up PostHog before any events fire. Must be done before any agent features.

**Logic:**

* Create `lib/posthog-client.ts` — PostHog browser client, initialized with environment variables


* Create `lib/posthog-server.ts` — PostHog server client with `flushAt: 1` and `flushInterval: 0`

* Initialize PostHog in root app layout — wraps entire app, passing `projectId` context dynamically


* `posthog.identify()` called after successful login with user ID


* `posthog.reset()` called on logout



---

### 04 Database Schema

All InsForge tables and storage bucket created before any data is written.

**Logic:**

* Create `projects` table matching the absolute columns from `architecture.md` including `gdd_data`

* Create `agent_runs` table tracking search scopes


* Create `mechanics` table with `competitor_research` `jsonb` column


* Create `agent_logs` table tracking system levels (`info`, `success`, `warning`, `error`)


* Create `drafts` storage bucket with authenticated access only, mapped to user folder structures


* Row level security (RLS) policies implemented on all components — always filter by `user_id`


---

## Phase 2 — Project Profile & GDD Management

### 05 Project Form Page — Full UI

Build the complete project setup and management UI with mock data. No save logic yet.

**UI:**

* Incomplete project warning banner at top if profile tokens are not filled


* Draft Upload section — drag and drop zone, "Click to upload or drag and drop blueprint", PDF/Text only note, Extract from Draft button, Skip button


* Game Design Document form with clearly labeled sections:
* Base Metadata — Title, Genre baseline context input, Art Style direction dropdown, Target Platform checkbox array, Target Audience segment


* Context Identifiers — Keywords text array chip input with Add button


* Core GDD Data Structure — Player Loop text area, Core Mechanics tags, Monetization strategy





* Save Project Configuration button at bottom



---

### 06 Project Save Logic

Wire project configuration form to InsForge DB.

**Logic:**

* Server Action in `actions/projects.ts` saves form inputs directly to the `projects` table


* Draft GDD document file uploaded to InsForge Storage bucket path `drafts/{user_id}/{project_id}/gdd.pdf`

* `pitch_deck_url` storage directory pointer written back to database profile record


* `is_complete` boolean automatically flags true when foundational parameters are verified


* Form pre-fills with existing database context values upon user path re-entry


* Global Navbar Project Selector Dropdown syncs instantly using `revalidatePath` routines



---

### 07 AI Project Extraction from Draft Document

Extract from Draft button — Gemini reads uploaded document data and auto-fills project form fields.

**UI:**

* Extract from Draft button displays loading state while execution process loops


* Form field arrays populate automatically across text frames after extraction finishes



**Logic:**

* Text content extracted from the uploaded PDF/text document buffer


* Failure state returned if file text parsing returns empty or insufficient characters


* Gemini model reads the raw text array and generates a structured JSON payload mapping back to all `projects` schema layout properties


* UI state updates seamlessly before user confirms save manually



---

---

## Phase 3 — Validate Concepts Workspace

### 09 Validate Concepts Page — Full UI

Build the complete validation dashboard layout using mock data assets. No automation logic yet.

**UI:**

* Active project verification card at top showing currently selected game profile parameters


* Concept inputs module:
* MECHANIC NAME label + text input field ("Deckbuilding", "Perma-death")


* TARGET GENRE label + baseline constraint input placeholder ("Roguelike", "RPG")


* Validate Concept button with analysis processing icons




* Success milestone confirmation area below inputs — banner text: *"Analyzed 8 community discussions and saved 4 high-value market insights for [Project Name]"*

* Discovered insights data layout section:
* Filter tools bar: text search input "Filter entries...", Insight Filters matching tags, Insight Pagination framework


* Insights table layout columns: FORUM ORIGIN badge (Steam Community/Reddit), CONCEPT TITLE, VIABILITY RATING badge (color-coded scoring brackets), ENGAGEMENT SCORE, DATE FOUND





---

### 10 Objective SearXNG Concept Discovery

Agent runs search commands through public hosted SearXNG endpoints, evaluates snippets via Gemini, and updates records.

**Logic:**

* POST `/api/agent/validate` receives mechanic and genre inputs from the client configuration forms


* Creates an operational tracking record inside the `agent_runs` table


* Calls `discoverRealCommunityThreads()` in `agent/aggregator.ts`

* Hits the cloud-deployed SearXNG engine running an organic search target string restricted strictly to public Reddit or Steam app hubs


* If network failures or server blocks are detected, flags a soft engine response indicator (`blocked: true`) instead of a genuine empty result set


* If rows exist, Gemini maps the actual snippets against the active project profile parameters, extracting a structured validation object:
* `viability_score` — integer 0–100


* `sentiment_reason` — concise analytical text paragraph


* `core_player_gripe` / `core_player_desires` / `structural_pitfalls` / `aligned_features` — clean string arrays




* Writes records directly into the `mechanics` database table anchored to their real source URLs



**PostHog events:** `concept_validation_started`, `insight_found`

---

### 11 Filter + Sort + Pagination Wiring

Wire layout navigation tabs, sorting tools, filter drops, and index page buttons to active InsForge database structures.

**Logic:**

* All Matches tab returns absolute tracked concept rows associated with the active `project_id`

* Gaps filter returns records where `viability_score` indicates high alignment or high actionability gaps


* Table ordering updates context queries dynamically: sort by Viability Score, sort by Newest entry, sort by Oldest entry


* Text search triggers matching operations against target column inputs like title or source


* Pagination bounds records to clear layouts containing 20 entries per indexing view pass



---

## Phase 4 — Mechanic Details & Deep Research

### 12 Mechanic Details Page — Full UI

Build the comprehensive structural mechanic breakdown page UI. Real metric fields are immediately wired from Phase 3 records, leaving the competitor deep research card in its initial empty state block.

**UI:**

* Navigation links leading back to the parent Validate Concepts dashboard space


* Header element displaying specific mechanic name, project badge reference, viability percentage, and source link


* Analytics panels rendering player sentiments: Grid blocks showing Grips/Complaints arrays, Desires list, Cited Competitors tags, and Aligned features


* AI Analysis card showing the complete reason summary text paragraph


* Competitor Research dashboard component — empty state showing "Research Competitors" trigger button


* Action design layout sections rendering architectural pitfalls to avoid



---

### 13 Competitor Research Agent

Agent launches remote browser automation scripts to crawl public community hubs and synthesizes a structured dossier using a single active Browserbase session.

**Logic:**

* POST `/api/agent/research` receives target `mechanicId` parameter


* Loads active user project details and target mechanic columns from database


* Resolves the competitor target network paths directly, extracting clean root domain vectors


* If extraction fails or site connectivity steps drop, bails early to pure model synthesis without throwing server crashes


* Initializes a remote browser runtime using `withStagehandCloud()` connected over secure Browserbase Cloud proxies



**Stagehand Homepage Extraction Run:**

```typescript
const homepageMetrics = await stagehand.extract({
  instruction: "Analyze this competitor's central design platform or landing layout. Extract what core structural features distinguish their gameplay loop, balance markers, and link references worth navigating.",
  schema: z.object({
    featureOverview: z.string().describe("Summary of game loop execution parameters"),
    systemBalance: z.string().describe("How mechanics interact inside their build loop"),
    communityScale: z.array(z.string()).describe("Signals tracking player volume, patch counts, or scale metrics"),
    subLinks: z.array(z.object({
      url: z.string(),
      type: z.enum(["reviews", "discussions", "patchnotes", "about", "other"])
    })).describe("Sub-links worth visiting to track player balance sentiments")
  })
});

```

**Stagehand Deep Sub-Page Crawling (Max 3 pages prioritizing discussion hubs or review nodes):**

```typescript
const detailedSentiment = await stagehand.extract({
  instruction: "Extract explicit structural complaints, technical feature failures, gameplay balance trends, and design loop constraints voiced by active player networks.",
  schema: z.object({
    balanceFlaws: z.array(z.string()),
    playerDesires: z.array(z.string()),
    systemNuances: z.array(z.string())
  })
});

```

**Gemini Cloud Synthesis Model Prompt Pass:**

```
You are a senior systems game designer evaluating a specific mechanic implementation concept against an existing project blueprint profile. You are given data scraping vectors collected across a primary competitor title, the active design draft configurations, and user sentiment parameters. Generate a precise developer briefing object.

Rules:
- Ground all analytical claims strictly inside the provided web research nodes.
- Frame candidate gaps as actionable design choices or balance adjustments.
- Retain sharp, brief system feedback parameters. No placeholder text structures allowed.

Return ONLY valid JSON format.

```

**Dossier payload shape written to `mechanics.competitor_research` jsonb:**

```json
{
  "competitorOverview": "string",
  "featureBreakdown": ["string"],
  "communityCulture": ["string"],
  "whyExecutionFailed": "string",
  "actionableDesignAdjustments": ["string"],
  "balancePitfalls": ["string"],
  "strategicQuestions": ["string"],
  "sources": ["string"]
}

```

* Complete payload written directly back to database rows



**PostHog event:** `competitor_researched`

---

## Phase 5 — Dashboard Analytics

### 14 Dashboard Page — Full UI

Build the complete project dashboard layout populated with clear mock visualization vectors.

**UI:**

* Top-level context switching dropdown enabling developers to shift project profiles globally


* Incomplete profile alerts displayed inside banner zones if active tokens evaluate empty


* Stats bar presenting 4 metrics layout tiles: Total Insights Found, Avg. Concept Viability, Competitors Researched, Validations This Week


* Recent Activity card tracking 5–10 recent chronological user events across system rows


* Analytics telemetry section rendering line and bar graphics with `recharts`:
* Insights Mapped Over Time line graphic


* Viability Score Distribution bar graphic


* Competitor Research Loops Run bar metric graphic





---

### 15 Stats Bar Integration

Wire the 4 metrics panels to real relational data filtering metrics out of InsForge database rows.

**Logic:**

* Total Insights Found — `COUNT` of `mechanics` rows matching current user and active `project_id`

* Avg. Concept Viability — `AVG` extraction of `viability_score` column components across current project rows


* Competitors Researched — `COUNT` evaluation of mechanic records where `competitor_research` column data evaluates not null


* Validations This Week — `COUNT` calculation of matching runs initialized within the last 7 calendar days



---

### 16 Recent Activity Data Loop

Aggregate chronological system logs across individual tables to present a comprehensive audit dashboard feed.

**Logic:**

* Query recent execution blocks tracking user actions inside the `agent_runs` table


* Pull recent mutation entries populated across the `mechanics` relational table rows


* Merge elements into a unified timeline, sorting records descending by `created_at` parameters


* Format values into direct human-readable layout strings:
* *"Indexed [X] market insights for [Mechanic Name] — [time ago]"*
* *"Completed deep competitor analysis on [Game Title] — [time ago]"*


* Apply visual color indicators based on activity levels (blue for informational runs, green for completed matches)



---

### 17 Analytics Charts Integration via PostHog Telemetry

Wire the dashboard graphics components directly to live events records pulled from PostHog metrics frameworks.

**Logic:**

* Insights Mapped Over Time — Query PostHog client models to fetch `insight_found` events matching distinct user hashes across a rolling 30-day window


* Viability Score Distribution — Fetch recorded telemetry parameters tracking `insight_found`, grouping properties dynamically across 0–100 brackets


* Competitor Research Loops Run — Extract recorded event instances tracking `competitor_researched` steps over a rolling 7-day filter window


* Recharts handles rendering layout visualization vectors on client screens


* Fallback empty state states trigger automatically if analytics parsing reads empty



---

## Feature Build Summary Count

| Phase | Targeted Development Scope | Total Integrated Features |
| --- | --- | --- |
| **Phase 1** | App Foundation & Core Access Layers | 4 features

 |
| **Phase 2** | Project Profile Management & GDD Pipeline | 4 features

 |
| **Phase 3** | Validate Concepts Workspace & Discovery Loops | 3 features

 |
| **Phase 4** | Mechanic Details & Competitor Web Automation | 2 features

 |
| **Phase 5** | Telemetry Dashboard Integration & Metrics Wiring | 4 features

 |
| **Total** | **Hitbox AI Production Blueprint Delivery** | **17 Core Features**<br> |
