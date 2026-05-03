"use client";

import { useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

/**
 * SvgArtifact — inline-renders an SVG that the LLM composed inside a
 * ```svg fenced code block.
 *
 * Why not just `dangerouslySetInnerHTML` on the raw SVG? Because the model
 * output is untrusted — it could emit `<script>`, `on*` handlers, or
 * javascript:-URL `<a>` tags. We sanitize with DOMPurify and explicitly
 * allow the animation tags SMIL needs (`<animate>`, `<animateTransform>`,
 * `<animateMotion>`, `<set>`).
 *
 * This is how we build the "Claude-style artifact" experience without
 * needing JSX evaluation in a sandboxed iframe: SVG + SMIL is already
 * declarative and safe to inline once scrubbed.
 */

const MAX_SVG_BYTES = 30_000;
const SVG_FRAGMENT_RE =
  /(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg\b[\s\S]*?(?:<\/svg>|$)/i;

const ALLOWED_TAGS = [
  "svg",
  "g",
  "defs",
  "style",
  "title",
  "desc",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "textPath",
  "marker",
  "linearGradient",
  "radialGradient",
  "stop",
  "pattern",
  "clipPath",
  "mask",
  "use",
  "symbol",
  "filter",
  "feGaussianBlur",
  "feOffset",
  "feBlend",
  "feColorMatrix",
  "feComposite",
  "feFlood",
  "feMerge",
  "feMergeNode",
  // SMIL animation — the reason we bothered with a custom renderer
  "animate",
  "animateTransform",
  "animateMotion",
  "mpath",
  "set",
];

// SVG attributes are case-sensitive. DOMPurify preserves case when we list
// camelCased names explicitly in ALLOWED_ATTR.
const ALLOWED_ATTRS = [
  "id",
  "class",
  "style",
  "xmlns",
  "xmlns:xlink",
  "viewBox",
  "width",
  "height",
  "x",
  "y",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x1",
  "x2",
  "y1",
  "y2",
  "d",
  "points",
  "transform",
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "stop-color",
  "stop-opacity",
  "offset",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "text-anchor",
  "dominant-baseline",
  "letter-spacing",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "patternTransform",
  "clipPathUnits",
  "markerWidth",
  "markerHeight",
  "markerUnits",
  "orient",
  "refX",
  "refY",
  "preserveAspectRatio",
  // SMIL
  "attributeName",
  "from",
  "to",
  "by",
  "values",
  "dur",
  "begin",
  "end",
  "repeatCount",
  "repeatDur",
  "keyTimes",
  "keySplines",
  "calcMode",
  "fill",
  "additive",
  "accumulate",
  "type",
  "rotate",
  "path",
  "href",
  "xlink:href",
];

function sanitizeSvg(raw: string): { svg: string; error: string | null } {
  const svgCandidate = (raw.match(SVG_FRAGMENT_RE)?.[0] ?? raw).trim();

  if (svgCandidate.length > MAX_SVG_BYTES) {
    return {
      svg: "",
      error: `SVG too large (${svgCandidate.length} > ${MAX_SVG_BYTES} bytes)`,
    };
  }

  const clean = DOMPurify.sanitize(svgCandidate, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ALLOWED_TAGS,
    ADD_ATTR: ALLOWED_ATTRS,
    FORBID_TAGS: ["script", "foreignObject", "iframe"],
    FORBID_ATTR: [
      "onclick",
      "onload",
      "onerror",
      "onmouseover",
      "onmouseout",
      "onmousedown",
      "onmouseup",
      "onkeydown",
      "onkeyup",
      "onfocus",
      "onblur",
    ],
    KEEP_CONTENT: false,
  });

  if (!clean.includes("<svg")) {
    return { svg: "", error: "No <svg> root after sanitization" };
  }

  return { svg: clean, error: null };
}

export default function SvgArtifact({ source }: { source: string }) {
  const { svg, error } = useMemo(() => sanitizeSvg(source.trim()), [source]);
  const [key, setKey] = useState(0);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <p className="text-xs font-mono text-amber-300 mb-2">
          ⚠️ SVG artifact rejected
        </p>
        <p className="text-[11px] text-amber-200/70">{error}</p>
      </div>
    );
  }

  return (
    <figure className="my-4 rounded-xl border border-cyan-400/25 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono tracking-[0.15em] bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 rounded px-1.5 py-0.5 uppercase">
            Beta
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/80 uppercase">
            Animated SVG · Hand-crafted
          </span>
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="text-[10px] font-mono text-cyan-300/70 hover:text-cyan-200 border border-cyan-400/20 rounded px-2 py-0.5 transition"
          title="Restart animations"
        >
          ↻ Replay
        </button>
      </div>
      <div
        key={key}
        className="svg-artifact-container flex justify-center items-center [&>svg]:max-w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="text-[10px] text-white/40 mt-2 font-mono">
        ⚠ Beta — Claudeがその場でSVGを設計・アニメ化しています
      </p>
    </figure>
  );
}
