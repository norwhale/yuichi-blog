import type { AnsweredQuestion, Language } from "./types";

type LocalizedText = {
  en: string;
  ja: string;
};

export type MentorLensId =
  | "socratic"
  | "clinical"
  | "exam"
  | "visual"
  | "memory"
  | "foundations";

export interface MentorLens {
  id: MentorLensId;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
  promptHint: string;
}

export interface MentorRecommendation {
  lensId: MentorLensId;
  title: LocalizedText;
  rationale: LocalizedText;
  nextAction: LocalizedText;
  promptHint: string;
}

export const mentorLenses: MentorLens[] = [
  {
    id: "socratic",
    icon: "🧩",
    title: { en: "Socratic mentor", ja: "ソクラテス式メンター" },
    description: {
      en: "Guides with questions instead of giving the answer immediately.",
      ja: "すぐ答えを渡さず、問いかけで理解を引き出します。",
    },
    promptHint:
      "Use a Socratic teaching style: ask one targeted question, wait conceptually for the student's reasoning, then reveal only the minimum hint needed.",
  },
  {
    id: "clinical",
    icon: "🩺",
    title: { en: "Clinical bridge", ja: "臨床ブリッジ" },
    description: {
      en: "Connects prep-course science to simple medical situations.",
      ja: "準備コースの理科を、シンプルな医療場面に接続します。",
    },
    promptHint:
      "Bridge the concept to a safe, beginner-friendly clinical scenario. Avoid diagnosis advice; focus on mechanism and vocabulary.",
  },
  {
    id: "exam",
    icon: "🎯",
    title: { en: "Exam trap detector", ja: "試験ひっかけ検出" },
    description: {
      en: "Highlights common distractors, wording traps, and misconceptions.",
      ja: "選択肢の罠・言い換え・よくある誤解を見抜く練習をします。",
    },
    promptHint:
      "Teach by exposing likely exam traps: compare the correct idea with 2-3 tempting wrong ideas and explain how to spot them.",
  },
  {
    id: "visual",
    icon: "🖼️",
    title: { en: "Visual explainer", ja: "図解エクスプレーナー" },
    description: {
      en: "Uses diagrams, tables, flows, or animated SVG when the concept is spatial or dynamic.",
      ja: "空間的・動的な概念を、図・表・流れ・アニメーションで理解します。",
    },
    promptHint:
      "Prefer a compact diagram-first explanation: table, flowchart, or animated SVG if the mechanism is spatial/dynamic.",
  },
  {
    id: "memory",
    icon: "🧠",
    title: { en: "Memory forge", ja: "記憶定着モード" },
    description: {
      en: "Creates mnemonics, micro-drills, and spaced review hooks.",
      ja: "語呂・ミニ演習・復習フックで記憶に残します。",
    },
    promptHint:
      "Create a memorable hook: mnemonic, contrast pair, or 20-second micro-drill. End with one recall question.",
  },
  {
    id: "foundations",
    icon: "🔬",
    title: { en: "Foundation repair", ja: "基礎補強" },
    description: {
      en: "Backfills missing prerequisite knowledge before moving ahead.",
      ja: "先に進む前に、抜けている前提知識を短く補強します。",
    },
    promptHint:
      "Diagnose and repair prerequisite gaps. Explain the smallest prerequisite concept that unlocks the current question.",
  },
];

export function localize(language: Language, text: LocalizedText) {
  if (language === "ja") return text.ja;
  if (language === "en") return text.en;
  return `${text.ja} / ${text.en}`;
}

export function getMentorLens(id: MentorLensId) {
  return mentorLenses.find((lens) => lens.id === id) ?? mentorLenses[0];
}

