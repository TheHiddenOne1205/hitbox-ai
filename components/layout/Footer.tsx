import Link from "next/link";
import { Gamepad } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-card-border bg-panel py-10 px-6 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-orange border border-card-border flex items-center justify-center shadow-[1px_1px_0px_var(--color-card-border)]">
              <Gamepad className="w-3.5 h-3.5 text-text-light" />
            </div>
            <span className="font-mono text-lg font-bold text-text-light">
              HITBOX<span className="text-text-green">.AI</span>
            </span>
          </div>
          <p className="font-sans text-xs text-text-muted text-center md:text-left max-w-sm">
            AI-powered game design evaluation suite and player sentiment discovery assistant.
          </p>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-6 font-mono text-xs text-text-muted">
          <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <Link href="/dashboard" className="hover:text-accent-gold transition-colors">Dashboard</Link>
          <Link href="/projects" className="hover:text-accent-gold transition-colors">Projects</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">Docs</a>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end gap-1 font-mono text-[11px] text-text-muted">
          <span>v1.0.0-PROTOTYPE</span>
          <span>© {new Date().getFullYear()} HITBOX AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
