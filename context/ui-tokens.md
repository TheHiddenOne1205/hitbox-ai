# UI Tokens

Design tokens for Hitbox AI. All colors, typography, spacing, border styles, and component values are here. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

* `--color-retro-beige` → `bg-retro-beige`, `text-retro-beige`, `border-retro-beige`
* `--color-pixel-green` → `bg-pixel-green`, `text-pixel-green`

```tsx
// Correct — uses generated token utility classes
className="bg-panel text-text-light border-card-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-green)' }}

// Never — hardcoded hex values
className="bg-[#1C1F26] text-[#A3B899]"

// Never — raw Tailwind color classes
className="bg-zinc-800 text-emerald-400"

```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font Families - Leaning into rounded, readable text alongside retro monospace metrics */
  --font-sans: "Quicksand", "Fredoka", "Inter", sans-serif;
  --font-mono: "VT323", "Courier New", monospace;

  /* Cozy Gaming Palette (Obsidian-Gold Base Archetype) */
  --color-background: #0D0E11;           /* Deep dark retro backdrop */
  --color-panel: #14161D;                /* Inner component grid dashboard panels */
  --color-panel-secondary: #1C1F27;      /* Secondary tooltips, filter states, code bars */
  --color-panel-active: #2C2E1B;         /* Selected navigation sidebar states */

  /* Borders & Rules */
  --color-card-border: #3A362D;          /* Chunky brown wood/stone framing lines */
  --color-border-light: #524D41;         /* Divider accents for grids and tables */
  --color-border-gold: #D7A15C;          /* Highlight framework indicator border styling */

  /* Text Typography Scales */
  --color-text-light: #F0E6D2;           /* Soft cream for header/primary labels */
  --color-text-muted: #9D9686;           /* Weathered parchment gray for metadata */
  --color-text-green: #A4C495;           /* Distinct retro-game title typography color */
  --color-text-dark: #2B2114;            /* Used inside high-contrast light buttons */

  /* Theme Accents & Game Primitives */
  --color-accent-gold: #E5C390;          /* Main primary gold selector color */
  --color-accent-orange: #E47644;        /* Monospace accent tokens and actions */
  --color-retro-beige: #F5E6CC;          /* Light cream button canvas color */

  /* Concept Viability / Scoring Metrics (Cozy Low-Contrast Scales) */
  --color-pixel-green: #6AA84F;          /* Strong loop tracking green indicator */
  --color-pixel-yellow: #F1C232;         /* Stable caution warning validation score */
  --color-pixel-orange: #E69138;         /* Room to improve indicator color token */
  --color-pixel-red: #CC0000;            /* Downward trend or severe structural pitfall */

  /* Border Radii (Soft Hand-Crafted Gaming Radii) */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;                      /* Large soft nested layout containers */
  --radius-full: 9999px;
}

```

---

## Color Usage Guide

### Page Layout

| Element | Token | Description |
| --- | --- | --- |
| Page Base Canvas | `bg-background` | Whole viewport backdrop screen

 |
| Primary HUD Container | `bg-panel` | Base surface for inner cards and lists

 |
| Input fields / Tabs | `bg-panel-secondary` | Form controls, input spaces, or selection tabs

 |
| Active Item Sidebar | `bg-panel-active` | Highlight active contextual buttons

 |
| Standard Outer Framing | `border-card-border` | The primary 1px brown wood/stone edge border

 |
| Bright Highlight Framer | `border-border-gold` | Focused elements or primary UI targets

 |

### Typography

| Element | Token | Usage |
| --- | --- | --- |
| Global Headings / Titles | `text-text-light` | Prominent label descriptors

 |
| Subheadings / Labels | `text-text-muted` | Side captions, descriptions, and audit items

 |
| Gaming Highlights | `text-text-green` | Used to label successful tags or logos

 |
| Light Button Foreground | `text-text-dark` | Text used inside cream retro elements

 |

### Action Accents

Used for: Hero CTAs, active selectors, custom pixel game button components, and badge indicators.

| Element | Token | Description |
| --- | --- | --- |
| Primary Glowing CTA Button | `bg-accent-orange` | Central click triggers ("Validate Your Concept")

 |
| Soft Interactive Canvas | `bg-retro-beige` | General functional inputs / "Start for free" controls

 |
| Core Focus Enforcers | `text-accent-gold` | Star icons, status values, dynamic drop highlights

 |

### Concept Viability Metrics

Concept match frameworks use targeted pixel indicators mapping back to score brackets:

| Viability Score Range | Color Context | Token Mapping |
| --- | --- | --- |
| **80-100%** (Strong Loop) | Gaming Green | `text-pixel-green` / `bg-pixel-green`<br> |
| **70-79%** (Moderate Variant) | Balanced Yellow | `text-pixel-yellow` / `bg-pixel-yellow`<br> |
| **50-69%** (Room to Improve) | Caution Orange | `text-pixel-orange` / `bg-pixel-orange`<br> |
| **Below 50%** (Severe Gaps) | Critical Red | `text-pixel-red` / `bg-pixel-red`<br> |

### Source Hub Identifiers

| Platform Source | Background | Text color token |
| --- | --- | --- |
| **Reddit** | `bg-panel-secondary` | `#FF4500` (Direct Brand Orange) |
| **Steam Community** | `bg-panel-secondary` | `text-accent-gold`<br> |

