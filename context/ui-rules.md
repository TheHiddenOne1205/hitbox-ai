# UI Rules

Concise rules for building the Hitbox AI UI. The low-fi, cozy pixel-art indie gaming layout dashboard (`design.png`) serves as the absolute source of truth for visual decisions. These rules cover the most important structural patterns and constraints to keep the UI visually consistent without over-specifying every component property.

---

## Fonts

Always import both `Quicksand` (for soft, playful, rounded UI controls) and `VT323` (for technical data values and gauges) via `next/font/google` in the root layout file.

```typescript
import { Quicksand, VT323 } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-sans" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-mono" });

```

The font variables are already declared in the `@theme` directive in `globals.css`. Apply both font variable classes to the `<html>` tag in the root layout. Never use system fallback fonts as the primary interface typography.

---

## Layout

* **Page Max-Width:** 1440px, centered with horizontal auto-margins.
* **Main Content Area Padding:** 24px (`p-6`) on all workspace sides.


* **Gap Between Page Sections:** 24px (`gap-6`) or 40px (`gap-10`) for major layout spaces.


* **Header Height:** 72px, full width, deep obsidian (`bg-background`) backdrop, featuring a thin decorative framing line at the bottom.


* **Navigation Flow:** Top navbar layout only — no sidebars, drawers, or slide-outs.



---

## Navbar & Dropdown Context Selector

The top navbar contains the retro-styled **Hitbox AI** logo, the active project context dropdown selector, and three main nav links: Dashboard, Validate, and Projects.

* **Active Navigation Link:** Font weight 600, `text-text-light`, with a soft under-glow indicator block instead of a standard text underline.


* **Inactive Navigation Link:** Font weight 500, `text-text-muted`.


* **Project Dropdown Selector:** Styled like an RPG inventory slot container, utilizing `bg-panel-secondary` wrapped in a `1px solid var(--color-card-border)` border outline.



---

## Cards (HUD Workspace Panels)

Every primary content layout section lives inside a dark HUD container panel.

```
background: var(--color-panel)
border: 1px solid var(--color-card-border)
border-radius: 12px (rounded-xl)
padding: 24px (p-6)
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4)

```

Never use standard bright or purely corporate gray card backgrounds. Color accents go inside cards via progress arcs, game control buttons, sparkline indicators, or monospace values, never across the base panel canvas surface.

---

## Typography Hierarchy

Four specific levels are used consistently across all views:

**Page Main Headlines (Hero Canvas Layout)**

```
font-family: var(--font-sans)
font-size: 64px
font-weight: 800
color: var(--color-text-light)
line-height: 1.1

```

**Section Headings & Panel Titles**

```
font-family: var(--font-sans)
font-size: 16px
font-weight: 600
color: var(--color-text-light)
line-height: 24px

```

**Technical Monospace Metrics & Labels**

```
font-family: var(--font-mono)
font-size: 14px
font-weight: 500
color: var(--color-accent-gold)

```

**Body, Description & Audit Lists**

```
font-family: var(--font-sans)
font-size: 14px
font-weight: 400
color: var(--color-text-muted)
line-height: 20px

```

Dynamic validation percentages or metric card totals inside HUD components utilize `font-mono`, `font-size: 22px` or `36px`.

---

## Badges & Tags

* **Standard Tags:** Use `border-radius: 8px` (`rounded-md`) or `rounded-full` pill shapes depending on data scope.


* **Platform Source Badges:** Built with `bg-panel-secondary` paired with thick border tracks. Reddit text uses `#FF4500`, and Steam text utilizes `text-accent-gold`.


* **Trend Badges (Stat Grids):** Use a `4px` (`rounded-sm`) radius container with typography colors set to `text-pixel-green` or `text-pixel-red` depending on direction.



---

## Buttons (Retro Game Controls)

**Primary Orange CTA ("Validate Your Concept"):**

```
background: var(--color-accent-orange)
border: 2px solid var(--color-card-border)
text: var(--color-text-light)
font-family: var(--font-sans)
font-weight: 700
border-radius: 12px
box-shadow: 0px 4px 0px var(--color-card-border)

```

**Secondary Light Cream Button ("Start for Free"):**

```
background: var(--color-retro-beige)
border: 1px solid var(--color-card-border)
text: var(--color-text-dark)
font-family: var(--font-sans)
font-weight: 700
border-radius: 9999px (rounded-full)

```

---

## Form Inputs

```
background: var(--color-panel-secondary)
border: 1px solid var(--color-card-border)
border-radius: 8px (rounded-md)
padding: 10px 16px
font-family: var(--font-sans)
font-size: 14px
color: var(--color-text-light)
placeholder color: var(--color-text-muted)
focus: border-border-gold ring-0

```

---

## Data Grids (Indexed Insights Table)

* **Row Styling:** Deep dark rows only (`bg-panel`), explicitly separated by thick horizontal rule dividers.


* **Row Border Divider:** `1px solid var(--color-border-light)`.


* **Column Headers:** Monospace (`font-mono`), lowercase or clean capitalization, `12px`, `font-weight: 500`, `text-accent-gold`.


* **Hover Interaction:** Changes row surface tint to `bg-panel-secondary`.



---

## Circular Validation Ring & Score Tracks

The circular diagnostics ring overlay runs using an SVG element pathing frame.

```
track background: var(--color-panel-secondary)
stroke-width: 12px
border-radius: rounded-full

```

Fill token colors dynamically assign depending on target viability threshold zones:

* **80–100%:** `text-pixel-green`

* **70–79%:** `text-pixel-yellow`

* **50–69%:** `text-pixel-orange`

* **Below 50%:** `text-pixel-red`


---

## Empty States

Every data tracking panel or dashboard widget that evaluates completely empty must display a minimal, thematic empty state block:

* Short, helpful system description written using `text-text-muted`.


* Small, single-tone visual game control icon or warning token displayed directly above description text.


* A clean, centered secondary button component if a user action loop is immediately available.



---

## Tailwind v4 Architecture Enforcement

This application leverages Tailwind v4 primitives exclusively. All custom styling properties are injected directly using the `@theme` directive blocks inside `app/globals.css`. Do not under any circumstances generate or edit a legacy `tailwind.config.ts` asset file.

---

## Do Nots

* **No Legacy Classes:** Never include default Tailwind scale colors like `bg-zinc-800` or `text-emerald-400` — use project-specific token properties exclusively.


* **No Config File Extensions:** Never introduce layout styles inside configuration files; stick to the `@theme` global layer.


* **No Corporate Base Backgrounds:** Never use bright canvas styles or neon gradients for primary background overlays — match `design.png` Obsidian parameters uniformly.


* **No Raw Stack Errors:** Never drop un-synthesized server traces or engine crashes into visual interfaces — map failures onto clear fallback alerts.


* **No Standard Gray Boundaries:** Never use generic grey borders (`border-gray-*`) for layout separation lines — stick entirely to your brown wood/stone boundaries (`--card-border`).



---

