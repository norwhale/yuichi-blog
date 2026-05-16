"use client";

import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/lab/reticla/MagneticButton";
import Section4 from "@/components/lab/reticla/Section4";
import Section5 from "@/components/lab/reticla/Section5";
import Section6 from "@/components/lab/reticla/Section6";
import Section7 from "@/components/lab/reticla/Section7";
import Footer from "@/components/lab/reticla/Footer";


const useInView = <T extends HTMLElement>(threshold = 0.25) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
};


const TYPING_QUESTIONS = [
  "What is the action potential threshold?",
  "How do covalent bonds form?",
  "Explain the brachial plexus.",
  "Test me on neuroanatomy.",
];

const TypingPlaceholder = () => {
  const [text, setText] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_QUESTIONS[qIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 30);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setQIndex((i) => (i + 1) % TYPING_QUESTIONS.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, qIndex]);

  return (
    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
      {text}
      <span
        style={{
          display: "inline-block",
          width: 1,
          height: "1em",
          background: "rgba(255,255,255,0.7)",
          marginLeft: 2,
          verticalAlign: "middle",
          animation: "reticla-blink 1s step-end infinite",
        }}
      />
    </span>
  );
};

const ASSETS = "https://qclay.design/lovable/reticla";

const titleLines = ["AI study companion that", "makes you smarter."];

