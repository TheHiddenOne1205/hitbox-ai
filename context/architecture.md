---

# Architecture

## Stack

| Layer | Tool | Purpose | Deployment Target (Free Tier) |
| --- | --- | --- | --- |
| **Framework** | Next.js 16 (App Router) | Full-stack framework leveraging modern caching & routing

 | **Vercel** (Hobby Tier - $0, no card)

 |
| **Auth + DB + Storage** | InsForge | Multi-project relational layer, auth engine, and PDF binary store

 | **InsForge Cloud** (Free Tier - $0, no card)

 |
| **Forum Discovery** | SearXNG | Privacy-centric, un-manipulated organic forum index parsing

 | **Koyeb / Render** (Web Service - $0, no card) |
| **Browser Automation** | Stagehand + Browserbase | LLM-driven deep competitor scraping with stealth proxies & auto-CAPTCHA solving

 | **Browserbase Cloud** (Hobby Tier - $0, no card) |
| **AI Processing** | Google Gemini API | Text structural evaluation and JSON parsing via `gemini-2.5-flash`<br> | **Google AI Studio** (Free Tier - $0, no card)

 |
| **Telemetry** | PostHog | Scoped user action event mapping & analytics dashboards

 | **PostHog Cloud** (Free Tier - $0, no card) |
| **PDF Generation** | @react-pdf/renderer | High-fidelity Pitch Deck and Game Design Document rendering

 | Evaluated inside Next.js Serverless Functions |
| **Language** | TypeScript strict | Application-wide type enforcement

 | Native compiler build pass |

---

## Production Cloud Wiring ($0 Architecture)

This setup runs entirely in the cloud using email-only registration loops that require **zero billing verification or payment configurations**:

### 1. Web Core & Client (Vercel)

* **Cost:** $0
* **Details:** Connect your repository directly to Vercel. Vercel handles serverless routing out-of-the-box. Because intensive browser loops are handled natively by external cloud web sockets, the frontend application safely stays within serverless runtime boundaries.



### 2. Relational Database & Engine (InsForge Cloud)

* **Cost:** $0
* **Details:** Provision a managed project directly on InsForge's hosted cloud tier.


* **Constraint:** Free tier database instances enter an automatic sleep state after a week of total user inactivity. Simply open your project's dashboard link to ping the server a day before submitting the link to YC to guarantee instant loading speeds.



### 3. Target Data Indexer (SearXNG on Koyeb/Render)

* **Cost:** $0
* **Details:** Deploy a public web service container pulling the official `searxng/searxng` image. Platforms like Koyeb provide a reliable, permanent public HTTPS endpoint with no required payment methods.



### 4. Managed Agent Fleet (Browserbase Cloud)

* **Cost:** $0
* **Details:** The Browserbase Hobby plan grants you direct access to remote Chromium instances with built-in proxy networks and automated CAPTCHA bypassing without needing an upfront card block.

```
[ Production Environment Variables ]
NEXT_PUBLIC_INSFORGE_URL=https://your-project.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your_insforge_public_anon_token
SEARXNG_BASE_URL=https://your-searxng.koyeb.app
BROWSERBASE_API_KEY=your_live_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_live_browserbase_project_id
GEMINI_API_KEY=your_google_studio_api_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_client_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

```

---

