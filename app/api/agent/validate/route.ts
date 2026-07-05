import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { discoverRealCommunityThreads } from "@/agent/aggregator";
import { validateCommunitySnippets } from "@/agent/validator";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export async function POST(request: Request) {
  let runId: string | null = null;
  let userId: string | null = null;
  let projectId: string | null = null;
  let mechanic: string = "";
  let genre: string = "";

  try {
    // 1. Authenticate user
    const insforge = await createInsforgeServer();
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    userId = user.id;

    // 2. Parse payload
    const body = await request.json();
    mechanic = body.mechanic;
    genre = body.genre;
    projectId = body.projectId;

    if (!mechanic || !genre || !projectId) {
      return NextResponse.json({ error: "Missing mechanic, genre, or projectId parameter" }, { status: 400 });
    }

    // 3. Fetch active Project Profile
    const { data: project, error: projectError } = await insforge.database
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projectError || !project) {
      console.error("[API/Validate] Project not found:", projectError);
      return NextResponse.json({ error: "Target Project Profile not found" }, { status: 404 });
    }

    // 4. Create Run record in running state
    const { data: runData, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([{
        user_id: userId,
        project_id: projectId,
        status: "running",
        mechanic_searched: mechanic,
        genre_baseline: genre,
        insights_found: 0,
        started_at: new Date().toISOString(),
        completed_at: null
      }])
      .select();

    if (runError || !runData || runData.length === 0) {
      console.error("[API/Validate] Failed to initialize agent run:", runError);
      return NextResponse.json({ error: "Failed to initialize validation run tracking" }, { status: 500 });
    }

    const activeRun = runData[0];
    runId = activeRun.id;

    // Trigger validation started event on PostHog
    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: userId,
        event: "concept_validation_started",
        properties: {
          projectId,
          runId,
          mechanic,
          genre,
        }
      });
    }

    // Write initial log
    await insforge.database.from("agent_logs").insert([{
      run_id: runId,
      user_id: userId,
      project_id: projectId,
      message: `Starting community sweep for gameplay mechanic "${mechanic}" in "${genre}"`,
      level: "info",
      mechanic_id: null,
      created_at: new Date().toISOString()
    }]);

    // 5. Query SearXNG for organic discussions
    console.log(`[API/Validate] Fetching threads for: ${mechanic} / ${genre}`);
    const searchData = await discoverRealCommunityThreads(mechanic, genre);

    // 6. Handle blocks or failure states from aggregator
    if (searchData.blocked) {
      console.warn("[API/Validate] SearXNG request was rate-limited or blocked.");
      
      // Update run to completed with zero results
      await insforge.database
        .from("agent_runs")
        .update({
          status: "completed",
          insights_found: 0,
          completed_at: new Date().toISOString()
        })
        .eq("id", runId);

      // Log warning
      await insforge.database.from("agent_logs").insert([{
        run_id: runId,
        user_id: userId,
        project_id: projectId,
        message: "SearXNG search request was rate-limited or blocked. Returning graceful empty state.",
        level: "warning",
        mechanic_id: null,
        created_at: new Date().toISOString()
      }]);

      return NextResponse.json({
        success: true,
        blocked: true,
        insights: []
      });
    }

    if (searchData.results.length === 0) {
      console.log("[API/Validate] SearXNG search returned zero relevant results.");

      // Update run to completed with zero results
      await insforge.database
        .from("agent_runs")
        .update({
          status: "completed",
          insights_found: 0,
          completed_at: new Date().toISOString()
        })
        .eq("id", runId);

      // Log success step with zero findings
      await insforge.database.from("agent_logs").insert([{
        run_id: runId,
        user_id: userId,
        project_id: projectId,
        message: "SearXNG returned zero relevant community discussions. Concept validation complete.",
        level: "info",
        mechanic_id: null,
        created_at: new Date().toISOString()
      }]);

      return NextResponse.json({
        success: true,
        blocked: false,
        insights: []
      });
    }

    // Write log: discussions found, starting Gemini screening
    await insforge.database.from("agent_logs").insert([{
      run_id: runId,
      user_id: userId,
      project_id: projectId,
      message: `Found ${searchData.results.length} discussion threads. Starting Gemini validation screening...`,
      level: "info",
      mechanic_id: null,
      created_at: new Date().toISOString()
    }]);

    // 7. Validate results using Gemini 3.1 Flash Lite
    const validatedInsights = await validateCommunitySnippets(
      searchData.results,
      project,
      mechanic,
      genre
    );

    console.log(`[API/Validate] Gemini extracted ${validatedInsights.length} relevant insights.`);

    const savedMechanics: any[] = [];

    // 8. Save each validated insight to database
    if (validatedInsights.length > 0) {
      const mechanicsToInsert = validatedInsights.map(insight => ({
        run_id: runId,
        user_id: userId,
        project_id: projectId,
        source: "search",
        source_url: insight.source_url,
        mechanic_name: insight.title,
        target_genre: genre,
        qualitative_meta: insight.qualitative_meta,
        community_upvotes: insight.community_upvotes,
        core_player_gripe: insight.core_player_gripe,
        core_player_desires: insight.core_player_desires,
        cited_competitors: insight.cited_competitors,
        viability_score: insight.viability_score,
        sentiment_reason: insight.sentiment_reason,
        structural_pitfalls: insight.structural_pitfalls,
        aligned_features: insight.aligned_features,
        found_at: insight.published_date ? new Date(insight.published_date).toISOString() : new Date().toISOString()
      }));

      // Delete existing search-based mechanics for this project to replace them
      const { error: deleteError } = await insforge.database
        .from("mechanics")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .eq("source", "search");

      if (deleteError) {
        console.error("[API/Validate] Failed to delete existing mechanics:", deleteError);
      }

      const { data: insertedData, error: insertError } = await insforge.database
        .from("mechanics")
        .insert(mechanicsToInsert)
        .select();

      if (insertError) {
        console.error("[API/Validate] Database insert failed for mechanics:", insertError);
        throw insertError;
      }

      if (insertedData) {
        savedMechanics.push(...insertedData);
      }

      // Log milestones and fire PostHog events for each insight
      for (const mech of savedMechanics) {
        await insforge.database.from("agent_logs").insert([{
          run_id: runId,
          user_id: userId,
          project_id: projectId,
          message: `Saved validated insight: "${mech.mechanic_name}" with Viability Score ${mech.viability_score}%`,
          level: "success",
          mechanic_id: mech.id,
          created_at: new Date().toISOString()
        }]);

        if (posthog) {
          posthog.capture({
            distinctId: userId!,
            event: "insight_found",
            properties: {
              projectId,
              runId,
              mechanicId: mech.id,
              mechanicName: mech.mechanic_name,
              viabilityScore: mech.viability_score
            }
          });
        }
      }
    }

    // 9. Mark agent run completed
    await insforge.database
      .from("agent_runs")
      .update({
        status: "completed",
        insights_found: savedMechanics.length,
        completed_at: new Date().toISOString()
      })
      .eq("id", runId);

    await insforge.database.from("agent_logs").insert([{
      run_id: runId,
      user_id: userId,
      project_id: projectId,
      message: `Concept validation complete. Saved ${savedMechanics.length} insights.`,
      level: "success",
      mechanic_id: null,
      created_at: new Date().toISOString()
    }]);

    await shutdownPostHog();

    return NextResponse.json({
      success: true,
      blocked: false,
      insights: savedMechanics
    });

  } catch (error: any) {
    console.error("[API/Validate] Execution error:", error);
    
    const insforge = await createInsforgeServer();
    if (runId && userId && projectId) {
      // Mark run as failed
      await insforge.database
        .from("agent_runs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString()
        })
        .eq("id", runId);

      // Write error log
      await insforge.database.from("agent_logs").insert([{
        run_id: runId,
        user_id: userId,
        project_id: projectId,
        message: `Execution failed: ${error.message || "Unknown error during validation loop"}`,
        level: "error",
        mechanic_id: null,
        created_at: new Date().toISOString()
      }]);
    }

    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during concept validation" 
    }, { status: 500 });
  }
}
