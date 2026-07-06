"use client";

import { useState, useEffect } from "react";
import { Project, Mechanic } from "@/types";
import { insforge } from "@/lib/insforge-client";
import { ConceptInputs } from "@/components/validate-concepts/ConceptInputs";
import { InsightFilters } from "@/components/validate-concepts/InsightFilters";
import { InsightsTable } from "@/components/validate-concepts/InsightsTable";
import { InsightsPagination } from "@/components/validate-concepts/InsightsPagination";
import { ShieldCheck, HelpCircle, Gamepad, Award, Loader2 } from "lucide-react";

interface ValidateConceptsClientProps {
  project: Project;
  initialInsights?: Mechanic[];
}

export function ValidateConceptsClient({ project, initialInsights = [] }: ValidateConceptsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Mechanic[]>(initialInsights);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedBracket, setSelectedBracket] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "gaps">("all");
  const [sortBy, setSortBy] = useState<string>("viability");
  const [totalItems, setTotalItems] = useState(initialInsights.length);
  const [isQuerying, setIsQuerying] = useState(false);
  
  const itemsPerPage = 20;
  const [scanMilestone, setScanMilestone] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsQuerying(true);
    try {
      let query = insforge.database
        .from("mechanics")
        .select("*", { count: "exact" })
        .eq("project_id", project.id)
        .eq("user_id", project.user_id);

      // 1. Text Search (filters title or qualitative_meta)
      if (searchTerm.trim()) {
        query = query.or(`mechanic_name.ilike.%${searchTerm}%,qualitative_meta.ilike.%${searchTerm}%`);
      }

      // 2. Source filters
      if (selectedSource === "Reddit") {
        query = query.like("source_url", "%reddit.com%");
      } else if (selectedSource === "Steam Community") {
        query = query.not("source_url", "like", "%reddit.com%");
      }

      // 3. Bracket filters
      if (selectedBracket === "strong") {
        query = query.gte("viability_score", 80);
      } else if (selectedBracket === "stable") {
        query = query.gte("viability_score", 70).lt("viability_score", 80);
      } else if (selectedBracket === "improving") {
        query = query.gte("viability_score", 50).lt("viability_score", 70);
      } else if (selectedBracket === "critical") {
        query = query.lt("viability_score", 50);
      }

      // 4. Tab filter (All Matches vs Gaps: gaps are viability_score >= 80 or < 50)
      if (activeTab === "gaps") {
        query = query.or("viability_score.gte.80,viability_score.lt.50");
      }

      // 5. Sorting
      if (sortBy === "viability") {
        query = query.order("viability_score", { ascending: false });
      } else if (sortBy === "newest") {
        query = query.order("found_at", { ascending: false });
      } else if (sortBy === "oldest") {
        query = query.order("found_at", { ascending: true });
      }

      // 6. Pagination (20 entries per indexing view pass)
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      setSearchResults((data || []) as Mechanic[]);
      setTotalItems(count || 0);
    } catch (err: any) {
      console.error("Error fetching filtered insights:", err.message, err.details, err.hint, err);
    } finally {
      setIsQuerying(false);
    }
  };

  // Re-fetch when filter states change
  useEffect(() => {
    fetchInsights();
  }, [searchTerm, selectedSource, selectedBracket, activeTab, sortBy, currentPage]);

  const handleValidateStart = async (mechanicName: string, genreBaseline: string) => {
    setIsLoading(true);
    setScanMilestone(null);

    try {
      // 1. Attempt client-side search to leverage residential IP
      let clientResults: any[] | null = null;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SEARXNG_BASE_URL || "https://searx.be";
        const primaryQuery = `site:reddit.com OR site:steamcommunity.com "${mechanicName}" "${genreBaseline}"`;
        const fallbackQuery = `site:reddit.com OR site:steamcommunity.com ${mechanicName} ${genreBaseline}`;
        
        const runQuery = async (q: string) => {
          const url = `${baseUrl}/search?q=${encodeURIComponent(q)}&format=json&categories=general`;
          const response = await fetch(url, {
            headers: {
              "Accept": "application/json",
            }
          });
          if (!response.ok) throw new Error(`Status ${response.status}`);
          const data = await response.json();
          const rawResults = data.results || [];
          const mapped = [];
          for (const res of rawResults) {
            const urlStr = res.url || "";
            let origin = null;
            if (urlStr.includes("reddit.com")) {
              origin = "Reddit";
            } else if (urlStr.includes("steamcommunity.com")) {
              origin = "Steam Community";
            }
            if (origin) {
              const baseScore = res.score ? Math.round(res.score * 10) : 1;
              const randomDaysAgo = Math.floor(Math.random() * 180);
              const fallbackDate = new Date();
              fallbackDate.setDate(fallbackDate.getDate() - randomDaysAgo);
              mapped.push({
                title: res.title || "Untitled Discussion",
                forum_hub_origin: origin,
                structural_text: res.content || "",
                reference_url: urlStr,
                community_score: Math.max(1, baseScore),
                published_date: res.publishedDate || fallbackDate.toISOString()
              });
            }
          }
          return mapped;
        };

        console.log(`[ClientSearch] Querying SearXNG client-side at ${baseUrl}`);
        clientResults = await runQuery(primaryQuery);
        if (clientResults.length === 0) {
          clientResults = await runQuery(fallbackQuery);
        }
      } catch (searchErr) {
        console.warn("[ClientSearch] Client-side search failed, falling back to server:", searchErr);
      }

      // 2. Dispatch validation to backend
      const response = await fetch("/api/agent/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mechanic: mechanicName,
          genre: genreBaseline,
          projectId: project.id,
          results: clientResults // Pass client-fetched results if successful
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const resData = await response.json();

      if (resData.error) {
        throw new Error(resData.error);
      }

      if (resData.blocked) {
        setScanMilestone(
          `SearXNG query was rate-limited or blocked. Returning graceful empty state.`
        );
      } else {
        const newInsights: Mechanic[] = resData.insights || [];
        if (newInsights.length > 0) {
          // Re-trigger the DB query to refresh list and get correct total count
          await fetchInsights();
          setScanMilestone(
            `Analyzed community discussions and saved ${newInsights.length} high-value market insights for "${mechanicName}".`
          );
        } else {
          setScanMilestone(
            `Found 0 relevant community discussions for "${mechanicName}" in "${genreBaseline}".`
          );
        }
      }
    } catch (err: any) {
      console.error("[ValidateConceptsClient] Validation failed:", err);
      setScanMilestone(`Validation scan failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      {/* Active Project Verification HUD Card */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] hover:border-border-gold transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold">
              <Gamepad className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider leading-none">
                Context Profile
              </span>
              <h2 className="font-sans text-lg font-bold text-text-light">{project.title}</h2>
            </div>
          </div>

          {/* Configuration Tokens Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto border-t md:border-t-0 border-border-light pt-4 md:pt-0">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Genre</span>
              <span className="font-sans text-xs font-semibold text-text-green">{project.genre}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Art Style</span>
              <span className="font-sans text-xs font-semibold text-text-light">{project.art_style}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Platform</span>
              <span className="font-sans text-xs font-semibold text-text-light">{project.platform}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Audience</span>
              <span className="font-sans text-xs font-semibold text-text-light">{project.target_audience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Inputs Card */}
      <ConceptInputs
        projectId={project.id}
        projectTitle={project.title}
        onValidateStart={handleValidateStart}
        isLoading={isLoading}
      />

      {/* Success/Milestone Confirmation Banner */}
      {scanMilestone && (
        <div className="flex items-center gap-3 px-5 py-4 bg-pixel-green/10 border border-pixel-green/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-8 h-8 rounded-md bg-pixel-green/15 border border-pixel-green/30 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-pixel-green" />
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            <span className="font-semibold text-text-light">Agent Sweep Milestone: </span>
            {scanMilestone}
          </p>
        </div>
      )}

      {/* Discovered Insights Workspace Section */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-6 relative">
        {/* Loading overlay for DB query updates */}
        {isQuerying && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10 transition-opacity">
            <div className="flex items-center gap-2 px-4 py-2 bg-panel border border-card-border rounded-lg shadow-lg">
              <Loader2 className="w-4 h-4 text-accent-gold animate-spin" />
              <span className="font-mono text-xs text-text-light uppercase tracking-wider">Querying DB...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-light pb-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-base font-bold text-text-light">Discovered Community Insights</h3>
            <p className="text-xs text-text-muted">
              Organic forum reviews parsed from Steam and Reddit databases mapped to concept viability indexes.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-panel-secondary border border-card-border rounded-lg p-0.5 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md font-sans text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-panel-active text-accent-gold shadow-sm"
                  : "text-text-muted hover:text-text-light"
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => {
                setActiveTab("gaps");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md font-sans text-xs font-semibold transition-all ${
                activeTab === "gaps"
                  ? "bg-panel-active text-accent-gold shadow-sm"
                  : "text-text-muted hover:text-text-light"
              }`}
            >
              Gaps
            </button>
          </div>
        </div>

        {/* Filters */}
        <InsightFilters
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          selectedSource={selectedSource}
          onSourceChange={(src) => {
            setSelectedSource(src);
            setCurrentPage(1);
          }}
          selectedBracket={selectedBracket}
          onBracketChange={(br) => {
            setSelectedBracket(br);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(sort) => {
            setSortBy(sort);
            setCurrentPage(1);
          }}
        />

        {/* Data Grid Table */}
        <InsightsTable insights={searchResults} projectId={project.id} />

        {/* Pagination */}
        <InsightsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
