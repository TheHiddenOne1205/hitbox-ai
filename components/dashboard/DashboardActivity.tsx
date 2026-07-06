"use client";

import { MessageSquare, Flame, CheckSquare, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActivityLog {
  id: string;
  type: "insight" | "research" | "project" | "generic";
  message: string;
  timestamp: string;
  link?: string;
}



export function DashboardActivity({ 
  projectId,
  logs = []
}: { 
  projectId?: string;
  logs?: ActivityLog[];
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "insight":
        return <Search className="w-4 h-4 text-accent-gold" />;
      case "research":
        return <Flame className="w-4 h-4 text-accent-orange" />;
      case "project":
        return <CheckSquare className="w-4 h-4 text-text-green" />;
      default:
        return <MessageSquare className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider block mb-1">
            Activity Streams
          </span>
          <h4 className="font-sans text-sm font-semibold text-text-light">
            Recent System Actions & Log Events
          </h4>
        </div>
        {projectId && (
          <Link
            href={`/projects/${projectId}/validate`}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-gold transition-colors font-mono font-medium"
          >
            view workspace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="flex flex-col divide-y divide-border-light">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-muted font-sans">
            No system actions or logs recorded yet. Start by validating a concept!
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 hover:bg-panel-secondary/20 transition-all rounded-lg px-2"
            >
              <div className="w-8 h-8 rounded-md bg-panel-secondary border border-card-border flex items-center justify-center shrink-0">
                {getActivityIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="font-sans text-xs text-text-light leading-relaxed">
                  {log.message}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
