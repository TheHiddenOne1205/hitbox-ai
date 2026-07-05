import { Globe, Cpu, FileText, CheckCircle2 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-accent-orange" />,
      title: "Forum Discovery & Scraping",
      description: "Crawl target competitor hubs (like Steam community review forms or Reddit subreddits) via SearXNG queries, capturing raw player discussions and reviews without any API limits.",
      bullets: [
        "Index Steam and Reddit hubs",
        "Stealth proxies & auto-CAPTCHA solving",
        "Manual triggers (no scheduled runs)"
      ]
    },
    {
      icon: <Cpu className="w-6 h-6 text-text-green" />,
      title: "Objective AI Matching & Scoring",
      description: "Gemini evaluates discovered threads against your active game design profiles. Get a 0-100 viability score, qualitative reasons, structural pitfalls, and aligned features.",
      bullets: [
        "Powered by gemini-2.5-flash",
        "Clear 0-100 viability brackets",
        "Synthesizes design actions & pitfalls"
      ]
    },
    {
      icon: <FileText className="w-6 h-6 text-accent-gold" />,
      title: "AI GDD Draft Extraction",
      description: "Upload a draft game design outline file. Gemini extracts parameters to auto-populate your database design profile in seconds.",
      bullets: [
        "Draft blueprint drag-and-drop uploads",
        "GDD Parameter auto-populating",
        "Supports PDF, TXT, and Markdown files"
      ]
    }
  ];

  return (
    <section className="w-full py-16 px-6 bg-panel/30 border-y border-card-border">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 text-center md:text-left max-w-2xl">
          <span className="font-mono text-xs text-accent-gold uppercase tracking-wider">Features Suite</span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-text-light tracking-tight">
            Designed for Modern Technical Designers
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-muted leading-relaxed">
            Everything you need to eliminate manual market research loops, discover player requirements early, and secure funding.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-panel border border-card-border rounded-xl p-6 flex flex-col gap-6 shadow-[0px_4px_10px_rgba(0,0,0,0.4)] hover:border-border-gold transition-all duration-300 group"
            >
              {/* Feature Icon Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-panel-secondary border border-card-border flex items-center justify-center shadow-[2px_2px_0px_var(--color-card-border)] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_var(--color-card-border)] transition-all">
                  {feat.icon}
                </div>
                <span className="font-mono text-sm text-text-muted">SLOT_0{index + 1}</span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-lg font-bold text-text-light group-hover:text-accent-gold transition-colors">
                  {feat.title}
                </h3>
                <p className="font-sans text-sm text-text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {/* Technical Bullets */}
              <div className="border-t border-border-light pt-4 mt-auto">
                <ul className="flex flex-col gap-2">
                  {feat.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-mono text-text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-text-green shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
