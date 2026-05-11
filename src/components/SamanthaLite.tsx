"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type PostInfo = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

type Message = {
  role: "samantha" | "user";
  text: string;
  links?: { slug: string; title: string }[];
  followUp?: "ask-satisfied" | "ask-topic" | "request-sent";
};

const GREETING =
  "こんにちは。Yuichiの思考ログへようこそ。どのような記事をお探しですか？\n\nHello. Welcome to Yuichi's thought log. What kind of article are you looking for?";

export default function SamanthaLite({ posts }: { posts: PostInfo[] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "samantha", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [waitingForTopic, setWaitingForTopic] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const search = (query: string): PostInfo[] => {
    // Stopwords to ignore (common in both EN and JP queries)
    const stopwords = new Set([
      "i", "me", "the", "a", "an", "is", "are", "was", "were", "be", "been",
      "to", "of", "in", "for", "on", "with", "at", "by", "from", "about",
      "would", "like", "want", "search", "find", "show", "article", "articles",
      "post", "posts", "blog", "related", "regarding", "looking", "please",
      "can", "you", "do", "does", "did", "have", "has", "had", "that", "this",
      "it", "its", "and", "or", "but", "not", "what", "which", "how", "where",
      "の", "は", "が", "を", "に", "で", "と", "も", "て", "た", "な", "し",
      "ある", "いる", "する", "ない", "この", "その", "記事", "ブログ", "探す",
      "検索", "教えて", "ほしい", "ください", "について", "関連", "関する",
    ]);

    // Extract meaningful keywords from the query
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\sぁ-んァ-ヶ一-龥々ー]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1 && !stopwords.has(w));

    // Also try the full query as a phrase
    const fullQuery = query.toLowerCase().trim();

    // Score each post
    const scored = posts.map((post) => {
      const title = post.title.toLowerCase();
      const desc = post.description.toLowerCase();
      const tags = post.tags.map((t) => t.toLowerCase());
      const allText = `${title} ${desc} ${tags.join(" ")}`;

      let score = 0;

      // Full phrase match (highest weight)
      if (allText.includes(fullQuery)) score += 10;

      // Per-keyword scoring
      for (const kw of keywords) {
        if (title.includes(kw)) score += 5;       // Title match = strongest signal
        if (tags.some((t) => t.includes(kw))) score += 4; // Tag match
        if (desc.includes(kw)) score += 2;         // Description match
      }

      return { post, score };
    });

    // Return posts with score > 0, sorted by relevance
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.post);
  };

  const sendRequest = async (keyword: string) => {
    try {
      await fetch("https://formspree.io/f/mrerbary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `読者からのリクエスト: ${keyword}`,
          _subject: `[yuichi.blog] 読者リクエスト: ${keyword}`,
        }),
      });
    } catch {
      // Silent fail — don't break the UI
    }
  };

  // Handle "No" button — ask what topic they want
  const handleNotSatisfied = () => {
    setWaitingForTopic(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "samantha",
        text: "どのようなトピックの記事をリクエストしますか？キーワードや一言で教えてください。\n\nWhat topic would you like Yuichi to write about? A keyword or short description is fine.",
        followUp: "ask-topic",
      },
    ]);
  };

  // Handle "Yes" button
  const handleSatisfied = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "samantha",
        text: "お役に立てて嬉しいです！他にもお探しの記事があれば、いつでもどうぞ。\n\nGlad I could help! Feel free to search for more articles anytime.",
      },
    ]);
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    // If waiting for topic request, send it to Formspree
    if (waitingForTopic) {
      await new Promise((r) => setTimeout(r, 600));
      await sendRequest(q);
      setWaitingForTopic(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "samantha",
          text: `Yuichiに「${q}」についてのリクエストを送信しました！📩\n\nI've sent your request to Yuichi to write about "${q}". Thanks for the suggestion!`,
          followUp: "request-sent",
        },
      ]);
      setLoading(false);
      return;
    }

    // Normal search flow
    await new Promise((r) => setTimeout(r, 800));
    setLastQuery(q);
    const results = search(q);

    if (results.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "samantha",
          text: `${results.length}件の記事が見つかりました：`,
          links: results.slice(0, 5).map((p) => ({
            slug: p.slug,
            title: p.title,
          })),
          followUp: "ask-satisfied",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "samantha",
          text: `「${q}」に該当する記事が見つかりませんでした。\nNo articles found for "${q}".`,
          followUp: "ask-satisfied",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/20"
        style={{
          border: open ? "2px solid rgba(6,182,212,0.5)" : "2px solid rgba(255,255,255,0.15)",
          boxShadow: open ? "0 0 20px rgba(6,182,212,0.2)" : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        aria-label={open ? "Close Samantha" : "Open Samantha"}
      >
        <Image
          src="/images/samantha-icon.png"
          alt="Samantha Lite"
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-40 right-6 z-50 w-[360px] max-h-[480px] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.05)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Image
              src="/images/samantha-icon.png"
              alt=""
              width={28}
              height={28}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Samantha Lite</div>
              <div className="text-[10px] text-cyan-400/60 font-mono">Article Navigator</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors text-lg">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-xl px-3 py-2 text-sm"
                  style={{
                    background: msg.role === "user" ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "#e0f7fa" : "rgba(255,255,255,0.75)",
                    border: msg.role === "user" ? "1px solid rgba(6,182,212,0.2)" : "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.links && (
                    <div className="mt-2 space-y-1.5">
                      {msg.links.map((link) => (
                        <a
                          key={link.slug}
                          href={`/blog/${link.slug}`}
                          className="block text-xs text-cyan-400 hover:text-cyan-300 transition-colors truncate"
                          style={{ borderLeft: "2px solid rgba(6,182,212,0.3)", paddingLeft: 8 }}
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                  {/* Follow-up: "Was this helpful?" buttons */}
                  {msg.followUp === "ask-satisfied" && i === messages.length - 1 && (
                    <div className="mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[11px] text-white/40 mb-2">
                        お探しの記事は見つかりましたか？ / Did you find what you were looking for?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSatisfied}
                          className="text-[11px] px-3 py-1 rounded-lg transition-all hover:scale-105"
                          style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
                        >
                          はい / Yes
                        </button>
                        <button
                          onClick={handleNotSatisfied}
                          className="text-[11px] px-3 py-1 rounded-lg transition-all hover:scale-105"
                          style={{ background: "rgba(6,182,212,0.15)", color: "#06B6D4", border: "1px solid rgba(6,182,212,0.2)" }}
                        >
                          いいえ / No, request a topic
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2 text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="記事を検索 / Search articles..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                style={{ background: "rgba(6,182,212,0.2)", color: "#06B6D4", border: "1px solid rgba(6,182,212,0.2)" }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
