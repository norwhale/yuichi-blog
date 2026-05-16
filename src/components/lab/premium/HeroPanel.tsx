"use client";

import { motion, useReducedMotion } from "framer-motion";
import RotatingBadge from "./RotatingBadge";
import MarqueeText from "./MarqueeText";

/**
 * The premium-ui lab hero. Holds the page title, bilingual subtitle, a
 * rotating "scroll down" badge in the corner, and a marquee tag-line of
 * the page's own keywords across the bottom — the same triad you'd see
 * on a QClay landing page.
 */
export default function HeroPanel() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-white/[0.05]">
      {/* Soft cyan glow behind the title */}
      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-cyan-500/10 via-cyan-500/[0.03] to-transparent blur-3xl pointer-events-none"
        animate={
          prefersReduced
            ? undefined
            : { scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }
        }
        transition={
          prefersReduced
            ? undefined
            : { duration: 10, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Floating bokeh dots */}
      {!prefersReduced && (
        <>
          {[
            { x: "12%", y: "22%", size: 6, delay: 0 },
            { x: "82%", y: "30%", size: 4, delay: 1.4 },
            { x: "20%", y: "78%", size: 8, delay: 2.8 },
            { x: "78%", y: "72%", size: 5, delay: 0.7 },
            { x: "50%", y: "18%", size: 3, delay: 2.1 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full bg-cyan-300/40"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.size,
                height: dot.size,
              }}
              animate={{
                y: [0, -18, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 6 + i,
                ease: "easeInOut",
                repeat: Infinity,
                delay: dot.delay,
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-32 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/80 uppercase">
                [LAB / PREMIUM-UI]
              </span>
              <span className="h-px w-12 bg-cyan-400/40" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                Experimental Prototype
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extralight tracking-tight text-white leading-[0.95]"
            >
              Premium
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-sky-400 bg-clip-text text-transparent italic font-light">
                UI Lab
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 max-w-2xl text-base sm:text-lg text-white/65 leading-relaxed"
            >
              高級感のあるアニメーションとインタラクションの検証場。
              <span className="text-white/35">
                {" "}
                / A studio bench for the calm, premium motion language we want
                across yuichi.blog.
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-4 max-w-2xl text-sm text-white/40 leading-relaxed"
            >
              Bogdan @ QClay の finance UI から
              「multi-color floating cards」「numbered sections」「marquee
              typography」を抽出し、yuichi.blog のダークトーンに馴染ませた実験。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="hidden lg:block"
          >
            <RotatingBadge text="SCROLL · EXPLORE · SCROLL · EXPLORE · " />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 py-6 border-t border-white/[0.05] bg-slate-950/40 backdrop-blur-sm">
        <MarqueeText
          items={[
            "medicine",
            "AI",
            "geopolitics",
            "Bulgaria",
            "BCI",
            "vibe coding",
            "neuroscience",
            "OSINT",
            "design systems",
            "Next.js",
            "framer-motion",
          ]}
          speed={50}
        />
      </div>
    </section>
  );
}
