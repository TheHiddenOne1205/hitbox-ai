"use client";

import { useState } from "react";
import { Save, Loader2, ChevronLeft, FlaskConical } from "lucide-react";
import Link from "next/link";
import { ProfileStatusIndicator } from "@/components/projects/ProfileStatusIndicator";
import { DraftUpload } from "@/components/projects/DraftUpload";
import { ProjectForm, type ProjectFormData } from "@/components/projects/ProjectForm";
import { GDDPreview } from "@/components/projects/GDDPreview";

// ─── Mock data — will be replaced by real DB fetch in Phase 06 ──────────────
const MOCK_PROJECT = {
  id: "1",
  title: "Neon Vanguard",
  is_complete: false,
  pitch_deck_url: null as string | null,
};

type Props = {
  projectId: string;
};

// ─── Client Section (form state management) ───────────────────────────────────

export function ProjectEditorClient({ projectId }: Props) {
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate save (will wire to actions/projects.ts in Phase 06)
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Simulate extract (will wire to /api/gdd/extract in Phase 07)
  const handleExtract = async (_file: File) => {
    setIsExtracting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsExtracting(false);
  };

  // Simulate PDF generation (will wire to /api/gdd/generate in Phase 08)
  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Warning Banner */}
      <ProfileStatusIndicator isComplete={MOCK_PROJECT.is_complete} />

      {/* Draft Upload */}
      <DraftUpload
        onExtract={handleExtract}
        onSkip={() => {}}
        isExtracting={isExtracting}
      />

      {/* Two-column layout: Form (left) + Sidebar (right) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Main GDD Form */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <ProjectForm
            initialData={{
              title: MOCK_PROJECT.title,
            }}
            onChange={setFormData}
          />
        </div>

        {/* Sidebar: GDD Preview Card */}
        <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-4 sticky top-[88px]">
          <GDDPreview
            projectTitle={formData?.title || MOCK_PROJECT.title}
            hasPitchDeckUrl={!!MOCK_PROJECT.pitch_deck_url}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

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
          </div>
        </div>
      </div>

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
