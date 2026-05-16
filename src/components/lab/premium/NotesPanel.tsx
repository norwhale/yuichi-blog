"use client";

import { motion } from "framer-motion";
import SectionNumber from "./SectionNumber";

/**
 * The "Notes" panel — a meta section where I record what I learned from
 * building this lab and which patterns I want to graduate to the real
 * blog. Kept in a notebook-style two-column layout.
 */

const NOTES: { id: string; tag: string; en: string; ja: string }[] = [
  {
    id: "n1",
    tag: "✦ TYPOGRAPHY",
    en: "QClay's confidence comes from ultra-light weights at large sizes. Make headlines breathe — never bold the hero.",
    ja: "QClay の説得力は『大きいのに細い』タイポにある。Hero を bold にしないだけで品が出る。",
  },
  {
    id: "n2",
    tag: "✦ COLOR",
    en: "Bogdan's finance cards rely on color identity per card (blue/green/amber). Apply this to logbook tags.",
    ja: "Bogdan の finance card は1枚ごとに色性格を持たせている。logbook の tag に同じ手を入れる。",
  },
  {
    id: "n3",
    tag: "✦ MOTION",
    en: "Spring stiffness 240, damping 28, mass 0.7 feels like luxury furniture — heavy but precise.",
    ja: "spring (stiffness 240, damping 28, mass 0.7) は『重いが正確』な家具のような感触。これを定数化する。",
  },
  {
    id: "n4",
    tag: "✦ PERSPECTIVE",
    en: "Carousel perspective:1400px + per-slide rotateY:±10° gives depth without dizziness.",
    ja: "perspective:1400px と rotateY:±10° の組み合わせは『酔わない奥行き』を生む。",
  },
  {
    id: "n5",
    tag: "✦ RESTRAINT",
    en: "Most slots should NOT animate. Reserve motion for moments that reward attention.",
    ja: "ほとんどの場所は動かさない。動きは『注意を払う価値がある瞬間』にだけ使う。",
  },
  {
    id: "n6",
    tag: "✦ NEXT",
    en: "Graduate: marquee → home page footer, count-up tiles → /dashboard, carousel → /blog index.",
    ja: "本番化候補: marquee → footer、count-up → /dashboard、carousel → /blog 一覧。",
  },
];

export default function NotesPanel() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 sm:px-10 py-24 md:py-32 border-t border-white/[0.05]">
      <SectionNumber
        number="04"
        eyebrow="Reflection"
        title="Notes from the bench"
        bilingualTitle="この実験で学んだこと、本番に持っていくもの"
      />

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
        {NOTES.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/60 mb-3">
              {note.tag}
            </p>
            <p className="text-base text-white/85 leading-relaxed font-light">
              {note.en}
            </p>
            <p className="mt-2 text-sm text-white/45 leading-relaxed">
              {note.ja}
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-white/[0.1] via-white/[0.04] to-transparent group-hover:from-cyan-400/30 transition-colors duration-700" />
          </motion.div>
        ))}
      </div>

      <div className="mt-20 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-8">
        <p className="font-mono text-[10px] tracking-[0.3em] text-amber-300/70 mb-3">
          ✦ EXPERIMENTAL PROTOTYPE
        </p>
        <p className="text-sm text-white/55 leading-relaxed max-w-2xl">
          このページは本番ブログのスタイルガイドではなく、移植元の実験ラボです。
          動きや色は yuichi.blog
          全体に反映される前に、ここで違和感を消すまで叩きます。
          <span className="block mt-2 text-white/30">
            This is a bench, not a spec. Patterns graduate to the main site
            only after they survive iteration here.
          </span>
        </p>
      </div>
    </section>
  );
}
