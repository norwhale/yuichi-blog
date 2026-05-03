"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildMentorPrompt,
  chooseMentorRecommendation,
  getMentorLens,
  localize,
  mentorLenses,
  type MentorLensId,
} from "@/lib/medmentor/mentorPlan";
import type { AnsweredQuestion, Language } from "@/lib/medmentor/types";

type MentorModePanelProps = {
  questions: AnsweredQuestion[];
  language: Language;
  subjectColor: string;
};

function getLabel(language: Language, en: string, ja: string) {
  if (language === "ja") return ja;
  if (language === "en") return en;
  return `${ja} / ${en}`;
}

export default function MentorModePanel({
  questions,
  language,
  subjectColor,
}: MentorModePanelProps) {
  const recommendation = useMemo(
    () => chooseMentorRecommendation(questions),
    [questions],
  );
  const [selectedLens, setSelectedLens] = useState<MentorLensId>(recommendation.lensId);
  const [copied, setCopied] = useState(false);

  const selected = getMentorLens(selectedLens);
  const prompt = buildMentorPrompt({
    recommendation: {
      ...recommendation,
      lensId: selectedLens,
      promptHint: selected.promptHint,
    },
    questions,
    language,
  });

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-left backdrop-blur-2xl"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
            Autonomous Mentor Plan
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white">
            {localize(language, recommendation.title)}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
            {localize(language, recommendation.rationale)}
          </p>
        </div>
        <div
          className="shrink-0 rounded-2xl border px-4 py-3 text-center"
          style={{ borderColor: `${subjectColor}33`, background: `${subjectColor}12` }}
        >
          <div className="text-3xl">{selected.icon}</div>
          <div className="mt-1 text-xs font-semibold" style={{ color: subjectColor }}>
            {localize(language, selected.title)}
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
        <div className="mb-1 text-xs font-mono uppercase tracking-[0.18em] text-white/35">
          {getLabel(language, "Recommended next action", "おすすめの次アクション")}
        </div>
        <p className="text-sm font-medium leading-relaxed text-white/80">
          {localize(language, recommendation.nextAction)}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mentorLenses.map((lens) => {
          const active = lens.id === selectedLens;
          return (
            <button
              key={lens.id}
              type="button"
              onClick={() => setSelectedLens(lens.id)}
              className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                active
                  ? "border-cyan-300/40 bg-cyan-300/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.05]"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{lens.icon}</span>
                <span className="text-sm font-semibold text-white/85">
                  {localize(language, lens.title)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/42">
                {localize(language, lens.description)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              {getLabel(language, "Mentor prompt", "メンタープロンプト")}
            </div>
            <p className="mt-1 text-xs text-white/35">
              {getLabel(
                language,
                "Use this to let the AI decide the next teaching move from your actual answers.",
                "実際の回答履歴から、AIに次の教え方を判断させるための指示です。",
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
          >
            {copied
              ? getLabel(language, "Copied", "コピー済み")
              : getLabel(language, "Copy", "コピー")}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.pre
            key={selectedLens}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs leading-relaxed text-white/55"
          >
            {prompt}
          </motion.pre>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