## Project Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── app/
│   ├── layout.tsx                          → Root layout, PostHog provider[cite: 1]
│   ├── page.tsx                            → Homepage (Hero, landing data)[cite: 1]
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                   → Login page (Google/GitHub OAuth)[cite: 1]
│   │   └── callback/
│   │       └── page.tsx                   → OAuth backend callback handler[cite: 1]
│   ├── dashboard/
│   │   └── page.tsx                       → Metrics summary, multi-project switch hub[cite: 1]
│   ├── projects/
│   │   ├── page.tsx                       → Overview grid of all active user game designs[cite: 1]
│   │   └── [id]/
│   │       ├── page.tsx                   → GDD structure form & draft blueprint uploads[cite: 1]
│   │       └── validate/
│   │           ├── page.tsx               → Validate Concepts dashboard (mechanics view)[cite: 1]
│   │           └── [mechId]/
│   │               └── page.tsx           → Individual mechanic results + deep research log[cite: 1]
│   └── api/
│       ├── agent/
│       │   ├── validate/route.ts          → Hits SearXNG to fetch live community footprints[cite: 1]
│       │   └── research/route.ts          → Runs Stagehand cloud session via Browserbase
│       ├── gdd/
│       │   ├── generate/route.ts          → Generates PDF Pitch Decks from project records[cite: 1]
│       │   └── extract/route.ts           → Extracts GDD fields from uploaded document text[cite: 1]
├── agent/
│   ├── aggregator.ts                      → Cleans query fields & fetches data via SearXNG JSON[cite: 1]
│   ├── research.ts                        → Competitor research orchestration (Stagehand + Browserbase)
│   ├── validator.ts                       → Handles Gemini calculation logic & alignment checks[cite: 1]
│   ├── extractor.ts                       → Handles Gemini layout mapping for raw text blueprints[cite: 1]
│   └── types.ts                           → Pure types managing search & browser actions[cite: 1]
├── actions/
│   ├── projects.ts                        → Server actions handling Project Profile CRUD operations[cite: 1]
│   └── mechanics.ts                       → Server actions prioritizing targeted market gaps[cite: 1]
├── components/
│   ├── ui/                                → Standard shadcn/ui base elements only[cite: 1]
│   ├── layout/
│   │   ├── Navbar.tsx                     → Navigation layout containing the Active Project Dropdown[cite: 1]
│   │   └── Footer.tsx[cite: 1]
│   ├── homepage/
│   │   ├── Hero.tsx[cite: 1]
│   │   ├── HowItWorks.tsx[cite: 1]
│   │   └── Features.tsx[cite: 1]
│   ├── dashboard/
│   │   ├── ProjectSelector.tsx            → Changes active project view state globally[cite: 1]
│   │   ├── StatsBar.tsx                   → Displays project-scoped metrics[cite: 1]
│   │   ├── RecentActivity.tsx[cite: 1]
│   │   └── AnalyticsCharts.tsx            → Connects project data to PostHog charts[cite: 1]
│   ├── projects/
│   │   ├── ProjectForm.tsx[cite: 1]
│   │   ├── DraftUpload.tsx[cite: 1]
│   │   ├── GDDPreview.tsx[cite: 1]
│   │   └── ProfileStatusIndicator.tsx[cite: 1]
│   ├── validate-concepts/
│   │   ├── ConceptInputs.tsx              → Inputs capturing target mechanic & subgenre constraints[cite: 1]
│   │   ├── InsightsTable.tsx              → Populates the authentic search entries grid[cite: 1]
│   │   ├── InsightFilters.tsx[cite: 1]
│   │   └── InsightsPagination.tsx[cite: 1]
│   └── mechanic-details/
│       ├── MechanicInfo.tsx[cite: 1]
│       ├── ViabilityScore.tsx[cite: 1]
│       ├── SentimentAnalysis.tsx          → Renders complaints, desires, and pitfalls[cite: 1]
│       ├── CompetitorResearch.tsx         → Interface panel invoking the Browserbase agent
│       └── DesignActions.tsx[cite: 1]
├── lib/
│   ├── insforge-client.ts                 → Client instance checking browser sessions[cite: 1]
│   ├── insforge-server.ts                 → Secure server-side query instance creator[cite: 1]
│   ├── browserbase.ts                     → Browserbase session creation & runtime configuration tools
│   ├── stagehand.ts                       → Controls Stagehand execution paths over Browserbase cloud
│   ├── gemini.ts                          → Gemini API client instance (shared across validator.ts / extractor.ts)[cite: 1]
│   ├── posthog-client.ts                  → PostHog interaction mapping tracking hooks[cite: 1]
│   ├── posthog-server.ts                  → Server event tracking engine[cite: 1]
│   └── utils.ts                           → Layout classes sorting & calculation helper[cite: 1]
└── types/
    └── index.ts                           → Global TypeScript types[cite: 1]

