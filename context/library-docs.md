# Library Docs

Project-specific usage patterns for every third-party library in this project. This file only covers how we use each library in this specific project — rules, patterns, and constraints specific to Hitbox AI.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third party library:

1. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them. Skills contain up-to-date API documentation, usage patterns, and best practices specific to this codebase.
2. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to documentation, logs, and debugging tools. If an MCP server is available — use it before falling back to general knowledge.
3. **Read this file** for project-specific patterns that override general library knowledge.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge

```

Never rely on general training knowledge alone for library APIs — they change frequently and training data may be outdated.

---

## InsForge

**Check first:** Check AGENTS.md for an installed InsForge skill. If an InsForge MCP server is configured — use it. The skill/MCP will have the latest API patterns.

### Client vs Server

Two separate instances — never mix them:

```typescript
// lib/insforge-client.ts — browser context only
import { createBrowserClient } from "@insforge/ssr";

export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
);

```

```typescript
// lib/insforge-server.ts — server context only
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

**Rules:**

* **Browser Client:** Used inside Client Components to track visual auth state and real-time interface changes.
* **Server Client:** Used inside Server Components, API routes, Server Actions, and deep backend background agent tasks.
* Never initialize the browser client instance inside serverless processing files.
* Never execute the server client initialization pipeline within interactive Client Components.

---

### Auth

```typescript
// Get current user in server context
const insforge = await createInsforgeServer();
const {
  data: { user },
  error,
} = await insforge.auth.getUser();
if (!user) redirect("/login");

```

---

### DB Queries

```typescript
// Read
const { data, error } = await insforge
  .from("projects")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

// Insert
const { data, error } = await insforge
  .from("mechanics")
  .insert({ user_id: user.id, project_id: projectId, mechanic_name: name, viability_score: score })
  .select()
  .single();

// Update
const { error } = await insforge
  .from("mechanics")
  .update({ competitor_research: dossier })
  .eq("id", mechanicId)
  .eq("user_id", user.id); // always scope to user

```

**Rules:**

* **Strict Tenancy Enforcement:** Always append explicit checks targeting the user's `user_id` parameter across all read, write, or mutation updates. Never execute a database query without user filters.
* Always evaluate the `error` response object directly — never allow a script execution path to assume transaction success.
* Chain `.single()` when expecting a query string request to return exactly one match.

---

### Storage

```typescript
// Upload file
const { data, error } = await insforge.storage
  .from("drafts")
  .upload(`drafts/${userId}/${projectId}/gdd.pdf`, fileBuffer, {
    contentType: "application/pdf",
    upsert: true, // overwrites existing file
  });

// Get public URL
const { data } = insforge.storage
  .from("drafts")
  .getPublicUrl(`drafts/${userId}/${projectId}/gdd.pdf`);

const url = data.publicUrl;

```

**Storage paths:**

* Game Design Draft Document path outline: `drafts/{user_id}/{project_id}/gdd.pdf`

**Rules:**

* Always apply `upsert: true` parameters during upload queries to overwrite old file strings seamlessly.
* Always update the active table row with the public storage string URL immediately following a successful upload.
* Never write staging files down onto local disk clusters — upload streaming buffers cleanly to storage directly.

---

## SearXNG Aggregate Discovery Pattern

**Check first:** Check AGENTS.md for an installed SearXNG skill. If none exists — use this file and your architecture configurations.

### Objective Index Query

```typescript
// agent/aggregator.ts
export async function discoverRealCommunityThreads(
  mechanic: string,
  genre: string,
): Promise<{ results: SearXNGResult[]; count: number; blocked: boolean }> {
  const instanceUrl = process.env.SEARXNG_BASE_URL; // Public Koyeb/Render deployment URL
  
  // Scopes searches tightly to authentic discussion hubs, wrapping terms in quotes
  const query = `"${mechanic}" "${genre}" (site:reddit.com/r/gaming OR site:reddit.com/r/truegaming OR site:steamcommunity.com/app)`;
  const targetUrl = `${instanceUrl}/search?q=${encodeURIComponent(query)}&format=json&engines=google,reddit&language=en`;

  let response: Response;
  try {
    response = await fetch(targetUrl, { method: "GET" });
  } catch {
    return { results: [], count: 0, blocked: true }; // Catches host blocks safely
  }

  if (!response.ok) {
    return { results: [], count: 0, blocked: true };
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return { results: [], count: 0, blocked: false };
  }

  const results = data.results.slice(0, 10).map((item: any) => ({
    title: item.title,
    forum_hub_origin: item.url.includes("reddit.com") ? "Reddit" : "Steam Community",
    structural_text: item.content || "",
    reference_url: item.url,
    community_score: Math.floor(item.score * 100) || 0
  }));

  return { results, count: results.length, blocked: false };
}

```

