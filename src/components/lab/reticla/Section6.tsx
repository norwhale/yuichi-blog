"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ASSETS = "https://qclay.design/lovable/reticla/section-6";

type Review = {
  text: string;
  name: string;
  role: string;
  avatar: string;
  glowColor: string;
};

const reviews: Review[] = [
  {
    text: "MedMentor gave me answers I used to spend hours hunting through PDFs for. Quizzes, explanations, and review queues are always clear — which makes my study sessions calmer and far more focused.",
    name: "Ayaka S.",
    role: "Medical student, Sofia",
    avatar: "review-1.png",
    glowColor: "#AB6140",
  },
  {
    text: "I finally stopped panicking before exams. MedMentor flags my weak topics early and explains what's actually missing, so I can fix gaps before they turn into red marks.",
    name: "Kenta H.",
    role: "Third-year, Pleven Medical University",
    avatar: "review-2.png",
    glowColor: "#AB6140",
  },
  {
    text: "Bilingual mode is the killer feature. I think in Japanese, study in English, and MedMentor speaks both — far less friction than YouTube tutorials and far more relevant than Anki decks.",
    name: "Hiroshi Y.",
    role: "Pre-med, Tokyo → Pleven",
    avatar: "review-3.png",
    glowColor: "#AB6140",
  },
  {
    text: "I came back to studying after years away from school. MedMentor doesn't judge how slow I am, it just keeps the next question ready. That's the only thing that actually worked for me.",
    name: "Yuichi K.",
    role: "33-year-old career switcher",
    avatar: "review-4.png",
    glowColor: "#AB6140",
  },
];

const CARD_WIDTH = 484; // 464 + 20 gap

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % reviews.length) * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 464,
        height: 360,
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      {/* Surface with masked glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: 464,
          height: 360,
          borderRadius: 24,
          background: "#3D3D3D",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          transform: hovered ? "scale(1.015)" : "scale(1)",
          transition: "transform 0.35s ease",
        }}
      >
        {/* Volumetric glow — sits beyond the top edge but masked by overflow:hidden */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgb(186, 105, 69)",
            filter: "blur(85px)",
            top: -370,
            left: "80%",
            transform: "translateX(-50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.55s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 32px 50px",
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 24,
                fontWeight: 100,
                lineHeight: "26px",
                color: "#FFFFFF",
                width: 373,
                maxWidth: "100%",
                margin: 0,
              }}
            >
              {review.text}
            </p>
          </div>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src={`${ASSETS}/${review.avatar}`}
              alt={review.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "1.5px solid rgba(255,255,255,0.12)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 18,
                  fontWeight: 100,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                }}
              >
                {review.name}
              </div>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 17,
                  fontWeight: 100,
                  color: "rgba(255,255,255,0.50)",
                  lineHeight: 1.2,
                }}
              >
                {review.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Section6 = () => {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const loopWidth = reviews.length * CARD_WIDTH;
  // Render the list 3x for seamless infinite scroll
  const looped = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    if (paused || dragging) return;
    const interval = setInterval(() => {
      setAnimate(true);
      setOffset((prev) => prev + CARD_WIDTH);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, dragging]);

  // Seamless wrap: when we cross one full loop, jump back without transition
  useEffect(() => {
    if (offset >= loopWidth) {
      const id = setTimeout(() => {
        setAnimate(false);
        setOffset((prev) => prev - loopWidth);
      }, 800);
      return () => clearTimeout(id);
    }
    if (offset < 0) {
      const id = setTimeout(() => {
        setAnimate(false);
        setOffset((prev) => prev + loopWidth);
      }, 800);
      return () => clearTimeout(id);
    }
  }, [offset, loopWidth]);

  // Re-enable animation on the next frame after a non-animated jump
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const onDown = (clientX: number) => {
    setDragging(true);
    startXRef.current = clientX;
    startOffsetRef.current = offset;
  };
  const onMove = (clientX: number) => {
    if (!dragging) return;
    const delta = startXRef.current - clientX;
    setAnimate(false);
    setOffset(startOffsetRef.current + delta);
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    const snapped = Math.round(offset / CARD_WIDTH) * CARD_WIDTH;
    setAnimate(true);
    setOffset(snapped);
  };

  const headingWords = "And these are just a few of the students.".split(" ");

  return (
    <section
      style={{
        background: "#000000",
        padding: "80px 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "0 40px", marginBottom: 56 }}>
        <h2
          className="r-s6-h2"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 72,
            fontWeight: 100,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            color: "#FFFFFF",
            maxWidth: 720,
            margin: "0 auto 16px",
            textAlign: "center",
          }}
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.055, ease: "easeOut" }}
              style={{ display: "inline-block", marginRight: "0.2em" }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            fontWeight: 100,
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Hear more from real users
        </motion.p>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to right, #000000 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to left, #000000 0%, transparent 100%)",
          }}
        />

        <div
          onMouseDown={(e) => onDown(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={(e) => onDown(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onUp}
          style={{
            display: "flex",
            gap: 20,
            padding: "20px 80px 40px",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            transform: `translateX(-${offset}px)`,
            transition: animate
              ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "none",
            willChange: "transform",
          }}
        >
          {looped.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section6;
