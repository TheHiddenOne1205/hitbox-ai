"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Gamepad, User, LogOut, Loader2 } from "lucide-react";
import { insforge } from "@/lib/insforge-client";
import { signOutAction } from "@/actions/auth";
import posthog from "posthog-js";

type Project = {
  id: string;
  title: string;
  genre: string;
};

export type NavbarUser = {
  id?: string;
  email?: string | null;
  profile?: {
    username?: string | null;
  } | null;
};

type NavbarProps = {
  initialUser?: NavbarUser | null;
};

export function Navbar({ initialUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);
  const [userEmail, setUserEmail] = useState<string | null>(initialUser?.profile?.username || initialUser?.email || null);
  const [loading, setLoading] = useState(!initialUser);

  const [prevUser, setPrevUser] = useState(initialUser);
  if (initialUser !== prevUser) {
    setPrevUser(initialUser);
    setIsLoggedIn(!!initialUser);
    setUserEmail(initialUser?.profile?.username || initialUser?.email || null);
    setLoading(false);
  }

  // Synchronize state with real InsForge authentication & load user projects
  useEffect(() => {
    const syncSessionAndProjects = async () => {
      let activeUser = initialUser;
      
      if (!initialUser) {
        try {
          const { data } = await insforge.auth.getCurrentUser();
          setIsLoggedIn(!!data?.user);
          const profile = data?.user?.profile as Record<string, unknown> | null;
          const username = typeof profile?.username === "string" ? profile.username : null;
          setUserEmail(username || data?.user?.email || null);
          if (data?.user) {
            activeUser = data.user as unknown as NavbarUser;
          }
        } catch (err) {
          console.error("[Navbar] Error checking authentication state:", err);
        } finally {
          setLoading(false);
        }
      }

      // If user is authenticated, retrieve their projects dynamically from the DB
      if (activeUser || isLoggedIn) {
        try {
          const { data, error } = await insforge.database
            .from("projects")
            .select("id, title, genre")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("[Navbar] Error fetching projects from DB:", error);
          } else if (data) {
            const fetched = data as Project[];
            setProjects(fetched);

            // Determine active selected project context based on current path
            const match = pathname.match(/\/projects\/([^\/]+)/);
            const currentId = match ? match[1] : null;

            if (currentId && currentId !== "new" && currentId !== "1") {
              const matched = fetched.find((p) => p.id === currentId);
              if (matched) setSelectedProject(matched);
            } else if (fetched.length > 0) {
              setSelectedProject(fetched[0]);
            }
          }
        } catch (err) {
          console.error("[Navbar] Unexpected error fetching projects:", err);
        }
      }
    };

    syncSessionAndProjects();
  }, [initialUser, isLoggedIn, pathname]);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      posthog.capture("sign_out_clicked");
      setLoading(true);
      try {
        const res = await signOutAction();
        if (res.success) {
          posthog.reset();
          window.location.href = "/";
        }
      } catch (err) {
        console.error("[Navbar] Sign out error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/login");
    }
  };

  const handleProjectSelect = (project: Project) => {
    posthog.capture("project_context_changed", {
      project_id: project.id,
      project_title: project.title,
      genre: project.genre,
    });
    setSelectedProject(project);
    setDropdownOpen(false);

    // Dynamic path-based redirection mapping
    const match = pathname.match(/\/projects\/([^\/]+)(.*)/);
    if (match) {
      const subPath = match[2]; // e.g. "/validate" or empty
      router.push(`/projects/${project.id}${subPath}`);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: isLoggedIn ? "/dashboard" : "/login" },
    { name: "Validate Concepts", href: isLoggedIn ? `/projects/${selectedProject?.id || '1'}/validate` : "/login" },
    { name: "Projects", href: isLoggedIn ? "/projects" : "/login" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[72px] w-full border-b border-card-border bg-background/95 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Left: Logo & Dropdown Selector */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-accent-orange border border-card-border flex items-center justify-center shadow-[2px_2px_0px_var(--color-card-border)] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_var(--color-card-border)] transition-all">
            <Gamepad className="w-5 h-5 text-text-light" />
          </div>
          <span className="font-mono text-2xl font-bold tracking-tight text-text-light group-hover:text-accent-gold transition-colors">
            HITBOX<span className="text-text-green">.AI</span>
          </span>
        </Link>

        {/* RPG Inventory-style Dropdown Selector */}
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-panel-secondary border border-card-border rounded-md hover:border-border-gold transition-all text-left"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider leading-none">
                  Active Context
                </span>
                <span className="font-sans text-sm font-semibold text-text-light">
                  {selectedProject ? selectedProject.title : "Select Project..."}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-text-muted mt-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-panel border border-card-border rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-border-light mb-1 flex justify-between items-center">
                  <span className="font-mono text-xs text-text-muted">Select RPG Inventory Slot</span>
                </div>
                {projects.length === 0 ? (
                  <div className="px-3 py-2.5 text-xs text-text-muted italic">No active projects</div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex flex-col ${
                        selectedProject?.id === project.id
                          ? "bg-panel-active border border-border-light text-text-light"
                          : "hover:bg-panel-secondary text-text-muted hover:text-text-light"
                      }`}
                    >
                      <span className="font-sans text-sm font-bold">{project.title}</span>
                      <span className="font-mono text-[11px] text-accent-gold/80">{project.genre}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>


      {/* Center & Right: Links & Auth State Toggle */}
      <div className="flex items-center gap-8">
        <ul className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <li key={link.name} className="relative py-1">
                <Link
                  href={link.href}
                  className={`font-sans text-[15px] font-medium tracking-wide transition-colors ${
                    isActive ? "text-text-light font-semibold" : "text-text-muted hover:text-text-light"
                  }`}
                >
                  {link.name}
                </Link>
                {isActive && (
                  <span className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-accent-gold rounded-full shadow-[0_0_8px_var(--color-accent-gold)]" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Real Session State Controller */}
        <div className="flex items-center gap-3 pl-4 border-l border-border-light">
          <button
            onClick={handleAuthAction}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs border rounded-md transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] disabled:opacity-50 ${
              isLoggedIn
                ? "bg-panel border-card-border text-text-muted hover:text-pixel-red hover:border-pixel-red"
                : "bg-panel border-card-border text-accent-gold hover:border-border-gold hover:bg-panel-secondary"
            }`}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-gold" />
            ) : isLoggedIn ? (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{userEmail || "Sign Out"}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-accent-gold" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
