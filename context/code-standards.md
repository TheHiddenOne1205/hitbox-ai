# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior systems engineer. This means:

* **Think before implementing** — understand what is being built and why before writing a single line.
* **Read context files first** — never assume; always verify against `architecture.md` and `project-overview.md`.
* **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful.
* **Every feature must be testable** — if it cannot be verified immediately after deployment, it is incomplete.
* **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions.
* **One thing at a time** — complete one feature fully before touching the next.
* **Failures are expected** — wrap agent operations in try/catch blocks, log failures directly to the database, and never let one failure crash the serverless run context.

---

## TypeScript

* Strict mode enabled in `tsconfig.json` — no exceptions.
* Never use `any` — use `unknown` and narrow the type explicitly.
* Never use type assertions (`as SomeType`) unless absolutely necessary, accompanied by an explicit comment explaining why.
* All function parameters and return types must be explicitly typed.
* Use `type` for object shapes and unions — use `interface` only for extendable component props.
* All async functions must have robust error handling — never let promises float unhandled.
* Use `const` by default — only use `let` when reassignment is explicitly required.

---

## Next.js 16 & React 19 Conventions

* **App Router Only** — no Pages Router configuration.
* **React 19 Core** — leverage modern React 19 hook states and structural patterns.
* All components are Server Components by default.
* Only add `"use client"` when the component specifically requires:
* `useState` or `useReducer`
* `useEffect`
* Browser APIs
* Client event listeners
* Third-party client-only libraries (PostHog browser telemetry tracking hook)


* Never add `"use client"` to layout files unless completely unavoidable.
* Data fetching happens in Server Components — never fetch data directly inside Client Components.
* Route handlers live in `app/api/` — never place deep business logic inside route handlers.
* Server Actions live in `actions/` — never define Server Actions inline in components.
* Caching is uncached by default — all dynamic project code executes live at request time.
* Always check the latest Next.js 16 documentation before implementing framework features.

---

## File and Folder Naming

* Folders: kebab-case — `validate-concepts`, `mechanic-details`
* Component files: PascalCase — `StatsBar.tsx`, `RecentActivity.tsx`
* Utility files: camelCase — `stagehand.ts`, `posthog-client.ts`
* Type files: camelCase — `index.ts`
* API route files: always named `route.ts`
* Server Action files: camelCase — `projects.ts`, `mechanics.ts`
* One component per file — never export multiple components from one file.
* Index files only permitted inside `components/ui/` — never barrel export from any other project directories.

---

## Component Structure

Every component must follow this exact structural order:

```typescript
"use client"; // only if client-side interactions are needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { ViabilityScore } from "@/components/mechanic-details/ViabilityScore";

// 3. Type definitions
type Props = {
  mechanicId: string;
  viabilityScore: number;
};

// 4. Component
export function ComponentName({ mechanicId, viabilityScore }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}

```

* Never use default exports for components — always use named exports.
* Props type must be defined directly above the component — not in a separate types file unless globally shared.
* No inline styles — all styling via Tailwind classes using dark-themed gaming variables from `ui-tokens.md`.

---

## API Route Handlers

```typescript
// app/api/agent/validate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate body properties
    // call targeted agent function
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[api/agent/validate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

```

* Every route handler must implement a global try/catch block.
* Every route handler must validate the incoming request body before executing core tasks.
* Errors must be logged with the route path prefixed: `[api/agent/validate]`.
* Always return a unified JSON response: `{ success: boolean, data?: T, error?: string }`.
* Never return raw data structures without the success wrapper object.

---

## Server Actions

```typescript
// actions/projects.ts

"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function saveProject(projectData: ProjectFormData) {
  try {
    const insforge = await createInsforgeServer();
    // run data schema validation
    // write to DB record
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("[actions/projects]", error);
    return { success: false, error: "Failed to save project layout" };
  }
}

```

* Every Server Action must implement a robust try/catch block.
* Every Server Action returns a uniform payload: `{ success: boolean, error?: string }`.
* Always trigger `revalidatePath` after data mutations that affect dynamic page values (e.g., active dropdown selectors).
* Never throw raw exceptions out of Server Actions — handle errors cleanly and return them as strings.

---

## Agent Code

```typescript
// agent/validator.ts

export async function evaluateConcept(
  mechanicName: string,
  genreBaseline: string,
  runId: string,
): Promise<{ success: boolean; insights?: MechanicInsight[]; error?: string }> {
  try {
    // structural processing implementation
    return { success: true, insights };
  } catch (error) {
    await logAgentError(runId, error);
    return { success: false, error: String(error) };
  }
}

```

* Every single agent function returns a clear execution signature: `{ success: boolean, error?: string }`.
* Every agent routine must use a tight try/catch block — never allow external scraper drops or network exceptions to break the execution loop.
* Error occurrences must write to the `agent_logs` table before returning failure responses.
* Functions inside `/agent` are strictly forbidden from importing parameters from `/components` or `/actions`.
* Agent scripts are completely isolated from React hooks and browser clients.

---

## InsForge Usage Patterns

```typescript
// Client context — permitted in Client Components only
import { insforge } from "@/lib/insforge-client";

// Server context — Server Components, Route Handlers, Server Actions, Agent Code
import { createInsforgeServer } from "@/lib/insforge-server";
const insforge = await createInsforgeServer();

```