**Rules:**

* Never query SearXNG without setting `format=json` and passing specific targeted gaming community subdomains within the query structure.
* Wrap both the target gameplay mechanic and genre inputs inside absolute string quotes (`""`) to ensure precise index searches.
* If a remote search execution encounters a network timeout or connection reset, flag a soft recovery response (`blocked: true`) instead of crashing or returning an inaccurate empty array.
* The `source` database value for entries compiled through this aggregator routine must always match `'search'`.

---

## Browserbase

**Check first:** Check AGENTS.md for an installed Browserbase skill. If a Browserbase MCP server is configured — use it. The skill/MCP will have the latest session management and API patterns.

### Session Creation — Competitor Deep Dive

```typescript
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// Single session initialization block for deep mechanical scraping passes
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  timeout: 180, // 3 minute maximum run budget context
});

```

**Important — Browserbase runs independently from your Next.js serverless architecture:**
Browserbase sessions execute within external managed cloud environments, completely independent of your Vercel Next.js edge routers. The API route merely instantiates and controls the websocket step before closing. Do not attach artificial long-running timeout flags or complex wrapper configurations onto Next.js endpoints to manage Browserbase.

**Rules:**

* Always instantiate single execution threads sequentially — never run parallel browser calls (free tier concurrency limitation).
* Always apply structured `try/catch/finally` blocks to guarantee that `stagehand.close()` runs, preventing active usage leakage on your hobby credit allocation.
* Project and developer keys must read directly from environment variables — hardcoded connection tokens are banned.

---

## Stagehand

**Check first:** Check AGENTS.md for an installed Stagehand skill. If a Stagehand MCP server is configured — use it. The skill/MCP will have the latest act() and extract() patterns.

### Initialisation

```typescript
import { Stagehand } from "@browserbasehq/stagehand";

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  apiKey: process.env.BROWSERBASE_API_KEY!,
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserbaseSessionID: session.id, // Binds Stagehand tightly onto our open cloud proxy channel
  modelName: "google/gemini-2.5-flash",
  modelClientOptions: { apiKey: process.env.GEMINI_API_KEY! },
});

await stagehand.init();
const page = stagehand.page; // Grab direct page execution target instance

```

---

### Competitor Deep Research Pattern

A structured sequence: homepage feature extraction → targeted sub-page crawling → Gemini AI cloud synthesis.
All project context values and active design form arrays are read directly from database tables — never waste execution time re-fetching existing data models from web pages.

```typescript
// Step 1 — Target platform or homepage structural extraction
const homepageData = await stagehand.extract({
  instruction: "Analyze this competitor game hub, design platform, or landing directory. Capture what structural gameplay loops are present, balancing parameters, scale signals, and sub-links most worth visiting to research feature implementation flaws.",
  schema: z.object({
    featureOverview: z.string().describe("Summary of game loop execution parameters"),
    systemBalance: z.string().describe("How mechanics interact inside their build loop"),
    communityScale: z.array(z.string()).describe("Signals tracking player volume, patch counts, or scale metrics"),
    subLinks: z.array(z.object({
      url: z.string(),
      type: z.enum(["reviews", "discussions", "patchnotes", "about", "other"])
    })).describe("Sub-links worth visiting to track player balance sentiments")
  }),
});

// If core overview parsing text returns empty, assume anti-bot block or dead link
// Bail cleanly to direct synthesis using database-stored descriptions only
if (!homepageData.featureOverview && homepageData.communityScale.length === 0) {
  await stagehand.close();
  // Proceed straight to synthesis phase using basic parameters
}

// Step 2 — Deep sub-page crawling (Max 3, prioritizing discussion hubs or review nodes)
const targetSubPage = homepageData.subLinks.find(link => link.type === "discussions" || link.type === "reviews");

if (targetSubPage) {
  await page.goto(targetSubPage.url);
  await page.waitForLoadState("networkidle");
  
  const designFrictionData = await stagehand.extract({
    instruction: "Extract explicit structural complaints, technical feature failures, gameplay balance trends, and design loop constraints voiced by active player networks.",
    schema: z.object({
      balanceFlaws: z.array(z.string()),
      playerDesires: z.array(z.string()),
      systemNuances: z.array(z.string())
    }),
  });
}

await stagehand.close(); // Clean session teardown execution inside finally blocks

// Step 3 — Gemini Synthesis Pass
const systemPrompt = `You are a senior systems game designer evaluating a specific mechanic implementation concept against an existing project blueprint profile. You are given data scraping vectors collected across a primary competitor title, the active design draft configurations, and user sentiment parameters. Generate a precise developer briefing object.

