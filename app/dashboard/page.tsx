import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { AlertTriangle, Sparkles, FolderOpen, ArrowRight } from "lucide-react";
import { IdentifyUser } from "./identify-user";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import Link from "next/link";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0 || seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

  if (authError || !user) {
    redirect("/login");
  }

  if (!user.profile?.username) {
    redirect("/onboarding");
  }

  // Fetch all user projects to check for context switching
  const { data: projects } = await insforge.database
    .from("projects")
    .select("id, title, genre, is_complete, keywords, gdd_data, pitch_deck_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const hasProjects = projects && projects.length > 0;
  
  // By default, select the latest created project as context
  const activeProject = hasProjects ? projects[0] : null;
  const isProfileIncomplete = activeProject ? !activeProject.is_complete : true;
    // Fetch stats and activity logs if activeProject exists
  let totalInsights = 0;
  let avgViability = 0;
  let competitorsResearched = 0;
  let validationsThisWeek = 0;
  let activityLogs: any[] = [];

  // Chart datasets
  let trendData: { day: string; insights: number }[] = [];
  let distributionData: { range: string; count: number; fill: string }[] = [];
  let loopData: { name: string; loops: number }[] = [];

  if (activeProject) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [
      insightsRes,
      viabilityRes,
      competitorsRes,
      validationsRes,
      runsLogRes,
      mechanicsLogRes,
      allProjectMechanicsRes,
      recentScraperRunsRes
    ] = await Promise.all([
      insforge.database
        .from("mechanics")
        .select("*", { count: "exact", head: true })
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id),
        
      insforge.database
        .from("mechanics")
        .select("viability_score")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id),
        
      insforge.database
        .from("mechanics")
        .select("*", { count: "exact", head: true })
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .not("competitor_research", "is", null),
        
      insforge.database
        .from("agent_runs")
        .select("*", { count: "exact", head: true })
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .gte("started_at", sevenDaysAgo.toISOString()),

      insforge.database
        .from("agent_runs")
        .select("id, status, mechanic_searched, genre_baseline, insights_found, started_at")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(10),

      insforge.database
        .from("mechanics")
        .select("id, mechanic_name, cited_competitors, competitor_research, found_at")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .order("found_at", { ascending: false })
        .limit(10),

      // Query all mechanics for insights mapped over time + score distribution
      insforge.database
        .from("mechanics")
        .select("viability_score, found_at, run_id")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .order("found_at", { ascending: true }),

      // Query recent scraper runs (runs with status/logs suggesting research or runs in general)
      insforge.database
        .from("agent_runs")
        .select("started_at")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id)
        .gte("started_at", sevenDaysAgo.toISOString())
    ]);

    totalInsights = insightsRes.count || 0;
    
    if (viabilityRes.data && viabilityRes.data.length > 0) {
      const validScores = viabilityRes.data.filter(
        (s: { viability_score: number | null }) => s.viability_score !== null && s.viability_score !== undefined
      );
      if (validScores.length > 0) {
        const sum = validScores.reduce((acc: number, curr: { viability_score: number }) => acc + curr.viability_score, 0);
        avgViability = Math.round(sum / validScores.length);
      }
    }
    
    competitorsResearched = competitorsRes.count || 0;
    validationsThisWeek = validationsRes.count || 0;

    // Process runs logs
    const tempLogs: any[] = [];
    if (runsLogRes.data) {
      for (const run of runsLogRes.data) {
        if (run.status === "completed") {
          tempLogs.push({
            id: run.id,
            type: "insight",
            message: `Indexed ${run.insights_found} market insights for '${run.mechanic_searched}'`,
            timestamp: new Date(run.started_at).getTime(),
            rawTime: run.started_at
          });
        } else if (run.status === "running") {
          tempLogs.push({
            id: run.id,
            type: "generic",
            message: `Running community sweep for gameplay mechanic '${run.mechanic_searched}' in ${run.genre_baseline}`,
            timestamp: new Date(run.started_at).getTime(),
            rawTime: run.started_at
          });
        }
      }
    }

    // Process mechanics/competitor research logs
    if (mechanicsLogRes.data) {
      for (const mech of mechanicsLogRes.data) {
        if (mech.competitor_research) {
          const compName = mech.cited_competitors?.[0] || "Competitor";
          tempLogs.push({
            id: `${mech.id}-research`,
            type: "research",
            message: `Completed deep competitor analysis on '${compName}'`,
            timestamp: new Date(mech.found_at).getTime() + 1000,
            rawTime: mech.found_at
          });
        }
      }
    }

    // Add project blueprint creation event if pitch deck uploaded
    if (activeProject.pitch_deck_url) {
      tempLogs.push({
        id: `${activeProject.id}-project`,
        type: "project",
        message: "Uploaded and processed game pitch deck blueprint document",
        timestamp: new Date(activeProject.created_at || Date.now()).getTime(),
        rawTime: activeProject.created_at || new Date().toISOString()
      });
    }

    // Sort descending by timestamp, take top 10
    tempLogs.sort((a, b) => b.timestamp - a.timestamp);
    activityLogs = tempLogs.slice(0, 10).map(log => ({
      id: log.id,
      type: log.type,
      message: log.message,
      timestamp: formatTimeAgo(log.rawTime)
    }));

    // 1. Compute Insights Mapped Over Time (30 day trend)
    // We want cumulative count of insights grouped by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Build days array chronologically to iterate
    const chronologicalDays: { label: string; date: Date }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chronologicalDays.push({
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        date: d
      });
    }

    if (allProjectMechanicsRes.data) {
      // Fetch all agent runs for this project to map run_id to started_at
      const { data: allRuns } = await insforge.database
        .from("agent_runs")
        .select("id, started_at")
        .eq("project_id", activeProject.id)
        .eq("user_id", user.id);

      const runDateMap: { [key: string]: Date } = {};
      if (allRuns) {
        for (const r of allRuns) {
          runDateMap[r.id] = new Date(r.started_at);
        }
      }

      trendData = chronologicalDays.map(({ label, date }) => {
        // Set date to the end of that day (23:59:59.999) to capture everything up to it
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Count how many mechanics were discovered in runs that completed up to this endOfDay timestamp
        const countUpToDay = allProjectMechanicsRes.data.filter(
          (m: { run_id: string | null; found_at: string }) => {
            // Fallback to found_at if no run_id is associated
            const discoveryTime = m.run_id ? runDateMap[m.run_id] : new Date(m.found_at);
            if (!discoveryTime || isNaN(discoveryTime.getTime())) return false;
            return discoveryTime <= endOfDay;
          }
        ).length;

        return {
          day: label,
          insights: countUpToDay
        };
      });
    } else {
      trendData = chronologicalDays.map(({ label }) => ({
        day: label,
        insights: 0
      }));
    }

    // 2. Compute Viability Score Distribution
    let bracketUnder50 = 0;
    let bracket50to69 = 0;
    let bracket70to79 = 0;
    let bracket80to100 = 0;

    if (allProjectMechanicsRes.data) {
      for (const m of allProjectMechanicsRes.data) {
        const score = m.viability_score;
        if (score !== null && score !== undefined) {
          if (score < 50) bracketUnder50++;
          else if (score < 70) bracket50to69++;
          else if (score < 80) bracket70to79++;
          else bracket80to100++;
        }
      }
    }

    distributionData = [
      { range: "< 50%", count: bracketUnder50, fill: "var(--color-pixel-red)" },
      { range: "50-69%", count: bracket50to69, fill: "var(--color-pixel-orange)" },
      { range: "70-79%", count: bracket70to79, fill: "var(--color-pixel-yellow)" },
      { range: "80-100%", count: bracket80to100, fill: "var(--color-pixel-green)" },
    ];

    // 3. Compute Scraper Loops Run (7 Days)
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const loopsByDay: { [key: string]: number } = {};
    
    // Initialize loopsByDay for last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      loopsByDay[weekdayNames[d.getDay()]] = 0;
    }

    if (recentScraperRunsRes.data) {
      for (const run of recentScraperRunsRes.data) {
        const dayName = weekdayNames[new Date(run.started_at).getDay()];
        if (loopsByDay[dayName] !== undefined) {
          loopsByDay[dayName]++;
        }
      }
    }

    // Build loopData array aligned to chronological order of the last 7 days
    loopData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = weekdayNames[d.getDay()];
      loopData.push({
        name: dayName,
        loops: loopsByDay[dayName]
      });
    }
  }

  // Render Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <IdentifyUser
        userId={user.id!}
        email={user.email}
        username={user.profile?.username as string}
      />
      <Navbar initialUser={user as unknown as NavbarUser} />

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">
              Workspace HUD
            </span>
            <h1 className="text-2xl font-bold text-text-light font-sans font-semibold">
              Dashboard Panel
            </h1>
            <p className="text-sm text-text-muted">
              Welcome back, <span className="text-accent-gold">@{user.profile?.username as string}</span>. Live gaming analytics context is active.
            </p>
          </div>

          {activeProject && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-panel border border-card-border rounded-xl">
              <FolderOpen className="w-5 h-5 text-accent-gold" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider leading-none">
                  Selected Game Profile
                </span>
                <span className="font-sans text-sm font-bold text-text-light">
                  {activeProject.title}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Warning Banner for Incomplete GDD Profile */}
        {activeProject && isProfileIncomplete && (
          <div className="flex items-start gap-3 px-5 py-4 bg-pixel-yellow/10 border border-pixel-yellow/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-md bg-pixel-yellow/15 border border-pixel-yellow/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-pixel-yellow" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="font-mono text-xs uppercase tracking-widest text-pixel-yellow font-semibold">
                WARNING: Game Profile Incomplete
              </span>
              <p className="text-sm text-text-muted leading-relaxed">
                Foundational design parameters are missing in your Game Design Document. Update your profile settings to run valid competitor crawler sweeps.
              </p>
            </div>
            <Link
              href={`/projects/${activeProject.id}`}
              className="px-4 py-1.5 bg-pixel-yellow/20 hover:bg-pixel-yellow/30 border border-pixel-yellow/30 text-pixel-yellow font-sans font-bold text-xs rounded-md transition-all whitespace-nowrap self-center"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {!hasProjects ? (
          /* Empty Workspace Welcome Panel */
          <div className="bg-panel border border-card-border rounded-xl p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center gap-6 hover:border-border-gold transition-all duration-300 py-16">
            <div className="w-16 h-16 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <h3 className="font-sans text-lg font-bold text-text-light">
                Initialize Your RPG Inventory
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                You have no active game designs in this workspace. Set up your first profile variables or upload a draft blueprint to start concept validation sweeps.
              </p>
            </div>
            <Link
              href="/projects"
              className="px-6 py-3 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
            >
              Create Game Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* High-Fidelity Stats, Charts and Activities */
          <div className="flex flex-col gap-6">
            {/* 4 Stats Bar Tiles */}
            <DashboardStats
              totalInsights={totalInsights}
              avgViability={avgViability}
              competitorsResearched={competitorsResearched}
              validationsThisWeek={validationsThisWeek}
            />

            {/* Recharts Analytics Panels */}
            <DashboardCharts
              trendData={trendData}
              distributionData={distributionData}
              loopData={loopData}
            />

            {/* Recent Chronological Logs Feed */}
            <DashboardActivity projectId={activeProject?.id} logs={activityLogs} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
