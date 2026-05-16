import { getTopic, subjects } from "./subjects";
import type { Difficulty, GeneratedQuestion, Language, QuestionType } from "./types";

type LocalizedText = {
  ja: string;
  en: string;
};

type FallbackEntry = {
  type: QuestionType;
  question: LocalizedText;
  options?: LocalizedText[];
  correctAnswer: LocalizedText;
  acceptedAnswers?: string[];
  hint: LocalizedText;
  teachingPoint: LocalizedText;
};

type FallbackArgs = {
  subjectId: string;
  topicId: string;
  language: Language;
  questionType: QuestionType;
  questionIndex: number;
  difficulty?: Difficulty;
  note?: string;
};

function localizeText(language: Language, text: LocalizedText) {
  if (language === "ja") return text.ja;
  if (language === "en") return text.en;
  return `${text.ja} / ${text.en}`;
}

const curatedDecks: Record<string, Record<string, FallbackEntry[]>> = {
  chemistry: {
    "periodic-table": [
      {
        type: "multiple_choice",
        question: {
          ja: "アルカリ金属を含む族はどれですか？",
          en: "Which group contains the alkali metals?",
        },
        options: [
          { ja: "第1族", en: "Group 1" },
          { ja: "第2族", en: "Group 2" },
          { ja: "第17族", en: "Group 17" },
          { ja: "第18族", en: "Group 18" },
        ],
        correctAnswer: { ja: "第1族", en: "Group 1" },
        hint: {
          ja: "水と激しく反応する Li, Na, K を思い出してください。",
          en: "Think of Li, Na, and K, which react strongly with water.",
        },
        teachingPoint: {
          ja: "アルカリ金属は第1族にあり、価電子が1個なので反応性が高いです。",
          en: "Alkali metals are in Group 1 and are highly reactive because they have one valence electron.",
        },
      },
      {
        type: "true_false",
        question: {
          ja: "同じ族に属する元素は、似た価電子配置を持つ傾向がある。True or False?",
          en: "Elements in the same group tend to have similar valence electron configurations. True or False?",
        },
        correctAnswer: { ja: "True", en: "True" },
        acceptedAnswers: ["true", "t"],
        hint: {
          ja: "縦の列は外側の電子に注目します。",
          en: "Vertical columns are closely related to outer electron patterns.",
        },
        teachingPoint: {
          ja: "同じ族の元素は価電子の数が似ているため、化学的性質も似やすいです。",
          en: "Elements in the same group often share similar chemical properties because they have similar numbers of valence electrons.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          ja: "周期表で左から右へ進むと、原子半径は一般にどうなりますか？",
          en: "As you move from left to right across a period, what generally happens to atomic radius?",
        },
        options: [
          { ja: "大きくなる", en: "It increases" },
          { ja: "小さくなる", en: "It decreases" },
          { ja: "変わらない", en: "It stays the same" },
          { ja: "必ず2倍になる", en: "It always doubles" },
        ],
        correctAnswer: { ja: "小さくなる", en: "It decreases" },
        hint: {
          ja: "電子殻は同じままで、核電荷が強くなります。",
          en: "The shell stays the same while nuclear charge increases.",
        },
        teachingPoint: {
          ja: "同じ周期では有効核電荷が大きくなるため、電子がより強く引き寄せられ、原子半径は小さくなります。",
          en: "Across a period, effective nuclear charge increases, pulling electrons closer to the nucleus and decreasing atomic radius.",
        },
      },
      {
        type: "fill_blank",
        question: {
          ja: "周期表の横の列は ___ と呼ばれます。",
          en: "The horizontal rows of the periodic table are called ___.",
        },
        correctAnswer: { ja: "周期", en: "periods" },
        acceptedAnswers: ["period", "periods", "周期"],
        hint: {
          ja: "英語では period、縦は group です。",
          en: "In English this is called a period; columns are groups.",
        },
        teachingPoint: {
          ja: "横の列は周期、縦の列は族です。周期は主に電子殻の数と関係します。",
          en: "Horizontal rows are periods, while vertical columns are groups. Periods are closely related to the number of electron shells.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          ja: "次のうちハロゲンはどれですか？",
          en: "Which of the following is a halogen?",
        },
        options: [
          { ja: "ナトリウム", en: "Sodium" },
          { ja: "カルシウム", en: "Calcium" },
          { ja: "塩素", en: "Chlorine" },
          { ja: "ネオン", en: "Neon" },
        ],
        correctAnswer: { ja: "塩素", en: "Chlorine" },
        hint: {
          ja: "第17族の代表例を考えてみてください。",
          en: "Think of a well-known Group 17 element.",
        },
        teachingPoint: {
          ja: "ハロゲンは第17族で、塩素・フッ素・臭素などが含まれます。価電子が7個で、電子を1個受け取りやすいです。",
          en: "Halogens are Group 17 elements such as chlorine, fluorine, and bromine. They have seven valence electrons and readily gain one electron.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          ja: "希ガスの特徴として最も適切なのはどれですか？",
          en: "Which statement best describes the noble gases?",
        },
        options: [
          { ja: "反応性が非常に高い", en: "They are highly reactive" },
          { ja: "最外殻がほぼ満たされていて安定している", en: "Their outer shell is full or nearly full, making them stable" },
          { ja: "すべて液体である", en: "They are all liquids" },
          { ja: "すべて金属である", en: "They are all metals" },
        ],
        correctAnswer: {
          ja: "最外殻がほぼ満たされていて安定している",
          en: "Their outer shell is full or nearly full, making them stable",
        },
        hint: {
          ja: "第18族はなぜ反応しにくいでしょうか？",
          en: "Why does Group 18 react so little?",
        },
        teachingPoint: {
          ja: "希ガスは最外殻が満たされていて電子配置が安定しているため、通常は反応性が低いです。",
          en: "Noble gases are usually unreactive because their outer electron shells are already stable.",
        },
      },
    ],
  },
};

