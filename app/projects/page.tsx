import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { FolderGit, Plus, Gamepad, Calendar } from "lucide-react";
import { StartNewProjectButton } from "./start-new-project-button";
import Link from "next/link";
import { Project } from "@/types";

export default async function ProjectsPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.username) {
    redirect("/onboarding");
  }

  // Fetch real projects from DB
  const { data: projects, error } = await insforge.database
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ProjectsPage] Error fetching projects:", error);
  }

  const projectList = (projects || []) as unknown as Project[];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar initialUser={user as unknown as NavbarUser} />
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-300">
        
        {/* Header with action button if list is populated */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">Inventory Slots</span>
            <h1 className="text-2xl font-bold text-text-light font-sans font-semibold">Game Projects</h1>
            <p className="text-sm text-text-muted">Manage your active game profiles, genre contexts, and design documents.</p>
          </div>
          {projectList.length > 0 && (
            <StartNewProjectButton />
          )}
        </div>

        {projectList.length === 0 ? (
          /* Empty State */
          <div className="bg-panel border border-card-border rounded-xl p-12 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center gap-4 hover:border-border-gold transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-accent-gold">
              <FolderGit className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-sans text-base font-bold text-text-light">No Game Designs Registered</h3>
              <p className="text-xs text-text-muted">You have no design profiles configured. Create one to begin validation checks against community indices.</p>
            </div>
            <StartNewProjectButton />
          </div>
        ) : (
          /* Grid of projects */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col justify-between gap-4 hover:border-border-gold transition-all duration-300 group"
              >
                <div className="flex flex-col gap-3">
                  {/* Top line: Slot details */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">
                      Slot ID: {project.id.slice(0, 8)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        project.is_complete
                          ? "bg-pixel-green/10 border-pixel-green/30 text-pixel-green"
                          : "bg-pixel-orange/10 border-pixel-orange/30 text-pixel-orange"
                      }`}
                    >
                      {project.is_complete ? "COMPLETE" : "INCOMPLETE"}
                    </span>
                  </div>

                  {/* Title & Genre */}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-sans text-base font-bold text-text-light group-hover:text-accent-gold transition-colors flex items-center gap-2">
                      <Gamepad className="w-4 h-4 text-accent-gold shrink-0" />
                      {project.title}
                    </h3>
                    <p className="font-mono text-xs text-text-green">{project.genre}</p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between border-t border-border-light pt-3 text-[11px] font-mono text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Edit Configuration &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

