"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, TrendingUp, BarChart2 } from "lucide-react";

type TrendItem = {
  day: string;
  insights: number;
};

type DistributionItem = {
  range: string;
  count: number;
  fill: string;
};

type LoopItem = {
  name: string;
  loops: number;
};

interface DashboardChartsProps {
  trendData?: TrendItem[];
  distributionData?: DistributionItem[];
  loopData?: LoopItem[];
}

export function DashboardCharts({
  trendData = [],
  distributionData = [],
  loopData = [],
}: DashboardChartsProps) {
  // Determine if we have actual data to render in the charts
  const hasInsightsTrend = trendData.some((d) => d.insights > 0);
  const hasDistribution = distributionData.some((d) => d.count > 0);
  const hasScraperActivity = loopData.some((d) => d.loops > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart: Insights Mapped Over Time */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4 min-h-[360px]">
        <div>
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider block mb-1">
            Insights Mapped Over Time
          </span>
          <h4 className="font-sans text-sm font-semibold text-text-light">
            Cumulative Discovery Trend (30 Days)
          </h4>
        </div>
        
        <div className="flex-1 w-full flex items-center justify-center">
          {!hasInsightsTrend ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 p-4">
              <div className="w-12 h-12 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-text-muted">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs text-text-light font-bold">No Trend Data Found</span>
                <p className="text-[11px] text-text-muted max-w-[200px]">
                  Validate gameplay concepts to view chronological discovery graphs.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-light)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-panel-secondary)",
                      borderColor: "var(--color-card-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ fontFamily: "var(--font-mono)", color: "var(--color-accent-gold)" }}
                    itemStyle={{ color: "var(--color-text-light)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="insights"
                    stroke="var(--color-accent-gold)"
                    strokeWidth={2}
                    dot={{ stroke: "var(--color-card-border)", strokeWidth: 1, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart: Viability Score Distribution */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4 min-h-[360px]">
        <div>
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider block mb-1">
            Viability Score Distribution
          </span>
          <h4 className="font-sans text-sm font-semibold text-text-light">
            Mapped Concepts by Viability Bracket
          </h4>
        </div>

        <div className="flex-1 w-full flex items-center justify-center">
          {!hasDistribution ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 p-4">
              <div className="w-12 h-12 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-text-muted">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs text-text-light font-bold">No Viability Metrics</span>
                <p className="text-[11px] text-text-muted max-w-[200px]">
                  Scored insights will generate brackets automatically on this HUD panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-light)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="range"
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-panel-secondary)",
                      borderColor: "var(--color-card-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ fontFamily: "var(--font-mono)", color: "var(--color-accent-gold)" }}
                    itemStyle={{ color: "var(--color-text-light)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart: Competitor Scrapers loops run */}
      <div className="bg-panel border border-card-border rounded-xl p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] flex flex-col gap-4 min-h-[360px]">
        <div>
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider block mb-1">
            Research Activity
          </span>
          <h4 className="font-sans text-sm font-semibold text-text-light">
            Scraper Sessions Run (7 Days)
          </h4>
        </div>

        <div className="flex-1 w-full flex items-center justify-center">
          {!hasScraperActivity ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 p-4">
              <div className="w-12 h-12 rounded-lg bg-panel-secondary border border-card-border flex items-center justify-center text-text-muted">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs text-text-light font-bold">No Scraper Runs</span>
                <p className="text-[11px] text-text-muted max-w-[200px]">
                  Researching competitor products initiates cloud crawling event metrics.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loopData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border-light)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-panel-secondary)",
                      borderColor: "var(--color-card-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ fontFamily: "var(--font-mono)", color: "var(--color-accent-gold)" }}
                    itemStyle={{ color: "var(--color-text-light)" }}
                  />
                  <Bar dataKey="loops" fill="var(--color-accent-orange)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
