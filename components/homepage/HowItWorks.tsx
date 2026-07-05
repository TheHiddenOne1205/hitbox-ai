import { Layers, Search, MessageSquare, Terminal, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Layers className="w-5 h-5 text-accent-gold" />,
      title: "Define Profile",
      desc: "Set your genre, aesthetic, platforms, and draft parameters inside the design matrix."
    },
    {
      icon: <Search className="w-5 h-5 text-accent-orange" />,
      title: "Scan Concepts",
      desc: "Agent sweeps Steam and Reddit forums via SearXNG queries for organic player discussions."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-text-green" />,
      title: "Evaluate Sentiments",
      desc: "Gemini screens text snippets to map gripes, desires, viability scores, and design gaps."
    },
    {
      icon: <Terminal className="w-5 h-5 text-accent-gold" />,
      title: "Deep Scrape Hubs",
      desc: "Launch Stagehand over Browserbase Cloud proxies to pull specific competitor balance models."
    },
    {
      icon: <Download className="w-5 h-5 text-text-light" />,
      title: "Generate PDF GDD",
      desc: "Generate and download a complete, stakeholder-ready GDD Pitch Deck PDF in one click."
    }
  ];

  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center max-w-xl mx-auto">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">Walkthrough</span>
          <h2 className="font-sans text-3xl font-extrabold text-text-light tracking-tight">
            The Game Design Validation Cycle
          </h2>
          <p className="font-sans text-sm text-text-muted">
            Establish your parameters, run agent scans, analyze findings, and compile documents.
          </p>
        </div>

        {/* Timeline Steps Panel */}
        <div className="bg-panel border border-card-border rounded-xl p-6 md:p-10 shadow-[0px_4px_10px_rgba(0,0,0,0.4)]">
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Connector Line (Desktop Only) */}
            <div className="hidden md:block absolute top-9 left-6 right-6 h-[2px] bg-border-light border-dashed border-t-2 z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center gap-4 text-center z-10 group">
                {/* Step Number Badge */}
                <div className="font-mono text-xs text-accent-gold bg-panel-secondary px-2.5 py-0.5 border border-card-border rounded">
                  STEP 0{idx + 1}
                </div>

                {/* Step Icon */}
                <div className="w-12 h-12 rounded-full bg-background border-2 border-card-border flex items-center justify-center shadow-[0px_2px_6px_rgba(0,0,0,0.5)] group-hover:border-border-gold transition-colors duration-300">
                  {step.icon}
                </div>

                {/* Text Context */}
                <div className="flex flex-col gap-1.5 max-w-[200px]">
                  <h3 className="font-sans text-sm font-bold text-text-light group-hover:text-accent-gold transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
