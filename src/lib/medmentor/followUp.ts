import type { Language } from "./types";
import { buildAnatomyPresetsList } from "./anatomyPresets";

export type FollowUpIntent =
  | "table"
  | "analogy"
  | "deeper"
  | "different_angle"
  | "svg_artifact"
  | "custom";

export interface FollowUpTurn {
  role: "user" | "assistant";
  content: string;
  intent?: FollowUpIntent;
}

const intentInstructions: Record<FollowUpIntent, string> = {
  table:
    "Reformulate or deepen the explanation by organizing the concept into a Markdown TABLE (GFM pipe-table syntax). Compare two or more cases side by side, or lay out the steps/components as rows. Prefer a 2-5 column, 3-8 row table. Keep rows concise.",
  analogy:
    "Give a CONCRETE ANALOGY — ideally from IT/programming, software engineering, or everyday life — that makes the concept click. Build the analogy for 2-3 sentences, then map each piece back to the original concept.",
  deeper:
    "Go ONE level deeper into the mechanism: explain WHY the fact is true, not just WHAT the fact is. Include one relevant formula, quantitative value, or named process if it genuinely clarifies. Use LaTeX math inside $$ ... $$ for any formulas.",
  different_angle:
    "Explain the same concept from a COMPLETELY DIFFERENT angle than before — a different metaphor, a different discipline's viewpoint, or a different level of abstraction. Avoid repeating sentences from earlier.",
  svg_artifact: `Design a CUSTOM INTERACTIVE SVG ARTIFACT that visualizes this exact concept — like a hand-crafted explainer diagram, not a generic stock image. Compose it in a \`\`\`svg fenced block.

HARD REQUIREMENTS for the artifact:
1. Root <svg> with viewBox (e.g. viewBox="0 0 600 400"). No width/height attrs — it auto-scales.
2. Dark-theme friendly: assume a dark gray/black background. Use bright, accessible colors for lines and fills (e.g. #06B6D4 cyan for primary strokes, #f8fafc for labels, #f59e0b amber for emphasis, #10b981 green, #f472b6 pink). Never pure white fills that wash out.
3. SMIL ANIMATION is required. Use <animate>, <animateTransform>, or <animateMotion> to bring the concept to life. Typical patterns:
   - Electron configurations: <animateTransform type="rotate"> on each electron group around the nucleus, with different dur/repeatCount per shell.
   - Action potentials: animate a dot's x along a pre-drawn voltage curve via <animateMotion>.
   - Ion movement: animate position via <animate attributeName="cx">.
   - Process pipelines: animate opacity or a traveling marker through stages.
4. Label every meaningful element with <text> — atomic symbol, electron count, shell number, step name.
5. Keep total size under 15 KB. Inline all styles. No external fonts, no <script>, no <foreignObject>.
6. Prefer precise science over decoration: correct electron counts, correct shell capacities (2, 8, 8, 18…), correct arrows.

EXAMPLE of the required caliber (electron configuration of oxygen, abbreviated):
\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="140" fill="none" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
  <circle cx="200" cy="200" r="70" fill="none" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
  <circle cx="200" cy="200" r="28" fill="#f59e0b"/>
  <text x="200" y="206" text-anchor="middle" font-family="Inter" font-size="16" font-weight="700" fill="#0a0a0a">O</text>
  <g>
    <circle cx="200" cy="130" r="6" fill="#38bdf8"/>
    <circle cx="200" cy="270" r="6" fill="#38bdf8"/>
    <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="6s" repeatCount="indefinite"/>
  </g>
  <g>
    <circle cx="340" cy="200" r="6" fill="#f472b6"/>
    <circle cx="60" cy="200" r="6" fill="#f472b6"/>
    <circle cx="200" cy="60" r="6" fill="#f472b6"/>
    <circle cx="200" cy="340" r="6" fill="#f472b6"/>
    <circle cx="299" cy="101" r="6" fill="#f472b6"/>
    <circle cx="101" cy="299" r="6" fill="#f472b6"/>
    <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="-360 200 200" dur="14s" repeatCount="indefinite"/>
  </g>
  <text x="200" y="395" text-anchor="middle" font-family="Inter" font-size="12" fill="#f8fafc">O: 1s² 2s² 2p⁴  (2, 6)</text>
</svg>
\`\`\`

Precede the block with ONE short sentence of context, then the \`\`\`svg block, then ONE short sentence interpreting what the animation shows. Do NOT include any other diagram types (mermaid, smiles) in the same turn.`,
  custom: "",
};

