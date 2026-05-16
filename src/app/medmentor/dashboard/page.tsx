"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProgress, getSubjectStats } from "@/lib/medmentor/storage";
import { subjects } from "@/lib/medmentor/subjects";
import { fadeUp, scaleIn } from "@/lib/medmentor/animations";
import type { UserProgress } from "@/lib/medmentor/types";
import { useLanguage } from "../layout";

export default function DashboardPage() {
  const { language } = useLanguage();
  const isJa = language === "ja";
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  const { stats } = progress;
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible">
          <motion.h1 custom={0} variants={fadeUp} className="text-4xl font-extrabold tracking-tight mb-12">
            {isJa ? "学習ダッシュボード" : "Learning Dashboard"}
          </motion.h1>
        </motion.div>

        {stats.totalQuestions === 0 ? (
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-center py-20">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-white/40 mb-6">
              {isJa ? "まだ学習データがありません。学習を始めましょう！" : "No study data yet. Start learning!"}
            </p>
            <Link href="/medmentor/study" className="inline-flex px-6 py-3 bg-cyan-500 text-black font-medium rounded-xl">
              {isJa ? "学習を始める" : "Start Learning"}
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { label: isJa ? "総問題数" : "Total Questions", value: stats.totalQuestions, color: "#06B6D4" },
                { label: isJa ? "正答率" : "Accuracy", value: `${accuracy}%`, color: "#22C55E" },
                { label: isJa ? "連続学習日数" : "Day Streak", value: stats.currentStreak, color: "#EAB308" },
                { label: isJa ? "復習予定" : "To Review", value: progress.reviewQueue.length, color: "#A855F7" },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={scaleIn}
                  className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08]">
                  <div className="text-3xl font-extrabold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-white/40 font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Subject Breakdown */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold mb-6">
                {isJa ? "科目別成績" : "Subject Breakdown"}
              </motion.h2>
              <div className="space-y-4">
                {subjects.map((sub, i) => {
                  const subStats = getSubjectStats(sub.id);
                  return (
                    <motion.div key={sub.id} custom={i} variants={fadeUp}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{sub.emoji}</span>
                          <span className="font-medium text-sm" style={{ color: sub.color }}>
                            {isJa ? sub.nameJa : sub.nameEn}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-white/40">
                          {subStats.total > 0 ? `${subStats.accuracy}% (${subStats.correct}/${subStats.total})` : "—"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${subStats.accuracy}%`, background: sub.color }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Sessions */}
            {progress.sessions.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
                <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold mb-6">
                  {isJa ? "最近のセッション" : "Recent Sessions"}
                </motion.h2>
                <div className="space-y-3">
                  {progress.sessions.slice(-10).reverse().map((session, i) => {
                    const correct = session.questions.filter((q) => q.isCorrect).length;
                    return (
                      <motion.div key={session.id} custom={i} variants={fadeUp}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white/80">{session.subject} / {session.topic}</div>
                          <div className="text-xs text-white/30 font-mono mt-0.5">
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm font-mono" style={{ color: correct === session.questions.length ? "#22C55E" : "#EAB308" }}>
                          {correct}/{session.questions.length}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
