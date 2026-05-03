"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ExplanationFollowUp from "@/components/medmentor/ExplanationFollowUp";
import MentorModePanel from "@/components/medmentor/MentorModePanel";
import RichMarkdown from "@/components/medmentor/RichMarkdown";
import { buildFallbackExplanation, getFallbackQuestion } from "@/lib/medmentor/fallback";
import { tSingle } from "@/lib/medmentor/i18n";
import { getTopic } from "@/lib/medmentor/subjects";
import { addSession, addToReviewQueue } from "@/lib/medmentor/storage";
import type { GeneratedQuestion, AnsweredQuestion, QuestionType } from "@/lib/medmentor/types";
import { useLanguage } from "../../../layout";

const QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "true_false",
  "multiple_choice",
  "fill_blank",
  "multiple_choice",
];
const TOTAL_QUESTIONS = 5;

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function humanizeServiceIssue(reason: string) {
  const lowered = reason.toLowerCase();

  if (lowered.includes("429") || lowered.includes("rate_limit")) {
    return "Anthropic is busy right now.";
  }

  if (lowered.includes("failed to fetch") || lowered.includes("network")) {
    return "The browser could not reach the MedMentor API.";
  }

  if (lowered.includes("503")) {
    return "The MedMentor API is temporarily unavailable.";
  }

  if (lowered.includes("api key") || lowered.includes("authentication")) {
    return "Anthropic authentication is not available right now.";
  }

  return "AI generation is temporarily unavailable.";
}

function buildFallbackQuestionMessage(reason: string) {
  return `${humanizeServiceIssue(reason)} MedMentor switched to a built-in backup question so you can keep studying.`;
}

