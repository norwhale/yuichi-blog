import Anthropic from "@anthropic-ai/sdk";
import { getFallbackQuestion } from "@/lib/medmentor/fallback";
import { buildQuestionPrompt } from "@/lib/medmentor/prompts";
import { checkRateLimit, getClientIp } from "@/lib/medmentor/rateLimit";
import type { Difficulty, Language, QuestionType } from "@/lib/medmentor/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUESTION_MODEL =
  process.env.ANTHROPIC_MEDMENTOR_QUESTION_MODEL ||
  process.env.MEDMENTOR_QUESTION_MODEL ||
  "claude-haiku-4-5";

function buildFallbackResponse({
  subjectId,
  topicId,
  language,
  questionType,
  questionIndex,
  difficulty,
  note,
}: {
  subjectId: string;
  topicId: string;
  language: Language;
  questionType: QuestionType;
  questionIndex: number;
  difficulty: Difficulty;
  note: string;
}) {
  const fallback = getFallbackQuestion({
    subjectId,
    topicId,
    language,
    questionType,
    questionIndex,
    difficulty,
    note,
  });

  return fallback
    ? Response.json(fallback, {
        headers: {
          "x-medmentor-question-source": "fallback",
        },
      })
    : Response.json({ error: note }, { status: 503 });
}

function getFriendlyErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lowered = message.toLowerCase();

  if (lowered.includes("429") || lowered.includes("rate_limit_error")) {
    return "Anthropic is busy right now, so MedMentor switched to a built-in practice question.";
  }

  if (lowered.includes("api key") || lowered.includes("authentication")) {
    return "Anthropic authentication is not configured correctly, so MedMentor switched to a built-in practice question.";
  }

  if (lowered.includes("overloaded") || lowered.includes("timeout")) {
    return "Anthropic is temporarily overloaded, so MedMentor switched to a built-in practice question.";
  }

  return "AI question generation is temporarily unavailable, so MedMentor switched to a built-in practice question.";
}

export async function POST(request: Request) {
  let subjectId = "";
  let topicId = "";
  let language: Language = "bilingual";
  let questionType: QuestionType = "multiple_choice";
  let questionIndex = 0;
  let difficulty: Difficulty = "beginner";

  try {
    const body = await request.json();
    const {
      subject,
      topic,
      subjectId: rawSubjectId,
      topicId: rawTopicId,
      difficulty: rawDifficulty,
      language: rawLanguage,
      questionType: rawQuestionType,
      questionIndex: rawQuestionIndex,
      previousQuestions: rawPreviousQuestions,
    } = body as {
      subject: string;
      topic: string;
      subjectId?: string;
      topicId?: string;
      difficulty?: Difficulty;
      language?: Language;
      questionType?: QuestionType;
      questionIndex?: number;
      previousQuestions?: string[];
    };

    const previousQuestions = Array.isArray(rawPreviousQuestions)
      ? rawPreviousQuestions.filter((q): q is string => typeof q === "string" && q.trim().length > 0)
      : [];

    subjectId = rawSubjectId || "";
    topicId = rawTopicId || "";
    language = rawLanguage || "bilingual";
    questionType = rawQuestionType || "multiple_choice";
    questionIndex = Number.isFinite(rawQuestionIndex) ? Number(rawQuestionIndex) : 0;
    difficulty = rawDifficulty || "beginner";

    if (!subject || !topic) {
      return Response.json({ error: "Missing subject or topic" }, { status: 400 });
    }

    if (!subjectId || !topicId) {
      return Response.json({ error: "Missing subjectId or topicId" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `medmentor:generate:${ip}`,
      limit: 15,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      return buildFallbackResponse({
        subjectId,
        topicId,
        language,
        questionType,
        questionIndex,
        difficulty,
        note: `High traffic detected. Using MedMentor's built-in backup question for the next ${rateLimit.retryAfterSeconds} seconds.`,
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return buildFallbackResponse({
        subjectId,
        topicId,
        language,
        questionType,
        questionIndex,
        difficulty,
        note: "Anthropic API key is not configured, so MedMentor is using a built-in backup question.",
      });
    }

    const { system, user } = buildQuestionPrompt(
      subject,
      topic,
      difficulty,
      language,
      questionType,
      previousQuestions,
    );

    const stream = await client.messages.stream({
      model: QUESTION_MODEL,
      max_tokens: 512,
      system,
      messages: [{ role: "user", content: user }],
    });

    let text = "";
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        text += event.delta.text;
      }
    }

    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const question = JSON.parse(cleaned);

    question.id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    question.source = "ai";
    question.acceptedAnswers = question.acceptedAnswers ?? null;

    return Response.json(question, {
      headers: {
        "x-medmentor-question-source": "ai",
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Generate question error:", errMsg);

    return buildFallbackResponse({
      subjectId,
      topicId,
      language,
      questionType,
      questionIndex,
      difficulty,
      note: getFriendlyErrorMessage(error),
    });
  }
}
