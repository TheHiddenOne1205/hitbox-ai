"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectFormData = {
  title: string;
  genre: string;
  artStyle: string;
  platform: string[];
  targetAudience: string;
  keywords: string[];
  playerLoop: string;
  coreMechanics: string[];
  monetization: string;
};

type Props = {
  initialData?: Partial<ProjectFormData>;
  onChange?: (data: ProjectFormData) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ART_STYLE_OPTIONS = [
  "Pixel Art",
  "2D Illustrated",
  "3D Low-Poly",
  "3D Realistic",
  "Cel-Shaded",
  "Voxel",
  "Hand-Drawn",
  "Minimalist",
];

const PLATFORM_OPTIONS = [
  { id: "pc", label: "PC" },
  { id: "mac", label: "Mac" },
  { id: "consoles", label: "Consoles" },
  { id: "mobile_ios", label: "iOS Mobile" },
  { id: "mobile_android", label: "Android" },
  { id: "web", label: "Web Browser" },
];

const AUDIENCE_OPTIONS = [
  "Hardcore",
  "Mid-Core",
  "Casual",
  "Strategy Enthusiast",
  "Narrative Focused",
  "Competitive",
  "Family Friendly",
];

const EMPTY_FORM: ProjectFormData = {
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ tag, title, description }: { tag: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-0.5 pb-2 border-b border-border-light">
      <span className="font-mono text-[10px] text-accent-gold uppercase tracking-widest">{tag}</span>
      <h3 className="font-sans text-sm font-semibold text-text-light">{title}</h3>
      {description && <p className="text-xs text-text-muted">{description}</p>}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-mono text-xs text-accent-gold uppercase tracking-wider flex items-center gap-1">
      {children}
      {required && <span className="text-pixel-orange">*</span>}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner disabled:opacity-50"
    />
  );
}

function TextAreaInput({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner resize-none leading-relaxed"
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner appearance-none cursor-pointer"
      style={{ color: value ? undefined : "var(--color-text-muted)" }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o} className="bg-panel text-text-light">
          {o}
        </option>
      ))}
    </select>
  );
}

// Chip tag input for arrays like keywords / coreMechanics
function ChipInput({
  id,
  values,
  onChange,
  placeholder,
}: {
  id: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  };

  const remove = (chip: string) => {
    onChange(values.filter((v) => v !== chip));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Existing chips */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-panel-secondary border border-border-light rounded-md font-sans text-xs text-text-light group"
            >
              {chip}
              <button
                type="button"
                onClick={() => remove(chip)}
                aria-label={`Remove ${chip}`}
                className="text-text-muted hover:text-pixel-red transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + Add button */}
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder || "Type and press Enter or comma..."}
          className="flex-1 bg-panel-secondary border border-card-border rounded-md px-4 py-2.5 text-text-light placeholder:text-text-muted font-sans text-sm focus:outline-none focus:border-border-gold transition-colors shadow-inner"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-panel-secondary border border-card-border rounded-md text-text-muted hover:border-border-gold hover:text-text-light transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-xs">Add</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectForm({ initialData, onChange }: Props) {
  const [form, setForm] = useState<ProjectFormData>({
    ...EMPTY_FORM,
    ...initialData,
  });

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    onChange?.(next);
  };

  const togglePlatform = (id: string) => {
    const next = form.platform.includes(id)
      ? form.platform.filter((p) => p !== id)
      : [...form.platform, id];
    update("platform", next);
  };

  return (
    <div className="bg-panel border border-card-border rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col divide-y divide-border-light">

      {/* ── Section A: Base Metadata ── */}
      <div className="p-6 flex flex-col gap-5">
        <SectionLabel
          tag="Section A"
          title="Base Metadata"
          description="Core identity parameters of your game design prototype."
        />

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Project Title</FieldLabel>
          <TextInput
            id="project-title"
            value={form.title}
            onChange={(v) => update("title", v)}
            placeholder="e.g. Project: Neon Vanguard"
          />
        </div>

        {/* Genre + Art Style row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Genre Baseline Context</FieldLabel>
            <TextInput
              id="project-genre"
              value={form.genre}
              onChange={(v) => update("genre", v)}
              placeholder="e.g. Roguelike Deckbuilder, Tactical RPG"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Art Style Direction</FieldLabel>
            <SelectInput
              id="project-art-style"
              value={form.artStyle}
              onChange={(v) => update("artStyle", v)}
              options={ART_STYLE_OPTIONS}
              placeholder="Select art direction..."
            />
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Target Distribution Platform</FieldLabel>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {PLATFORM_OPTIONS.map(({ id, label }) => {
              const active = form.platform.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  id={`platform-${id}`}
                  onClick={() => togglePlatform(id)}
                  className={`px-3 py-1.5 rounded-md border font-sans text-xs font-semibold transition-all ${
                    active
                      ? "bg-panel-active border-border-gold text-accent-gold shadow-[0_0_8px_rgba(215,161,92,0.2)]"
                      : "bg-panel-secondary border-card-border text-text-muted hover:border-border-gold hover:text-text-light"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Audience */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Target Player Segment</FieldLabel>
          <SelectInput
            id="project-audience"
            value={form.targetAudience}
            onChange={(v) => update("targetAudience", v)}
            options={AUDIENCE_OPTIONS}
            placeholder="Select target audience..."
          />
        </div>
      </div>

      {/* ── Section B: Context Identifiers ── */}
      <div className="p-6 flex flex-col gap-5">
        <SectionLabel
          tag="Section B"
          title="Context Identifiers"
          description="Keyword tags used as refined search parameters when running SearXNG discovery queries."
        />

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Context Keywords</FieldLabel>
          <ChipInput
            id="project-keywords"
            values={form.keywords}
            onChange={(v) => update("keywords", v)}
            placeholder="Add genre tags, gameplay themes... (Enter or comma)"
          />
          <p className="font-mono text-[11px] text-text-muted">
            These tokens are injected directly into SearXNG community queries. Be specific — e.g. &quot;permadeath&quot;, &quot;deckbuilding&quot;, &quot;co-op&quot;.
          </p>
        </div>
      </div>

      {/* ── Section C: Core GDD Data Structure ── */}
      <div className="p-6 flex flex-col gap-5">
        <SectionLabel
          tag="Section C"
          title="Core GDD Data Structure"
          description="The structural design backbone used for AI alignment scoring and PDF generation."
        />

        {/* Player Loop */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Player Loop</FieldLabel>
          <TextAreaInput
            id="project-player-loop"
            value={form.playerLoop}
            onChange={(v) => update("playerLoop", v)}
            placeholder="Describe the core gameplay loop — what does the player do every session? What keeps them engaged? (e.g. 'Build a deck → run a dungeon → unlock new cards → repeat with harder modifiers')"
            rows={4}
          />
        </div>

        {/* Core Mechanics */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Core Mechanics Tags</FieldLabel>
          <ChipInput
            id="project-core-mechanics"
            values={form.coreMechanics}
            onChange={(v) => update("coreMechanics", v)}
            placeholder="e.g. Deckbuilding, Turn-Based Combat, Procedural Generation..."
          />
        </div>

        {/* Monetization */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Monetization Strategy</FieldLabel>
          <TextAreaInput
            id="project-monetization"
            value={form.monetization}
            onChange={(v) => update("monetization", v)}
            placeholder="Describe your revenue model — one-time purchase, free-to-play cosmetics, subscription, etc."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
