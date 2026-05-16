"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Bogdan/Synex-style large metric tile: huge number that counts up when
 * scrolled into view, paired with a label, an optional prefix/suffix
 * (e.g. "$", "%"), and a soft accent color.
 *
 * The animation respects prefers-reduced-motion (the final value is shown
 * immediately) and only fires once per page view.
 */
export default function CountUpMetric({
  value,
  label,
  bilingualLabel,
  prefix = "",
  suffix = "",
  accent = "cyan",
  delay = 0,
  format = "int",
}: {
  value: number;
  label: string;
  bilingualLabel?: string;
  prefix?: string;
  suffix?: string;
  accent?: "cyan" | "emerald" | "amber" | "pink" | "blue";
  delay?: number;
  format?: "int" | "decimal" | "compact";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView || prefersReduced) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(value * eased);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    const timeout = window.setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, [inView, value, delay, prefersReduced]);

  const formatted = (() => {
    if (format === "decimal") return display.toFixed(1);
    if (format === "compact") {
      if (display >= 1000) return (display / 1000).toFixed(1) + "k";
      return Math.round(display).toString();
    }
    return Math.round(display).toLocaleString();
  })();

  const accentClass = {
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    pink: "text-pink-300",
    blue: "text-sky-300",
  }[accent];

  const glowClass = {
    cyan: "from-cyan-500/15",
    emerald: "from-emerald-500/15",
    amber: "from-amber-500/15",
    pink: "from-pink-500/15",
    blue: "from-sky-500/15",
  }[accent];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-xl p-6 group hover:border-white/15 transition-colors"
    >
      <div
        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-radial ${glowClass} to-transparent blur-2xl opacity-60 pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className={`text-2xl font-light ${accentClass} opacity-70`}>
              {prefix}
            </span>
          )}
          <span
            className={`text-4xl sm:text-5xl font-extralight tracking-tight tabular-nums ${accentClass}`}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatted}
          </span>
          {suffix && (
            <span className={`text-2xl font-light ${accentClass} opacity-70`}>
              {suffix}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-white/55 font-mono uppercase tracking-wider">
          {label}
        </p>
        {bilingualLabel && (
          <p className="text-[10px] text-white/30 mt-0.5 tracking-wide">
            {bilingualLabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}
