"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, scaleIn } from "@/lib/medmentor/animations";
import { subjects } from "@/lib/medmentor/subjects";
import { useLanguage } from "./layout";

export default function MedMentorLanding() {
  const { language } = useLanguage();
  const isJa = language === "ja";

  return (
    <div>
      {/* ═══ Hero ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* BG effects */}
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(6,182,212,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.08) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <motion.div initial="hidden" animate="visible" className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div custom={0} variants={fadeUp} className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em] mb-6">
            AI-Powered Medical Tutor
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
            {isJa ? "AIが導く" : "Your AI"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {isJa ? "医学の学び。" : "Medical Tutor."}
            </span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
            {isJa
              ? "化学、生物学、解剖学、生理学、医学英語をAIチューターと一緒に学ぶ。答えの「なぜ」を理解する。"
              : "Master chemistry, biology, anatomy, physiology, medical English, and more — with an AI tutor that explains the 'why' behind every answer."}
          </motion.p>

          <motion.div custom={3} variants={fadeUp}>
            <Link
              href="/medmentor/study"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-lg"
            >
              {isJa ? "学習を始める" : "Start Learning"} →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🤖", title: isJa ? "AIが問題を生成" : "AI-Powered Questions", desc: isJa ? "暗記ではなく理解を問う問題。あなたのレベルに合わせて生成。" : "Questions that test understanding, not just memorization. Adapted to your level.", color: "cyan" },
              { icon: "💡", title: isJa ? "即座に解説" : "Instant Explanations", desc: isJa ? "すべての回答に明確で詳細な解説。医学的な文脈とのつながりも。" : "Get clear, detailed explanations for every answer — with connections to broader medical concepts.", color: "blue" },
              { icon: "🔄", title: isJa ? "間隔反復学習" : "Spaced Repetition", desc: isJa ? "間違えた問題は自動的に復習キューへ。最適な間隔で復習。" : "Missed questions automatically enter your review queue. Review at optimal intervals.", color: "purple" },
            ].map((feat, i) => (
              <motion.div key={feat.title} custom={i} variants={scaleIn} className="relative group">
                <div className="p-8 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] transition-all duration-500 hover:border-white/20 hover:bg-white/[0.06]">
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <h3 className="text-lg font-bold text-white/90 mb-2">{feat.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Subjects Preview ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.h2 custom={0} variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-center mb-4 tracking-tight">
              {isJa ? `${subjects.length}つの科目` : `${subjects.length} Subjects`}
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-white/40 text-center mb-16 max-w-xl mx-auto">
              {isJa ? "医学準備コースに必要な基礎科目をカバー" : "Covering the foundational subjects for medical preparatory courses"}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub, i) => (
              <motion.div key={sub.id} custom={i} variants={scaleIn}>
                <Link href="/medmentor/study" className="block group">
                  <div className="relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] transition-all duration-500 hover:bg-white/[0.06] overflow-hidden" style={{ borderColor: `${sub.color}15` }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 100%, ${sub.color}10, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{sub.emoji}</div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: sub.color }}>{isJa ? sub.nameJa : sub.nameEn}</h3>
                      <p className="text-xs text-white/30 font-mono">{sub.topics.length} {isJa ? "トピック" : "topics"}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 custom={0} variants={fadeUp} className="text-3xl md:text-4xl font-extrabold mb-4">
            {isJa ? "今すぐ始めよう。" : "Start now."}
          </motion.h2>
          <motion.div custom={1} variants={fadeUp}>
            <Link href="/medmentor/study" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-xl hover:bg-cyan-400 transition-all duration-300">
              {isJa ? "学習を始める" : "Start Learning"} →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/30">
          <span>MedMentor — Built by <Link href="/" className="text-cyan-400/60 hover:text-cyan-400">yuichi.blog</Link></span>
          <span>Powered by Claude Haiku</span>
        </div>
      </footer>
    </div>
  );
}
