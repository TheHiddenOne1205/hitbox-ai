import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { Shield, Database, BarChart2, Activity } from "lucide-react";
import { InitializeProjectButton } from "./initialize-project-button";
import { IdentifyUser } from "./identify-user";

export default async function DashboardPage() {
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
      <IdentifyUser
        userId={user.id!}
        email={user.email}
        username={user.profile?.username as string}
      />
      <Navbar initialUser={user as unknown as NavbarUser} />
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 select-none animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">Workspace HUD</span>
          <h1 className="text-2xl font-bold text-text-light font-sans">Dashboard Panel</h1>
          <p className="text-sm text-text-muted">Welcome, {user.email}. Authentication session verified successfully.</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">Auth Status</span>
              <Shield className="w-5 h-5 text-text-green" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold text-text-light">ACTIVE</span>
              <span className="text-xs text-text-muted">User session active</span>
            </div>
          </div>

          <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">Database Connection</span>
              <Database className="w-5 h-5 text-text-green" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold text-text-light">ONLINE</span>
              <span className="text-xs text-text-muted">InsForge DB connected</span>
            </div>
          </div>

          <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">PostHog Status</span>
              <BarChart2 className="w-5 h-5 text-text-green" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold text-text-green">CONNECTED</span>
              <span className="text-xs text-text-muted">Telemetry online</span>
            </div>
          </div>

          <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">Agent Sweeps</span>
              <Activity className="w-5 h-5 text-accent-orange" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-semibold text-text-light">IDLE</span>
              <span className="text-xs text-text-muted">Scraper queue empty</span>
            </div>
          </div>
        </div>

        {/* Project Setup Prompt Card */}
        <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4 hover:border-border-gold transition-all duration-300">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-lg font-bold text-text-light">Create Your First Game Profile</h3>
            <p className="text-sm text-text-muted">You have no active game designs in this workspace. Set up your first profile variables or upload a draft blueprint to start concept validation sweeps.</p>
          </div>
          <div>
            <InitializeProjectButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
