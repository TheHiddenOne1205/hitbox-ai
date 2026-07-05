# Memory — Database Schema Provisioning

Last updated: 2026-07-05T12:40:00+05:30

## What was built

- **`types/index.ts`** ([types/index.ts](file:///home/kalash/projects/hitbox-ai/types/index.ts)): Created from scratch. Full TypeScript interfaces for all four tables — `Project`, `AgentRun`, `Mechanic`, `AgentLog` — plus Insert/Update variants, `CompetitorResearchDossier`, `SearXNGResult`, and `DBResponse<T>` utility types.
- **InsForge DB Tables**: All four tables provisioned live on `r3krqy29.ap-southeast.insforge.app`:
  - `projects` — game design profiles, `gdd_data jsonb DEFAULT '{}'`, `is_complete boolean DEFAULT false`, CASCADE from `auth.users`
  - `agent_runs` — concept validation sessions, FK to `projects` ON DELETE CASCADE, status CHECK constraint (`running/completed/failed`)
  - `mechanics` — individual community insights, FK to `agent_runs` ON DELETE SET NULL (supports manual entries), viability_score CHECK 0–100, source CHECK (`search/manual`)
  - `agent_logs` — system audit entries, FK to `agent_runs` and `projects` ON DELETE CASCADE, optional `mechanic_id` FK ON DELETE SET NULL
- **RLS Policies**: Row Level Security enabled on all four tables with SELECT/INSERT/UPDATE/DELETE policies scoped to `auth.uid() = user_id`.
- **`drafts` Storage Bucket**: Private (non-public) bucket created. Path convention: `drafts/{user_id}/{project_id}/gdd.pdf`.
- **`scripts/setup-db.mjs`** ([scripts/setup-db.mjs](file:///home/kalash/projects/hitbox-ai/scripts/setup-db.mjs)): Reusable provisioning script that drives the InsForge MCP CLI via proper JSON-RPC 2.0 stdio protocol (initialize → initialized notification → tools/call). Idempotent — safe to re-run.

## Decisions made

- **ON DELETE CASCADE** on all child tables (`agent_runs`, `mechanics`, `agent_logs`) when their parent project is deleted.
- **`run_id` ON DELETE SET NULL** on `mechanics` — supports manually added mechanics that have no associated agent run.
- **`gdd_data` defaults to `'{}'::jsonb`** (not null) — simplifies `is_complete` checks downstream.
- **MCP CLI via stdio**: InsForge MCP is a stdio JSON-RPC server, not a REST API. The setup script spawns `npx @insforge/mcp@latest` and handles the full MCP handshake per call.

## Problems solved

- **MCP subagent permission issue**: InsForge MCP permission grants are scoped to the parent agent context only — subagents cannot inherit them. All MCP-dependent work must run from the parent agent directly, or via a terminal script that invokes the MCP CLI process.
- **MCP stdio protocol**: The InsForge MCP CLI requires the full JSON-RPC 2.0 handshake: `initialize` request → `notifications/initialized` notification → `tools/call`. Skipping the notification caused silent failures.

## Current state

- **Phase 1 — 04 Database Schema** is complete and fully verified.
- All four tables exist in InsForge with correct schema, FK constraints, and RLS policies.
- `drafts` bucket is live and private.
- TypeScript types in `types/index.ts` match the schema exactly.
- The project builds successfully (no new code changes that could break the build).

## Next session starts with

- **Phase 2 — 05 Project Form Page — Full UI**: Build the complete project setup page at `app/projects/[id]/page.tsx` with mock data — no save logic yet. Includes: incomplete profile warning banner, drag-and-drop upload zone, Base Metadata form fields, Context Keywords chip input, Core GDD textarea fields, Generate PDF button, and Save button.

## Open questions

- None.
