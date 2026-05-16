"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FollowUpIntent, FollowUpTurn } from "@/lib/medmentor/followUp";
import type { Language } from "@/lib/medmentor/types";
import RichMarkdown from "./RichMarkdown";

type Props = {
  subject: string;
  topic: string;
  question: string;
  correctAnswer: string;
  originalExplanation: string;
  language: Language;
  /** "fallback" means the original explanation was not from Anthropic API;
   *  follow-ups are disabled in that case because context is weak. */
  explanationSource: "ai" | "fallback" | null;
};

const MAX_TURNS = 3;

/** Labels for the quick-action buttons. */
const ACTIONS: Array<{
  intent: FollowUpIntent;
  emoji: string;
  label: { en: string; ja: string };
  prompt: { en: string; ja: string };
}> = [
  {
    intent: "table",
    emoji: "📊",
    label: { en: "Show in a table", ja: "表で整理" },
    prompt: {
      en: "Please reorganize this explanation as a comparison table.",
      ja: "この解説を比較表にまとめてください。",
    },
  },
  {
    intent: "analogy",
    emoji: "💡",
    label: { en: "Give an analogy", ja: "例えで説明" },
    prompt: {
      en: "Give me a concrete analogy from IT or everyday life.",
      ja: "IT または日常生活からの具体的な例えで説明してください。",
    },
  },
  {
    intent: "deeper",
    emoji: "🔍",
    label: { en: "More detail", ja: "もっと詳しく" },
    prompt: {
      en: "Go one level deeper — explain WHY, with a formula if relevant.",
      ja: "もう1段階深く教えてください。必要なら式や仕組みも含めて。",
    },
  },
  {
    intent: "different_angle",
    emoji: "🔄",
    label: { en: "Different angle", ja: "違う視点で" },
    prompt: {
      en: "Explain this from a completely different angle.",
      ja: "全く違う視点から説明してください。",
    },
  },
  {
    intent: "svg_artifact",
    emoji: "✨",
    label: { en: "Animated diagram", ja: "アニメ図を描いて" },
    prompt: {
      en: "Design a custom animated SVG diagram that visualizes this concept. Hand-craft it — use SMIL animation, label everything, make the motion mean something.",
      ja: "このコンセプトを可視化する、アニメーション付きのSVG図を自作してください。SMILアニメーションを使い、要素に正確なラベルを付け、動きに意味を持たせてください。",
    },
  },
];

