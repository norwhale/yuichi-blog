import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design System — Experimental",
  description: "Experimental design system for yuichi.blog, generated with Claude Design.",
  robots: { index: false, follow: false },
};

type PreviewItem = {
  file: string;
  label: string;
  category: string;
};

const previews: PreviewItem[] = [
  // Brand
  { file: "brand-hero.html", label: "Hero", category: "Brand" },
  { file: "brand-monogram.html", label: "YB Monogram", category: "Brand" },
  { file: "brand-imagery.html", label: "Imagery", category: "Brand" },
  { file: "brand-icons.html", label: "Icons", category: "Brand" },
  // Type
  { file: "type-hero.html", label: "Hero Headline", category: "Type" },
  { file: "type-display.html", label: "Display", category: "Type" },
  { file: "type-body.html", label: "Body Prose", category: "Type" },
  { file: "type-mono-metadata.html", label: "Mono Metadata", category: "Type" },
  // Colors
  { file: "colors-neutrals.html", label: "Neutrals", category: "Colors" },
  { file: "colors-accent.html", label: "Accent & Gradient", category: "Colors" },
  { file: "colors-subjects.html", label: "Subject Accents", category: "Colors" },
  // Spacing
  { file: "spacing-scale.html", label: "Spacing Scale", category: "Spacing" },
  { file: "radii.html", label: "Radii", category: "Spacing" },
  { file: "shadows.html", label: "Shadows", category: "Spacing" },
  // Components
  { file: "components-card.html", label: "Article Card", category: "Components" },
  { file: "components-buttons.html", label: "Buttons & Pills", category: "Components" },
  { file: "components-status.html", label: "Status Badges", category: "Components" },
  { file: "components-inputs.html", label: "Form Inputs", category: "Components" },
  { file: "components-glass.html", label: "Glass Cards", category: "Components" },
  { file: "components-navbar.html", label: "Navbar", category: "Components" },
  { file: "components-floating.html", label: "Floating Chrome (BGM + Samantha)", category: "Components" },
];

const categories = Array.from(new Set(previews.map((p) => p.category)));

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em] mb-3">
            Experimental // Design System v1
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            yuichi.blog Design System
          </h1>
          <p className="text-white/50 max-w-2xl leading-relaxed">
            Generated with Claude Design on April 2026. This is a test deployment —
            nothing on this page is active in production. Click any preview to open
            the standalone HTML file.
          </p>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="/design-system/ui_kits/yuichi-blog/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-cyan-400 transition-colors"
            >
              Open Full UI Kit →
            </a>
            <a
              href="/design-system/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm hover:border-cyan-400/30 transition-colors"
            >
              View README.md
            </a>
            <a
              href="/design-system/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm hover:border-cyan-400/30 transition-colors"
            >
              View SKILL.md
            </a>
            <Link
              href="/lab"
              className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm hover:border-cyan-400/30 transition-colors"
            >
              ← Back to Lab
            </Link>
          </div>
        </div>

        {/* Preview grid by category */}
        {categories.map((category) => (
          <section key={category} className="mb-14">
            <h2 className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em] mb-4">
              [{String(categories.indexOf(category) + 1).padStart(2, "0")}] {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previews
                .filter((p) => p.category === category)
                .map((p) => (
                  <a
                    key={p.file}
                    href={`/design-system/preview/${p.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-base font-bold text-white/90 group-hover:text-cyan-400 transition-colors">
                        {p.label}
                      </span>
                      <span className="text-white/30 group-hover:text-cyan-400 transition-colors">→</span>
                    </div>
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
                      {p.file}
                    </div>
                  </a>
                ))}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-white/[0.06] text-xs text-white/30 font-mono">
          <p className="mb-2">Test deployment — not connected to production components.</p>
          <p>Source: Claude Design output ·{" "}
            <a
              href="https://claude.ai/design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-400"
            >
              claude.ai/design
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
