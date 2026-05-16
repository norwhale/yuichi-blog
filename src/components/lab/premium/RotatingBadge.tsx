"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * QClay-style rotating circular text badge. Renders the text along a
 * circular SVG path and continuously rotates the SVG wrapper. A center icon
 * (default: a small dot) stays still so the badge feels "weighty".
 */
export default function RotatingBadge({
  text = "SCROLL DOWN · EXPLORE · ",
  size = 110,
  duration = 18,
}: {
  text?: string;
  size?: number;
  duration?: number;
}) {
  const prefersReduced = useReducedMotion();
  // Repeat the text to fill the circle smoothly.
  const repeated = (text + text).slice(0, 90);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        animate={prefersReduced ? undefined : { rotate: 360 }}
        transition={
          prefersReduced
            ? undefined
            : { duration, ease: "linear", repeat: Infinity }
        }
        className="absolute inset-0"
      >
        <defs>
          <path
            id="rb-circle"
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="7.5"
          letterSpacing="2"
          className="text-cyan-400/60 font-mono uppercase"
        >
          <textPath href="#rb-circle">{repeated}</textPath>
        </text>
      </motion.svg>
      <span className="text-cyan-400/70 text-base">↓</span>
    </div>
  );
}