export function chooseMentorRecommendation(
  questions: AnsweredQuestion[],
): MentorRecommendation {
  const total = questions.length;
  const incorrect = questions.filter((q) => !q.isCorrect);
  const freeFormMisses = incorrect.filter((q) => q.type === "free_form" || q.type === "fill_blank").length;
  const mcqMisses = incorrect.filter((q) => q.type === "multiple_choice" || q.type === "true_false").length;
  const visualTopic = questions.some((q) =>
    /electron|orbital|bond|cell|neuron|signal|wave|circuit|anatom|body|system|eeg|action potential/i.test(
      `${q.question} ${q.correctAnswer}`,
    ),
  );

  if (incorrect.length === 0 && total > 0) {
    return {
      lensId: "clinical",
      title: { en: "Upgrade: clinical bridge", ja: "次の一手：臨床ブリッジ" },
      rationale: {
        en: "You cleared this set, so the best next step is transfer: can you use the same concept in a medical context?",
        ja: "このセットはクリアできています。次は、同じ概念を医療の文脈へ移せるかを試す段階です。",
      },
      nextAction: {
        en: "Ask MedMentor for a short clinical mini-case using today’s concept.",
        ja: "今日の概念を使った短い臨床ミニケースをMedMentorに作らせましょう。",
      },
      promptHint: getMentorLens("clinical").promptHint,
    };
  }

  if (freeFormMisses >= 2) {
    return {
      lensId: "foundations",
      title: { en: "Repair the missing prerequisite", ja: "前提知識を補強しましょう" },
      rationale: {
        en: "Several open or fill-in answers were missed, which often means the underlying vocabulary or prerequisite chain is unstable.",
        ja: "自由記述・穴埋めのミスが複数あります。用語や前提知識の鎖がまだ不安定なサインです。",
      },
      nextAction: {
        en: "Do a 3-step prerequisite check before another quiz.",
        ja: "次のクイズ前に、3ステップの前提知識チェックをしましょう。",
      },
      promptHint: getMentorLens("foundations").promptHint,
    };
  }

  if (mcqMisses >= 2) {
    return {
      lensId: "exam",
      title: { en: "Train against exam traps", ja: "試験のひっかけ対策" },
      rationale: {
        en: "Multiple-choice misses suggest the distractors are close enough to confuse recognition.",
        ja: "選択問題のミスが目立ちます。誤選択肢が正解に近く見える状態です。",
      },
      nextAction: {
        en: "Compare the correct answer with the most tempting wrong answer.",
        ja: "正解と“最も選びたくなる誤答”を比較しましょう。",
      },
      promptHint: getMentorLens("exam").promptHint,
    };
  }

  if (visualTopic) {
    return {
      lensId: "visual",
      title: { en: "Make it visual", ja: "図で理解しましょう" },
      rationale: {
        en: "This topic has moving parts or spatial structure, so a diagram can reduce cognitive load.",
        ja: "このトピックは動きや構造があります。図解にすると理解負荷を下げられます。",
      },
      nextAction: {
        en: "Generate a compact visual explanation, then quiz yourself from the diagram.",
        ja: "短い図解を生成し、その図から自分に問い直しましょう。",
      },
      promptHint: getMentorLens("visual").promptHint,
    };
  }

  return {
    lensId: "socratic",
    title: { en: "Switch to Socratic mode", ja: "ソクラテス式に切り替え" },
    rationale: {
      en: "A guided question will reveal whether you can reason from first principles, not just recognize answers.",
      ja: "問いかけ形式にすると、答えの認識ではなく原理から考えられるか確認できます。",
    },
    nextAction: {
      en: "Ask one why-question before seeing a full explanation.",
      ja: "完全な解説を見る前に、まず“なぜ？”を1つ解きましょう。",
    },
    promptHint: getMentorLens("socratic").promptHint,
  };
}

export function buildMentorPrompt({
  recommendation,
  questions,
  language,
}: {
  recommendation: MentorRecommendation;
  questions: AnsweredQuestion[];
  language: Language;
}) {
  const missed = questions.filter((q) => !q.isCorrect).slice(-3);
  const focusQuestions = missed.length > 0 ? missed : questions.slice(-3);
  const compactHistory = focusQuestions
    .map((q, index) =>
      `${index + 1}. Q: ${q.question}\nStudent: ${q.userAnswer}\nCorrect: ${q.correctAnswer}\nResult: ${q.isCorrect ? "correct" : "incorrect"}`,
    )
    .join("\n\n");

  const languageInstruction =
    language === "ja"
      ? "Reply in Japanese."
      : language === "en"
        ? "Reply in English."
        : "Reply bilingually: Japanese first, then English.";

  return `You are MedMentor acting as an autonomous medical-prep mentor, not a passive quiz generator.

Mentor mode: ${localize(language, getMentorLens(recommendation.lensId).title)}
Teaching strategy: ${recommendation.promptHint}
${languageInstruction}

Recent performance:
${compactHistory || "No answered questions yet."}

Create the next learning step. Be proactive: decide what the student needs next, then teach it. Keep it compact and actionable.`;
}
