"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ASSETS = "https://qclay.design/lovable/reticla/section-5";

const DOT_COUNT = 46;

const useWave = (speed: number, phase = 0) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let id: number;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  const center = (DOT_COUNT - 1) / 2;
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const d = Math.abs(i - center);
    const v = Math.sin(t * speed - d * 0.45 + phase);
    return Math.max(0, v);
  });
};

const EqualizerRow = ({ values }: { values: number[] }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2.5 }}>
    {values.map((v, i) => {
      // Base white dot, lerp to orange based on intensity
      const r = Math.round(255 * 0.2 + (232 - 255 * 0.2) * v);
      const g = Math.round(255 * 0.2 + (100 - 255 * 0.2) * v);
      const b = Math.round(255 * 0.2 + (42 - 255 * 0.2) * v);
      const a = 0.2 + 0.8 * v;
      return (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            background: `rgba(${r}, ${g}, ${b}, ${a})`,
          }}
        />
      );
    })}
  </div>
);

const HEADING = "Connect your study with the rest of your life.";
const TABS = ["Topics", "Quizzes", "Sessions", "Reviews"];
const CHECKLIST = [
  "Capture every concept with bilingual explanations (English + Japanese)",
  "Instantly generate quiz questions and feedback from raw lecture notes",
  "Turn passive reading into active recall in seconds, on any device",
];

