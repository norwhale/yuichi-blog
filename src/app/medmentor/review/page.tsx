"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProgress, removeFromReviewQueue } from "@/lib/medmentor/storage";
import { getSubject } from "@/lib/medmentor/subjects";
import { fadeUp } from "@/lib/medmentor/animations";
import type { ReviewItem } from "@/lib/medmentor/types";
import { useLanguage } from "../layout";

export default function ReviewPage() {
  const { language } = useLanguage();
  const isJa = language === "ja";
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const progress = getProgress();
    setReviewItems(progress.reviewQueue);
  }, []);

  const handleRemove = (questionId: string) => {
    removeFromReviewQueue(questionId);
    setReviewItems((prev) => prev.filter((r) => r.questionId !== questionId));
  };

  // Group by subject
  const grouped = reviewItems.reduce<Record<string, ReviewItem[]>>((acc, item) => {
    if (!acc[item.subject]) acc[item.subject] = [];
    acc[item.subject].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible">
          <motion.h1 custom={0} variants={fadeUp} className="text-4xl font-extrabold tracking-tight mb-4">
            {isJa ? "復習キュー" : "Review Queue"}
          </motion.h1>
          <motion.p custom={1} variants={fadeUp} className="text-white/40 font-mono text-sm mb-12">
            {reviewItems.length} {isJa ? "問の復習が必要です" : "items to review"}
          </motion.p>
        </motion.div>

        {reviewItems.length === 0 ? (
          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-center py-20">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-white/40 mb-6">
              {isJa ? "復習する問題はありません。よくできました！" : "No items to review. Great job!"}
            </p>
            <Link href="/medmentor/study" className="inline-flex px-6 py-3 bg-cyan-500 text-black font-medium rounded-xl">
              {isJa ? "学習を続ける" : "Continue Studying"}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([subjectId, items], gi) => {
              const sub = getSubject(subjectId);
              return (
                <motion.div
                  key={subjectId}
                  custom={gi}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{sub?.emoji || "📝"}</span>
                    <h2 className="text-lg font-bold" style={{ color: sub?.color || "#fff" }}>
                      {isJa ? sub?.nameJa : sub?.nameEn || subjectId}
                    </h2>
                    <span className="text-xs font-mono text-white/30 ml-2">{items.length} items</span>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.questionId} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-sm text-white/80 mb-3 leading-relaxed">{item.question}</p>
                        <div className="flex gap-4 text-xs mb-3">
                          <div>
                            <span className="text-white/30">{isJa ? "あなたの回答" : "Your answer"}: </span>
                            <span className="text-red-400">{item.userAnswer}</span>
                          </div>
                          <div>
                            <span className="text-white/30">{isJa ? "正解" : "Correct"}: </span>
                            <span className="text-green-400">{item.correctAnswer}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/medmentor/study/${item.subject}/${item.topic}`}
                            className="text-xs px-3 py-1.5 rounded-lg text-black font-medium"
                            style={{ background: sub?.color || "#06B6D4" }}
                          >
                            {isJa ? "もう一度" : "Study Again"}
                          </Link>
                          <button
                            onClick={() => handleRemove(item.questionId)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/40 hover:text-white/80 transition-colors"
                          >
                            {isJa ? "削除" : "Remove"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