```

---

## System Boundaries

| Folder | Owns |
| --- | --- |
| `app/` | Pages and API routes only. No business logic or query mutations live here.

 |
| `agent/` | Independent TypeScript functions driving SearXNG extraction, Stagehand execution paths, and model interactions. No React/frontend dependencies allowed.

 |
| `actions/` | Next.js Server Actions managing layout mutations and database updates directly triggered by UI inputs.

 |
| `components/` | Visual presentations and interactions. Direct data lookups or state modifications are banned.

 |
| `lib/` | Instantiations of third-party APIs, configuration mappings, client setups, and universal global tools.

 |
| `types/` | Data mapping structures, parameters, and global schema models shared across layers.

 |

---

## Data Flow

### Relational Project Mutations (Server Actions)

```
User interaction in client component
        ↓
Invokes actions/projects.ts Server Action[cite: 1, 3]
        ↓
Database updates record securely inside InsForge Cloud database[cite: 1, 3]
        ↓
Revalidates cache path layout, automatically syncing Navbar Context Dropdown[cite: 1, 3]

```

### Objective Concept Discovery Pipeline (API Routes)

```
User defines a mechanic & genre baseline ➔ clicks "Validate Concept"[cite: 1, 3]
        ↓
POST request triggers route path /api/agent/validate[cite: 1, 3]
        ↓
Calls discoverRealCommunityThreads() within agent/aggregator.ts[cite: 1, 3]
        ↓
Hits public hosted SearXNG endpoint query[cite: 1, 3]
        ↓
SearXNG returns strict organic search arrays from Reddit & Steam (Zero Generation Allowed)[cite: 1, 3]
        ↓
If length === 0, stops immediately ➔ dumps exact empty state to UI view layout[cite: 1, 3]
        ↓
If rows exist, Gemini screens actual raw text snippets to index matches[cite: 1, 3]
        ↓
InsForge writes actual rows to mechanics table linked securely to active project_id[cite: 1, 3]
        ↓
Page data revalidated cleanly on screen[cite: 3]

```

### Competitor Deep-Dive Research Execution (API Routes)

```
User clicks "Research Competitors" on a targeted discussion item[cite: 1, 3]
        ↓
POST request hits /api/agent/research[cite: 1, 3]
        ↓
Invokes agent/research.ts passing the competitor details[cite: 1, 3]
        ↓
Single Browserbase session initialization layer opens alongside Stagehand[cite: 3]
        ↓
Navigates sequentially across competitor community spaces and game logs[cite: 3]
        ↓
Gemini (`gemini-2.5-flash`) analyzes extracted text data array, compiling a clean structured JSON document[cite: 1, 3]
        ↓
Dossier dossier string array writes natively to mechanics.competitor_research column[cite: 1, 3]
        ↓
Page data revalidated cleanly on screen[cite: 3]

```

### Game Document Operations (API Routes)

```
User uploads draft blueprint file or clicks "Generate PDF Outline"
        ↓
POST request hits route path /api/gdd/[action]
        ↓
Gemini processes text mapping or @react-pdf/renderer constructs output buffer[cite: 1, 3]
        ↓
New PDF document uploads cleanly to InsForge Storage bucket instance[cite: 1, 3]
        ↓
Output bucket storage URL persists safely inside the active projects table row[cite: 3]

