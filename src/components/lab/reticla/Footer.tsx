"use client";

import { motion } from "framer-motion";

const ASSETS = "https://qclay.design/lovable/reticla";
const FOOTER = `${ASSETS}/footer.webp`;
const LOGO = `${ASSETS}/logo.svg`;

const columns = [
  {
    title: "Menu",
    links: ["Home", "Agents", "Pricing"],
  },
  {
    title: "About",
    links: ["Resources", "About Us", "Changelog"],
  },
  {
    title: "Others",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

const Footer = () => {
  return (
    <footer
      style={{
        position: "relative",
        background: "#000000",
        overflow: "hidden",
        paddingTop: 100,
      }}
    >
      {/* Gradient image - smooth fade in on scroll */}
      <motion.img
        src={FOOTER}
        alt=""
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 60px",
          display: "flex",
          justifyContent: "space-between",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        {/* Left: logo + description */}
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #06B6D4 0%, #3b82f6 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              YB
            </span>
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              yuichi.blog
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: "20px",
              color: "rgba(255,255,255,0.55)",
              marginTop: 28,
              marginBottom: 28,
            }}
          >
            A medical student in Bulgaria, a former software engineer, and an AI study companion called MedMentor. This is an experimental landing built from a Lafys prompt — design language by Bogdan Falin / QClay.
          </p>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(255,255,255,0.40)",
              margin: 0,
            }}
          >
            © 2026 yuichi.blog · Built with a Lafys prompt + Lovable scaffold. Reticla design system credit: Bogdan Falin / QClay.
          </p>
        </div>

        {/* Right: link columns */}
        <div style={{ display: "flex", gap: 110, flexWrap: "wrap" }}>
          {columns.map((col) => (
            <div key={col.title} style={{ minWidth: 130 }}>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 28,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 18,
                        fontWeight: 300,
                        color: "#FFFFFF",
                        textDecoration: "none",
                        transition: "opacity 0.25s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Giant yuichi.blog wordmark - fills width, flush to edges */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 80,
          width: "100%",
          lineHeight: 0,
          fontSize: 0,
        }}
      >
        <motion.svg
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewBox="0 0 1000 230"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <text
            x="0"
            y="225"
            textLength="1280"
            lengthAdjust="spacingAndGlyphs"
            fill="rgba(255,255,255,0.10)"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 320,
              fontWeight: 200,
            }}
          >
            yuichi.blog
          </text>
        </motion.svg>
      </div>
    </footer>
  );
};

export default Footer;
