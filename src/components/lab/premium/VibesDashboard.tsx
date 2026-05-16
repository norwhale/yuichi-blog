"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SectionNumber from "./SectionNumber";
import CountUpMetric from "./CountUpMetric";

/**
 * "My Vibes Dashboard" — Bogdan-inspired multi-color metric tiles plus an
 * interactive tag row underneath. Clicking a tag highlights it and morphs
 * the visible "mood line" below to a short blurb related to that tag —
 * proving that the tiles aren't just decoration.
 */

const TAGS = [
  { id: "medicine", label: "Medicine", ja: "医学", color: "emerald" as const },
  { id: "ai", label: "AI", ja: "AI", color: "cyan" as const },
  { id: "geo", label: "Geopolitics", ja: "地政学", color: "amber" as const },
  { id: "bulgaria", label: "Bulgaria", ja: "ブルガリア", color: "pink" as const },
  { id: "bci", label: "BCI", ja: "脳科学", color: "blue" as const },
] as const;

const MOOD_LINES: Record<(typeof TAGS)[number]["id"], { en: string; ja: string }> = {
  medicine: {
    en: "30 hours/week studying anatomy, biochem, and chemistry — every late night.",
    ja: "週30時間、解剖・生化学・化学に向き合う夜が続いている。",
  },
  ai: {
    en: "Building MedMentor with Claude as a design partner. Shipping daily.",
    ja: "Claude をデザインパートナーに MedMentor を実装中。毎日デプロイ。",
  },
  geo: {
    en: "Watching the Middle East and the Pacific. OSINT keeps me honest about both.",
    ja: "中東と太平洋を眺めている。OSINT で世界の解像度を上げる。",
  },
  bulgaria: {
    en: "Pleven, a quiet medical town. Plum trees in spring, snow on the rooftops.",
    ja: "プレヴェン、静かな医学都市。春のプラム、屋根の雪。",
  },
  bci: {
    en: "Neural signals, electrode arrays, EEG. The bridge between medicine and machine.",
    ja: "神経信号、電極アレイ、EEG。医学と機械の橋。",
  },
};

const tagColorClass = {
  emerald:
    "border-emerald-400/40 bg-emerald-400/15 text-emerald-100 shadow-emerald-500/20",
  cyan: "border-cyan-400/40 bg-cyan-400/15 text-cyan-100 shadow-cyan-500/20",
  amber: "border-amber-400/40 bg-amber-400/15 text-amber-100 shadow-amber-500/20",
  pink: "border-pink-400/40 bg-pink-400/15 text-pink-100 shadow-pink-500/20",
  blue: "border-sky-400/40 bg-sky-400/15 text-sky-100 shadow-sky-500/20",
};

export default function VibesDashboard() {
  const [activeTag, setActiveTag] =
    useState<(typeof TAGS)[number]["id"]>("ai");
  const active = MOOD_LINES[activeTag];
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative max-w-6xl mx-auto px-6 sm:px-10 py-24 md:py-32">
      <SectionNumber
        number="01"
        eyebrow="Dashboard"
        title="My Vibes Dashboard"
        bilingualTitle="今の自分を計測する5枚のタイル"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        <CountUpMetric
          value={32}
          label="Blog posts"
          bilingualLabel="記事数"
          suffix=""
          accent="cyan"
        />
        <CountUpMetric
          value={4823}
          label="Words / week"
          bilingualLabel="週次文字数"
          accent="emerald"
          delay={0.1}
        />
        <CountUpMetric
          value={27}
          label="Side projects"
          bilingualLabel="副業案件"
          accent="amber"
          delay={0.2}
        />
        <CountUpMetric
          value={4.2}
          label="Hours sleep"
          bilingualLabel="睡眠時間 (今夜の試算)"
          accent="pink"
          delay={0.3}
          format="decimal"
          suffix="h"
        />
        <CountUpMetric
          value={1.8}
          label="Megawatts (PV)"
          bilingualLabel="興味中の解体業者の発電所"
          accent="blue"
          delay={0.4}
          format="decimal"
          suffix="MW"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
        <p className="text-[10px] font-mono tracking-[0.25em] text-cyan-400/60 uppercase mb-4">
          Mood map · クリックでテーマを切替
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((tag) => {
            const isActive = activeTag === tag.id;
            return (
              <motion.button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                whileHover={prefersReduced ? undefined : { y: -2 }}
                whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all ${
                  isActive
                    ? `${tagColorClass[tag.color]} shadow-lg`
                    : "border-white/[0.08] bg-white/[0.02] text-white/45 hover:text-white/70 hover:border-white/20"
                }`}
                aria-pressed={isActive}
              >
                <span className="tracking-wider">#{tag.label}</span>
                <span className="ml-1.5 opacity-60">/ {tag.ja}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-lg sm:text-xl text-white/85 font-light leading-relaxed">
                {active.en}
              </p>
              <p className="mt-2 text-sm text-white/45 leading-relaxed">
                {active.ja}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
