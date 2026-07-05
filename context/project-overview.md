# Project Overview

## About the Project

Hitbox AI is a full-stack, cloud-hosted, AI-powered game design evaluation suite and discovery assistant. The user defines their active design project profile once (genre, mechanics, platform, aesthetic tokens), and a data agent automatically discovers real-world community insights, discussion footprints, and player sentiment records from live web indexes via SearXNG—intelligently evaluating each feature concept against the user's game design parameters using a Google Gemini AI model context pass.

For mechanics they want to analyze deeply, the agent orchestrates remote browser executions using Stagehand over Browserbase Cloud to crawl target competitor hubs (like Reddit discussion spaces or Steam community review forms) and build a structured product dossier—compiling community pain points, competitive feature balance data, design pitfalls, and potential feature adjustments. The user can review this telemetry dashboard and render a complete, high-fidelity Game Design Document (GDD) blueprint or Pitch Deck PDF with a single click to present to stakeholders or publishers.

The entire operational flow is securely tracked via a live metrics dashboard powered by PostHog event mapping and an historical audit feed.

---

## The Problem It Solves

Game design is notoriously risky, and developers often rely on guesswork. Designers spend dozens of hours reading forum boards, assessing player reviews, and analyzing competitors to determine if a specific gameplay mechanic is highly anticipated, overdone, or fundamentally broken.

Hitbox AI eliminates manual market and community validation research loops. The agent surfaces authentic player friction data, evaluates it against the designer's specific game mechanics, and parses hidden developer pitfalls before writing code. This workspace gives developers the insights they need to address player requirements early, mitigate balance risks, and validate a game's viability before pitching to publishers or filing for platforms.

---

## Pages

```
/                  → Homepage (Landing framework, capabilities showcase)
/login             → Auth page (InsForge Auth — Google + GitHub OAuth)
/dashboard         → Project matrix overview, global analytics summary, historical logs
/projects          → Overview grid of all active user game designs
/projects/[id]     → GDD structure editor & draft blueprint uploads
/projects/[id]/validate → Validate Concepts dashboard (mechanics analysis workspace)
/projects/[id]/validate/[mechId] → Deep competitor research log & sentiment dossier

```

---

## Navigation

Top navbar layout. Minimalist and clear. It contains a persistent **Active Project Context Selector Dropdown** alongside three main navigation links:

```
Dashboard    Projects    Profile (Contextual Settings)

```

Full-width presentation layouts utilized uniformly across all page components. No sidebars are present.

---

## Core User Flow

### Homepage

* **Hero Section:** Features detailed product capabilities and call-to-actions.
* **Authenticated Routing:** Authenticated sessions automatically intercept path execution and redirect to `/dashboard`.
* **Guest Routing:** Unauthenticated users clicking core layouts face immediate routing back to `/login`.

### Onboarding & Authentication

* **Provider Engine:** Handled natively by InsForge Auth using secure social loops (Google OAuth or GitHub OAuth).
* **Initialization Redirect:** Landing on a valid login session pushes path execution straight to `/dashboard`.
* **Profile Verification:** The main workspace layout fires a validation pass; if the user's active game project contains incomplete design tokens, an inline warning banner appears across the dashboard view.

### Project Setup & Design Profile GDD Form

* **Manual Definition:** Users manually populate structural field vectors—mapping genre constraints, distribution platforms, art styles, and baseline target audiences.
* **Blueprint Extraction:** Users can drag-and-drop a draft design blueprint document or markdown file into the upload zone.
* **Extraction Processing:** Gemini maps and parses raw text contents, extracting parameters and auto-populating equivalent text blocks in the project record form.
* **Document Compilation:** Users can generate a clean, stylized GDD Pitch Deck PDF tracking their current profile data layout using `@react-pdf/renderer` with one click.

### Finding Insights — SearXNG Concept Validation Loop

* **Search Execution:** The user inputs target feature concepts and gameplay mechanic tags inside the validation workspace.
* **Discovery Dispatch:** The application triggers an internal request path hitting `/api/agent/validate`. The agent calls a public, cloud-deployed SearXNG endpoint query, isolating organic search entries from Reddit and Steam community hubs.
* **AI Evaluation Pass:** Gemini screens these text records, assigning an alignment validation rating from 0–100 calculated relative to the active project's design parameters.
* **Completion Reporting:** After the matching loop finishes, an on-screen status confirmation banner is displayed: *"Found [X] historical entries and indexed [Y] strong player alignment footprints."*

### Metric Concept Matching

* **Analytical Scoring:** Gemini maps discovered community entries against active project parameters, returning a strict multi-property object: viability score, clear justification text, aligned feature vectors, and potential structural pitfalls.
* **Unfiltered Access:** All discovered threads persist visually inside the tracking table regardless of rating; high-potential community matches display highlight visual attributes, while poor matches remain accessible for inspection.

