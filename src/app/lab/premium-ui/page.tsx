import type { Metadata } from "next";
import Link from "next/link";
import HeroPanel from "@/components/lab/premium/HeroPanel";
import VibesDashboard from "@/components/lab/premium/VibesDashboard";
import LogbookCarousel from "@/components/lab/premium/LogbookCarousel";
import MicroInteractionsGallery from "@/components/lab/premium/MicroInteractionsGallery";
import NotesPanel from "@/components/lab/premium/NotesPanel";

export const metadata: Metadata = {
  title: "Premium UI Lab · yuichi.blog",
  description:
    "An experimental prototype exploring calm, premium motion patterns for yuichi.blog — inspired by Bogdan @ QClay's finance UI work.",
  openGraph: {
    title: "Premium UI Lab · yuichi.blog",
    description:
      "An experimental prototype exploring calm, premium motion patterns inspired by QClay's finance UI work.",
  },
};

/**
 * /lab/premium-ui — research bench for the next iteration of yuichi.blog's
 * motion language. Inspired by Bogdan (@bogdan_qclay) / QClay finance-UI
 * sensibility, adapted to our dark/cyan tone.
 *
 * Page sections (top to bottom):
 *   1. HeroPanel — title, bilingual sub, rotating badge, marquee strip
 *   2. VibesDashboard — animated count-up tiles + interactive tag mood map
 *   3. LogbookCarousel — drag-snap arc with hover-reveal + modal (centerpiece)
 *   4. MicroInteractionsGallery — small reusable motion patterns
 *   5. NotesPanel — meta reflection + "what graduates to production"
 */
export default function PremiumUiLabPage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Subtle dotted grid background */}
      <div
        aria-hidden
        className="fixed inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Top fade */}
      <div
        aria-hidden
        className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20"
      />

      <header className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-mono tracking-[0.2em] text-white/80 hover:text-white transition-colors"
        >
          yuichi.blog
        </Link>
        <Link
          href="/lab"
          className="group flex items-center gap-2 text-xs font-mono tracking-wider text-white/45 hover:text-cyan-300 transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to /lab
        </Link>
      </header>

      <HeroPanel />
      <VibesDashboard />
      <LogbookCarousel />
      <MicroInteractionsGallery />
      <NotesPanel />

      <footer className="relative z-10 border-t border-white/[0.05] py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/30">
          <span>
            /lab/premium-ui · experimental · inspired by{" "}
            <a
              href="https://x.com/bogdan_qclay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-300 transition-colors"
            >
              @bogdan_qclay
            </a>{" "}
            /{" "}
            <a
              href="https://qclay.design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-300 transition-colors"
            >
              qclay.design
            </a>
          </span>
          <Link
            href="/"
            className="hover:text-white/70 transition-colors"
          >
            ← yuichi.blog
          </Link>
        </div>
      </footer>
    </main>
  );
}
