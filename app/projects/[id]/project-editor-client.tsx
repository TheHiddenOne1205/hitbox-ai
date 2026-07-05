"use client";

import { useState } from "react";
import { Save, Loader2, FlaskConical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { ProfileStatusIndicator } from "@/components/projects/ProfileStatusIndicator";
import { DraftUpload } from "@/components/projects/DraftUpload";
import { ProjectForm, type ProjectFormData } from "@/components/projects/ProjectForm";
import { saveProjectAction, deleteProjectAction } from "@/actions/projects";
import { Project } from "@/types";

type Props = {
  projectId: string;
  initialProject: Project | null;
};

export function ProjectEditorClient({ projectId, initialProject }: Props) {
  const router = useRouter();
  
  // Map DB record properties to ProjectForm state structure
  const getInitialForm = (): ProjectFormData => {
    if (!initialProject) {
      return {
        title: "",
        genre: "",
        artStyle: "",
        platform: [],
        targetAudience: "",
        keywords: [],
        playerLoop: "",
        coreMechanics: [],
        monetization: "",
      };
    }

    return {
      title: initialProject.title || "",
      genre: initialProject.genre || "",
      artStyle: initialProject.art_style || "",
      platform: initialProject.platform
        ? initialProject.platform.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
      targetAudience: initialProject.target_audience || "",
      keywords: initialProject.keywords || [],
      playerLoop: initialProject.gdd_data?.playerLoop || "",
      coreMechanics: initialProject.gdd_data?.coreMechanics || [],
      monetization: initialProject.gdd_data?.monetizationStrategy || "",
    };
  };

  const [formData, setFormData] = useState<ProjectFormData>(getInitialForm());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formVersion, setFormVersion] = useState(0);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to delete this project? This will permanently remove all associated mechanics, validation reports, logs, and files. This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await deleteProjectAction(projectId);
      if (response.success) {
        posthog.capture("project_deleted", { projectId });
        router.push("/projects");
        router.refresh();
      } else {
        setErrorMessage(response.error || "Failed to delete project");
      }
    } catch (err) {
      console.error("[ProjectEditor] Delete error:", err);
      setErrorMessage("An unexpected error occurred while deleting the project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("genre", formData.genre);
      data.append("artStyle", formData.artStyle);
      data.append("targetAudience", formData.targetAudience);
      data.append("platform", formData.platform.join(","));
      data.append("keywords", JSON.stringify(formData.keywords));
      data.append("playerLoop", formData.playerLoop);
      data.append("monetization", formData.monetization);
      data.append("coreMechanics", JSON.stringify(formData.coreMechanics));

      if (selectedFile) {
        data.append("file", selectedFile);
      }

      const response = await saveProjectAction(projectId, data);

      if (response.success && response.id) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // If this is a newly created project, redirect to its actual UUID path
        const isNew = projectId === "1" || projectId === "new";
        if (isNew) {
          router.push(`/projects/${response.id}`);
        } else {
          router.refresh();
        }
      } else {
        setErrorMessage(response.error || "Failed to save project settings");
      }
    } catch (err) {
      console.error("[ProjectEditor] Save error:", err);
      setErrorMessage("An unexpected error occurred while saving the configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  // Call real AI GDD extraction endpoint
  const handleExtract = async (fileOrUrl: File | string) => {
    setIsExtracting(true);
    setErrorMessage(null);

    try {
      const data = new FormData();
      if (typeof fileOrUrl === "string") {
        data.append("url", fileOrUrl);
      } else {
        data.append("file", fileOrUrl);
      }

      const res = await fetch("/api/gdd/extract", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.success && result.data) {
        const extracted = result.data;
        setFormData({
          title: extracted.title || "",
          genre: extracted.genre || "",
          artStyle: extracted.artStyle || "",
          platform: Array.isArray(extracted.platform) ? extracted.platform : [],
          targetAudience: extracted.targetAudience || "",
          keywords: Array.isArray(extracted.keywords) ? extracted.keywords : [],
          playerLoop: extracted.playerLoop || "",
          coreMechanics: Array.isArray(extracted.coreMechanics) ? extracted.coreMechanics : [],
          monetization: extracted.monetization || "",
        });
        setFormVersion((v) => v + 1);

        // Capture PostHog telemetry event
        posthog.capture("draft_extracted", {
          projectId,
          hasFile: typeof fileOrUrl !== "string",
          hasUrl: typeof fileOrUrl === "string",
        });
      } else {
        setErrorMessage(result.error || "Failed to extract game design settings from the draft document.");
      }
    } catch (err) {
      console.error("[ProjectEditor] Extraction error:", err);
      setErrorMessage("An unexpected error occurred during draft document extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const isComplete = initialProject?.is_complete ?? false;
  const currentTitle = formData.title || initialProject?.title || "Unnamed Project";

  return (
    <div className="flex flex-col gap-6">
      {/* Warning Banner */}
      <ProfileStatusIndicator isComplete={isComplete} />

      {/* Draft Upload */}
      <DraftUpload
        initialFileUrl={initialProject?.pitch_deck_url || undefined}
        onExtract={handleExtract}
        onSkip={() => {}}
        onFileSelect={setSelectedFile}
        isExtracting={isExtracting}
      />

      {/* Two-column layout: Form (left) + Sidebar (right) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Main GDD Form */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <ProjectForm
            key={`${projectId}-${formVersion}`}
            initialData={formData}
            onChange={setFormData}
          />
        </div>

        {/* Sidebar: Quick Actions Card */}
        <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-4 sticky top-[88px]">

          {/* Quick Actions Card */}
          <div className="bg-panel border border-card-border rounded-xl p-4 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-3">
            <span className="font-mono text-[10px] text-accent-gold uppercase tracking-widest">
              Quick Links
            </span>
            <Link
              href={`/projects/${projectId}/validate`}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-panel-secondary border border-card-border rounded-md text-text-muted font-sans text-sm hover:border-border-gold hover:text-text-light transition-all group"
            >
              <FlaskConical className="w-4 h-4 text-accent-gold group-hover:scale-110 transition-transform" />
              Validate Concepts
            </Link>

            {projectId !== "new" && projectId !== "1" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2.5 px-3 py-2.5 bg-panel-secondary border border-card-border rounded-md text-pixel-red font-sans text-sm hover:border-pixel-red/50 hover:bg-pixel-red/5 transition-all group disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <Trash2 className="w-4 h-4 text-pixel-red group-hover:scale-110 transition-transform shrink-0" />
                )}
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error display if present */}
      {errorMessage && (
        <div className="bg-pixel-red/10 border border-pixel-red/30 rounded-xl p-4 text-sm text-pixel-red font-mono">
          [ERROR] {errorMessage}
        </div>
      )}

      {/* Save Button — sticky footer feel */}
      <div className="flex items-center justify-between py-4 px-6 bg-panel border border-card-border rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.4)] mt-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-sm font-semibold text-text-light">
            {saveSuccess ? "Configuration Saved!" : "Save Project Configuration"}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {saveSuccess
              ? "Profile updated — Navbar dropdown will reflect changes shortly."
              : "All form fields will be persisted to your InsForge project record."}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          id="save-project-btn"
          className={`flex items-center gap-2.5 px-5 py-2.5 border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none ${
            saveSuccess ? "bg-pixel-green" : "bg-accent-orange"
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}