const Section5 = () => {
  const row1 = useWave(6, 0);
  const row2 = useWave(5, 1.2);

  return (
    <section
      style={{
        background: "#000000",
        padding: "80px 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes s5-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="r-pad-x" style={{ textAlign: "center", marginBottom: 64 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "block",
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(255,255,255,0.40)",
            letterSpacing: "0.5px",
            marginBottom: 14,
          }}
        >
          Team Collaboration
        </motion.span>

        <h2
          className="r-s5-h2"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 66,
            fontWeight: 400,
            lineHeight: 1.06,
            letterSpacing: "-2px",
            color: "#FFFFFF",
            maxWidth: 720,
            margin: "0 auto 16px",
            textAlign: "center",
          }}
        >
          {HEADING.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              style={{ display: "inline-block", marginRight: "0.2em" }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          Stop switching between meeting notes and disconnected apps, and bring conversations directly into your workflow
        </motion.p>
      </div>

      {/* Two columns */}
      <div
        className="r-s5-grid r-pad-x"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
          gap: 80,
        }}
      >
        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: 480, paddingTop: 20 }}>
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "block",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 16,
            }}
          >
            Syncing
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            MedMentor turns your lecture notes into spaced-repetition flashcards.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.50)",
              marginBottom: 32,
            }}
          >
            Get transcripts, video recordings, and AI-powered summaries in your private Docs.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {CHECKLIST.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={`${ASSETS}/check.svg`}
                  alt=""
                  style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0, opacity: 0.8 }}
                />
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.70)",
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="r-s5-right"
          style={{ flex: 1, maxWidth: 580, display: "flex", flexDirection: "column" }}
        >
        <div
          style={{
            position: "relative",
            height: 560,
          }}
        >
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden" }}>
            <img
              src={`${ASSETS}/right-card.png`}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 100%)",
              zIndex: 1,
            }}
          />

          {/* Card + tabs wrapper */}
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 32,
              right: 32,
              zIndex: 10,
            }}
          >
          {/* Notes card */}
          <div
            style={{
              position: "relative",
              background: "rgba(51, 51, 51, 0.60)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: 24,
              padding: "24px 24px 20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.50)",
              overflow: "hidden",
            }}
          >
            <img
              src="https://qclay.design/lovable/reticla/section-3/blur-left.svg"
              alt=""
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 20,
                  fontWeight: 100,
                  color: "#FFFFFF",
                  marginBottom: 12,
                }}
              >
                Design sync call Notes
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src={`${ASSETS}/profile-3.png`}
                  alt=""
                  style={{ width: 33, height: 33, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#FFFFFF",
                    }}
                  >
                    Zach blurg
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.40)",
                      }}
                    >
                      Last updated: Today at 21:38
                    </span>
                    <img
                      src={`${ASSETS}/clock.svg`}
                      alt=""
                      style={{ width: 11, height: 11, opacity: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Equalizer row */}
            <div
              style={{
                margin: "14px 0 14px",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 999,
                padding: "6px 14px 6px 6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  gap: 2.5,
                  marginRight: 12,
                }}
              >
                <span style={{ width: 2, height: 9, background: "#000", borderRadius: 1 }} />
                <span style={{ width: 2, height: 9, background: "#000", borderRadius: 1 }} />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  overflow: "hidden",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                }}
              >
                <EqualizerRow values={row1} />
                <EqualizerRow values={row2} />
              </div>
              <div
                style={{
                  marginLeft: 12,
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.45)",
                  flexShrink: 0,
                }}
              >
                32:43
              </div>
            </div>

            {/* Summary block */}
            <div
              style={{
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 20,
                  fontWeight: 100,
                  color: "#FFFFFF",
                  marginBottom: 10,
                }}
              >
                Summary
              </div>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 10,
                }}
              >
                The team brainstorm different design assets and aligned on which ones to use.
              </p>
              <div
                style={{
                  height: 8,
                  width: "85%",
                  borderRadius: 4,
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.07) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "s5-shimmer 2s linear infinite",
                }}
              />
              <div
                style={{
                  height: 8,
                  width: "65%",
                  borderRadius: 4,
                  marginTop: 6,
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "s5-shimmer 2s linear infinite",
                }}
              />
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.25)",
                  marginTop: 10,
                }}
              >
                See everything at a glance with Dashboards. Bring important project indicators into one place. Add visual widgets for team members.
              </p>
            </div>
            </div>
          </div>

          {/* Bottom tabs (inside card wrapper, centered under the card) */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {TABS.map((label, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  borderRadius: 40,
                  border: "1px solid rgba(148, 148, 148, 0.60)",
                  background: "rgba(73, 73, 73, 0.70)",
                  backdropFilter: "blur(48.5px)",
                  WebkitBackdropFilter: "blur(48.5px)",
                  display: "flex",
                  height: 40,
                  padding: "10px 18px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.75)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
              >
                {label}
              </motion.button>
            ))}
          </div>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Second block — card on the LEFT */}
      <div
        className="r-s5-grid r-pad-x"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "120px auto 0",
          gap: 80,
        }}
      >
        {/* LEFT — image card with stacked interfaces */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="r-s5-left-card"
          style={{ flex: 1, maxWidth: 580, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              position: "relative",
              height: 560,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <img
              src={`${ASSETS}/left-card.png`}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* card-1 (back) */}
            <motion.img
              src={`${ASSETS}/card-1.png`}
              alt=""
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: "52%",
                width: "70%",
                right: "18%",
                zIndex: 2,
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))",
              }}
            />

            {/* card-2 (front) */}
            <motion.img
              src={`${ASSETS}/card-2.png`}
              alt=""
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: "32%",
                width: "55%",
                right: 0,
                zIndex: 3,
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              }}
            />
          </div>
        </motion.div>

        {/* RIGHT — text */}
        <div style={{ flex: 1, maxWidth: 480, paddingTop: 20 }}>
          <motion.span
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "block",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 16,
            }}
          >
            Automation
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Meeting tasks get created, &amp; added automatically.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.50)",
              marginBottom: 32,
            }}
          >
            MedMentor will surface weak topics and queue the right follow-up questions as soon as your session ends.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 32,
            }}
          >
            {[
              "Detect weak spots and queue them for spaced repetition automatically",
              "Sync mastered concepts directly into your long-term memory map",
              "Never miss a review with our AI-powered scheduling",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={`${ASSETS}/check.svg`}
                  alt=""
                  style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0, opacity: 0.8 }}
                />
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.70)",
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              padding: "12px 22px",
              cursor: "pointer",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "#FFFFFF",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            Learn more
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Section5;
