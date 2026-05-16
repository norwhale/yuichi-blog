"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * QClay-style infinite horizontal marquee. Two duplicate strips translate
 * by their own width with a linear loop so there's never a visible "seam"
 * when the scroll wraps.
 *
 * Respects prefers-reduced-motion: when the user prefers reduced motion we
 * collapse the marquee to a static centered line so we never spin pixels
 * for nothing.
 */
export default function MarqueeText({
  items,
  speed = 40,
  className = "",
}: {
  items: string[];
  /** Seconds per full loop. Lower = faster. */
  speed?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div
        className={`overflow-hidden whitespace-nowrap text-center text-white/30 ${className}`}
      >
        {items.join(" · ")}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.4em] text-white/30 uppercase"
          >
            <span className="w-1 h-1 rounded-full bg-cyan-400/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
