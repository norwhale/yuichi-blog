"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fade-in variants for Framer Motion ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function LabPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  /* ─── GSAP Parallax ─── */
  useEffect(() => {
    if (!parallaxBgRef.current) return;

    gsap.to(parallaxBgRef.current, {
      y: "-20%",
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: parallaxBgRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* ─── Framer Motion parallax for hero text ─── */
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      {/* ━━━ Navigation ━━━ */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-mono font-bold text-sm group-hover:bg-cyan-400 transition-colors rounded-sm">
              YB
            </div>
            <span className="font-semibold tracking-tight">yuichi.lab</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span className="px-3 py-1 text-xs font-mono border border-cyan-400/30 text-cyan-400 rounded-full">
              EXPERIMENTAL
            </span>
          </div>
        </div>
      </nav>

      {/* ━━━ Hero Section with Parallax ━━━ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div
          ref={parallaxBgRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30,58,138,0.12) 0%, transparent 50%)",
            willChange: "transform",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em] mb-6"
          >
            Under Construction // Experimental
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8"
          >
            The Future of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Digital Medicine.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Exploring the convergence of artificial intelligence, brain-computer interfaces,
            and clinical practice — from a medical student&apos;s desk in Bulgaria.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="flex gap-4 justify-center"
          >
            <Link
              href="/"
              className="px-8 py-4 bg-white text-black font-medium hover:bg-cyan-400 transition-all duration-300 rounded-lg"
            >
              Read the Blog →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/20 text-white font-medium hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300 rounded-lg backdrop-blur-sm"
            >
              Get in Touch
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
            >
              <div className="w-1 h-2 bg-cyan-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━ Stats Section — Glass Morphism ━━━ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { num: "16+", label: "Published Essays", desc: "AI, Medicine, Life, and everything in between", icon: "01" },
              { num: "6", label: "Research Domains", desc: "BCI, OSINT, AI Warfare, Cell Biology, Geopolitics", icon: "02" },
              { num: "2", label: "Languages", desc: "Bilingual content in Japanese & English", icon: "03" },
            ].map((stat, i) => (
              <motion.div
                key={stat.icon}
                custom={i}
                variants={scaleIn}
                className="relative group"
              >
                <div className="relative p-8 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] overflow-hidden transition-all duration-500 hover:border-cyan-400/20 hover:bg-white/[0.06]">
                  {/* Gradient border glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 50%, rgba(139,92,246,0.05) 100%)" }}
                  />

                  <div className="relative z-10">
                    <span className="font-mono text-xs text-cyan-400/60 tracking-widest">[{stat.icon}]</span>
                    <div className="text-5xl font-extrabold mt-4 mb-2 tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                      {stat.num}
                    </div>
                    <h3 className="text-lg font-bold text-white/90 mb-2">{stat.label}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{stat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={3}
            variants={fadeUp}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/lab/synex-hero"
              className="group/cta relative inline-flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.04] px-8 py-5 text-sm text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/[0.08] hover:scale-[1.02]"
              style={{ boxShadow: "0 0 20px rgba(6,182,212,0.15), 0 0 60px rgba(6,182,212,0.05)" }}
            >
              {/* Animated glow ring */}
              <span className="absolute inset-0 rounded-2xl animate-pulse" style={{ boxShadow: "0 0 15px rgba(6,182,212,0.2), inset 0 0 15px rgba(6,182,212,0.05)" }} />
              <span className="relative font-mono text-cyan-400 font-bold">[NEW]</span>
              <span className="relative">Open the Synex-style landing page experiment</span>
              <span className="relative" aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Design System link */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={4}
            variants={fadeUp}
            className="mt-4 flex justify-center"
          >
            <Link
              href="/lab/design-system"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
            >
              <span className="font-mono text-white/40">[LAB]</span>
              <span>Explore the Claude-generated Design System</span>
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ Feature Cards — Glass Morphism Showcase ━━━ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div custom={0} variants={fadeUp} className="text-center mb-20">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em]">What I Build</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
                Clarity and control for every
                <br />
                part of your learning.
              </h2>
              <p className="text-white/40 mt-6 max-w-xl mx-auto">
                Tools, writings, and experiments at the intersection of technology and medicine.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "GeoIntel Dashboard",
                desc: "Real-time geopolitical intelligence powered by OSINT and AI. Monitoring global events as they unfold.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                accent: "text-cyan-400",
              },
              {
                title: "BCI Experiments",
                desc: "Brain-computer interface research using EEG headsets and machine learning to decode neural signals.",
                gradient: "from-green-500/20 to-emerald-500/20",
                accent: "text-green-400",
              },
              {
                title: "AI Study Tools",
                desc: "Using ChatGPT, Gemini, and Claude to revolutionize how medical students learn chemistry and anatomy.",
                gradient: "from-purple-500/20 to-pink-500/20",
                accent: "text-purple-400",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={scaleIn}
                className="group cursor-pointer"
              >
                <div className={`relative h-full p-8 rounded-2xl bg-gradient-to-br ${card.gradient} backdrop-blur-2xl border border-white/[0.08] overflow-hidden transition-all duration-500 hover:border-white/20 hover:scale-[1.02]`}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)" }}
                  />

                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-3 ${card.accent}`}>{card.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━ Comparison Table Section ━━━ */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div custom={0} variants={fadeUp} className="text-center mb-16">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.3em]">Why This Approach</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
                Built for modern learning.
                <br />
                Not legacy systems.
              </h2>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUp}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left p-5 text-sm text-white/40 font-mono">Capability</th>
                    <th className="text-center p-5 text-sm font-mono">
                      <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-lg">AI-Assisted</span>
                    </th>
                    <th className="text-center p-5 text-sm text-white/30 font-mono">Traditional</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Personalized explanations",
                    "Instant practice problems",
                    "Multi-language support",
                    "Visual diagrams on demand",
                    "24/7 availability",
                  ].map((cap, i) => (
                    <tr key={cap} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 text-sm text-white/60">{cap}</td>
                      <td className="p-5 text-center">
                        <span className="text-cyan-400 text-lg">✓</span>
                      </td>
                      <td className="p-5 text-center text-white/20 text-xs font-mono">
                        {i === 1 || i === 3 ? "✓" : "Absent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ CTA Section ━━━ */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
            >
              Still under construction.
              <br />
              <span className="text-white/40">But already alive.</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-white/40 text-lg mb-10">
              This page is an experiment in design and code. Follow the journey.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 bg-white text-black font-medium hover:bg-cyan-400 transition-all duration-300 rounded-lg"
              >
                Back to Blog
              </Link>
              <a
                href="https://x.com/Yu_Hyakuya123"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 text-white font-medium hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow @Yu_Hyakuya123
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-mono font-bold text-[10px] rounded-sm">
              YB
            </div>
            <span className="text-sm text-white/30">
              © {new Date().getFullYear()} Yuichi // Experimental Lab
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