function buildQuestionFromEntry(
  entry: FallbackEntry,
  language: Language,
  questionId: string,
  difficulty: Difficulty,
  note?: string,
): GeneratedQuestion {
  const localizedOptions = entry.options?.map((option) => localizeText(language, option)) ?? null;
  const localizedCorrectAnswer =
    entry.type === "multiple_choice" && localizedOptions
      ? localizedOptions.find((option) => option === localizeText(language, entry.correctAnswer)) ?? localizeText(language, entry.correctAnswer)
      : localizeText(language, entry.correctAnswer);

  return {
    id: questionId,
    question: localizeText(language, entry.question),
    type: entry.type,
    options: localizedOptions,
    correctAnswer: localizedCorrectAnswer,
    acceptedAnswers: entry.acceptedAnswers ?? null,
    hint: localizeText(language, entry.hint),
    difficulty,
    teachingPoint: localizeText(language, entry.teachingPoint),
    source: "fallback",
    note,
  };
}

function buildGenericFallbackQuestion({
  subjectId,
  topicId,
  language,
  questionType,
  questionIndex,
  difficulty = "beginner",
  note,
}: FallbackArgs): GeneratedQuestion | null {
  const data = getTopic(subjectId, topicId);
  if (!data) return null;

  const siblingTopics = data.subject.topics.filter((topic) => topic.id !== topicId).slice(0, 3);
  const bilingualTopicName =
    language === "ja"
      ? data.topic.nameJa
      : language === "en"
        ? data.topic.nameEn
        : `${data.topic.nameJa} / ${data.topic.nameEn}`;

  if (questionType === "multiple_choice") {
    const correct = language === "ja"
      ? data.topic.descriptionJa
      : language === "en"
        ? data.topic.descriptionEn
        : `${data.topic.descriptionJa} / ${data.topic.descriptionEn}`;

    const distractors = siblingTopics.map((topic) =>
      language === "ja"
        ? topic.descriptionJa
        : language === "en"
          ? topic.descriptionEn
          : `${topic.descriptionJa} / ${topic.descriptionEn}`,
    );

    const options = [correct, ...distractors].slice(0, 4);

    return {
      id: `fallback_${subjectId}_${topicId}_${questionType}_${questionIndex}`,
      question:
        language === "ja"
          ? `「${bilingualTopicName}」の説明として最も適切なものはどれですか？`
          : language === "en"
            ? `Which description best matches the topic "${bilingualTopicName}"?`
            : `「${bilingualTopicName}」に最も合う説明はどれですか？ / Which description best matches "${bilingualTopicName}"?`,
      type: "multiple_choice",
      options,
      correctAnswer: correct,
      hint:
        language === "ja"
          ? "トピックのタイトルと学習目標のつながりを考えてみてください。"
          : language === "en"
            ? "Think about how the title connects to the learning goal."
            : "トピック名と学習目標のつながりを考えてみてください。 / Think about how the title connects to the learning goal.",
      difficulty,
      teachingPoint:
        language === "ja"
          ? `このトピックでは主に「${data.topic.descriptionJa}」を学びます。`
          : language === "en"
            ? `This topic mainly focuses on ${data.topic.descriptionEn}.`
            : `このトピックでは主に「${data.topic.descriptionJa}」を学びます。 / This topic mainly focuses on ${data.topic.descriptionEn}.`,
      source: "fallback",
      note,
    };
  }

  if (questionType === "true_false") {
    return {
      id: `fallback_${subjectId}_${topicId}_${questionType}_${questionIndex}`,
      question:
        language === "ja"
          ? `「${bilingualTopicName}」は ${data.subject.nameJa} の学習トピックである。True or False?`
          : language === "en"
            ? `"${bilingualTopicName}" is a study topic within ${data.subject.nameEn}. True or False?`
            : `「${bilingualTopicName}」は ${data.subject.nameJa} の学習トピックである。True or False? / "${bilingualTopicName}" is a study topic within ${data.subject.nameEn}.`,
      type: "true_false",
      options: null,
      correctAnswer: "True",
      acceptedAnswers: ["true", "t"],
      hint:
        language === "ja"
          ? "今いる科目の一覧を思い出してください。"
          : language === "en"
            ? "Recall which subject section you are currently studying."
            : "今いる科目の一覧を思い出してください。 / Recall which subject section you are currently studying.",
      difficulty,
      teachingPoint:
        language === "ja"
          ? `「${data.topic.nameJa}」は ${data.subject.nameJa} の中のトピックです。学習を止めないために、今は内蔵問題でセッションを続けています。`
          : language === "en"
            ? `"${data.topic.nameEn}" belongs to ${data.subject.nameEn}. MedMentor is continuing with a built-in backup question so you can keep studying.`
            : `「${data.topic.nameJa}」は ${data.subject.nameJa} の中のトピックです。学習を止めないために、今は内蔵問題でセッションを続けています。 / "${data.topic.nameEn}" belongs to ${data.subject.nameEn}. MedMentor is continuing with a built-in backup question so you can keep studying.`,
      source: "fallback",
      note,
    };
  }

  return {
    id: `fallback_${subjectId}_${topicId}_${questionType}_${questionIndex}`,
    question:
      language === "ja"
        ? `この学習セットのテーマは「${data.topic.nameJa}」です。空欄に英語名を入れてください: ${data.topic.nameJa} = ___`
        : language === "en"
          ? `This study set focuses on "${data.topic.nameEn}". Fill in the blank with the topic name: ___`
          : `この学習セットのテーマは「${data.topic.nameJa}」です。空欄に英語名を入れてください: ${data.topic.nameJa} = ___ / This study set focuses on "${data.topic.nameEn}". Fill in the blank: ___`,
    type: "fill_blank",
    options: null,
    correctAnswer: data.topic.nameEn,
    acceptedAnswers: [data.topic.nameEn.toLowerCase(), data.topic.nameJa],
    hint:
      language === "ja"
        ? "ページ上部のタイトルを確認してみましょう。"
        : language === "en"
          ? "Look at the title shown at the top of the page."
          : "ページ上部のタイトルを確認してみましょう。 / Look at the title shown at the top of the page.",
    difficulty,
    teachingPoint:
      language === "ja"
        ? `このセットは「${data.topic.nameJa}」の基礎確認用です。AIが混雑している間も、重要語の確認は続けられます。`
        : language === "en"
          ? `This set is reviewing the basics of "${data.topic.nameEn}". Even while AI is busy, you can still keep reinforcing the key terms.`
          : `このセットは「${data.topic.nameJa}」の基礎確認用です。AIが混雑している間も、重要語の確認は続けられます。 / This set is reviewing the basics of "${data.topic.nameEn}". Even while AI is busy, you can still reinforce the key terms.`,
    source: "fallback",
    note,
  };
}

