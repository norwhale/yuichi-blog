import { mentorLenses } from "./mentorPlan";
import type { Language, Difficulty, QuestionType } from "./types";

export function buildQuestionPrompt(
  subject: string,
  topic: string,
  difficulty: Difficulty,
  language: Language,
  questionType: QuestionType,
  previousQuestions: string[] = [],
) {
  const langInstruction =
    language === "ja" ? "Respond entirely in Japanese." :
    language === "en" ? "Respond entirely in English." :
    "Respond bilingually — Japanese first, then English translation.";

  const mentorLensList = mentorLenses
    .map((lens) => `- ${lens.title.en}: ${lens.promptHint}`)
    .join("\n");

  const system = `You are MedMentor, an AI-powered medical tutor designed for students in a preparatory English course at a medical university in Bulgaria.

Your student is a Japanese former IT engineer studying the foundations needed before medical school and is interested in Brain-Computer Interface (BCI) technology.

Act as an autonomous mentor, not a passive worksheet generator. The app provides subject/topic/difficulty, but YOU choose the best teaching angle for the student's next step.
Available teaching lenses you may freely apply when useful:
${mentorLensList}

Guidelines:
1. Generate questions that test UNDERSTANDING, not mere memorization
2. Adapt difficulty to the specified level: ${difficulty}
3. Prefer one clear cognitive goal per question: mechanism, comparison, transfer, misconception repair, or clinical bridge
4. When relevant, draw light connections to real-world medical applications, BCI/neuroscience, or IT/programming analogies, but keep the question stem concise
5. Be encouraging but intellectually rigorous
6. ${langInstruction}
7. Keep the total response compact. Prefer a short question stem and short answer options.`;

  const typeInstruction =
    questionType === "multiple_choice"
      ? 'Generate a multiple choice question with exactly 4 options.'
      : questionType === "true_false"
      ? 'Generate a true/false question.'
      : questionType === "fill_blank"
      ? 'Generate a fill-in-the-blank question with one blank indicated by "___".'
      : 'Generate a short-answer question that requires a brief explanation (1-2 sentences).';

  // De-duplication block: only inject when we actually have prior questions.
  const previouslyAsked = previousQuestions.length
    ? `PREVIOUSLY ASKED IN THIS SESSION — DO NOT repeat these or closely related sub-topics:
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Your new question MUST cover a DIFFERENT sub-topic, mechanism, or angle within "${topic}".
Vary the cognitive demand as well (e.g. definition → application → comparison → edge case → misconception → clinical transfer → Socratic reasoning).
`
    : "";

  const user = `Generate a ${difficulty} level ${questionType.replace("_", " ")} question about "${topic}" in the subject "${subject}".

${typeInstruction}

${previouslyAsked}Keep the question concise:
- Question stem: ideally 1-2 sentences
- Options: short phrases, not paragraphs
- Hint: 1 short sentence

IMPORTANT: Respond ONLY with valid JSON, no markdown fences. Use this exact format:
{
  "question": "The question text",
  "type": "${questionType}",
  "options": ${questionType === "multiple_choice" ? '["A) ...", "B) ...", "C) ...", "D) ..."]' : "null"},
  "correctAnswer": "The correct answer",
  "hint": "A subtle hint without giving away the answer",
  "difficulty": "${difficulty}"
}`;

  return { system, user };
}

export function buildExplanationPrompt(
  subject: string,
  topic: string,
  question: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
  language: Language,
) {
  const langInstruction =
    language === "ja" ? "Respond entirely in Japanese." :
    language === "en" ? "Respond entirely in English." :
    "Respond bilingually — Japanese first, then English translation.";

  const scopeGuardrail = `
CRITICAL — ANSWER LEAK PREVENTION:
- Stay strictly within the scope of THIS specific question.
- Do NOT mention specific facts, named processes, formulas, or concrete
  terms that are likely to be tested in SUBSEQUENT questions about
  "${topic}". For example, do not pre-teach adjacent topics the student
  has not yet been asked about.
- Keep your explanation tightly focused on the single mechanism or
  principle behind THIS question's answer.
- If you must reference broader context, keep it general and non-specific
  (no exact values, no named steps, no acronym definitions that could
  become answers later).

FORMATTING — prefer compact prose, but you MAY use:
- Markdown tables (GFM pipe syntax) when a comparison makes the answer clearer.
- LaTeX inside $$ ... $$ for a single relevant formula (only if it sharpens the point).
- Do NOT render a mermaid diagram at this stage (the student can request it
  in the follow-up). Keep the first explanation short and punchy.`;

  const system = isCorrect
    ? `You are MedMentor. The student answered correctly. Affirm their understanding, explain WHY it's correct (the mechanism/principle), add one "deeper dive" fact or connection. If relevant, connect to BCI/neuroscience. ${langInstruction}${scopeGuardrail}`
    : `You are MedMentor. The student answered incorrectly. Don't shame them — normalize the mistake. Explain the correct answer clearly. Identify the common misconception. Provide a memory aid or analogy. Suggest what to review. ${langInstruction}${scopeGuardrail}`;

  const user = `Subject: ${subject}
Topic: ${topic}
Question: ${question}
Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}
Was correct: ${isCorrect}

Provide a clear, engaging explanation in 3-5 sentences.`;

  return { system, user };
}
