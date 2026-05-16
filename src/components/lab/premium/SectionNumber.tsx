"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * QClay/Bogdan-style numbered section badge: a big monospace [01], [02], [03]
 * label paired with a short uppercase eyebrow and a fade-in underline.
 * Used at the top of each main section.
 */
export default function SectionNumber({
  number,
  eyebrow,
  title,
  bilingualTitle,
}: {
  number: string;
  eyebrow?: string;
  title: string;
  bilingualTitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div ref={ref} className="mb-10 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-3"
      >
        <span className="font-mono text-[11px] tracking-[0.3em] text-cyan-400/70 uppercase">
          [{number}]
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 via-white/10 to-transparent max-w-[120px]" />
        {eyebrow && (
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {eyebrow}
          </span>
        )}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white/95 leading-[1.05]"
      >
        {title}
      </motion.h2>
      {bilingualTitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-3 text-sm text-white/45 font-mono tracking-wide"
        >
          {bilingualTitle}
        </motion.p>
      )}
    </div>
  );
}
