import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProjectEditorClient } from "./project-editor-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

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

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col gap-3">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 w-fit font-mono text-xs text-text-muted hover:text-text-light transition-colors group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Projects
          </Link>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest">
              GDD Editor
            </span>
            <h1 className="text-2xl font-bold text-text-light font-sans">
              Project Configuration
            </h1>
            <p className="text-sm text-text-muted">
              Define your game design profile, import blueprint documents, and generate pitch assets.
            </p>
          </div>
        </div>

        {/* All interactive content lives in the client component */}
        <ProjectEditorClient projectId={id} />
      </main>

      <Footer />
    </div>
  );
}