### Mechanic Details & Deep Research Dossier

* **Data Fields:** Displays complete structured information including mechanic metadata, source hub, community engagement score, and link references.
* **Friction Analytics:** Visual panels render clear player sentiment categorization—grouping verified user complaints, missing feature desires, and cited competitor titles.
* **Deep Cloud Scraping:** Features a dedicated "Research Competitors" trigger. Clicking it opens a secure, remote Browserbase proxy session running a Stagehand process that navigates the target competitor's hub to extract balance models and feature nuances.
* **AI Synthesis:** Gemini reads the extracted web page text arrays and compiles a complete JSON document, rendering the updated dossier directly to the active `mechanics.competitor_research` column.

### Dashboard Core

* **Metrics Summary Panel:** Displays 4 data counters: Total Mechanics Audited, Avg. Market Alignment, Projects Validated, and Agent Sweeps This Week.
* **Historical Audit Feed:** A chronological list displaying the last 5–10 agent events pulled from the database logs.
* **Embedded Telemetry Charts:** Pulls event analytics directly from PostHog tracking interfaces:
* Mechanics discovered over time (Line chart)
* Viability score distribution metrics (Bar chart)
* Deep-scraping agent activity counters (Bar chart)



---

## Data Architecture

### Core Design Profile Data

* **Storage Location:** Kept inside the `projects` table.
* **Modification Barriers:** Profile records are only mutated when the user explicitly modifies form vectors or executes a "Blueprint Extraction" parse. This schema serves as the rigid base context used for matching logic and is never modified by automated background loops.

### Competitor Research Data

* **Storage Location:** Stored directly inside the `mechanics.competitor_research` jsonb column.
* **Execution Boundary:** Generated on demand only when a user triggers deep web scraper tasks. These updates are strictly limited to the specific mechanic record and cannot bleed into or mutate your primary project profile data.

---

## Features In Scope

* Responsive landing homepage with product overview sections and platform footers.
* Standardized top layout navbar featuring a project dropdown and main route path links.
* Secure multi-tenant access controls driven by InsForge Auth (Google/GitHub OAuth).
* Automatic route interception redirecting active login states directly to `/dashboard`.
* In-app workspace forms tracking standard game development parameters.
* Document extraction processing that converts raw text blueprint files into structured project profiles using Gemini.
* Automated GDD overview document rendering utilizing `@react-pdf/renderer` serverless execution.
* Target index discovery running query-filtered requests against cloud-deployed SearXNG endpoints.
* Objective multi-property alignment evaluation logic handled by Gemini models.
* Comprehensive mechanic results pages displaying sentiment analysis panels and source reference data.
* Dedicated deep-scraping agent tools leveraging Stagehand routines over secure Browserbase Cloud proxies.
* Central tracking dashboard featuring interactive analytics metrics and live PostHog charts.
* Granular user event telemetry recording throughout key interactive interfaces.

---

## Features Out of Scope

* Automated asset compilation—the platform does not generate visual textures, audio layouts, or code objects.
* Automated game framework generation or code repository creation.
* Competitor monitoring via automated cron schedules—all web sweeps must be manually triggered.
* Real-time engine visualization feeds or active terminal stream widgets inside the client.
* Game platform publishing—the system does not submit metadata details to external storefronts (like Steam or Epic Games Store).
* Multi-user design channels or shared project editing spaces (single workspace per developer profile).
* Browser extensions or local system tracking applications.

---

## PostHog Telemetry Events

```typescript
mechanic_search_started;   // Properties: { userId, projectTitle, mechanicName }
mechanic_indexed;          // Properties: { userId, platformSource, alignmentScore }
project_profile_completed; // Properties: { userId, projectTitle }
competitor_researched;     // Properties: { userId, mechanicId, targetGame }

```

---

## Target User

An independent game developer, technical designer, or startup project lead who:

* Is actively mapping and prototyping gameplay features or game mechanics.
* Has initial text notes or design pitch layouts they want to programmatically parse.
* Requires objective community sentiment data to refine design loops and mitigate balance issues.
* Needs high-fidelity presentation assets to secure funding or platform validation.

---

## Success Criteria

* A user can complete registration, initialize an active project profile, and kick off a concept discovery scan in under 5 minutes.
* SearXNG queries return organic player data from Reddit and Steam community hubs for various genre and mechanic combinations.
* Gemini alignment analytics accurately reflect real-world community sentiment, providing useful structural design justifications.
* Deep-scraping routines consistently extract and deliver structural balance parameters from highly recognized community hubs.
* Scraping tasks gracefully catch network errors, ensuring fallback systems generate valid data points from the initial mechanic files alone.
* Relational tables securely store app data via multi-tenant Postgres configurations.
* PostHog analytic models track app actions, populating dashboard graphics cleanly.
* UI elements remain clear and visually cohesive throughout the dark-themed aesthetic configuration.

---