export default function ExplanationFollowUp({
  subject,
  topic,
  question,
  correctAnswer,
  originalExplanation,
  language,
  explanationSource,
}: Props) {
  const [turns, setTurns] = useState<FollowUpTurn[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBilingual = language === "bilingual";
  const isJa = language === "ja";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns, isLoading]);

  // Fallback explanations don't come from Anthropic and have no deep context,
  // so we don't offer follow-up on them.
  if (explanationSource === "fallback" || !originalExplanation) {
    return null;
  }

  const userTurns = turns.filter((t) => t.role === "user").length;
  const turnsRemaining = Math.max(0, MAX_TURNS - userTurns);
  const limitReached = userTurns >= MAX_TURNS;

  const sendFollowUp = async (message: string, intent: FollowUpIntent) => {
    if (!message.trim() || isLoading || limitReached) return;

    const userTurn: FollowUpTurn = { role: "user", content: message, intent };
    const nextHistory = [...turns, userTurn];
    setTurns(nextHistory);
    setIsLoading(true);
    setNote("");

    try {
      const res = await fetch("/api/medmentor/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          question,
          correctAnswer,
          originalExplanation,
          history: turns, // history BEFORE this turn
          message,
          intent,
          language,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | {
            reply?: string;
            error?: string;
            limitReached?: boolean;
            rateLimited?: boolean;
          }
        | null;

      if (!res.ok || !data || data.error) {
        const msg = data?.error || `Request failed (${res.status})`;
        setNote(msg);
        // Rollback the user turn if it failed so the user can retry
        setTurns(turns);
        return;
      }

      if (data.reply) {
        setTurns((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
      }

      if (data.limitReached || data.rateLimited) {
        setNote(data.reply || "");
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Network error");
      setTurns(turns);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (
    intent: FollowUpIntent,
    prompt: { en: string; ja: string },
  ) => {
    const msg = isJa ? prompt.ja : prompt.en;
    sendFollowUp(msg, intent);
  };

  const handleCustomSend = () => {
    const msg = customInput.trim();
    if (!msg) return;
    setCustomInput("");
    sendFollowUp(msg, "custom");
  };

  const headerLabel = isBilingual
    ? "Go deeper / さらに掘り下げる"
    : isJa
      ? "さらに掘り下げる"
      : "Go deeper";

  // --- BETA: on-demand DALL-E 3 illustration -------------------------------
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageNote, setImageNote] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageRevisedPrompt, setImageRevisedPrompt] = useState<string | null>(null);

  const handleGenerateImage = async (
    style: "chemistry" | "anatomy" | "process",
  ) => {
    if (imageLoading) return;
    setImageLoading(true);
    setImageNote(null);
    setImageUrl(null);
    setImageRevisedPrompt(null);

    try {
      const res = await fetch("/api/medmentor/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, correctAnswer, style }),
      });
      const data = (await res.json().catch(() => null)) as
        | {
            url?: string;
            revisedPrompt?: string;
            error?: string;
            configured?: boolean;
          }
        | null;

      if (!res.ok || !data || data.error) {
        setImageNote(data?.error || `Image generation failed (${res.status})`);
        return;
      }
      if (data.url) setImageUrl(data.url);
      if (data.revisedPrompt) setImageRevisedPrompt(data.revisedPrompt);
    } catch (err) {
      setImageNote(err instanceof Error ? err.message : "Network error");
    } finally {
      setImageLoading(false);
    }
  };

  const counterLabel = isJa
    ? `${turnsRemaining} 回まで質問できます`
    : `${turnsRemaining} follow-up${turnsRemaining === 1 ? "" : "s"} remaining`;

  return (
    <div className="mt-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase">
            {headerLabel}
          </span>
        </div>
        <span
          className={`text-[10px] font-mono ${
            limitReached ? "text-amber-300/80" : "text-white/30"
          }`}
        >
          {counterLabel}
        </span>
      </div>

      {/* Conversation timeline */}
      {turns.length > 0 && (
        <div className="space-y-3 mb-4">
          <AnimatePresence initial={false}>
            {turns.map((turn, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-4 py-3 ${
                    turn.role === "user"
                      ? "bg-cyan-400/10 border border-cyan-400/20"
                      : "bg-white/[0.03] border border-white/[0.06]"
                  }`}
                >
                  {turn.role === "user" ? (
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {turn.content}
                    </p>
                  ) : (
                    <RichMarkdown source={turn.content} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {note && (
        <p className="text-xs text-amber-200/70 mb-3 px-1">{note}</p>
      )}

      {/* ─── BETA: DALL-E 3 illustration panel ─── */}
      <div className="mb-3 rounded-xl border border-dashed border-fuchsia-400/25 bg-fuchsia-400/[0.03] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-[0.15em] bg-fuchsia-400/15 text-fuchsia-200 border border-fuchsia-400/30 rounded px-1.5 py-0.5 uppercase">
              Beta
            </span>
            <span className="text-[10px] font-mono text-fuchsia-200/70">
              {isJa
                ? "AI 画像生成 · $0.04/枚"
                : "AI image generation · $0.04/img"}
            </span>
          </div>
          <span className="text-[9px] font-mono text-white/30">
            DALL-E 3
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <button
            onClick={() => handleGenerateImage("chemistry")}
            disabled={imageLoading}
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white/70 hover:bg-fuchsia-400/10 hover:border-fuchsia-400/30 hover:text-fuchsia-200 transition-all disabled:opacity-30"
          >
            🧪 {isJa ? "化学構造" : "Chemistry"}
          </button>
          <button
            onClick={() => handleGenerateImage("anatomy")}
            disabled={imageLoading}
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white/70 hover:bg-fuchsia-400/10 hover:border-fuchsia-400/30 hover:text-fuchsia-200 transition-all disabled:opacity-30"
          >
            🧠 {isJa ? "解剖図" : "Anatomy"}
          </button>
          <button
            onClick={() => handleGenerateImage("process")}
            disabled={imageLoading}
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white/70 hover:bg-fuchsia-400/10 hover:border-fuchsia-400/30 hover:text-fuchsia-200 transition-all disabled:opacity-30"
          >
            ⚙️ {isJa ? "プロセス図" : "Process"}
          </button>
        </div>
        {imageLoading && (
          <div className="flex items-center gap-2 text-[11px] text-fuchsia-200/70 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-300/70 animate-pulse" />
            {isJa ? "画像を生成中…（10-20秒）" : "Generating… (10-20s)"}
          </div>
        )}
        {imageNote && (
          <p className="text-[11px] text-amber-200/70 py-1">{imageNote}</p>
        )}
        {imageUrl && (
          <figure className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={topic}
              className="w-full h-auto"
              loading="lazy"
            />
            {imageRevisedPrompt && (
              <figcaption className="text-[10px] text-white/40 px-3 py-2 border-t border-white/5">
                {isJa ? "モデル解釈:" : "Model interpretation:"}{" "}
                <span className="text-white/60">{imageRevisedPrompt}</span>
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {/* Quick actions + custom input (hidden when limit reached) */}
      {!limitReached && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.intent}
                onClick={() => handleQuickAction(a.intent, a.prompt)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="mr-1">{a.emoji}</span>
                {isBilingual
                  ? `${a.label.en} / ${a.label.ja}`
                  : a.label[language as "en" | "ja"]}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSend()}
              placeholder={
                isJa
                  ? "他にも聞きたいことを入力..."
                  : "Ask anything else..."
              }
              disabled={isLoading}
              className="flex-1 text-sm rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/40 disabled:opacity-40"
            />
            <button
              onClick={handleCustomSend}
              disabled={isLoading || !customInput.trim()}
              className="text-sm px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-30"
              style={{
                background: customInput.trim()
                  ? "rgba(6, 182, 212, 0.2)"
                  : "rgba(255,255,255,0.04)",
                color: customInput.trim()
                  ? "#06B6D4"
                  : "rgba(255,255,255,0.3)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
