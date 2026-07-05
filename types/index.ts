// =============================================================================
// Global TypeScript Types — Hitbox AI
// Matches InsForge database schema defined in context/architecture.md exactly.
// These types are shared across app/, actions/, agent/, and lib/ layers.
// =============================================================================

// -----------------------------------------------------------------------------
// projects
// Central game design profile. One record per active project per user.
// -----------------------------------------------------------------------------

export interface GDDData {
  playerLoop?: string;
  coreMechanics?: string[];
  monetizationStrategy?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  genre: string;
  art_style: string;
  platform: string;
  target_audience: string;
  keywords: string[];
  gdd_data: GDDData;
  pitch_deck_url: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type ProjectUpdate = Partial<
  Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
>;

// -----------------------------------------------------------------------------
// agent_runs
// Tracks a single concept validation scan session for a project.
// -----------------------------------------------------------------------------

export type AgentRunStatus = "running" | "completed" | "failed";

export interface AgentRun {
  id: string;
  user_id: string;
  project_id: string;
  status: AgentRunStatus;
  mechanic_searched: string;
  genre_baseline: string;
  insights_found: number;
  started_at: string;
  completed_at: string | null;
}

export type AgentRunInsert = Omit<AgentRun, "id" | "started_at"> & {
  id?: string;
};

// -----------------------------------------------------------------------------
// mechanics
// Individual community insight record discovered or added manually per project.
// -----------------------------------------------------------------------------

export type MechanicSource = "search" | "manual";

export interface CompetitorResearchDossier {
  competitorOverview: string;
  featureBreakdown: string[];
  communityCulture: string[];
  whyExecutionFailed: string;
  actionableDesignAdjustments: string[];
  balancePitfalls: string[];
  strategicQuestions: string[];
  sources: string[];
}

export interface Mechanic {
  id: string;
  run_id: string | null;
  user_id: string;
  project_id: string;
  source: MechanicSource;
  source_url: string;
  mechanic_name: string;
  target_genre: string;
  qualitative_meta: string;
  community_upvotes: number;
  core_player_gripe: string[];
  core_player_desires: string[];
  cited_competitors: string[];
  viability_score: number;
  sentiment_reason: string;
  structural_pitfalls: string[];
  aligned_features: string[];
  competitor_research: CompetitorResearchDossier | null;
  found_at: string;
}

export type MechanicInsert = Omit<Mechanic, "id" | "found_at"> & {
  id?: string;
};

export type MechanicUpdate = Partial<
  Omit<Mechanic, "id" | "user_id" | "project_id" | "run_id" | "found_at">
>;

// -----------------------------------------------------------------------------
// agent_logs
// System tracking log entries tied to a run, project, and optionally a mechanic.
// -----------------------------------------------------------------------------

export type AgentLogLevel = "info" | "success" | "warning" | "error";

export interface AgentLog {
  id: string;
  run_id: string;
  user_id: string;
  project_id: string;
  message: string;
  level: AgentLogLevel;
  mechanic_id: string | null;
  created_at: string;
}

export type AgentLogInsert = Omit<AgentLog, "id" | "created_at"> & {
  id?: string;
};

// -----------------------------------------------------------------------------
// Utility / Shared Types
// -----------------------------------------------------------------------------

/** SearXNG aggregator result shape from agent/aggregator.ts */
export interface SearXNGResult {
  title: string;
  forum_hub_origin: "Reddit" | "Steam Community";
  structural_text: string;
  reference_url: string;
  community_score: number;
}

/** Standard InsForge DB response wrapper */
export interface DBResponse<T> {
  data: T | null;
  error: { message: string } | null;
}