```

---

## InsForge Database Schema

### `projects`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary Key

 |
| user_id | uuid | References auth.users

 |
| title | text | Name of the game design prototype

 |
| genre | text | Core category baseline (e.g. Roguelike Deckbuilder)

 |
| art_style | text | Visual design direction (Pixel art, 3D Low-poly, etc.)

 |
| platform | text | Target distribution scope (PC, Consoles, Mobile)

 |
| target_audience | text | Target player segment (Hardcore, Casual, etc.)

 |
| keywords | text[] | Context string index markers for refined queries

 |
| gdd_data | jsonb | Full structured schema capturing game design components. Enforces strict name matching across all project files.

 |
| pitch_deck_url | text | InsForge Storage directory path for output PDF files

 |
| is_complete | boolean | True when foundational fields are valid

 |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

### `agent_runs`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary Key

 |
| user_id | uuid | References auth.users

 |
| project_id | uuid | References projects.id

 |
| status | text | running / completed / failed

 |
| mechanic_searched | text | Feature keyword parsed by the engine query

 |
| genre_baseline | text | Target boundaries established for context filtering

 |
| insights_found | integer | Number of organic records found via search engine

 |
| started_at | timestamptz |  |
| completed_at | timestamptz |  |

### `mechanics`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary Key

 |
| run_id | uuid | References agent_runs (Null if added manually)

 |
| user_id | uuid | References auth.users

 |
| project_id | uuid | References projects.id

 |
| source | text | search / manual

 |
| source_url | text | Real verifiable source link on Reddit or Steam hub

 |
| mechanic_name | text | High-level descriptive title

 |
| target_genre | text | Extracted category location tag

 |
| qualitative_meta | text | Actual snippet text fetched by the engine query

 |
| community_upvotes | integer | Engagement metric or comment weight rating

 |
| core_player_gripe | text[] | Verified user complaint bullet points from data

 |
| core_player_desires | text[] | Identified unmet feature demands from text

 |
| cited_competitors | text[] | Related game titles named within text logs

 |
| viability_score | integer | 0-100 analysis metric calculated relative to active GDD

 |
| sentiment_reason | text | AI analytical summary explanation

 |
| structural_pitfalls | text[] | Architecture balance warning flags to avoid

 |
| aligned_features | text[] | Identified easy design additions

 |
| competitor_research | jsonb | Full deep-dive dossier from Stagehand browser scraping

 |
| found_at | timestamptz |  |

### `agent_logs`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary Key

 |
| run_id | uuid | References agent_runs

 |
| user_id | uuid | References auth.users

 |
| project_id | uuid | References projects.id

 |
| message | text | System tracking error message or step milestone

 |
| level | text | info / success / warning / error

 |
| mechanic_id | uuid | Optional — Links log cleanly to specific mechanic row

 |
| created_at | timestamptz |  |

---

## InsForge Storage

| Bucket | Path | Contents |
| --- | --- | --- |
| `drafts` | `drafts/{user_id}/{project_id}/gdd.pdf` | Clean generated PDF overview file

 |

* **Access Controls:** Authenticated users only; read/write access explicitly capped to personal ownership scopes matching the active `user_id`.



---

## Authentication

* **Provider:** InsForge Auth


* **Methods:** Google OAuth, GitHub OAuth


* **Protected Routes:** `/dashboard`, `/projects`, `/projects/[id]`, `/projects/[id]/validate`, `/projects/[id]/validate/[mechId]`

* **Public Routes:** `/`, `/login`

* **Middleware Interception:** Infrastructure in `middleware.ts` evaluates authorization signatures on every layout routing request, intercepting invalid tokens and shifting execution blocks securely back to `/login`.


* **On Success:** Automatically forces redirection pathing forward to `/dashboard`.



---

## InsForge Client Pattern

Two completely isolated InsForge initialization engines—never mix their contexts:

```typescript
// lib/insforge-client.ts
// Browser-side — used in client components for auth state tracking
import { createBrowserClient } from "@insforge/ssr";
export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
);

// lib/insforge-server.ts
// Server-side — used exclusively inside API routes, Server Actions, and agent loops
import { createServerClient } from "@insforge/ssr";
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_INSFORGE_URL!,
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};

```

---

## Browserbase Session Pattern

```typescript
// lib/browserbase.ts
// Competitor discovery run context — instances pull single active project blocks sequentially
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!,
});

export async function createAutomationSession() {
  return await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    timeout: 180, // 3 minute maximum budget context to scan 3-5 subpages max
  });
}

```

---

## Stagehand Browserbase Cloud Pattern

```typescript
// lib/stagehand.ts
import { Stagehand } from "@browserbasehq/stagehand";

