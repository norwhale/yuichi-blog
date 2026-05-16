"use client";

import { useState, type ReactNode } from "react";

export default function ReadMoreToggle({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/*
        SEO: The content is ALWAYS in the DOM. Only visual height is toggled.
        Crawlers (GPTBot, ClaudeBot, Googlebot) see everything regardless of state.
      */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? "2000px" : "0px", opacity: expanded ? 1 : 0 }}
      >
        {children}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors group"
      >
        <span>{expanded ? "Show Less" : "Read More"}</span>
        <span
          className="inline-block transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ↓
        </span>
      </button>
    </>
  );
}
