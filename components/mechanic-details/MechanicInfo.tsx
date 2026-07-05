"use client";

import Link from "next/link";
import { Mechanic } from "@/types";
import { ChevronLeft, ExternalLink, Calendar, Flame, Tag } from "lucide-react";

interface MechanicInfoProps {
  mechanic: Mechanic;
  projectId: string;
}

export function MechanicInfo({ mechanic, projectId }: MechanicInfoProps) {
  const isReddit = mechanic.source_url.includes("reddit.com");
  const platformLabel = isReddit ? "REDDIT" : "STEAM";
  const platformColor = isReddit ? "#FF4500" : "var(--color-accent-gold)";
  
  return (
    <div className="flex flex-col gap-4">
      {/* Back link */}
      <Link
        href={`/projects/${projectId}/validate`}
        className="flex items-center gap-1.5 w-fit font-mono text-xs text-text-muted hover:text-text-light transition-colors group"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Validation Hub
      </Link>

      {/* Main card */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] hover:border-border-gold transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-1 rounded bg-panel-secondary border border-card-border font-mono text-[10px] font-semibold tracking-wider"
                style={{ color: platformColor }}
              >
                {platformLabel}
              </span>
              <a
                href={mechanic.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-xs text-text-muted hover:text-text-light transition-colors"
              >
                View Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <h1 className="font-sans text-xl md:text-2xl font-bold text-text-light">
              {mechanic.mechanic_name}
            </h1>
            
            <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
              <Tag className="w-3.5 h-3.5 text-accent-gold" />
              <span>Target Genre: {mechanic.target_genre}</span>
            </div>
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border-light pt-4 md:pt-0 md:pl-6 shrink-0">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Engagement</span>
              <div className="flex items-center gap-1.5 font-mono text-base font-semibold text-text-light">
                <Flame className="w-4 h-4 text-accent-orange" />
                <span>{mechanic.community_upvotes}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Found Date</span>
              <div className="flex items-center gap-1.5 font-mono text-base font-semibold text-text-light">
                <Calendar className="w-4 h-4 text-accent-gold" />
                <span>{new Date(mechanic.found_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