export function getFallbackQuestion(args: FallbackArgs): GeneratedQuestion | null {
  const {
    subjectId,
    topicId,
    questionType,
    questionIndex,
    difficulty = "beginner",
    language,
    note,
  } = args;

  const curatedDeck = curatedDecks[subjectId]?.[topicId];
  if (curatedDeck) {
    const sameTypeQuestions = curatedDeck.filter((entry) => entry.type === questionType);
    if (sameTypeQuestions.length > 0) {
      const index = questionIndex % sameTypeQuestions.length;
      return buildQuestionFromEntry(
        sameTypeQuestions[index],
        language,
        `fallback_${subjectId}_${topicId}_${questionType}_${questionIndex}`,
        difficulty,
        note,
      );
    }
  }

  return buildGenericFallbackQuestion(args);
}

export function buildFallbackExplanation({
  question,
  userAnswer,
  isCorrect,
  language,
}: {
  question: GeneratedQuestion;
  userAnswer: string;
  isCorrect: boolean;
  language: Language;
}) {
  const teachingPoint = question.teachingPoint ?? "";

  if (language === "ja") {
    return isCorrect
      ? `正解です。${teachingPoint}`.trim()
      : `今回は不正解でした。正答は「${question.correctAnswer}」です。あなたの回答は「${userAnswer}」でした。${teachingPoint}`.trim();
  }

  if (language === "en") {
    return isCorrect
      ? `Correct. ${teachingPoint}`.trim()
      : `Not this time. The correct answer is "${question.correctAnswer}" and you answered "${userAnswer}". ${teachingPoint}`.trim();
  }

  return isCorrect
    ? `正解です。${teachingPoint}\n\nCorrect. ${teachingPoint}`.trim()
    : `今回は不正解でした。正答は「${question.correctAnswer}」で、あなたの回答は「${userAnswer}」でした。${teachingPoint}\n\nNot this time. The correct answer is "${question.correctAnswer}" and you answered "${userAnswer}". ${teachingPoint}`.trim();
}

export function getFallbackTopicIds() {
  return Object.entries(curatedDecks).flatMap(([subjectId, topics]) =>
    Object.keys(topics).map((topicId) => `${subjectId}:${topicId}`),
  );
}

export function getGenericFallbackCoverageCount() {
  return subjects.reduce((count, subject) => count + subject.topics.length, 0);
}
