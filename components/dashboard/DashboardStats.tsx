"use client";

import { Shield, Sparkles, AlertTriangle, Activity } from "lucide-react";

interface DashboardStatsProps {
  totalInsights?: number;
  avgViability?: number;
  competitorsResearched?: number;
  validationsThisWeek?: number;
}

export function DashboardStats({
  totalInsights = 128,
  avgViability = 74,
  competitorsResearched = 8,
  validationsThisWeek = 12,
}: DashboardStatsProps) {
  // Determine viability score color scale class
  const getViabilityColorClass = (score: number) => {
    if (score >= 80) return "text-pixel-green";
    if (score >= 70) return "text-pixel-yellow";
    if (score >= 50) return "text-pixel-orange";
    return "text-pixel-red";
  };

  const stats = [
    {
      label: "Total Insights Found",
      value: totalInsights,
      icon: Sparkles,
      iconColor: "text-accent-gold",
      desc: "Community discussions mapped",
    },
    {
      label: "Avg. Concept Viability",
      value: `${avgViability}%`,
      icon: Shield,
      iconColor: getViabilityColorClass(avgViability),
      desc: "Overall viability score index",
      valueClass: getViabilityColorClass(avgViability),
    },
    {
      label: "Competitors Researched",
      value: competitorsResearched,
      icon: Activity,
      iconColor: "text-accent-orange",
      desc: "Deep scraper loops completed",
    },
    {
      label: "Validations This Week",
      value: validationsThisWeek,
      icon: AlertTriangle,
      iconColor: "text-text-green",
      desc: "Active discovery passes run",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4 hover:border-border-gold transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] text-accent-gold uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-mono text-3xl font-semibold text-text-light ${
                  stat.valueClass || ""
                }`}
              >
                {stat.value}
              </span>
              <span className="text-xs text-text-muted">{stat.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
