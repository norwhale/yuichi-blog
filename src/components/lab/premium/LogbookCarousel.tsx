"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SectionNumber from "./SectionNumber";

/**
 * The centerpiece: a horizontally-draggable carousel of "logbook entries"
 * (mock blog cards) where:
 *
 * - Cards laid out in a subtle ARC via per-slide transform: the active
 *   slide sits at center with rotateY:0, neighbors rotate ~12° away.
 * - Heavy hover state: float-up, deeper shadow, tag chip animation, and
 *   a fade-in excerpt that wasn't visible at rest.
 * - Click-through opens a dimmed modal with the full entry — same data
 *   model as the home page logbook, easy to wire to real posts later.
 * - Drag works smoothly via embla; the snap is "center" to keep the
 *   active card aligned with the rotating spotlight.
 *
 * Honors prefers-reduced-motion (no perspective, no float-on-hover).
 */

type Entry = {
  id: string;
  date: string;
  tag: string;
  tagJa: string;
  accent: "cyan" | "emerald" | "amber" | "pink" | "blue";
  title: string;
  titleJa: string;
  excerpt: string;
  body: string;
};

const ENTRIES: Entry[] = [
  {
    id: "log-01",
    date: "2026 · 05",
    tag: "Medicine",
    tagJa: "医学",
    accent: "emerald",
    title: "Anatomy at 02:00",
    titleJa: "深夜2時の解剖学",
    excerpt:
      "Brachial plexus, thoracic outlet, axillary nerve. Three sessions in and I still mix C7 with T1.",
    body: "今夜は腕神経叢を覚え直していた。C5-T1 から発する神経線維が、鎖骨下動脈と並走しながら腋窩で再構成される、その立体構造をどうしても2Dの教科書では飲み込めない。MedMentor の anatomy preset SVG に、自分用のC5-T1のミニマップを追加した。",
  },
  {
    id: "log-02",
    date: "2026 · 05",
    tag: "AI",
    tagJa: "AI",
    accent: "cyan",
    title: "Claude as a design partner",
    titleJa: "Claude を設計相棒として使う",
    excerpt:
      "Not a code generator. A second brain that asks 'are you sure?' at exactly the right moments.",
    body: "Claude にコードを丸投げするのではなく、設計の判断を一緒に詰める使い方が一番効く。『この機能、ユーザーの動線と合ってる?』『この命名、後で混乱しない?』みたいな質問を投げ返してくれるのが、自分の頭の中の同僚として最高に機能している。",
  },
  {
    id: "log-03",
    date: "2026 · 04",
    tag: "Geopolitics",
    tagJa: "地政学",
    accent: "amber",
    title: "Reading the Pacific",
    titleJa: "太平洋を読む",
    excerpt:
      "Open-source intelligence as a meditation practice. Watching ships move, asking why.",
    body: "OSINT は瞑想に近い。AIS のデータを眺めて、なぜこの船は今この海域にいるのか、なぜこのタイミングか、と問い続ける。答えは出ないことが多いが、問い続けることで世界の解像度が上がる。これは医学を学ぶ姿勢と同じだ。",
  },
  {
    id: "log-04",
    date: "2026 · 04",
    tag: "Bulgaria",
    tagJa: "ブルガリア生活",
    accent: "pink",
    title: "Plum trees in Pleven",
    titleJa: "プレヴェンのプラム並木",
    excerpt:
      "Snow in late April, then suddenly 25°C. The plum trees don't know what season it is.",
    body: "4月のプレヴェン。雪が降った翌日に25度になる。プラムの木はもう花を咲かせていたが、雪の重みで枝が折れた。市場のおばあさんが『この国の天気は本気で人を試してくる』と笑っていた。それでも、ここの空気は東京より2倍くらい澄んでいる。",
  },
  {
    id: "log-05",
    date: "2026 · 03",
    tag: "BCI",
    tagJa: "脳科学",
    accent: "blue",
    title: "Reading EEG with my own eyes",
    titleJa: "自分の目でEEGを読む",
    excerpt:
      "Borrowed a research-grade EEG at the lab. My alpha rhythm is louder than expected.",
    body: "研究室で研究用EEGを貸してもらった。10-20法の電極を貼ってリラックス状態を測ると、自分のα波が想像より大きかった。瞑想の習慣が効いている可能性がある。BCIへの興味が、ふと『道具を作る側』から『使う側』に揺れた瞬間だった。",
  },
  {
    id: "log-06",
    date: "2026 · 03",
    tag: "Vibe Coding",
    tagJa: "Vibe Coding",
    accent: "cyan",
    title: "Three weeks, one app",
    titleJa: "3週間、1つのアプリ",
    excerpt:
      "MedMentor went from sketch to production in 21 days. The trick: ship something every day.",
    body: "MedMentor は構想から本番運用まで3週間。秘訣は『毎日何かを本番にデプロイする』こと。完璧を目指さない。動くものを出す。フィードバックを受ける。次の朝に直す。このサイクルがバイブコーディングの本質で、これは生成AIなしでは絶対に成り立たない速度だ。",
  },
];

