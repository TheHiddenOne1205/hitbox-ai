# Memory — Project Save Logic & Navigation Integration

Last updated: 2026-07-05T14:10:00+05:30

## What was built

- **`actions/projects.ts`** — Created `saveProjectAction(projectId, formData)` Server Action to handle project creations (SQL `INSERT`) and updates (SQL `UPDATE`), dynamic calculation of `is_complete` status, and raw `File` binary uploads to the `drafts` S3 bucket in InsForge.
- **`app/projects/[id]/page.tsx`** — Refactored to dynamically retrieve project properties using `insforge.database.from("projects")` and pass them to the client editor.
- **`app/projects/[id]/project-editor-client.tsx`** — Wired the form save button to the Server Action. Added redirect handling for newly initialized project records (`/projects/[new_uuid]`).
- **`components/projects/DraftUpload.tsx`** — Added `onFileSelect` prop to expose the selected file to the client editor state for saving.
- **`components/layout/Navbar.tsx`** — Rewired the RPG dropdown selector to dynamically query user projects from `insforge.database.from("projects")`. Added automatic path-redirect handling when swapping selected project contexts.
- **`app/projects/page.tsx`** — Fully rewired page to query the user's projects database. If empty, renders the standard empty state. If projects exist, renders a clean grid of project cards with completion status tags, slot IDs, created dates, and editor link routes.
- **`app/dashboard/page.tsx`** — Dynamically checks project presence. Displays the RPG setup prompt card if no projects exist, or replaces it with a summary card showing the active slots count and a quick manage projects trigger.

## Decisions made

- **Syntax standard**: Database queries must use `insforge.database.from()` (not `insforge.from()`) as defined in the SDK reference.
- **2-argument upload**: S3 file upload matches the SDK signature `upload(path, file)` passing the `File` object directly without contentType options or Buffer streams.
- **Form completeness criteria**: `is_complete = true` is evaluated automatically if `title`, `genre`, and `playerLoop` are all filled.
- **Dropdown URL parsing**: The Navbar dropdown parses pathname parameter indexes via regex to determine active context and preserve child paths on route transitions (e.g. `/projects/[old]/validate` -> `/projects/[new]/validate`).

## Problems solved

- **Database syntax errors**: Fixed compiler errors regarding missing `.from()` property on `InsForgeClient` by referencing the correct `.database` namespace wrapper.
- **Storage parameter count mismatch**: Corrected `.upload()` argument counts from 3 parameters (as documented in `library-docs.md`) to the SDK-enforced 2-parameter signature.
- **Static empty dashboards**: Solved UX blocker where dashboards and grids remained empty even after projects were saved by replacing all mockup components with dynamic database query loops.

## Current state

- **Phase 2 — 06 Project Save Logic** is fully complete and verified. Next is **Phase 2 — 07 AI Project Extraction**.
- Grid list renders saved projects, and user setup prompts hide dynamically.
- Production build passes cleanly with no compiler warnings or TypeScript type errors.

## Next session starts with

- **Phase 2 — 07 AI Project Extraction from Draft Document**: Implement text extraction from the uploaded draft document and Gemini integration inside `/api/gdd/extract` to parse raw text and return structured project variables that will auto-fill form fields.

## Open questions

- None.
