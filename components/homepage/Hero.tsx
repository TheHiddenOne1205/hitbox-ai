"use client";

import Link from "next/link";
import { ArrowRight, Play, Flame, Search, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";

type HeroProps = {
  isLoggedIn: boolean;
};

export function Hero({ isLoggedIn }: HeroProps) {
  const targetRoute = isLoggedIn ? "/dashboard" : "/login";

  return (
    <section className="relative w-full py-16 px-6 overflow-hidden flex flex-col items-center">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[350px] h-[350px] rounded-full bg-accent-orange/5 blur-[100px] pointer-events-none" />

      {/* Main Copy */}
      <div className="max-w-[900px] text-center flex flex-col items-center gap-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-panel-secondary border border-card-border shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <Flame className="w-4 h-4 text-accent-orange animate-pulse" />
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">
            Game Validation Agent v1.0
          </span>
        </div>

        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold text-text-light tracking-tight leading-[1.1] max-w-3xl">
          Validate Game Mechanics Before Writing <span className="text-text-green">Code</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
          Hitbox AI sweeps organic community indexes, extracts real player friction points, and evaluates mechanic concepts against your game's design parameters.
        </p>

        {/* Buttons (Retro Styled) */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href={isLoggedIn ? "/projects/1/validate" : "/login"}
            className="group relative px-6 py-3.5 bg-accent-orange border-2 border-card-border text-text-light font-sans font-bold rounded-xl shadow-[0_4px_0_px_var(--color-card-border)] hover:translate-y-[2px] hover:shadow-[0_2px_0_px_var(--color-card-border)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <span>Validate Your Concept</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={targetRoute}
            className="px-6 py-3.5 bg-retro-beige border border-card-border text-text-dark font-sans font-bold rounded-full hover:bg-retro-beige/90 transition-all flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
          >
            <span>Start For Free</span>
            <Play className="w-4 h-4 fill-text-dark text-text-dark" />
          </Link>
        </div>
      </div>

      {/* Styled CSS Dashboard Mockup (WOW Factor) */}
      <div className="w-full max-w-[1100px] mt-16 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-panel border border-card-border rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Mockup Header/Controls */}
          <div className="bg-panel-secondary border-b border-card-border px-5 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pixel-red opacity-80" />
              <span className="w-3 h-3 rounded-full bg-pixel-yellow opacity-80" />
              <span className="w-3 h-3 rounded-full bg-pixel-green opacity-80" />
              <span className="font-mono text-xs text-text-muted ml-4 select-none">
                hitbox-agent-fleet://console/project-1
              </span>
            </div>
            <div className="font-mono text-xs text-accent-gold bg-background border border-card-border rounded px-2.5 py-1">
              STATUS: AGENT READY
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-background/50">
            {/* Left Column: Stat Widgets & Quick Search */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Active Context Card */}
              <div className="bg-panel border border-card-border p-4 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-border-light pb-2">
                  <span className="font-mono text-xs text-accent-gold">PROJECT SCOPE</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-panel-active text-text-green border border-border-light">
                    ACTIVE
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-text-light">Neon Vanguard</span>
                  <span className="font-mono text-xs text-text-muted mt-1">
                    Genre: <span className="text-accent-gold">Roguelike Deckbuilder</span>
                  </span>
                  <span className="font-mono text-xs text-text-muted">
                    Platform: <span className="text-accent-gold">PC (Steam)</span>
                  </span>
                </div>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-panel border border-card-border p-4 rounded-xl flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase">Insights Found</span>
                  <span className="font-mono text-2xl font-bold text-text-light">42</span>
                </div>
                <div className="bg-panel border border-card-border p-4 rounded-xl flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase">Avg. Viability</span>
                  <span className="font-mono text-2xl font-bold text-pixel-green">84%</span>
                </div>
                <div className="bg-panel border border-card-border p-4 rounded-xl flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase">Scrapers Run</span>
                  <span className="font-mono text-2xl font-bold text-accent-gold">5</span>
                </div>
                <div className="bg-panel border border-card-border p-4 rounded-xl flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-muted uppercase">Target Platforms</span>
                  <span className="font-mono text-2xl font-bold text-text-green">2</span>
                </div>
              </div>
            </div>

            {/* Right Columns: Insights Table */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-panel border border-card-border rounded-xl p-5 flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center border-b border-border-light pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-accent-gold" />
                    <span className="font-mono text-sm text-text-light font-bold">Discovered Community Footprints</span>
                  </div>
                  <span className="font-mono text-xs text-text-muted">Filtered by Active Project Context</span>
                </div>

                {/* Table Mockup */}
                <div className="flex flex-col w-full text-left">
                  {/* Headers */}
                  <div className="grid grid-cols-12 pb-2 border-b border-card-border font-mono text-[11px] text-accent-gold font-bold">
                    <div className="col-span-2">ORIGIN</div>
                    <div className="col-span-5">MECHANIC TOPIC</div>
                    <div className="col-span-3 text-center">VIABILITY</div>
                    <div className="col-span-2 text-right">ENGAGEMENT</div>
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col divide-y divide-border-light">
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 py-3 items-center text-xs hover:bg-panel-secondary/50 px-1 rounded transition-colors group">
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-panel-secondary text-[#FF4500] font-bold border border-card-border">
                          Reddit
                        </span>
                      </div>
                      <div className="col-span-5 font-sans font-medium text-text-light group-hover:text-accent-gold transition-colors">
                        Synergy Deckbuilder Card Burns
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <span className="px-2.5 py-0.5 rounded font-mono text-[11px] bg-pixel-green/10 text-pixel-green font-bold border border-pixel-green/30">
                          82% (Strong)
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-text-muted">4.2k upvotes</div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-12 py-3 items-center text-xs hover:bg-panel-secondary/50 px-1 rounded transition-colors group">
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-panel-secondary text-[#FF4500] font-bold border border-card-border">
                          Reddit
                        </span>
                      </div>
                      <div className="col-span-5 font-sans font-medium text-text-light group-hover:text-accent-gold transition-colors">
                        Rogue Dodge-Roll Framerate Lock
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <span className="px-2.5 py-0.5 rounded font-mono text-[11px] bg-pixel-yellow/10 text-pixel-yellow font-bold border border-pixel-yellow/30">
                          74% (Stable)
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-text-muted">1.8k upvotes</div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-12 py-3 items-center text-xs hover:bg-panel-secondary/50 px-1 rounded transition-colors group">
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-panel-secondary text-accent-gold font-bold border border-card-border">
                          Steam
                        </span>
                      </div>
                      <div className="col-span-5 font-sans font-medium text-text-light group-hover:text-accent-gold transition-colors">
                        Permadeath Progress Wipe Penalty
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <span className="px-2.5 py-0.5 rounded font-mono text-[11px] bg-pixel-red/10 text-pixel-red font-bold border border-pixel-red/30">
                          48% (Critical)
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-text-muted">982 reviews</div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Breakdown Spark */}
                <div className="mt-2 p-3 bg-panel-secondary border border-card-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-pixel-yellow" />
                    <span className="font-sans text-xs text-text-muted">
                      <strong className="text-text-light font-semibold">Friction Detected:</strong> Players frequently report deck clutter when using excessive synergy triggers.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-text-green font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>REC: CULL MECHANIC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
