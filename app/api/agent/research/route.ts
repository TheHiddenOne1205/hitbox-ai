import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { runCompetitorResearch } from "@/agent/research";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export async function POST(request: Request) {
  let userId: string | null = null;
  let projectId: string | null = null;
  let mechanicId: string | null = null;
  let runId: string | null = null;

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
    mechanicId = body.mechanicId;

    if (!mechanicId) {
      return NextResponse.json({ error: "Missing mechanicId parameter" }, { status: 400 });
    }

    // 3. Fetch target mechanic
    const { data: mechanicData, error: mechanicError } = await insforge.database
      .from("mechanics")
      .select("*")
      .eq("id", mechanicId)
      .eq("user_id", userId)
      .single();

    if (mechanicError || !mechanicData) {
      console.error("[API/Research] Mechanic not found:", mechanicError);
      return NextResponse.json({ error: "Target mechanic not found" }, { status: 404 });
    }

    projectId = mechanicData.project_id;
    runId = mechanicData.run_id;

    // 4. Fetch parent Project Profile
    const { data: project, error: projectError } = await insforge.database
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projectError || !project) {
      console.error("[API/Research] Project not found:", projectError);
      return NextResponse.json({ error: "Parent Project Profile not found" }, { status: 404 });
    }

    // Resolve competitor game title
    const competitors = mechanicData.cited_competitors || [];
    const competitorName = competitors.length > 0 ? competitors[0] : "";

    // Create start log
    await insforge.database.from("agent_logs").insert([{
      run_id: runId,
      user_id: userId,
      project_id: projectId,
      message: competitorName 
        ? `Initiating competitor research crawler for target title "${competitorName}" (${mechanicData.mechanic_name})`
        : `No competitors cited for mechanic "${mechanicData.mechanic_name}". Running generic AI design synthesis.`,
      level: "info",
      mechanic_id: mechanicId,
      created_at: new Date().toISOString()
    }]);

    console.log(`[API/Research] Running research for: ${competitorName || "Generic Synthesis"} on mechanic ${mechanicData.mechanic_name}`);

    // 5. Run competitor research (Scraping + Gemini Synthesis)
    const dossier = await runCompetitorResearch(
      competitorName,
      mechanicData.mechanic_name,
      mechanicData.target_genre,
      project
    );

    // 6. Save competitor research dossier back to mechanic record
    const { error: updateError } = await insforge.database
      .from("mechanics")
      .update({ competitor_research: dossier })
      .eq("id", mechanicId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("[API/Research] Failed to update mechanic research dossier:", updateError);
      throw updateError;
    }

    // 7. Log success
    await insforge.database.from("agent_logs").insert([{
      run_id: runId,
      user_id: userId,
      project_id: projectId,
      message: `Competitor research dossier successfully compiled for mechanic "${mechanicData.mechanic_name}"`,
      level: "success",
      mechanic_id: mechanicId,
      created_at: new Date().toISOString()
    }]);

    // 8. Capture PostHog Event
    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture({
        distinctId: userId,
        event: "competitor_researched",
        properties: {
          userId,
          mechanicId,
          targetGame: competitorName || "Generic Synthesis",
        }
      });
    }

    await shutdownPostHog();

    return NextResponse.json({
      success: true,
      competitor_research: dossier
    });

  } catch (error: any) {
    console.error("[API/Research] Execution error:", error);

    const insforge = await createInsforgeServer();
    if (userId && projectId && mechanicId) {
      // Log error log
      await insforge.database.from("agent_logs").insert([{
        run_id: runId,
        user_id: userId,
        project_id: projectId,
        message: `Competitor research failed: ${error.message || "Unknown error during scraping/synthesis"}`,
        level: "error",
        mechanic_id: mechanicId,
        created_at: new Date().toISOString()
      }]);
    }

    return NextResponse.json({
      error: error.message || "An unexpected error occurred during competitor research"
    }, { status: 500 });
  }
}
