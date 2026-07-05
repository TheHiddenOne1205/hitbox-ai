"use client";

import { Search } from "lucide-react";

interface InsightFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  selectedBracket: string; // 'all' | 'strong' | 'stable' | 'improving' | 'critical'
  onBracketChange: (bracket: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function InsightFilters({
  searchTerm,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedBracket,
  onBracketChange,
  sortBy,
  onSortChange,
}: InsightFiltersProps) {
  const sources = [
    { value: "all", label: "All Sources" },
    { value: "Reddit", label: "Reddit Only" },
    { value: "Steam Community", label: "Steam Only" },
  ];

  const brackets = [
    { value: "all", label: "All Scores" },
    { value: "strong", label: "Strong (80-100)" },
    { value: "stable", label: "Stable (70-79)" },
    { value: "improving", label: "Improving (50-69)" },
    { value: "critical", label: "Critical (<50)" },
  ];

  const sorts = [
    { value: "viability", label: "Viability Score" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input, Sort Select, and Source Selectors */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter entries by mechanic title..."
              className="w-full bg-panel-secondary border border-card-border rounded-md pl-10 pr-4 py-2 text-text-light placeholder:text-text-muted font-sans text-xs focus:outline-none focus:border-border-gold transition-colors shadow-inner"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider whitespace-nowrap">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-40 bg-panel-secondary border border-card-border rounded-md px-3 py-2 text-text-light font-sans text-xs focus:outline-none focus:border-border-gold transition-colors shadow-inner cursor-pointer"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value} className="bg-panel text-text-light">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Selectors */}
        <div className="flex items-center gap-2 self-start lg:self-auto w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider whitespace-nowrap mr-2">
            Origin:
          </span>
          {sources.map((src) => (
            <button
              key={src.value}
              onClick={() => onSourceChange(src.value)}
              className={`px-3 py-1.5 rounded-md border font-sans text-xs font-semibold transition-all whitespace-nowrap ${
                selectedSource === src.value
                  ? "bg-panel-active border-border-gold text-accent-gold shadow-[0_0_8px_rgba(215,161,92,0.2)]"
                  : "bg-panel-secondary border-card-border text-text-muted hover:border-border-gold hover:text-text-light"
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bracket Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider whitespace-nowrap mr-2">
          Viability:
        </span>
        {brackets.map((br) => (
          <button
            key={br.value}
            onClick={() => onBracketChange(br.value)}
            className={`px-3 py-1.5 rounded-md border font-sans text-xs font-semibold transition-all whitespace-nowrap ${
              selectedBracket === br.value
                ? "bg-panel-active border-border-gold text-accent-gold shadow-[0_0_8px_rgba(215,161,92,0.2)]"
                : "bg-panel-secondary border-card-border text-text-muted hover:border-border-gold hover:text-text-light"
            }`}
          >
            {br.label}
          </button>
        ))}
      </div>
    </div>
  );
}