export async function withStagehandCloud<T>(sessionId: string, fn: (stagehand: Stagehand) => Promise<T>): Promise<T> {
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY!,
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserbaseSessionID: sessionId,               // Binds Stagehand sequentially onto our open proxy path
    modelName: "google/gemini-2.5-flash",           // Shared Gemini execution context
    modelClientOptions: { apiKey: process.env.GEMINI_API_KEY! },
  });

  try {
    await stagehand.init();
    return await fn(stagehand);
  } finally {
    await stagehand.close();                       // Structural requirement to ensure cloud session closure
  }
}

```

---

## Objective SearXNG Discovery Pattern

```typescript
// agent/aggregator.ts
export async function discoverRealCommunityThreads(mechanic: string, genre: string) {
  const instanceUrl = process.env.SEARXNG_BASE_URL; // Pulls the public Koyeb/Render deployment URL
  const query = `"${mechanic}" "${genre}" (site:reddit.com/r/gaming OR site:reddit.com/r/truegaming OR site:steamcommunity.com/app)`;[cite: 1]
  const targetUrl = `${instanceUrl}/search?q=${encodeURIComponent(query)}&format=json&engines=google,reddit&language=en`;[cite: 1]

  let response: Response;
  try {
    response = await fetch(targetUrl, { method: "GET" });[cite: 1]
  } catch {
    return { results: [], count: 0, blocked: true };[cite: 1]
  }

  if (!response.ok) {
    return { results: [], count: 0, blocked: true };[cite: 1]
  }

  const data = await response.json();[cite: 1]

  if (!data.results || data.results.length === 0) {
    return { results: [], count: 0, blocked: false };[cite: 1]
  }

  const results = data.results.slice(0, 10).map((item: any) => ({
    title: item.title,[cite: 1]
    forum_hub_origin: item.url.includes("reddit.com") ? "Reddit" : "Steam Community",[cite: 1]
    structural_text: item.content || "",[cite: 1]
    reference_url: item.url,[cite: 1]
    community_score: Math.floor(item.score * 100) || 0[cite: 1]
  }));

  return { results, count: results.length, blocked: false };[cite: 1]
}

```

---

## Invariants

Rules the AI agent must never violate:

* **Presentation Boundaries:** API routes contain no UI presentation logic. Visual view components contain no direct database transaction logic.


* **Import Isolation:** Agent utilities structured inside `/agent` are completely forbidden from importing properties or declarations from `/components` or `/actions`.


* **Invocation Paths:** Server Actions must never invoke engine functions inside `/agent` directly. All asynchronous agent threads hide exclusively behind endpoint API routes.


* **Write Signatures:** Every single server-side data transaction modification tracking via InsForge must use `createInsforgeServer()`—never use the browser initialization instance.


* **Token Standardization:** Hardcoded styling values or raw tailwind color utilities are strictly banned from layout code—all visual properties must draw from variables established in `ui-tokens.md`.


* **Fault Tolerant Logging:** Every external Stagehand sequence must execute within explicit try/catch blocks. Unhandled network anomalies log down to `agent_logs` and return a structured degradation message; they must never crash the serverless run context.


* **Total Synthesis Mandate:** Competitor automation passes must always compile a complete structured dossier string—even if remote target blocking triggers, Gemini must synthesize structural layouts using the core mechanic title parameters and project profiles alone. Never return completely blank outputs.


* **Session Leak Protection:** Active Browserbase allocations must guarantee termination via a `finally { await stagehand.close(); }` step to prevent memory consumption overheads or runtime usage bleed on your cloud account quota.


* **Rigid Tenancy Filtering:** Every database transaction check hitting `mechanics`, `projects`, or `agent_logs` tables must explicitly append strict user filtration parameters matching the verified `user_id` context. Multi-tenant boundaries cannot be ignored.


* **Source Validation:** The database property value context for `mechanics.source` can only match `'search'` or `'manual'`—no alternative values are structurally permitted.



---

