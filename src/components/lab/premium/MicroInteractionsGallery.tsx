"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SectionNumber from "./SectionNumber";

/**
 * A laboratory bench of small interactive controls — buttons, tags,
 * toggles, magnetic cursor — so the rest of the site can copy these
 * patterns without re-inventing them. Each tile is a self-contained demo
 * with its own state.
 */

function MagneticButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      onMouseMove={(e) => {
        if (prefersReduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPos({
          x: (e.clientX - (r.left + r.width / 2)) * 0.25,
          y: (e.clientY - (r.top + r.height / 2)) * 0.25,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="px-6 py-3 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 text-sm font-mono tracking-wider hover:bg-cyan-400/20 transition-colors"
    >
      ✦ MAGNETIC
    </motion.button>
  );
}

function MorphingChip() {
  const [active, setActive] = useState(false);
  return (
    <motion.button
      onClick={() => setActive((v) => !v)}
      whileTap={{ scale: 0.95 }}
      className="relative h-10 px-5 rounded-full border bg-slate-900/60 text-sm font-mono"
      style={{
        borderColor: active
          ? "rgba(244, 114, 182, 0.5)"
          : "rgba(255,255,255,0.1)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ? "on" : "off"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={active ? "text-pink-200" : "text-white/55"}
        >
          {active ? "● TRACKING" : "○ IDLE"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function ShimmerCard() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-5 group cursor-pointer w-full"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <p className="relative text-xs font-mono text-cyan-400/70 tracking-wider mb-2">
        HOVER ME
      </p>
      <p className="relative text-sm text-white/75">
        Shimmer sweep on hover
      </p>
    </motion.div>
  );
}

function PressableTag() {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 text-xs font-mono cursor-pointer select-none"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
      #live
    </motion.span>
  );
}

function FocusInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className="w-full px-4 pt-6 pb-2 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-transparent focus:outline-none focus:border-cyan-400/50 transition-colors"
      />
      <motion.label
        animate={{
          y: focused || value ? -10 : 4,
          fontSize: focused || value ? "10px" : "13px",
          color: focused
            ? "rgba(34, 211, 238, 0.9)"
            : value
              ? "rgba(255,255,255,0.45)"
              : "rgba(255,255,255,0.35)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-4 top-4 font-mono tracking-wider pointer-events-none origin-left"
      >
        FLOATING LABEL
      </motion.label>
    </div>
  );
}

function SegmentToggle() {
  const [seg, setSeg] = useState<"en" | "ja">("ja");
  return (
    <div className="relative inline-flex p-1 rounded-full border border-white/10 bg-slate-900/60">
      <button
        onClick={() => setSeg("en")}
        className={`relative z-10 px-4 py-1.5 text-xs font-mono tracking-wider transition-colors ${
          seg === "en" ? "text-slate-950" : "text-white/55"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setSeg("ja")}
        className={`relative z-10 px-4 py-1.5 text-xs font-mono tracking-wider transition-colors ${
          seg === "ja" ? "text-slate-950" : "text-white/55"
        }`}
      >
        JA
      </button>
      <motion.div
        layout
        className="absolute inset-y-1 rounded-full bg-cyan-300"
        initial={false}
        animate={{
          left: seg === "en" ? "4px" : "calc(50% + 2px)",
          right: seg === "en" ? "calc(50% + 2px)" : "4px",
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
      />
    </div>
  );
}

export default function MicroInteractionsGallery() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 sm:px-10 py-24 md:py-32 border-t border-white/[0.05]">
      <SectionNumber
        number="03"
        eyebrow="Components"
        title="Micro-interactions Gallery"
        bilingualTitle="本番に持っていきたい小さな動き"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { node: <MagneticButton />, label: "Magnetic button" },
          { node: <MorphingChip />, label: "State chip" },
          { node: <ShimmerCard />, label: "Shimmer card", wide: true },
          { node: <PressableTag />, label: "Pressable tag" },
          { node: <FocusInput />, label: "Floating label", wide: true },
          { node: <SegmentToggle />, label: "Segment toggle" },
        ].map((demo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`rounded-2xl border border-white/[0.07] bg-slate-900/40 p-6 flex flex-col items-center justify-center gap-4 min-h-[140px] ${demo.wide ? "md:col-span-1" : ""}`}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              {demo.node}
            </div>
            <span className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase">
              {demo.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