const accentBg = {
  cyan: "from-cyan-500/25 via-cyan-500/10 to-transparent",
  emerald: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  amber: "from-amber-500/25 via-amber-500/10 to-transparent",
  pink: "from-pink-500/25 via-pink-500/10 to-transparent",
  blue: "from-sky-500/25 via-sky-500/10 to-transparent",
};

const accentBorder = {
  cyan: "group-hover:border-cyan-400/40",
  emerald: "group-hover:border-emerald-400/40",
  amber: "group-hover:border-amber-400/40",
  pink: "group-hover:border-pink-400/40",
  blue: "group-hover:border-sky-400/40",
};

const accentText = {
  cyan: "text-cyan-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  pink: "text-pink-300",
  blue: "text-sky-300",
};

export default function LogbookCarousel() {
  const prefersReduced = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openEntry, setOpenEntry] = useState<Entry | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (i: number) => emblaApi?.scrollTo(i);
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollPrev = () => emblaApi?.scrollPrev();

  return (
    <section className="relative max-w-7xl mx-auto px-6 sm:px-10 py-24 md:py-32">
      <SectionNumber
        number="02"
        eyebrow="Carousel"
        title="Interactive Logbook"
        bilingualTitle="ドラッグできる、活動ログのアーカイブ"
      />

      <p className="max-w-2xl text-white/55 leading-relaxed mb-8 -mt-4">
        ドラッグできます。カードを真ん中に置くと焦点が合い、ホバーで抜粋が現れます。
        <span className="text-white/30">
          {" "}
          / Drag, then hover the centered card to surface its excerpt.
        </span>
      </p>

      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{ perspective: prefersReduced ? undefined : "1400px" }}
        >
          <div className="flex gap-5 sm:gap-7 py-12">
            {ENTRIES.map((entry, i) => {
              const offset = i - selectedIndex;
              const isCentered = offset === 0;

              return (
                <motion.button
                  key={entry.id}
                  onClick={() => {
                    if (isCentered) setOpenEntry(entry);
                    else scrollTo(i);
                  }}
                  className={`group relative flex-[0_0_84%] sm:flex-[0_0_55%] md:flex-[0_0_42%] lg:flex-[0_0_34%] xl:flex-[0_0_28%] rounded-2xl border border-white/[0.07] bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 text-left overflow-hidden transition-all duration-500 cursor-pointer ${accentBorder[entry.accent]}`}
                  animate={
                    prefersReduced
                      ? undefined
                      : {
                          rotateY: offset * -10,
                          scale: isCentered ? 1 : 0.92,
                          opacity: Math.abs(offset) >= 3 ? 0.35 : isCentered ? 1 : 0.7,
                          y: isCentered ? 0 : 8,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 28,
                    mass: 0.7,
                  }}
                  whileHover={
                    prefersReduced || !isCentered ? undefined : { y: -8 }
                  }
                  style={{
                    transformStyle: prefersReduced ? undefined : "preserve-3d",
                  }}
                >
                  {/* Accent glow */}
                  <div
                    aria-hidden
                    className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-radial ${accentBg[entry.accent]} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="relative flex items-center gap-3 mb-5">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
                      {entry.date}
                    </span>
                    <span className="h-px flex-1 bg-white/[0.07]" />
                    <motion.span
                      className={`font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-white/[0.08] ${accentText[entry.accent]} bg-white/[0.03]`}
                      whileHover={prefersReduced ? undefined : { scale: 1.06 }}
                    >
                      #{entry.tag}
                    </motion.span>
                  </div>

                  <h3 className="relative text-xl sm:text-2xl font-light text-white/95 leading-tight">
                    {entry.title}
                  </h3>
                  <p className="relative text-sm text-white/45 mt-2 font-mono tracking-wide">
                    {entry.titleJa}
                  </p>

                  <motion.p
                    className="relative text-sm text-white/65 mt-5 leading-relaxed line-clamp-3"
                    initial={{ opacity: 0.55 }}
                    whileHover={
                      prefersReduced || !isCentered
                        ? undefined
                        : { opacity: 1 }
                    }
                  >
                    {entry.excerpt}
                  </motion.p>

                  <div className="relative mt-6 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono tracking-wider ${accentText[entry.accent]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    >
                      Read entry →
                    </span>
                    <span className="font-mono text-[9px] text-white/25 tracking-widest uppercase">
                      {entry.tagJa}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination + arrows */}
      <div className="mt-8 flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
          aria-label="Previous entry"
        >
          ←
        </button>
        <div className="flex gap-2">
          {ENTRIES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === selectedIndex
                  ? "w-8 bg-cyan-400/80"
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
              aria-label={`Go to entry ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
          aria-label="Next entry"
        >
          →
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openEntry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenEntry(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full rounded-2xl border border-white/10 bg-slate-900/95 p-8 sm:p-10"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenEntry(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
                {openEntry.date} · #{openEntry.tag}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-light text-white/95 leading-tight">
                {openEntry.title}
              </h3>
              <p className="mt-1 text-sm text-white/45 font-mono">
                {openEntry.titleJa}
              </p>
              <div className="mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/10 to-transparent" />
              <p className="mt-6 text-[15px] text-white/75 leading-[1.85]">
                {openEntry.body}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
