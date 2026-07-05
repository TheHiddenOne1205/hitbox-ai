# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### HUD Workspace Card (Panel Container)
Used for dashboard widgets, feature blocks, and timeline details.

File: [Features.tsx](file:///home/kalash/projects/hitbox-ai/components/homepage/Features.tsx), [HowItWorks.tsx](file:///home/kalash/projects/hitbox-ai/components/homepage/HowItWorks.tsx)
Last updated: 2026-07-05

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-panel` |
| Border           | `border border-card-border` |
| Border radius    | `rounded-xl` (12px) |
| Text — primary   | `text-text-light` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-6` (24px) |
| Hover state      | `hover:border-border-gold transition-all duration-300` |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |
| Accent usage     | `text-accent-gold` (for monospace subtitle labels) |

---

### Retro Game Buttons (Control Buttons)
Used for triggers and call-to-actions.

File: [Hero.tsx](file:///home/kalash/projects/hitbox-ai/components/homepage/Hero.tsx)
Last updated: 2026-07-05

| Button Type | Background | Border | Radius | Text | Shadow / Effect |
| ----------- | ---------- | ------ | ------ | ---- | --------------- |
| **Primary Orange** | `bg-accent-orange` | `border-2 border-card-border` | `rounded-xl` (12px) | `text-text-light font-bold` | `shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none` |
| **Secondary Cream** | `bg-retro-beige` | `border border-card-border` | `rounded-full` | `text-text-dark font-bold` | `hover:bg-retro-beige/90` |
| **Cozy Dark Panel** | `bg-panel-secondary` | `border border-card-border` | `rounded-md` (8px) | `text-text-light font-mono` | `hover:border-border-gold transition-all` |

---

### Navigation Bar
Top layout persistent container.

File: [Navbar.tsx](file:///home/kalash/projects/hitbox-ai/components/layout/Navbar.tsx)
Last updated: 2026-07-05

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-background/95 backdrop-blur-md` |
| Border           | `border-b border-card-border` |
| Text — primary   | `text-text-light font-semibold` (Active state) |
| Text — secondary | `text-text-muted hover:text-text-light` (Inactive/Hover) |
| Spacing          | `h-[72px] px-6` |
| Under-glow line  | `absolute bottom-[-10px] left-0 right-0 h-[2px] bg-accent-gold rounded-full shadow-[0_0_8px_var(--color-accent-gold)]` |

---

### Concept Viability Badges
Color-coded indicator badges for viability scoring thresholds.

File: [Hero.tsx (Dashboard Mockup)](file:///home/kalash/projects/hitbox-ai/components/homepage/Hero.tsx)
Last updated: 2026-07-05

| Score Bracket | Color | Class List |
| ------------- | ----- | ---------- |
| **80-100%** (Strong) | Gaming Green | `bg-pixel-green/10 text-pixel-green border border-pixel-green/30` |
| **70-79%** (Stable) | Caution Yellow | `bg-pixel-yellow/10 text-pixel-yellow border border-pixel-yellow/30` |
| **50-69%** (Improving) | Caution Orange | `bg-pixel-orange/10 text-pixel-orange border border-pixel-orange/30` |
| **Below 50%** (Critical) | Critical Red | `bg-pixel-red/10 text-pixel-red border border-pixel-red/30` |

---

### Login Form Card
Cozy Obsidian/Gold themed login card.

File: [page.tsx](file:///home/kalash/projects/hitbox-ai/app/(auth)/login/page.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Card Container | `w-full max-w-md bg-panel border border-card-border rounded-xl p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-8 relative overflow-hidden` |
| Header Logo Frame | `w-16 h-16 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold relative group hover:border-border-gold transition-all duration-300 shadow-inner` |
| Title typography | `font-mono text-3xl font-bold tracking-wider text-text-light` |
| Subtitle typography | `font-sans text-xs uppercase tracking-widest text-text-muted font-semibold` |
| Info Banner | `bg-panel-secondary/40 border border-card-border/60 rounded-md p-4 flex gap-3 items-start` |
| Error Alert Box | `bg-pixel-red/10 border border-pixel-red/40 rounded-md p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300` |
| OAuth login button | `w-full flex items-center justify-center gap-3 py-3 px-4 bg-panel-secondary border border-card-border rounded-md text-text-light font-sans font-bold hover:border-border-gold transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none group shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |

---

### Onboarding Form Card
Cozy Obsidian/Gold themed onboarding handle selection card.

File: [onboarding-form.tsx](file:///home/kalash/projects/hitbox-ai/app/onboarding/onboarding-form.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Card Container | `w-full max-w-md bg-panel border border-card-border rounded-xl p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-8 relative overflow-hidden` |
| Text Input | `w-full bg-panel-secondary border border-card-border rounded-md px-4 py-3 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner` |
| Primary submit button | `w-full flex items-center justify-center gap-3 py-3 px-4 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none group` |

**Pattern notes:**
Maintains identical container ratios, spacing gaps, and decorative corner borders as the Login Form Card. The submission button utilizes the primary accent-orange theme accent to call out final workspace initialization.

---

### Profile Status Indicator (Warning Banner)
Incomplete project profile warning shown at the top of the project editor.

File: [ProfileStatusIndicator.tsx](file:///home/kalash/projects/hitbox-ai/components/projects/ProfileStatusIndicator.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Container | `flex items-start gap-3 px-5 py-4 bg-pixel-yellow/10 border border-pixel-yellow/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300` |
| Icon frame | `w-8 h-8 rounded-md bg-pixel-yellow/15 border border-pixel-yellow/30 flex items-center justify-center` |
| Tag label | `font-mono text-xs uppercase tracking-widest text-pixel-yellow font-semibold` |
| Description | `text-sm text-text-muted leading-relaxed` |
| Dismiss button | `w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-light hover:bg-panel-secondary transition-all` |

**Pattern notes:**
Uses `pixel-yellow/10` background + `pixel-yellow/30` border for warning severity. Mirrors the error alert box from LoginForm but with yellow. Always dismissable.

---

### Draft Upload Zone
Drag-and-drop file upload area for importing blueprint documents.

File: [DraftUpload.tsx](file:///home/kalash/projects/hitbox-ai/components/projects/DraftUpload.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Card container | `bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-5` |
| Drop zone — idle | `border-2 border-dashed border-card-border bg-panel-secondary/40 hover:border-border-gold hover:bg-panel-secondary/60` |
| Drop zone — dragging | `border-border-gold bg-panel-active/60` |
| Drop zone — file selected | `border-pixel-green/50 bg-pixel-green/5` |
| Drop zone base | `flex flex-col items-center justify-center gap-3 rounded-lg px-6 py-10 transition-all duration-200 cursor-pointer` |
| Icon frame — idle | `bg-panel-secondary border-card-border text-text-muted` |
| Icon frame — file OK | `bg-pixel-green/10 border border-pixel-green/30 text-pixel-green` |

**Pattern notes:**
Drop zone state is driven by three CSS branches (idle / dragging / file-selected). All states map to token variables — no raw colors.

---

### Project Form (GDD Structure Editor)
Multi-section form for capturing game design document parameters.

File: [ProjectForm.tsx](file:///home/kalash/projects/hitbox-ai/components/projects/ProjectForm.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Form shell | `bg-panel border border-card-border rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col divide-y divide-border-light` |
| Section padding | `p-6 flex flex-col gap-5` |
| Section tag | `font-mono text-[10px] text-accent-gold uppercase tracking-widest` |
| Section title | `font-sans text-sm font-semibold text-text-light` |
| Section description | `text-xs text-text-muted` |
| Field label | `font-mono text-xs text-accent-gold uppercase tracking-wider` |
| Required marker | `text-pixel-orange` |
| Text input | `w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner` |
| Textarea | Same as text input + `resize-none leading-relaxed` |
| Select | Same as text input + `appearance-none cursor-pointer` |

**Pattern notes:**
Form divided into named sections (A, B, C) separated by `divide-y divide-border-light`. Each section is self-contained. Inputs match standard Form Input token spec exactly.

---

### Chip Input (Tag Editor)
Inline chip tag editor for keyword and mechanic arrays.

File: [ProjectForm.tsx](file:///home/kalash/projects/hitbox-ai/components/projects/ProjectForm.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Chip tag | `inline-flex items-center gap-1.5 px-2.5 py-1 bg-panel-secondary border border-border-light rounded-md font-sans text-xs text-text-light` |
| Chip remove button | `text-text-muted hover:text-pixel-red transition-colors` |
| Add button | `flex items-center gap-1.5 px-3 py-2.5 bg-panel-secondary border border-card-border rounded-md text-text-muted hover:border-border-gold hover:text-text-light transition-all disabled:opacity-40` |

**Pattern notes:**
Chips use `border-light` (brighter than card-border) to distinguish from the input frame. Remove button turns `pixel-red` on hover.

---

### Platform Toggle Button
Toggle button for platform selection in project form.

File: [ProjectForm.tsx](file:///home/kalash/projects/hitbox-ai/components/projects/ProjectForm.tsx)
Last updated: 2026-07-05

| State | Class |
| --- | --- |
| Active | `bg-panel-active border-border-gold text-accent-gold shadow-[0_0_8px_rgba(215,161,92,0.2)]` |
| Inactive | `bg-panel-secondary border-card-border text-text-muted hover:border-border-gold hover:text-text-light` |
| Base | `px-3 py-1.5 rounded-md border font-sans text-xs font-semibold transition-all` |

**Pattern notes:**
Active state uses `panel-active` + gold border + glow — matches sidebar active state pattern. A styled toggle button, not a native checkbox.

---

### Concept Inputs Card
Inputs capturing gameplay mechanic name and genre baseline constraint parameters.

File: [ConceptInputs.tsx](file:///home/kalash/projects/hitbox-ai/components/validate-concepts/ConceptInputs.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Card Container | `bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] hover:border-border-gold transition-all duration-300` |
| Input Fields | `w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner` |
| Primary Action Button | `w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all` |

---

### Insight Filters Tools
Filter tools bar matching tags, search input, and pagination controls.

File: [InsightFilters.tsx](file:///home/kalash/projects/hitbox-ai/components/validate-concepts/InsightFilters.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Search Input | `w-full bg-panel-secondary border border-card-border rounded-md pl-10 pr-4 py-2 text-text-light placeholder:text-text-muted font-sans text-xs focus:outline-none focus:border-border-gold transition-colors shadow-inner` |
| Sort Selector Select | `w-full sm:w-40 bg-panel-secondary border border-card-border rounded-md px-3 py-2 text-text-light font-sans text-xs focus:outline-none focus:border-border-gold transition-colors shadow-inner cursor-pointer` |
| Active Filter Button | `bg-panel-active border-border-gold text-accent-gold shadow-[0_0_8px_rgba(215,161,92,0.2)] px-3 py-1.5 rounded-md border font-sans text-xs font-semibold` |
| Inactive Filter Button | `bg-panel-secondary border-card-border text-text-muted hover:border-border-gold hover:text-text-light px-3 py-1.5 rounded-md border font-sans text-xs font-semibold` |

---

### Insights Data Grid Table
Data grid table showing forum origins, concept titles, viability scores, and search metadata.

File: [InsightsTable.tsx](file:///home/kalash/projects/hitbox-ai/components/validate-concepts/InsightsTable.tsx)
Last updated: 2026-07-05

| Property | Class |
| --- | --- |
| Table Headers | `pb-3 font-mono text-[11px] font-medium text-accent-gold uppercase tracking-wider` |
| Table Rows (bg/hover) | `hover:bg-panel-secondary transition-colors duration-200 group bg-panel` |
| Divider Line | `divide-y divide-border-light` |

---

### Mechanic Details Header (MechanicInfo)

File: [MechanicInfo.tsx](file:///home/kalash/projects/hitbox-ai/components/mechanic-details/MechanicInfo.tsx)
Last updated: 2026-07-05

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-panel` |
| Border           | `border border-card-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-light font-bold` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-6` |
| Hover state      | `hover:border-border-gold transition-all duration-300` |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |
| Accent usage     | Brand badge colors (e.g. `#FF4500` for Reddit, `text-accent-gold` for Steam) |

**Pattern notes:**
Contains a breadcrumb back link at the top and metadata metrics column layout aligned left or right with standard `border-light` division lines.

---

### Viability Score Gauge (ViabilityScore)

File: [ViabilityScore.tsx](file:///home/kalash/projects/hitbox-ai/components/mechanic-details/ViabilityScore.tsx)
Last updated: 2026-07-05

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-panel`, inner ring `bg-panel-secondary` |
| Border           | `border border-card-border` |
| Border radius    | `rounded-xl`, inner circle `rounded-full` |
| Text — primary   | `text-text-light` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-6` |
| Hover state      | none |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]`, inner `shadow-inner` |
| Accent usage     | Circle stroke color maps dynamically (`text-pixel-green`, `text-pixel-yellow`, `text-pixel-orange`, `text-pixel-red`) |

**Pattern notes:**
Draws an SVG circle gauge representing the viability index percentage. Highlights score categories using matching badge backgrounds and border tags.

---

### Friction Sentiment Panels (SentimentAnalysis)

File: [SentimentAnalysis.tsx](file:///home/kalash/projects/hitbox-ai/components/mechanic-details/SentimentAnalysis.tsx)
Last updated: 2026-07-05

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-panel` |
| Border           | `border border-card-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-light` |
| Text — secondary | `text-text-muted` |
| Spacing          | Grid `gap-6`, inner cards `p-6` |
| Hover state      | none |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |
| Accent usage     | `text-pixel-red` (gripes), `text-pixel-yellow` (desires), `text-accent-gold` (competitors), `text-pixel-green` (wins) |

**Pattern notes:**
A clean 2x2 grid representing quantitative developer inputs. Lists are itemized with custom bullets matching the card accent.

---

### Design Action Alerts (DesignActions)

File: [DesignActions.tsx](file:///home/kalash/projects/hitbox-ai/components/mechanic-details/DesignActions.tsx)
Last updated: 2026-07-05

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-panel`, inner warning cards `bg-panel-secondary/40` |
| Border           | `border border-card-border`, inner card `border-pixel-orange/20` |
| Border radius    | `rounded-xl`, inner cards `rounded-lg` |
| Text — primary   | `text-text-light` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-6` |
| Hover state      | none |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |
| Accent usage     | `text-pixel-orange` for caution warnings |

**Pattern notes:**
Highlights severe structural pitfalls or design warnings to prevent gameplay breaks. Uses highlighted custom caution markers `[!WAR]`.

---

### Competitor Research Dashboard (CompetitorResearch)

File: [CompetitorResearch.tsx](file:///home/kalash/projects/hitbox-ai/components/mechanic-details/CompetitorResearch.tsx)
Last updated: 2026-07-05

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-panel` |
| Border           | `border border-card-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-light` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-6` |
| Hover state      | CTA Button hover transforms |
| Shadow           | `shadow-[0px_4px_10px_rgba(0,0,0,0.4)]` |
| Accent usage     | CTA Button uses `bg-accent-orange` and drop shadow pixels |

**Pattern notes:**
Toggles empty state trigger layout or deep dossier metrics panels depending on the presence of data.


