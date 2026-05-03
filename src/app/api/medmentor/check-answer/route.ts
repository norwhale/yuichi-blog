import Anthropic from "@anthropic-ai/sdk";
import { buildFallbackExplanation } from "@/lib/medmentor/fallback";
import { buildExplanationPrompt } from "@/lib/medmentor/prompts";
import { checkRateLimit, getClientIp } from "@/lib/medmentor/rateLimit";
import type { GeneratedQuestion, Language } from "@/lib/medmentor/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXPLANATION_MODEL =
  process.env.ANTHROPIC_MEDMENTOR_EXPLANATION_MODEL ||
  process.env.MEDMENTOR_EXPLANATION_MODEL ||
  "claude-sonnet-4-20250514";

function getFriendlyExplanationNote(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lowered = message.toLowerCase();

  if (lowered.includes("429") || lowered.includes("rate_limit_error")) {
    return "Anthropic is busy right now, so MedMentor used a built-in explanation.";
  }

  if (lowered.includes("api key") || lowered.includes("authentication")) {
    return "Anthropic authentication is unavailable, so MedMentor used a built-in explanation.";
  }

  return "AI explanation is temporarily unavailable, so MedMentor used a built-in explanation.";
}

export async function POST(request: Request) {
  let questionText = "";
  let userAnswer = "";
  let correctAnswer = "";
  let isCorrect = false;
  let effectiveLanguage: Language = "bilingual";
  let generatedQuestion: GeneratedQuestion | undefined;

  const getExplanationQuestion = () =>
    generatedQuestion ?? {
      id: "fallback_explanation",
      question: questionText || "Review question",
      type: "free_form",
      options: null,
      correctAnswer,
      hint: "",
      difficulty: "beginner",
      source: "fallback" as const,
    };

  try {
    const body = await request.json();
    const {
      subject: rawSubject,
      topic: rawTopic,
      question,
      userAnswer: rawUserAnswer,
      correctAnswer: rawCorrectAnswer,
      isCorrect: rawIsCorrect,
      language,
      generatedQuestion: rawGeneratedQuestion,
    } = body as {
      subject: string;
      topic: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      language: Language;
      generatedQuestion?: GeneratedQuestion;
    };

    questionText = question;
    userAnswer = rawUserAnswer;
    correctAnswer = rawCorrectAnswer;
    isCorrect = rawIsCorrect;
    effectiveLanguage = language || "bilingual";
    generatedQuestion = rawGeneratedQuestion;

    if (generatedQuestion?.source === "fallback") {
      return Response.json({
        isCorrect,
        explanation: buildFallbackExplanation({
          question: generatedQuestion,
          userAnswer: rawUserAnswer,
          isCorrect,
          language: effectiveLanguage,
        }),
        explanationSource: "fallback",
        note: "Using MedMentor's built-in explanation because this question came from the backup deck.",
      });
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `medmentor:explanation:${ip}`,
      limit: 20,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      return Response.json({
        isCorrect,
        explanation: buildFallbackExplanation({
          question: getExplanationQuestion(),
          userAnswer: rawUserAnswer,
          isCorrect,
          language: effectiveLanguage,
        }),
        explanationSource: "fallback",
        note: `High traffic detected. Using a built-in explanation for the next ${rateLimit.retryAfterSeconds} seconds.`,
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        isCorrect,
        explanation: buildFallbackExplanation({
          question: getExplanationQuestion(),
          userAnswer: rawUserAnswer,
          isCorrect,
          language: effectiveLanguage,
        }),
        explanationSource: "fallback",
        note: "Anthropic API key is not configured, so MedMentor used a built-in explanation.",
      });
    }

    const { system, user } = buildExplanationPrompt(
      rawSubject,
      rawTopic,
      question,
      rawUserAnswer,
      rawCorrectAnswer,
      rawIsCorrect,
      effectiveLanguage,
    );

    const stream = await client.messages.stream({
      model: EXPLANATION_MODEL,
      max_tokens: 320,
      system,
      messages: [{ role: "user", content: user }],
    });

    let explanation = "";
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        explanation += event.delta.text;
      }
    }

    return Response.json({ isCorrect: rawIsCorrect, explanation, explanationSource: "ai" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Check answer error:", errMsg);

    return Response.json(
      {
        isCorrect,
        explanation: buildFallbackExplanation({
          question: getExplanationQuestion(),
          userAnswer,
          isCorrect,
          language: effectiveLanguage,
        }),
        explanationSource: "fallback",
        note: getFriendlyExplanationNote(error),
      },
      { status: 200 },
    );
  }
}
