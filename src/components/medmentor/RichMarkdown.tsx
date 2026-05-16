"use client";

import { useEffect, useRef, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import SmilesBlock from "./SmilesBlock";
import AnatomyPreset from "./AnatomyPreset";
import SvgArtifact from "./SvgArtifact";

/**
 * RichMarkdown
 *
 * MedMentor-specific markdown renderer with:
 * - GFM tables (via remark-gfm)
 * - KaTeX math (via remark-math + rehype-katex)
 * - Mermaid diagrams (detected client-side and rendered via mermaid.js)
 * - SMILES chemistry (```smiles fences, rendered via RDKit.js)
 * - Anatomy presets ({{anatomy:id}} tokens, rendered from /public SVGs)
 *
 * Special blocks are extracted BEFORE markdown parsing so they reach the
 * client intact.
 */

// Unique per-render ID so multiple diagrams on the same screen don't collide.
let mermaidIdCounter = 0;
function nextMermaidId() {
  mermaidIdCounter += 1;
  return `mermaid-${Date.now()}-${mermaidIdCounter}`;
}

type Block =
  | { kind: "md"; content: string }
  | { kind: "mermaid"; code: string }
  | { kind: "smiles"; code: string }
  | { kind: "svg"; code: string }
  | { kind: "anatomy"; name: string };

type SpecialBlock = Exclude<Block, { kind: "md"; content: string }>;

const SVG_ROOT_RE =
  /^\s*(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg\b/i;

function pushMarkdownBlock(blocks: Block[], content: string) {
  if (content.trim()) {
    blocks.push({ kind: "md", content });
  }
}

function specialBlockFromFence(lang: string, body: string): SpecialBlock | null {
  const trimmed = body.trim();
  const bodyStartsWithSvg = SVG_ROOT_RE.test(trimmed);

  if (lang === "mermaid") {
    return { kind: "mermaid", code: trimmed };
  }

  if (lang === "smiles") {
    return { kind: "smiles", code: trimmed };
  }

  if (bodyStartsWithSvg) {
    return { kind: "svg", code: trimmed };
  }

  return null;
}

function splitTrailingRemainder(source: string): Block[] {
  const blocks: Block[] = [];

  if (!source.trim()) {
    return blocks;
  }

  // Claude occasionally gets cut off mid-reply and leaves a dangling
  // ```svg fence without the closing ``` even when the SVG body itself is
  // otherwise usable. Recover that case instead of dumping raw code.
  const danglingFence = /```([^\s`\n]*)[ \t]*\n([\s\S]*)$/m.exec(source);
  if (danglingFence) {
    pushMarkdownBlock(blocks, source.slice(0, danglingFence.index));

    const lang = (danglingFence[1] || "").toLowerCase();
    const special = specialBlockFromFence(lang, danglingFence[2] ?? "");
    if (special) {
      blocks.push(special);
      return blocks;
    }
  }

  // Also tolerate a raw inline SVG fragment without a fence if the model
  // dropped markdown formatting entirely.
  const rawSvgIndex = source.search(/(?:^|\n)\s*(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg\b/i);
  if (rawSvgIndex !== -1) {
    pushMarkdownBlock(blocks, source.slice(0, rawSvgIndex));
    blocks.push({ kind: "svg", code: source.slice(rawSvgIndex).trim() });
    return blocks;
  }

  pushMarkdownBlock(blocks, source);
  return blocks;
}

/**
 * Split the source into alternating markdown + special blocks (mermaid, smiles,
 * svg artifacts, anatomy presets) so each can be rendered by its specialized
 * pipeline.
 *
 * We match ANY fenced code block (including unlabeled and `xml` ones) and
 * promote it to kind:"svg" if the contents start with `<svg`. This is more
 * forgiving than requiring the model to always emit ```svg — in practice
 * Claude sometimes writes ```xml or just ``` for SVG payloads.
 */
function splitBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  // Match fenced blocks OR {{anatomy:name}} tokens.
  //   match[1] = language tag (may be empty, any non-whitespace chars)
  //   match[2] = block body
  //   match[3] = anatomy id
  // Language class is intentionally very permissive ([^\s`]*) so quirks like
  // `svg+xml`, `html`, `text/xml` don't cause us to miss the block.
  const regex =
    /```([^\s`\n]*)[ \t]*\n([\s\S]*?)```|\{\{anatomy:([a-z0-9-]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    pushMarkdownBlock(blocks, source.slice(lastIndex, match.index));

    if (match[3]) {
      blocks.push({ kind: "anatomy", name: match[3] });
    } else {
      const lang = (match[1] || "").toLowerCase();
      const special = specialBlockFromFence(lang, match[2] ?? "");

      if (special) {
        blocks.push(special);
      } else {
        // Not a special block — put the fence back into markdown so remark
        // renders it as a normal code block.
        blocks.push({ kind: "md", content: match[0] });
      }
    }
    lastIndex = match.index + match[0].length;
  }

  blocks.push(...splitTrailingRemainder(source.slice(lastIndex)));

  return blocks.length > 0 ? blocks : [{ kind: "md", content: source }];
}

async function renderMarkdownToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex, { throwOnError: false, errorColor: "#EF4444" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return String(file);
}

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "dark",
          themeVariables: {
            darkMode: true,
            background: "#0a0a0a",
            primaryColor: "#0f172a",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#06B6D4",
            secondaryColor: "#1e293b",
            secondaryTextColor: "#f8fafc",
            tertiaryColor: "#0a0a0a",
            tertiaryTextColor: "#f8fafc",
            noteTextColor: "#f8fafc",
            nodeTextColor: "#f8fafc",
            textColor: "#f8fafc",
            labelTextColor: "#f8fafc",
            lineColor: "#06B6D4",
            edgeLabelBackground: "#0f172a",
            fontFamily: "'Inter', 'JetBrains Mono', sans-serif",
            fontSize: "15px",
          },
        });

        const id = nextMermaidId();
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mermaid render failed");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-xs font-mono text-red-300 mb-2">
          ⚠️ Diagram failed to render
        </p>
        <pre className="text-xs text-red-200/70 whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 overflow-x-auto flex justify-center">
      <div ref={ref} className="mermaid-svg-container" />
    </div>
  );
}

function HtmlBlock({ html }: { html: string }) {
  return (
    <div
      className="rich-md prose prose-invert max-w-none text-sm text-white/80 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type ProcessedBlock =
  | { kind: "html"; html: string }
  | { kind: "mermaid"; code: string }
  | { kind: "smiles"; code: string }
  | { kind: "svg"; code: string }
  | { kind: "anatomy"; name: string };

export default function RichMarkdown({ source }: { source: string }) {
  const [blocks, setBlocks] = useState<ProcessedBlock[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const rawBlocks = splitBlocks(source);
      const processed = await Promise.all(
        rawBlocks.map(async (block): Promise<ProcessedBlock> => {
          if (block.kind === "mermaid") return { kind: "mermaid", code: block.code };
          if (block.kind === "smiles") return { kind: "smiles", code: block.code };
          if (block.kind === "svg") return { kind: "svg", code: block.code };
          if (block.kind === "anatomy") return { kind: "anatomy", name: block.name };
          const html = await renderMarkdownToHtml(block.content);
          return { kind: "html", html };
        }),
      );
      if (!cancelled) setBlocks(processed);
    })();

    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className="rich-markdown space-y-2">
      {blocks.map((b, i) => {
        if (b.kind === "html") return <HtmlBlock key={i} html={b.html} />;
        if (b.kind === "mermaid") return <MermaidBlock key={i} code={b.code} />;
        if (b.kind === "smiles") return <SmilesBlock key={i} smiles={b.code} />;
        if (b.kind === "svg") return <SvgArtifact key={i} source={b.code} />;
        return <AnatomyPreset key={i} name={b.name} />;
      })}
    </div>
  );
}
