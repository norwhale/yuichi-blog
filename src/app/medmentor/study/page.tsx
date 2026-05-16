"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { subjects } from "@/lib/medmentor/subjects";
import { fadeUp, scaleIn } from "@/lib/medmentor/animations";
import { useLanguage } from "../layout";

export default function StudySelectPage() {
  const { language } = useLanguage();
  const isJa = language === "ja";
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible">
          <motion.h1 custom={0} variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            {isJa ? "科目を選択" : "Choose Your Subject"}
          </motion.h1>
          <motion.p custom={1} variants={fadeUp} className="text-white/40 text-center mb-16 font-mono text-sm">
            {subjects.reduce((acc, s) => acc + s.topics.length, 0)} topics across {subjects.length} subjects
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, i) => (
            <motion.div key={sub.id} custom={i} variants={scaleIn}>
              <div
                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden transition-all duration-500 cursor-pointer hover:bg-white/[0.06]"
                style={{ borderColor: expandedSubject === sub.id ? `${sub.color}40` : undefined }}
                onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{sub.emoji}</span>
                    <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: `${sub.color}15`, color: sub.color }}>
                      {sub.topics.length} {isJa ? "トピック" : "topics"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: sub.color }}>
                    {isJa ? sub.nameJa : sub.nameEn}
                  </h2>
                  <p className="text-sm text-white/30">
                    {isJa ? sub.nameEn : sub.nameJa}
                  </p>
                </div>

                {/* Expanded topics */}
                <AnimatePresence>
                  {expandedSubject === sub.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-2">
                        <div className="border-t border-white/[0.06] pt-4 mb-3" />
                        {sub.topics.map((topic) => (
                          <Link
                            key={topic.id}
                            href={`/medmentor/study/${sub.id}/${topic.id}`}
                            className="block p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
                            style={{ ["--sub-color" as string]: sub.color }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                  {isJa ? topic.nameJa : topic.nameEn}
                                </div>
                                <div className="text-xs text-white/30 mt-0.5">
                                  {isJa ? topic.nameEn : topic.nameJa}
                                </div>
                              </div>
                              <span className="text-white/20 group-hover:text-white/60 transition-colors">→</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
