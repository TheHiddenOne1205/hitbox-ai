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
