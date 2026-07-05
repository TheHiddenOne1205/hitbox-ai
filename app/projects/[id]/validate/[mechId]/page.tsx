import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect, notFound } from "next/navigation";
import { MechanicInfo } from "@/components/mechanic-details/MechanicInfo";
import { ViabilityScore } from "@/components/mechanic-details/ViabilityScore";
import { SentimentAnalysis } from "@/components/mechanic-details/SentimentAnalysis";
import { DesignActions } from "@/components/mechanic-details/DesignActions";
import { CompetitorResearch } from "@/components/mechanic-details/CompetitorResearch";
import { Project, Mechanic } from "@/types";

type Props = {
  params: Promise<{ id: string; mechId: string }>;
};

export default async function MechanicDetailsPage({ params }: Props) {
  const { id, mechId } = await params;

  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.username) {
    redirect("/onboarding");
  }

  // Validate UUID formats roughly
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id) || !uuidRegex.test(mechId)) {
    notFound();
  }

  // Fetch project to ensure tenancy and existence
  const { data: project, error: projectError } = await insforge.database
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (projectError || !project) {
    console.error(`[projects/[id]/validate/[mechId]] Project fetch error for ID ${id}:`, projectError);
    notFound();
  }

  // Fetch the target mechanic
  const { data: mechanic, error: mechanicError } = await insforge.database
    .from("mechanics")
    .select("*")
    .eq("id", mechId)
    .eq("project_id", id)
    .eq("user_id", user.id)
    .single();

  if (mechanicError || !mechanic) {
    console.error(`[projects/[id]/validate/[mechId]] Mechanic fetch error for ID ${mechId}:`, mechanicError);
    notFound();
  }

  const projectData = project as unknown as Project;
  const mechanicData = mechanic as unknown as Mechanic;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar initialUser={user as unknown as NavbarUser} />

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Mechanic Header Info (Breadcrumbs + Title Card) */}
        <MechanicInfo mechanic={mechanicData} projectId={id} />

        {/* Viability Score Section */}
        <ViabilityScore
          score={mechanicData.viability_score}
          reason={mechanicData.sentiment_reason}
        />

        {/* Friction Analytics Panels (Gripes, Desires, Competitors, Aligned Features) */}
        <SentimentAnalysis
          gripes={mechanicData.core_player_gripe || []}
          desires={mechanicData.core_player_desires || []}
          competitors={mechanicData.cited_competitors || []}
          alignedFeatures={mechanicData.aligned_features || []}
        />

        {/* Architectural Pitfalls */}
        <DesignActions pitfalls={mechanicData.structural_pitfalls || []} />

        {/* Competitor Research dossier dashboard component */}
        <div className="flex flex-col gap-2">
          <h2 className="font-mono text-xs text-accent-gold uppercase tracking-widest pl-1">
            Competitor Research Hub
          </h2>
          <CompetitorResearch
            mechanicId={mechId}
            projectId={id}
            researchData={mechanicData.competitor_research}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