export default function StudySessionClient({
  subjectId,
  topicId,
}: {
  subjectId: string;
  topicId: string;
}) {
  const { language } = useLanguage();
  const data = useMemo(() => getTopic(subjectId, topicId), [subjectId, topicId]);

  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState("");
  const [explanationNote, setExplanationNote] = useState("");
  const [explanationSource, setExplanationSource] = useState<"ai" | "fallback" | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<AnsweredQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  // Keep the latest sessionQuestions accessible inside fetchQuestion without
  // making it a useCallback dependency (which would cause re-renders + refetch loops).
  const sessionQuestionsRef = useRef<AnsweredQuestion[]>([]);
  useEffect(() => {
    sessionQuestionsRef.current = sessionQuestions;
  }, [sessionQuestions]);

  const subjectColor = data?.subject.color || "#06B6D4";

  const fetchQuestion = useCallback(
    async (retryCount = 0) => {
      if (!data) return;

      const qType = QUESTION_TYPES[questionNumber % QUESTION_TYPES.length];
      const makeFallback = (reason: string) =>
        getFallbackQuestion({
          subjectId,
          topicId,
          language,
          questionType: qType,
          questionIndex: questionNumber,
          difficulty: "beginner",
          note: buildFallbackQuestionMessage(reason),
        });

      setIsLoading(true);
      setCurrentQuestion(null);
      setSelectedAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
      setExplanation("");
      setExplanationNote("");
      setExplanationSource(null);

      try {
        // Collect the stems of questions already asked THIS SESSION so the
        // model can steer to a different sub-topic (Issue #3 de-duplication).
        const previousQuestions = sessionQuestionsRef.current
          .map((q) => q.question)
          .filter((stem) => typeof stem === "string" && stem.trim().length > 0);

        const res = await fetch("/api/medmentor/generate-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId,
            topicId,
            subject: data.subject.nameEn,
            topic: data.topic.nameEn,
            difficulty: "beginner",
            language,
            questionType: qType,
            questionIndex: questionNumber,
            previousQuestions,
          }),
        });

        const q = (await res.json().catch(() => null)) as GeneratedQuestion | { error?: string } | null;

        if (!res.ok || !q || ("error" in q && q.error)) {
          const message =
            (q && "error" in q && q.error) ||
            `Request failed with status ${res.status}`;

          if (message.includes("429") && retryCount < 2) {
            const delay = (retryCount + 1) * 1500;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchQuestion(retryCount + 1);
          }

          throw new Error(message);
        }

        setCurrentQuestion(q as GeneratedQuestion);
      } catch (err) {
        console.error("Fetch question error:", err);
        const fallback =
          makeFallback(err instanceof Error ? err.message : "Network issue detected.") ??
          {
            id: `err_${Date.now()}`,
            question: "Unable to load a question right now. Please try again in a moment.",
            type: "multiple_choice" as const,
            options: ["Retry"],
            correctAnswer: "Retry",
            acceptedAnswers: null,
            hint: "",
            difficulty: "beginner" as const,
            source: "fallback" as const,
            note: "MedMentor could not reach the AI service or the API route.",
          };

        setCurrentQuestion(fallback);
      } finally {
        setIsLoading(false);
      }
    },
    [data, language, questionNumber, subjectId, topicId],
  );

  useEffect(() => {
    if (questionNumber < TOTAL_QUESTIONS && !isComplete) {
      fetchQuestion();
    }
  }, [questionNumber, fetchQuestion, isComplete]);

  const checkAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    setIsAnswered(true);
    setIsExplaining(true);

    const normalizedSelected = normalizeAnswer(selectedAnswer);
    const acceptedAnswers = currentQuestion.acceptedAnswers?.map(normalizeAnswer) ?? null;

    const correct =
      currentQuestion.type === "multiple_choice"
        ? selectedAnswer === currentQuestion.correctAnswer
        : currentQuestion.type === "true_false"
          ? normalizedSelected === normalizeAnswer(currentQuestion.correctAnswer)
          : acceptedAnswers
            ? acceptedAnswers.includes(normalizedSelected)
            : normalizedSelected === normalizeAnswer(currentQuestion.correctAnswer);

    setIsCorrect(correct);

    if (currentQuestion.source === "fallback") {
      setExplanation(
        buildFallbackExplanation({
          question: currentQuestion,
          userAnswer: selectedAnswer,
          isCorrect: correct,
          language,
        }),
      );
      setExplanationSource("fallback");
      setExplanationNote(
        currentQuestion.note || "Using MedMentor's built-in explanation while AI is busy.",
      );
      setIsExplaining(false);
    } else {
      try {
        const res = await fetch("/api/medmentor/check-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: data?.subject.nameEn,
            topic: data?.topic.nameEn,
            question: currentQuestion.question,
            userAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: correct,
            language,
            generatedQuestion: currentQuestion,
          }),
        });

        const result = (await res.json().catch(() => null)) as
          | {
              error?: string;
              explanation?: string;
              explanationSource?: "ai" | "fallback";
              note?: string;
            }
          | null;

        if (!res.ok || !result || result.error) {
          throw new Error(result?.error || `Request failed with status ${res.status}`);
        }

        setExplanation(result.explanation || "");
        setExplanationSource(result.explanationSource || "ai");
        setExplanationNote(result.note || "");
      } catch (error) {
        console.error("Check answer error:", error);
        setExplanation(
          buildFallbackExplanation({
            question: {
              ...currentQuestion,
              source: "fallback",
            },
            userAnswer: selectedAnswer,
            isCorrect: correct,
            language,
          }),
        );
        setExplanationSource("fallback");
        setExplanationNote(
          buildFallbackQuestionMessage(
            error instanceof Error ? error.message : "Network issue detected.",
          ),
        );
      } finally {
        setIsExplaining(false);
      }
    }

    const answered: AnsweredQuestion = {
      ...currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect: correct,
      explanation: "",
      timestamp: new Date().toISOString(),
    };
    setSessionQuestions((prev) => [...prev, answered]);

    if (!correct) {
      addToReviewQueue({
        questionId: currentQuestion.id,
        subject: subjectId,
        topic: topicId,
        question: currentQuestion.question,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: selectedAnswer,
        lastAttempt: new Date().toISOString(),
        correctCount: 0,
        incorrectCount: 1,
        nextReview: new Date(Date.now() + 600000).toISOString(),
        difficulty: currentQuestion.difficulty,
      });
    }
  };

  const nextQuestion = () => {
    const next = questionNumber + 1;

    if (next >= TOTAL_QUESTIONS) {
      setIsComplete(true);
      addSession({
        id: `s_${Date.now()}`,
        date: new Date().toISOString(),
        subject: subjectId,
        topic: topicId,
        questions: sessionQuestions,
        duration: Math.floor((Date.now() - startTime) / 1000),
      });
    } else {
      setQuestionNumber(next);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Subject or topic not found.</p>
      </div>
    );
  }

  const correctCount = sessionQuestions.filter((q) => q.isCorrect).length;

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{data.subject.emoji}</span>
              <h1 className="text-xl font-bold" style={{ color: subjectColor }}>
                {data.topic.nameEn}
              </h1>
            </div>
            <p className="text-sm text-white/30">{data.topic.nameJa}</p>
          </div>

          {!isComplete && (
            <div className="text-right">
              <div className="font-mono text-sm text-white/50">
                {questionNumber + 1} / {TOTAL_QUESTIONS}
              </div>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-1 rounded-full"
                    style={{
                      background:
                        i < sessionQuestions.length
                          ? sessionQuestions[i].isCorrect
                            ? "#22C55E"
                            : "#EF4444"
                          : i === questionNumber
                            ? subjectColor
                            : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-extrabold mb-2">Session Complete!</h2>
              <p className="text-white/50 mb-8">
                Score:{" "}
                <span className="text-white font-bold">
                  {correctCount}/{sessionQuestions.length}
                </span>{" "}
                correct
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/medmentor/study"
                  className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm hover:bg-white/[0.1] transition-colors"
                >
                  Back to Subjects
                </Link>
                <Link
                  href="/medmentor/review"
                  className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm hover:bg-white/[0.1] transition-colors"
                >
                  Review Mistakes
                </Link>
                <button
                  onClick={() => {
                    setIsComplete(false);
                    setQuestionNumber(0);
                    setSessionQuestions([]);
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-white"
                  style={{ background: subjectColor }}
                >
                  Study Again
                </button>
              </div>

              <MentorModePanel
                questions={sessionQuestions}
                language={language}
                subjectColor={subjectColor}
              />
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
              <p className="text-white/40 font-mono text-sm">Generating question...</p>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              {/* Intro banner — shown only on the first question of the session */}
              {questionNumber === 0 && (() => {
                const introTitle = tSingle("study.intro_banner_title", language);
                const introBody = tSingle("study.intro_banner_body", language);
                const topicName =
                  language === "ja" ? data.topic.nameJa : data.topic.nameEn;
                const bodyEn = introBody.en.replace("{topic}", data.topic.nameEn);
                const bodyJa = introBody.ja.replace("{topic}", data.topic.nameJa);

                return (
                  <motion.section
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] backdrop-blur-xl p-5 mb-6"
                    aria-label="Session introduction"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/80 uppercase mt-0.5">
                        Intro
                      </span>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-semibold text-white/90">
                          {language === "bilingual"
                            ? `${introTitle.en} / ${introTitle.ja}`
                            : introTitle[language]}
                        </p>
                        {language === "bilingual" ? (
                          <>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {bodyEn}
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {bodyJa}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-white/60 leading-relaxed">
                            {language === "ja" ? bodyJa : bodyEn}
                          </p>
                        )}
                        <p className="text-[11px] font-mono text-white/30 pt-1">
                          {language === "ja"
                            ? `対象トピック: ${topicName}`
                            : `Topic: ${topicName}`}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                );
              })()}

              <div className="rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 mb-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs font-mono px-2 py-1 rounded-full bg-white/[0.06] text-white/40">
                    {currentQuestion.type.replace("_", " ").toUpperCase()}
                  </span>
                  {currentQuestion.source === "fallback" ? (
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      BUILT-IN BACKUP
                    </span>
                  ) : (
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                      AI GENERATED
                    </span>
                  )}
                </div>

                <p className="text-lg font-medium text-white/90 leading-relaxed">
                  {currentQuestion.question}
                </p>

                {currentQuestion.note ? (
                  <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-xs text-amber-100/80 leading-relaxed">
                    {currentQuestion.note}
                  </div>
                ) : null}

                {currentQuestion.hint && !isAnswered && (
                  <p className="text-xs text-white/20 mt-4 font-mono">
                    💡 Hint: {currentQuestion.hint}
                  </p>
                )}
              </div>

              {!isAnswered ? (
                <div className="space-y-3 mb-6">
                  {currentQuestion.type === "multiple_choice" && currentQuestion.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedAnswer(opt)}
                          className={`p-4 rounded-xl text-left text-sm border transition-all duration-300 ${
                            selectedAnswer === opt
                              ? "border-cyan-400/50 bg-cyan-400/10 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.15] hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="font-mono text-xs text-white/30 mr-2">{i + 1}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : currentQuestion.type === "true_false" ? (
                    <div className="grid grid-cols-2 gap-3">
                      {["True", "False"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedAnswer(opt)}
                          className={`p-4 rounded-xl text-center text-sm border transition-all duration-300 ${
                            selectedAnswer === opt
                              ? "border-cyan-400/50 bg-cyan-400/10 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.15]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50"
                      onKeyDown={(e) => e.key === "Enter" && selectedAnswer && checkAnswer()}
                    />
                  )}

                  <button
                    onClick={checkAnswer}
                    disabled={!selectedAnswer}
                    className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: selectedAnswer ? subjectColor : "rgba(255,255,255,0.06)",
                      color: selectedAnswer ? "#000" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
                      <span
                        className="font-bold text-sm"
                        style={{ color: isCorrect ? "#22C55E" : "#EF4444" }}
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-xs text-white/50 mt-1">
                        Correct answer:{" "}
                        <span className="text-white/80">{currentQuestion.correctAnswer}</span>
                      </p>
                    )}
                  </div>

                  {isExplaining ? (
                    <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                      <div className="inline-block w-5 h-5 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin mb-2" />
                      <p className="text-xs text-white/30 font-mono">
                        Generating explanation...
                      </p>
                    </div>
                  ) : explanation ? (
                    <>
                      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="text-xs font-mono text-cyan-400/60">
                            {explanationSource === "fallback"
                              ? "BUILT-IN EXPLANATION"
                              : "AI EXPLANATION"}
                          </div>
                          {explanationSource === "fallback" ? (
                            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              SAFE MODE
                            </span>
                          ) : null}
                        </div>
                        {explanationNote ? (
                          <p className="text-xs text-amber-100/70 mb-3">{explanationNote}</p>
                        ) : null}
                        {/* Render with RichMarkdown so tables/Mermaid/math in the
                             explanation are formatted, not shown as raw text. */}
                        <RichMarkdown source={explanation} />
                      </div>

                      {/* Follow-up: quick actions + free input.
                           Hidden when the explanation came from the fallback
                           deck (no API context to base follow-ups on). */}
                      <ExplanationFollowUp
                        subject={data?.subject.nameEn || ""}
                        topic={data?.topic.nameEn || ""}
                        question={currentQuestion.question}
                        correctAnswer={currentQuestion.correctAnswer}
                        originalExplanation={explanation}
                        language={language}
                        explanationSource={explanationSource}
                      />
                    </>
                  ) : null}

                  <button
                    onClick={nextQuestion}
                    className="w-full py-3 rounded-xl font-medium text-sm text-black transition-all duration-300"
                    style={{ background: subjectColor }}
                  >
                    {questionNumber + 1 >= TOTAL_QUESTIONS
                      ? "Finish Session"
                      : "Next Question →"}
                  </button>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
