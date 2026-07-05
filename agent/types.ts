import { SearXNGResult } from "@/types";

export interface DiscoveredInsight {
  title: string;
  source_url: string;
  qualitative_meta: string; // The snippet text
  forum_hub_origin: "Reddit" | "Steam Community";
  community_upvotes: number;
  viability_score: number; // 0-100
  sentiment_reason: string;
  core_player_gripe: string[];
  core_player_desires: string[];
  cited_competitors: string[];
  structural_pitfalls: string[];
  aligned_features: string[];
  published_date?: string;
}