export function buildFollowUpPrompt({
  subject,
  topic,
  question,
  correctAnswer,
  originalExplanation,
  history,
  newUserMessage,
  newIntent,
  language,
}: {
  subject: string;
  topic: string;
  question: string;
  correctAnswer: string;
  originalExplanation: string;
  history: FollowUpTurn[];
  newUserMessage: string;
  newIntent: FollowUpIntent;
  language: Language;
}) {
  const langInstruction =
    language === "ja"
      ? "Respond entirely in Japanese."
      : language === "en"
        ? "Respond entirely in English."
        : "Respond bilingually — Japanese first, then English translation.";

  const intentHint = intentInstructions[newIntent];

  const system = `You are MedMentor, an AI medical tutor in a follow-up conversation.
The student just received an explanation for a study question and wants to explore it further.

FORMATTING — you can and SHOULD use these rich formats when helpful:
- Markdown TABLES (GFM pipe syntax with a header separator row) — great for comparisons.
- Mermaid diagrams inside \`\`\`mermaid ... \`\`\` fenced code blocks — for flowcharts,
  sequence diagrams, or process pipelines. Keep them simple and under ~10 nodes.
- LaTeX math inside $$ ... $$ (block) or $ ... $ (inline) — for equations,
  chemical formulas, or quantitative relationships.
- Chemistry structures: when a single molecule is central to the answer, emit a
  \`\`\`smiles ... \`\`\` fenced block with ONE valid SMILES string (e.g.
  \`\`\`smiles\nCC(=O)Oc1ccccc1C(=O)O\n\`\`\`). The frontend renders it to a 2D
  structure via RDKit.js. Use only when the molecular structure itself clarifies
  the mechanism — do not emit SMILES for trivia.
- Custom animated SVG artifacts: when the student asks for a visualization OR
  the concept is inherently visual (electron configuration, orbital motion,
  action potential phases, ion channel opening, cell cycle, a process pipeline
  with moving parts), compose a hand-crafted \`\`\`svg ... \`\`\` fenced block
  with SMIL animation (\`<animate>\`, \`<animateTransform>\`, \`<animateMotion>\`).
  Design it like a tailored explainer — NOT a generic stock image. Keep under
  15 KB, inline styles only, no \`<script>\`/\`<foreignObject>\`.
- Neuroanatomy presets: when a canonical diagram would help, reference a
  bundled SVG using a \`{{anatomy:<id>}}\` token on its own line. Available ids:
${buildAnatomyPresetsList()}
  Use at most ONE preset per reply, and only if it's directly relevant.
- Short, direct prose. Avoid filler. Prefer 3-6 sentences unless a table or
  diagram is clearly better.

HARD RULES:
- Stay within the scope of THIS specific question's topic. Do not pre-teach
  other topics.
- Do not ask the student more meta-questions; they just want the explanation.
- Keep it compact. Do NOT repeat the full original explanation.
- ${langInstruction}
${intentHint ? `\nINTENT FOR THIS TURN:\n${intentHint}` : ""}`;

  const historyText = history
    .map((turn) =>
      turn.role === "user"
        ? `STUDENT: ${turn.content}`
        : `YOU (previously): ${turn.content}`,
    )
    .join("\n\n");

  const user = `Context
- Subject: ${subject}
- Topic: ${topic}
- Question: ${question}
- Correct answer: ${correctAnswer}

Original explanation (already shown to the student — do not repeat it verbatim):
"""
${originalExplanation}
"""

${historyText ? `Conversation so far:\n${historyText}\n\n` : ""}STUDENT's new request: ${newUserMessage}`;

  return { system, user };
}
