import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ValidateConceptsClient } from "./validate-concepts-client";
import { Project } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ValidateConceptsPage({ params }: Props) {
  const { id } = await params;

  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.username) {
    redirect("/onboarding");
  }

  // Validate UUID format roughly before querying
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const { data: project, error } = await insforge.database
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    console.error(`[projects/[id]/validate] Fetch error for ID ${id}:`, error);
    notFound();
  }

  // Fetch existing validated insights/mechanics
  const { data: initialInsights } = await insforge.database
    .from("mechanics")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .order("found_at", { ascending: false });

  const projectData = project as unknown as Project;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar initialUser={user as unknown as NavbarUser} />

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/projects/${id}`}
            className="flex items-center gap-1.5 w-fit font-mono text-xs text-text-muted hover:text-text-light transition-colors group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Editor
          </Link>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">
              Validation Hub
            </span>
            <h1 className="text-2xl font-bold text-text-light font-sans font-semibold">
              Validate Concepts
            </h1>
            <p className="text-sm text-text-muted">
              Scan live community discussion indices and evaluate gameplay mechanic alignment vectors.
            </p>
          </div>
        </div>

        {/* Client workspace component */}
        <ValidateConceptsClient project={projectData} initialInsights={(initialInsights || []) as any} />
      </main>

      <Footer />
    </div>
  );
}