* Never call or mix the browser client inside serverless processing files.
* Never use the server-side client inside interactive Client Components.
* Always append `await` when invoking `createInsforgeServer()` to ensure async cookies are parsed correctly.
* **Strict Multi-Tenancy Enforcement:** Every database select, update, or write query must explicitly include filters verifying the matching `user_id`. Never execute general lookups without a user filter.

---

## Error Handling Standards

* Empty catch blocks are strictly prohibited — always log context or handle exceptions gracefully.
* Console error statements must include a distinct context module identifier: `[component/function name]`.
* User-facing error notifications must display human-readable strings — never expose raw engine errors or unmapped stack traces to client layouts.
* Agent failures route directly into the database `agent_logs` table — do not bubble un-synthesized raw scraper logs up to the interface.
* API route errors return a strict `status: 500` accompanied by generalized summary texts to prevent structural code exposure.

---

## PostHog Telemetry Events

All PostHog events must match these precise definitions. Do not introduce alternative event names without documenting them here first.

| Event | Triggering Action | Key Properties |
| --- | --- | --- |
| `mechanic_search_started` | Validate Concept button is clicked | `userId`, `projectTitle`, `mechanicName` |
| `mechanic_indexed` | Individual discussion match parsed and saved | `userId`, `platformSource`, `alignmentScore` |
| `project_profile_completed` | Designer completes a complete set of GDD design tokens | `userId`, `projectTitle` |
| `competitor_researched` | Browserbase agent research task finishes compilation | `userId`, `mechanicId`, `targetGame` |

These four events constitute the absolute monitoring tracking footprint of this platform.

* `mechanic_indexed` drives the Dashboard charts tracking *Insights Mapped Over Time* and *Viability Score Distribution*.
* `competitor_researched` directly drives the *Competitor Research Loops Run* dashboard telemetry chart.

---

## Environment Variables

All environment settings live inside `.env.local` during assembly and are wired to cloud dashboards on launch. Never expose keys, private connection vectors, or API credentials inside version-controlled code blocks.

| Variable | Target Destination Usage |
| --- | --- |
| `NEXT_PUBLIC_INSFORGE_URL` | `lib/insforge-client.ts` & server setups |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | `lib/insforge-client.ts` & server setups |
| `SEARXNG_BASE_URL` | `agent/aggregator.ts` (Koyeb/Render Endpoint) |
| `BROWSERBASE_API_KEY` | `lib/browserbase.ts` & Stagehand engines |
| `BROWSERBASE_PROJECT_ID` | `lib/browserbase.ts` & Stagehand engines |
| `GEMINI_API_KEY` | `lib/gemini.ts` & structural parsing scripts |
| `NEXT_PUBLIC_POSTHOG_KEY` | `lib/posthog-client.ts` browser routing |
| `NEXT_PUBLIC_POSTHOG_HOST` | `lib/posthog-client.ts` browser routing |

The `NEXT_PUBLIC_` prefix indicates immediate client-side exposure. Never add this prefix to private keys like your `GEMINI_API_KEY` or `BROWSERBASE_API_KEY`.

---

## Concept Viability Threshold

The metric threshold determining feature alignment is set exactly once as a global system variable. Do not hardcode this index value anywhere else in the product code.

```typescript
// lib/utils.ts
export const CONCEPT_VIABILITY_THRESHOLD = 70;

```

Import and reference `CONCEPT_VIABILITY_THRESHOLD` uniformly whenever highlighting high-potential community matches.

---

## Import Aliases

Always use the `@/` absolute alias mapping path — relative syntax navigating up more than a single directory layer is prohibited.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge-client";
import { CONCEPT_VIABILITY_THRESHOLD } from "@/lib/utils";

// Forbidden
import { Button } from "../../../../components/ui/button";

```

---

## Comments & Code Self-Documentation

* Do not write comments explaining what a function does line-by-line — code execution paths must remain clean and self-explanatory.
* Comments are reserved for the **why** — providing high-level justifications for non-obvious design choices or balance decisions.
* Background agent scripts may include brief structural comments detailing Browserbase extraction commands or Stagehand selectors.
* Never commit code containing active `TODO` or `FIXME` comments.

---

## Approved Project Dependencies

Never install external software packages or additional runtime assets unless a distinct requirement is verified. Check if built-in tools can handle the feature natively before installing extensions.

Approved production dependencies for Hitbox AI:

* `@insforge/ssr` — Database core, server initialization, and cookie token mapping.
* `@browserbasehq/sdk` — Automated cloud session allocation.
* `@browserbasehq/stagehand` — AI browser control and remote chromium execution.
* `@google/genai` — Official Google Gemini API client powering `gemini-2.5-flash`.
* `posthog-js` — Client component client event logging interface.
* `posthog-node` — Server action and route handler event integration toolkit.
* `zod` — Schema definitions and rigid JSON validation passes.
* `lucide-react` — Visual design icons.
* `tailwindcss` — CSS utility configuration framework.
* `shadcn/ui` components — Visual layout baseline components.

Do not introduce any alternative packages without updating this master registry list first.

---

