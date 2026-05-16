"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "How accurate is MedMentor on medical content?",
    a: "MedMentor is built on Anthropic Claude, which scores in the top quartile on USMLE-style benchmarks. Every answer ships with citations and a follow-up channel so you can verify anything that doesn\u2019t sit right \u2014 and explanations always end with a Japanese \u548c\u8a33 summary in EN mode.",
  },
  {
    q: "How does MedMentor handle my study data?",
    a: "Your study progress lives in your browser\u2019s local storage by default \u2014 no account required, no data leaves your device unless you opt in. The Anthropic API call is the only network hop, and prompts use the no-training tier.",
  },
  {
    q: "Can it generate visual aids on the fly?",
    a: "Yes \u2014 MedMentor can hand-craft animated SVG diagrams for electron configurations, action potentials, ion channels, and similar concepts. It also renders chemical structures from SMILES strings via RDKit.js.",
  },
  {
    q: "Does it work with the textbooks I already use?",
    a: "MedMentor doesn't need your textbooks to start — pick a subject and topic, and it generates fresh questions from the model's medical knowledge. Future versions will accept PDFs and lecture notes as context.",
  },
  {
    q: "What happens after a study session ends?",
    a: "You instantly get a session summary, the topics you struggled with, and a spaced-repetition queue scheduled to your forgetting curve. Open the dashboard the next morning and you\u2019ll see exactly what to review first.",
  },
];

const Pill = ({ index, open }: { index: number; open: boolean }) => (
  <div
    style={{
      display: "inline-flex",
      padding: "6px 12px",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 20,
      border: "1px solid transparent",
      background:
        "linear-gradient(#292929, #292929) padding-box, linear-gradient(178.8deg, rgba(255, 255, 255, 0.2464) 10.85%, rgba(20, 20, 20, 0.46) 24.36%, rgba(50, 50, 50, 0.46) 73.67%, rgba(255, 255, 255, 0.46) 90.68%) border-box",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      opacity: 0.95,
      boxShadow:
        "0 51px 85px 0 rgba(0, 0, 0, 0.45), 0 30.029px 44.336px 0 rgba(0, 0, 0, 0.32), 0 15.422px 20.808px 0 rgba(0, 0, 0, 0.25), 0 6.202px 9.112px 0 rgba(0, 0, 0, 0.20), 0 1.387px 3.944px 0 rgba(0, 0, 0, 0.13)",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 12,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 1,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
    <span
      aria-hidden
      style={{
        width: 10,
        height: 10,
        position: "relative",
        display: "inline-block",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1.2,
          background: open ? "#E8642A" : "rgba(255,255,255,0.85)",
          transform: "translateY(-50%)",
          transition: "background 0.3s",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1.2,
          background: open ? "#E8642A" : "rgba(255,255,255,0.85)",
          transform: `translateX(-50%) rotate(${open ? "90deg" : "0deg"})`,
          transformOrigin: "center",
          transition: "transform 0.35s ease, background 0.3s",
        }}
      />
    </span>
  </div>
);

const FAQItem = ({ item, index, open, onToggle }: { item: FAQ; index: number; open: boolean; onToggle: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: 20,
        background: "#1A1A1A",
        boxShadow:
          "rgba(0, 0, 0, 0.24) 4px 16px 36px, rgb(255 255 255 / 20%) 0.5px 0.5px 0.5px inset, rgba(255, 255, 255, 0.05) 0.5px -0.5px 0.5px inset",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      {/* Volumetric orange glow — masked by overflow:hidden */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 730,
          height: 480,
          borderRadius: "50%",
          background: "rgb(161, 76, 38)",
          filter: "blur(75px)",
          top: -420,
          left: "39%",
          opacity: open ? 0.85 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "22px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 18,
              fontWeight: 100,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {item.q}
          </h3>
          <Pill index={index} open={open} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.45s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                paddingTop: 4,
                maxWidth: 760,
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Section7 = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingLines = ["Got Questions?", "We've got answers."];

  return (
    <section
      style={{
        background: "#000000",
        padding: "120px 0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 40px", marginBottom: 64 }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 20px",
          }}
        >
          FAQs
        </motion.p>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 72,
            fontWeight: 100,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            color: "#FFFFFF",
            maxWidth: 820,
            margin: "0 auto 20px",
          }}
          className="r-s7-h2"
        >
          {headingLines.map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {line.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (li * 3 + i) * 0.055, ease: "easeOut" }}
                  style={{ display: "inline-block", marginRight: "0.2em" }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Learn how MedMentor captures, explains, and turns your study sessions into long-term mastery.
        </motion.p>
      </div>

      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
        className="r-s7-list"
      >
        {faqs.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            index={i}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Section7;