const Index = () => {
  const block1 = useInView<HTMLDivElement>(0.2);
  const block2 = useInView<HTMLDivElement>(0.2);
  const block3 = useInView<HTMLDivElement>(0.2);
  const block4 = useInView<HTMLDivElement>(0.2);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(179deg, #767676 -43.55%, #000 90.05%)" }}
    >
      {/* Navbar */}
      <nav
        className="r-nav fixed z-50 flex items-center justify-between"
        style={{
          top: 24,
          left: 24,
          right: 24,
          padding: "12px 14px",
          borderRadius: 48,
          border: "1px solid rgb(153 153 153 / 19%)",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(57px)",
          WebkitBackdropFilter: "blur(57px)",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center" style={{ position: "relative", zIndex: 1 }}>
          <a
            href="/"
            className="r-nav-logo flex items-center"
            style={{
              marginRight: 20,
              paddingLeft: 12,
              textDecoration: "none",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: "linear-gradient(135deg, #06B6D4 0%, #3b82f6 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              YB
            </span>
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              yuichi.blog
            </span>
          </a>
          <div
            className="r-nav-divider"
            style={{
              width: 1,
              height: 20,
              background: "rgba(255,255,255,0.15)",
              marginRight: 20,
            }}
          />
          <div className="r-nav-links flex items-center" style={{ gap: 4 }}>
            <NavLink label="Home" active />
            <NavLink label="MedMentor" hasArrow />
            <NavLink label="Blog" />
            <NavLink label="Lab" />
            <NavLink label="About" />
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 10, position: "relative", zIndex: 1 }}>
          <button
            className="r-nav-lang flex items-center transition-colors"
            style={{
              gap: 6,
              padding: "6px 10px",
              borderRadius: 8,
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <img
              src={`${ASSETS}/language.svg`}
              alt=""
              width={16}
              height={16}
              style={{ opacity: 0.65 }}
            />
            <span
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              English
            </span>
          </button>

          <MagneticButton
            circleColor="rgba(255,255,255,0.12)"
            circleSize={200}
            style={{
              display: "flex",
              padding: "10px 16px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.16)",
              boxShadow: "0 8px 12px 0 rgba(0,0,0,0.08)",
              backdropFilter: "blur(17px)",
              WebkitBackdropFilter: "blur(17px)",
              color: "#FFFFFF",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Book a demo
          </MagneticButton>

          <MagneticButton
            circleColor="rgba(0,0,0,0.15)"
            circleSize={200}
            style={{
              borderRadius: 9999,
              background: "#FFFFFF",
              color: "#111111",
              border: "none",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            <img src={`${ASSETS}/apple.svg`} alt="" width={14} height={14} />
            <span className="r-nav-download-text">Open MedMentor</span>
          </MagneticButton>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="r-mobile-menu-btn items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              color: "#FFF",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`r-mobile-menu ${mobileOpen ? "open" : ""}`} role="menu">
        <a href="#" onClick={() => setMobileOpen(false)}>Home</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Agents</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Changelog</a>
        <a href="#" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#" onClick={() => setMobileOpen(false)}>English</a>
      </div>

      {/* Hero section */}
      <section className="relative w-full" style={{ overflow: "hidden" }}>
        {/* Stones */}
        <motion.img className="r-hero-stone"
          src={`${ASSETS}/stone-l.png`}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "70vh",
            width: "auto",
            objectFit: "contain",
            objectPosition: "left center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <motion.img className="r-hero-stone"
          src={`${ASSETS}/stone-r.png`}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "70vh",
            width: "auto",
            objectFit: "contain",
            objectPosition: "right center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <motion.img
          src={`${ASSETS}/stone-d.png`}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "0%",
            width: "100%",
            maxWidth: 1460,
            height: "auto",
            objectFit: "contain",
            transform: "translateX(-50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Bottom gradient overlay anchored to hero */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "13vh",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.36) 36%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0.95) 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div
          className="r-hero-padtop relative flex flex-col items-center text-center"
          style={{ zIndex: 10, paddingTop: 130 }}
        >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="inline-flex items-center"
          style={{
            gap: 8,
            background: "rgba(60,60,65,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9999,
            padding: "6px 14px",
            marginBottom: 24,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#E8642A",
              flexShrink: 0,
              animation: "rec-blink 1.4s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: "rgba(255,255,255,0.80)",
            }}
          >
            Smart way of studying
          </span>
        </motion.div>

        <h1
          className="r-hero-h1"
          style={{
            width: 705,
            maxWidth: "100%",
            margin: "0 auto 20px",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 72,
            fontStyle: "normal",
            fontWeight: 300,
            lineHeight: "64px",
            letterSpacing: "-3px",
            color: "#FFF",
            textAlign: "center",
          }}
        >
          {titleLines.map((line, lineIdx) => (
            <div key={lineIdx} style={{ display: "block", whiteSpace: "nowrap" }}>
              {line.split(" ").map((word, i) => {
                const delay = (lineIdx * 4 + i) * 0.055;
                return (
                  <motion.span
                    key={`${lineIdx}-${i}`}
                    initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.55, delay, ease: "easeOut" }}
                    style={{ display: "inline-block", marginRight: "0.2em" }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="r-hero-sub"
          style={{
            maxWidth: 420,
            margin: "0 auto 32px",
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
          }}
        >
          Get real-time explanations during study. MedMentor pulls context from your textbooks and past sessions in under a second.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="r-hero-buttons flex items-center justify-center"
          style={{ gap: 12, marginBottom: 56 }}
        >
          <MagneticButton
            circleColor="rgba(255,255,255,0.10)"
            circleSize={300}
            className="r-cta-pulse"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 9999,
              color: "#FFFFFF",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              height: 48,
              padding: "0 28px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            Book a demo
          </MagneticButton>

          <MagneticButton
            circleColor="rgba(0,0,0,0.08)"
            circleSize={300}
            className="r-cta-pulse"
            style={{
              background: "#FFFFFF",
              border: "1px solid transparent",
              boxSizing: "border-box",
              borderRadius: 9999,
              color: "#111111",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              height: 48,
              padding: "0 28px",
              cursor: "pointer",
            }}
          >
            Talk to AI assistant
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="r-hero-shot"
          style={{
            position: "relative",
            zIndex: 5,
            width: "100%",
            maxWidth: 990,
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          <img
            src={`${ASSETS}/interface.png`}
            alt="MedMentor study interface"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "16px 16px 0 0",
              boxShadow:
                "0 -4px 40px rgba(0,0,0,0.40), 0 -1px 0 rgba(255,255,255,0.08)",
              display: "block",
            }}
          />
        </motion.div>
        </div>
      </section>

      {/* Trusted by Populars */}
      <section
        className="r-trusted"
        style={{
          position: "relative",
          zIndex: 30,
          background: "#000",
          padding: "80px 0 64px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 20,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            marginBottom: 40,
          }}
        >
          Trusted by Populars
        </p>
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 25%, #000 75%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, #000 25%, #000 75%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee-x 35s linear infinite",
            }}
          >
            {[0, 1].map((dup) => (
              <div
                key={dup}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 80,
                  paddingRight: 80,
                  flexShrink: 0,
                }}
                aria-hidden={dup === 1}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <img
                    key={n}
                    src={`${ASSETS}/logo-${n}.svg`}
                    alt=""
                    style={{
                      display: "block",
                      height: 40,
                      width: "auto",
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Live Suggestions */}
      <section
        className="r-section-pad r-pad-x"
        style={{
          position: "relative",
          zIndex: 30,
          background: "#000",
          padding: "120px 0 120px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            className="r-section-eyebrow"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 18,
            }}
          >
            Live Suggestions
          </p>
          <h2
            className="r-section-h2"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 64,
              fontWeight: 300,
              lineHeight: "68px",
              letterSpacing: "-2.5px",
              color: "#FFF",
              margin: "0 auto 24px",
              maxWidth: 900,
            }}
          >
            MedMentor gives you live<br />feedback during study sessions.
          </h2>
          <p
            className="r-section-sub"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            From ideas to actions our AI listens, understands, and guides your meetings instantly.
          </p>
        </div>

        <div
          style={{
            maxWidth: 1436,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "580px 832px",
            gap: 24,
            justifyContent: "center",
          }}
          className="r-grid-3"
        >
          {/* Block 1 — AI Answers */}
          <div ref={block1.ref} className="r-card-small">
            <div
              style={{
                opacity: block1.inView ? 1 : 0,
                filter: block1.inView ? "blur(0)" : "blur(12px)",
                transform: block1.inView ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.9s ease-out, filter 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 580,
                height: 520,
                backgroundImage: `url(${ASSETS}/section-3/back-1.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="r-card-inner-fixed"
                style={{
                  position: "relative",
                  width: 454,
                  borderRadius: 24,
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background: "rgba(51, 51, 51, 0.60)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${ASSETS}/section-3/blur-left.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                />
                <img
                  src={`${ASSETS}/section-3/blur-top.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      MedMentor
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "#7FE6C9",
                        border: "1px solid rgba(127,230,201,0.4)",
                        padding: "2px 8px",
                        borderRadius: 9999,
                      }}
                    >
                      Chat bot
                    </span>
                  </div>
                  <button
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.85)",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "5px 12px",
                      borderRadius: 9999,
                      cursor: "pointer",
                    }}
                  >
                    Migrate
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#FFF",
                    marginBottom: 14,
                  }}
                >
                  Start a conversation
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img src={`${ASSETS}/section-3/stars.svg`} alt="" style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#FFF" }}>AI Answers</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        Instant answers to your questions
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "#7FE6C9",
                        border: "1px solid rgba(127,230,201,0.4)",
                        padding: "1px 8px",
                        borderRadius: 9999,
                        marginBottom: 2,
                        display: "inline-block",
                      }}
                    >
                      1 hour
                    </div>
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      Response
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter Display', 'Inter Tight', sans-serif",
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: "17px",
                    letterSpacing: "-0.6px",
                    marginLeft: 48,
                    marginBottom: 16,
                    background:
                      "linear-gradient(176deg, rgba(255, 255, 255, 0.10) 19.5%, rgba(255, 255, 255, 0.02) 73.22%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  I hear you, but most teams actually end up paying less with meetings once backups we will transfer ro doc that are included.
                </p>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                     padding: "12px 16px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 16,
                    background: "rgba(0,0,0,0.34)",
                    boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.12) inset",
                    width: "100%",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      content: '""',
                      pointerEvents: "none",
                      position: "absolute",
                      opacity: 0.5,
                      inset: 0,
                      borderRadius: 16,
                      border: "1px solid transparent",
                      background:
                        "linear-gradient(210deg, rgba(255, 255, 255, 0.22) 6.2%, rgba(20, 20, 20, 0.5) 21.56%, rgba(50, 50, 50, 0.5) 69.03%, rgba(255, 255, 255, 0.4) 96.99%) border-box",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                    }}
                  />
                  {block1.inView ? (
                    <TypingPlaceholder />
                  ) : (
                    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                      Type your question
                    </span>
                  )}
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "4px 8px",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 20,
                      border: "1px solid transparent",
                      background:
                        "linear-gradient(#292929, #292929) padding-box, linear-gradient(178.8deg, rgba(255, 255, 255, 0.2464) 10.85%, rgba(20, 20, 20, 0.46) 24.36%, rgba(50, 50, 50, 0.46) 73.67%, rgba(255, 255, 255, 0.46) 90.68%) border-box",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      opacity: 0.95,
                      boxShadow:
                        "0 51px 85px 0 rgba(0, 0, 0, 0.45), 0 30.029px 44.336px 0 rgba(0, 0, 0, 0.32), 0 15.422px 20.808px 0 rgba(0, 0, 0, 0.25), 0 6.202px 9.112px 0 rgba(0, 0, 0, 0.20), 0 1.387px 3.944px 0 rgba(0, 0, 0, 0.13)",
                    }}
                  >
                    <img src={`${ASSETS}/section-3/cmd.svg`} alt="" style={{ width: 11, height: 11, display: "block" }} />
                    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>
                      +K
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 24,
                opacity: block1.inView ? 1 : 0,
                filter: block1.inView ? "blur(0)" : "blur(10px)",
                transition: "opacity 0.9s ease-out 0.3s, filter 0.9s ease-out 0.3s",
              }}
            >
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
                AI Answers
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 100, color: "#FFF", marginBottom: 10 }} className="r-block-h3">
                Instant answers from your docs
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                MedMentor finds the right explanation in under a second, so you never lose momentum mid-session.
              </p>
            </div>
          </div>

          {/* Block 2 — Suggestions / Dashboard */}
          <div ref={block2.ref} className="r-card-large">
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 832,
                height: 520,
                backgroundImage: `url(${ASSETS}/section-3/back-2.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "8%",
                  top: "12%",
                  right: "-2%",
                  bottom: 0,
                  borderRadius: "24px 0 0 0",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background: "rgba(51, 51, 51, 0.60)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  display: "flex",
                  overflow: "hidden",
                  clipPath: "inset(0 0 0 0)",
                  opacity: block2.inView ? 1 : 0,
                  transform: block2.inView ? "translateY(0)" : "translateY(40px)",
                  transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
                }}
              >
                {/* Blurs inside dashboard card */}
                <img
                  src={`${ASSETS}/section-3/blur-left.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
                />
                <img
                  src={`${ASSETS}/section-3/blur-top.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0 }}
                />
                {/* Sidebar */}
                <div
                  style={{
                    paddingTop: 30,
                    paddingLeft: 24,
                    paddingRight: 20,
                    display: "flex",
                    gap: 20,
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                    {["home", "heart", "phone", "hat", "folder", "stack", "user", "layout", "sun"].map((ic, i) => (
                      <img
                        key={ic}
                        src={`${ASSETS}/section-3/${ic}.svg`}
                        alt=""
                        style={{
                          width: 20,
                          height: 20,
                          opacity: block2.inView ? (i === 0 ? 1 : 0.55) : 0,
                          transform: block2.inView ? "translateX(0)" : "translateX(-12px)",
                          transition: `opacity 0.5s ease-out ${0.5 + i * 0.08}s, transform 0.5s ease-out ${0.5 + i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ position: "relative", width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.10)" }}>
                    {/* active indicator for home (first icon) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: -0.5,
                        width: 2,
                        height: 30,
                        background: "#FFFFFF",
                        borderRadius: 2,
                        opacity: block2.inView ? 1 : 0,
                        transform: block2.inView ? "translateY(0)" : "translateY(-12px)",
                        transition: "opacity 0.5s ease-out 1.3s, transform 0.5s ease-out 1.3s",
                      }}
                    />
                  </div>
                </div>
                {/* Main */}
                <div style={{ flex: 1, padding: "30px 24px 20px", display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.6s, filter 0.7s ease-out 0.6s" }}>
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                      Home/ <span style={{ color: "#FFF" }}>Results</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.85)",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          padding: "5px 12px",
                          borderRadius: 9999,
                          cursor: "pointer",
                        }}
                      >
                        Migrate
                      </button>
                      <img src={`${ASSETS}/section-3/settings.svg`} alt="" style={{ width: 18, height: 18, opacity: 0.7 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.75s, filter 0.7s ease-out 0.75s" }}>
                    <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 400, color: "#FFF" }}>
                      Welcome! John
                    </h4>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.7)",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        padding: "3px 4px 3px 10px",
                        borderRadius: 9999,
                      }}
                    >
                      Rearrange
                      <span
                        style={{
                          color: "#E8642A",
                          border: "1px solid rgba(232,100,42,0.5)",
                          borderRadius: 9999,
                          padding: "1px 7px",
                          fontSize: 10,
                        }}
                      >
                        1 hour
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      background: "rgba(51, 51, 51, 0.80)",
                      padding: "20px 24px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.85s, filter 0.7s ease-out 0.85s" }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, color: "#FFF" }}>
                        Annual Success history
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.85)",
                          padding: "4px 8px",
                          borderRadius: 20,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                        }}
                      >
                        Data <span style={{ color: "rgba(255,255,255,0.5)" }}>Yearly ▾</span>
                      </span>
                    </div>
                    {/* Bars */}
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 10, paddingBottom: 0, overflow: "hidden" }}>
                      {[
                        { label: "Cold Transfer", value: "40%", delta: "+15%", h: 280, accent: true },
                        { label: "Meetings", value: "20%", delta: "+7%", h: 246, accent: false },
                        { label: "Batch Call", value: "10%", delta: "+8%", h: 198, accent: false },
                        { label: "MedMentor Hints", value: "24%", delta: "+3%", h: 269, accent: false },
                      ].map((b, i) => (
                        <div key={b.label} style={{ width: 152, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <div
                            style={{
                              color: "#FFF",
                              fontSize: 10,
                              fontWeight: 300,
                              lineHeight: "normal",
                              marginBottom: 4,
                              opacity: block2.inView ? 1 : 0,
                              filter: block2.inView ? "blur(0)" : "blur(6px)",
                              transition: `opacity 0.6s ease-out ${1.0 + i * 0.1}s, filter 0.6s ease-out ${1.0 + i * 0.1}s`,
                            }}
                          >
                            {b.label}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 6,
                              marginBottom: 6,
                              opacity: block2.inView ? 1 : 0,
                              filter: block2.inView ? "blur(0)" : "blur(6px)",
                              transition: `opacity 0.6s ease-out ${1.05 + i * 0.1}s, filter 0.6s ease-out ${1.05 + i * 0.1}s`,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: 20,
                                fontWeight: 300,
                                color: "#FFF",
                                lineHeight: "normal",
                                letterSpacing: "-0.6px",
                              }}
                            >
                              {b.value}
                            </span>
                            <span
                              style={{
                                color: "#FFF",
                                fontSize: 10,
                                fontWeight: 300,
                                lineHeight: "normal",
                                opacity: 0.5,
                              }}
                            >
                              {b.delta}
                            </span>
                          </div>
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: b.h,
                              borderTop: b.accent ? "1px solid rgb(255, 119, 46)" : "1px solid rgba(255,255,255,0.6)",
                              background: "rgba(255,255,255,0.18)",
                              transformOrigin: "bottom",
                              transform: block2.inView ? "scaleY(1)" : "scaleY(0)",
                              transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${0.9 + i * 0.12}s`,
                            }}
                          >
                            {b.accent && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: "20%",
                                  background:
                                    "linear-gradient(rgb(199, 83, 20) 0%, rgba(255, 119, 46, 0) 100%)",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Fade gradient above the entire dashboard */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  pointerEvents: "none",
                  zIndex: 3,
                  background:
                    "linear-gradient(rgba(51, 51, 51, 0) 20%, rgb(51, 51, 51) 70%, rgb(30, 30, 30) 100%)",
                }}
              />
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#E8642A", marginBottom: 8 }}>
                Suggestions
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 100, color: "#FFF", marginBottom: 10 }} className="r-block-h3">
                Learn from what worked before
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                Answers from past meetings become suggestions for future ones.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row — Cold Transfer (wide left) + Briefing (narrow right) */}
        <div
          style={{
            maxWidth: 1436,
            margin: "32px auto 0",
            display: "grid",
            gridTemplateColumns: "832px 580px",
            gap: 24,
            justifyContent: "center",
          }}
          className="r-grid-3"
        >
          {/* Block 3 — Cold Transfer */}
          <div ref={block3.ref} className="r-card-large">
            <div
              style={{
                opacity: block3.inView ? 1 : 0,
                transform: block3.inView ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 832,
                height: 520,
                backgroundImage: `url(${ASSETS}/section-3/back-3.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "6%",
                  top: "10%",
                  right: "-2%",
                  bottom: 0,
                  borderRadius: "24px 0 0 0",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background: "rgba(51, 51, 51, 0.60)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  padding: "28px 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${ASSETS}/section-3/blur-left.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
                />
                <img
                  src={`${ASSETS}/section-3/blur-top.svg`}
                  alt=""
                  style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0 }}
                />
                <h4
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 28,
                    fontWeight: 100,
                    color: "#FFF",
                    marginBottom: 22,
                    position: "relative",
                    zIndex: 1,
                    opacity: block3.inView ? 1 : 0,
                    filter: block3.inView ? "blur(0)" : "blur(8px)",
                    transition: "opacity 0.7s ease-out 0.3s, filter 0.7s ease-out 0.3s",
                  }}
                >
                  Turn handoffs into better outcomes
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16, flex: 1, position: "relative", zIndex: 1, minHeight: 0 }} className="r-cold-grid">
                  {/* Transfer meetings panel */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      opacity: block3.inView ? 1 : 0,
                      transform: block3.inView ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.7s ease-out 0.45s, transform 0.7s ease-out 0.45s",
                    }}
                  >
                    {/* Transfer meetings header pill */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderRadius: 16,
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 300, color: "#FFF" }}>
                        Transfer meetings
                      </span>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    </div>
                    {/* Recommendation row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", marginTop: 4 }}>
                      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
                        Recommendation
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "#E8642A",
                          border: "1px solid rgba(232,100,42,0.6)",
                          padding: "4px 14px",
                          borderRadius: 9999,
                        }}
                      >
                        Sync
                      </span>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "2px 4px 0" }} />
                    {/* Meeting rows */}
                    {[
                      { name: "Product meeting", when: "Next week: 40 min", type: "Cold transfer", photo: "photo-1.png", bg: "rgba(0,0,0,0.45)" },
                      { name: "Handoff metting", when: "Next week: 55 min", type: "Warm transfer", photo: "photo-2.png", bg: "rgba(255,255,255,0.04)" },
                    ].map((m, i) => (
                      <div
                        key={m.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          borderRadius: 16,
                          background: m.bg,
                          border: "1px solid rgba(255,255,255,0.06)",
                          opacity: block3.inView ? 1 : 0,
                          transform: block3.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: `opacity 0.5s ease-out ${0.7 + i * 0.12}s, transform 0.5s ease-out ${0.7 + i * 0.12}s`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={`${ASSETS}/section-3/${m.photo}`}
                            alt=""
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 400, color: "#FFF" }}>{m.name}</div>
                            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                              {m.when}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 6px 5px 12px",
                            borderRadius: 9999,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(0,0,0,0.25)",
                            fontFamily: "'Inter Tight', sans-serif",
                            fontSize: 11,
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          Type{" "}
                          <span
                            style={{
                              color: "rgba(255,255,255,0.85)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 9999,
                              padding: "2px 10px",
                              background: "rgba(255,255,255,0.04)",
                            }}
                          >
                            {m.type} ▾
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Transformations panel */}
                   <div
                    style={{
                      position: "relative",
                      borderRadius: 24,
                      background: "rgba(51, 51, 51, 0.60)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      padding: "24px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      overflow: "hidden",
                      opacity: block3.inView ? 1 : 0,
                      transform: block3.inView ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.7s ease-out 0.55s, transform 0.7s ease-out 0.55s",
                    }}
                  >
                    {/* Decorative blurs & lightning */}
                    <img
                      src={`${ASSETS}/section-3/blur-l-top.svg`}
                      alt=""
                      style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0 }}
                    />
                    <img
                      src={`${ASSETS}/section-3/blur-l-left.svg`}
                      alt=""
                      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
                    />
                    <img
                      src={`${ASSETS}/section-3/lightning.png`}
                      alt=""
                      style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 1 }}
                    />
                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: -40 }}>
                      <div
                        className="route-circle"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img src={`${ASSETS}/section-3/route.svg`} alt="" style={{ width: 26, height: 26, opacity: 0.85 }} />
                      </div>
                      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, color: "#FFF" }}>
                        Transfermations
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.55)",
                          maxWidth: 200,
                          lineHeight: 1.5,
                        }}
                      >
                        Preparing structured data across the organisation.
                      </div>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        width: "70%",
                        height: 5,
                        borderRadius: 9999,
                        background: "rgba(255,255,255,0.10)",
                        overflow: "hidden",
                        marginTop: 20,
                        transform: "translateY(-5px)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: block3.inView ? "55%" : "0%",
                          background: "linear-gradient(90deg, #C24A1A 0%, #E8642A 60%, #FFB37A 100%)",
                          borderRadius: 9999,
                          transition: "width 1.2s ease-out 1s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom fade */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  pointerEvents: "none",
                  zIndex: 3,
                  background:
                    "linear-gradient(rgba(51, 51, 51, 0) 20%, rgb(51, 51, 51) 70%, rgb(30, 30, 30) 100%)",
                }}
              />
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
                Cold Transfer
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 100, color: "#FFF", marginBottom: 10 }} className="r-block-h3">
                Move calls forward with Call Transfer
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, width: 460 }} className="r-text-fixed">
                Seamlessly switch meetings with AI-powered warm and cold transfers that save time, maintain context, and keep customers engaged.
              </p>
            </div>
          </div>

          {/* Block 4 — Briefing */}
          <div ref={block4.ref} className="r-card-small">
            <div
              style={{
                opacity: block4.inView ? 1 : 0,
                filter: block4.inView ? "blur(0)" : "blur(12px)",
                transform: block4.inView ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.9s ease-out, filter 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 580,
                height: 520,
                backgroundImage: `url(${ASSETS}/section-3/back-4.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="r-card-inner-fixed"
                style={{
                  position: "relative",
                  width: 480,
                  borderRadius: 24,
                  border: "1px solid rgba(255, 255, 255, 0.40)",
                  background: "rgba(51, 51, 51, 0.70)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  overflow: "hidden",
                }}
              >
                {/* decorative top-left background image */}
                <img
                  src={`${ASSETS}/section-3/left-top-back.png`}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "60%",
                    height: "auto",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
                {/* decorative top image */}
                <img
                  src={`${ASSETS}/section-3/top-image.png`}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                {/* blur-r-top */}
                <img
                  src={`${ASSETS}/section-3/blur-r-top.svg`}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />

                {/* mac header */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "16px 20px 8px",
                  }}
                >
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF6D6D" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFCF5F" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#67D243" }} />
                </div>

                <div style={{ position: "relative", zIndex: 5, padding: "14px 24px 24px" }}>
                  <h5
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 20,
                      fontWeight: 100,
                      color: "#FFF",
                      marginBottom: 12,
                    }}
                  >
                    Informal Briefing
                  </h5>
                  <p
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 16,
                      fontWeight: 200,
                      color: "rgba(255,255,255,0.78)",
                      lineHeight: 1.5,
                      marginBottom: 18,
                    }}
                  >
                    This is our initial meeting with Urban Combinator. Previously, I was searching for a Calls and note-taking tool to reach out to team and AI.
                  </p>

                  {/* Inner darker card */}
                  <div
                    style={{
                      borderRadius: 16,
                      background: "rgba(20,20,20,0.55)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "18px 20px",
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 16, color: "#FFF", fontWeight: 300 }}>Company</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 16, color: "#FFF", fontWeight: 300 }}>Participations</div>
                    </div>

                    {/* Established / Uorban */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", paddingTop: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "rgba(255,255,255,0.5)" }}>Established</div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "#FFF" }}>2022</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: block4.inView ? 1 : 0,
                          transform: block4.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: "opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img src={`${ASSETS}/section-3/photo-3.png`} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(20,20,20,1)" }} />
                          <img src={`${ASSETS}/section-3/photo-4.png`} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(20,20,20,1)", marginLeft: -10 }} />
                        </div>
                        <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "#FFF" }}>Uorban team</span>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#67D243", marginLeft: "auto" }} />
                      </div>
                    </div>

                    {/* Industry / Abinewon */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", paddingTop: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "rgba(255,255,255,0.5)" }}>Industry</div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "#FFF" }}>MedMentor</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: block4.inView ? 1 : 0,
                          transform: block4.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: "opacity 0.5s ease-out 0.65s, transform 0.5s ease-out 0.65s",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img src={`${ASSETS}/section-3/photo-1.png`} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(20,20,20,1)" }} />
                          <img src={`${ASSETS}/section-3/photo-2.png`} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(20,20,20,1)", marginLeft: -10 }} />
                        </div>
                        <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 200, color: "#FFF" }}>Abinewon team</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#34D17A", marginBottom: 8 }}>
                Briefing
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 100, color: "#FFF", marginBottom: 10 }} className="r-block-h3">
                Quick briefs before every call
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                Retlica pulls relevant info from your calendar, email, and CRM into one view.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Footer />

    </div>
  );
};

const NavLink = ({
  label,
  active,
  hasArrow,
}: {
  label: string;
  active?: boolean;
  hasArrow?: boolean;
}) => {
  return (
    <button
      className="flex items-center transition-colors"
      style={{
        gap: 4,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: 14,
        fontWeight: active ? 500 : 400,
        color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
        padding: "6px 12px",
        borderRadius: 8,
        background: active ? "rgba(255,255,255,0.10)" : "transparent",
        cursor: "pointer",
        border: "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "rgba(255,255,255,0.90)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.65)";
        }
      }}
    >
      {label}
      {hasArrow && <ChevronDown size={13} color="rgba(255,255,255,0.65)" />}
    </button>
  );
};

export default Index;
