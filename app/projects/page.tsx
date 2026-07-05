import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { FolderGit } from "lucide-react";
import { StartNewProjectButton } from "./start-new-project-button";

export default async function ProjectsPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.username) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar initialUser={user as unknown as NavbarUser} />
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 select-none animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">Inventory Slots</span>
          <h1 className="text-2xl font-bold text-text-light font-sans">Game Projects</h1>
          <p className="text-sm text-text-muted">Manage your active game profiles, genre contexts, and design documents.</p>
        </div>

        {/* Empty State */}
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
      </main>
      <Footer />
    </div>
  );
}