Rules:
- Ground all analytical claims strictly inside the provided web research nodes. Never invent balance metrics or facts.
- Frame candidate gaps as actionable design choices or balance adjustments specific to the target profile.
- Return ONLY valid JSON format matching the specified shape.`;

// Invoke Gemini via the official @google/genai client pattern...

```

**Dossier Shape Saved to `mechanics.competitor_research` jsonb:**

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

**Rules:**

* Always pass rigid `zod` schema constraints inside `extract()` calls — never attempt to parse unstructured text blocks with raw regular expressions.
* Limit deep crawling procedures to a maximum of 3 sub-pages to safeguard free-tier processing minute limitations.
* Always trigger synthesis even if browser automation runs return completely empty results; Gemini can generate valid design briefs using target project parameters and design forms alone.

---

## Google Gemini (`@google/genai`)

**Check first:** Check AGENTS.md for an installed Gemini skill. The skill will have the latest API patterns and model capabilities.

### Structured JSON Response Pattern

```typescript
import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const response = await gemini.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Your detailed evaluation prompts go here",
  config: { 
    responseMimeType: "application/json", // Enforces strict structured output parsing
    temperature: 0.3,
    maxOutputTokens: 800
  },
});

const cleanResult = JSON.parse(response.text);

```

**Temperature Configurations:**

* **`0.3`:** Used for concept alignment, structural validation passes, schema extraction, and research data synthesis where deterministic logic is essential.
* **`0.7`:** Used for executive document generation or creative game text phrasing expansions where natural textual variation is required.

**Rules:**

* The core evaluation model string is always explicitly `"gemini-2.5-flash"`.
* Always enable `responseMimeType: "application/json"` config markers when parsing structured agent data payloads.
* Wrap all output extractions inside strict validation `try/catch` handlers to handle un-synthesized JSON returns gracefully.
* Never reference a hardcoded viability rating index within checking components — always import and validate via `CONCEPT_VIABILITY_THRESHOLD` inside `lib/utils.ts`.

---

## PostHog

**Check first:** Check AGENTS.md for an installed PostHog skill. If a PostHog MCP server is configured — use it. The skill/MCP will have the latest client and server patterns.

### Client Setup (Browser Side)

```typescript
// lib/posthog-client.ts
import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      capture_pageview: false, // manual pageview tracking
    });
  }
}

// Capture event client-side
posthog.capture("mechanic_indexed", {
  userId,
  platformSource: "Steam",
  alignmentScore: score,
});

```

### Server Setup (Serverless Routes)

```typescript
// lib/posthog-server.ts
import { PostHog } from "posthog-node";

export const createPostHogServer = () =>
  new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1, // send immediately
    flushInterval: 0, // no batching — Next.js serverless functions are short-lived
  });

// Invoke and shutdown inside the same serverless function sequence
const posthog = createPostHogServer();
posthog.capture({
  distinctId: userId,
  event: "competitor_researched",
  properties: { userId, mechanicId, targetGame: gameTitle },
});
await posthog.shutdown(); // Mandatory — flushes event out to network before serverless edge closes

```

**Rules:**

* Always execute `await posthog.shutdown()` within backend API endpoints or route execution flows; otherwise, short-lived serverless environments will close before the metrics flush completes.
* Set `flushAt: 1` and `flushInterval: 0` inside the server client builder to handle instant transaction reporting.
* Telemetry hooks must capture exact event terms matching the specifications outlined inside `code-standards.md`.