---

## Typography Style Matrix

| Element Layout | Font Family | Size | Weight | Color Token |
| --- | --- | --- | --- | --- |
| Hero Headline | `--font-sans` | 64px | 800 | `text-text-light`<br> |
| Central Game Title Logo | `--font-sans` | 24px | 700 | `text-text-light`<br> |
| Primary Scored Indicator | `--font-sans` | 36px | 700 | `text-text-light`<br> |
| Monospace Card Labels | `--font-mono` | 14px | 500 | `text-accent-gold`<br> |
| Dynamic Data Values | `--font-mono` | 22px | 600 | `text-text-light`<br> |
| General Nav Links / Tabs | `--font-sans` | 15px | 500 | `text-text-light`<br> |
| Body Copy / Audit Items | `--font-sans` | 14px | 400 | `text-text-muted`<br> |
| Tiny Grid Metadata / Spark | `--font-mono` | 12px | 400 | `text-text-muted`<br> |

---

## Spacing & Layout Alignment

| Token | Pixel Value | Structural Target Usage |
| --- | --- | --- |
| `gap-1.5` | 6px | Tight inner tag grids and icon spacing elements

 |
| `gap-3` | 12px | Metric card structural column layouts

 |
| `gap-4` | 16px | Form component groupings and text line structures

 |
| `gap-6` | 24px | Master card separations and inner HUD padding matrices

 |
| `gap-10` | 40px | Major sectional divisions across page flows

 |
| `p-4` | 16px | Sub-card components padding blocks

 |
| `p-6` | 24px | Primary dashboard workspace frame grid padding

 |
| `px-5 py-2.5` | 20px / 10px | Primary layout menu buttons and CTA components padding

 |

---

## Component Tokens

### HUD Dashboard Cards

```
background: bg-panel
border: 1px solid var(--color-card-border)
border-radius: 12px (rounded-xl)
padding: 24px (p-6)
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4)

```

### Retro Game Control Buttons

**Primary Orange CTA ("Validate Your Concept"):**

```
background: bg-accent-orange
border: 2px solid var(--color-card-border)
text: text-text-light
font-family: font-sans
font-weight: font-bold
border-radius: 12px (rounded-xl)
box-shadow: 0px 4px 0px var(--color-card-border) (Pixel drop-shadow profile effect)

```

**Secondary Light Cream ("Start for Free"):**

```
background: bg-retro-beige
border: 1px solid var(--color-card-border)
text: text-text-dark
font-family: font-sans
font-weight: font-bold
border-radius: 9999px (rounded-full)

```

**Cozy Dark Panel Buttons:**

```
background: bg-panel-secondary
border: 1px solid var(--color-card-border)
text: text-text-light
border-radius: 8px (rounded-md)

```

### Form Input Fields

```
background: bg-panel-secondary
border: 1px solid var(--color-card-border)
border-radius: 8px (rounded-md)
padding: px-4 py-2.5
text: text-text-light
placeholder: text-text-muted
focus: border-border-gold ring-0

```

### Circular Validation Ring Tracker

```
Track background: bg-panel-secondary
Active Indicator Fill: Varies dynamically by validation score (e.g. bg-pixel-green)[cite: 8]
Stroke thickness: 12px
Nested content alignment: Absolute center text centering[cite: 8]

```

### Metric Trend Indicators (HUD Sparklines)

```
Line stroke: Varies by direction (bg-pixel-green for up, bg-pixel-red for down)[cite: 8]
Stroke width: 2px
Fill area gradient opacity: transparent to soft base opacity background limits
Text badges: text-pixel-green or text-pixel-red matching metric directional values[cite: 8]

```

---

## Invariants

* Never use raw system color values directly in layout frames — always pull CSS variables via project token strings.


* Font scales are locked to Quicksand/VT323 — always integrate variables using standard configurations.


* Never use default Tailwind values like `bg-zinc-800` or `text-emerald-400` — use project-specific tokens without deviation.


* All border outlines default to `--card-border` (#3A362D) — standard gray scales (`border-gray-*`) are prohibited.


* Every network discovery match progress line or diagnostic circle must pull color indicators directly based on target viability thresholds. Never map static values.
