import Anthropic from "@anthropic-ai/sdk";
import { buildFollowUpPrompt, type FollowUpIntent, type FollowUpTurn } from "@/lib/medmentor/followUp";
import { checkRateLimit, getClientIp } from "@/lib/medmentor/rateLimit";
import type { Language } from "@/lib/medmentor/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FOLLOWUP_MODEL =
  process.env.ANTHROPIC_MEDMENTOR_FOLLOWUP_MODEL ||
  process.env.ANTHROPIC_MEDMENTOR_EXPLANATION_MODEL ||
  "claude-sonnet-4-20250514";

const MAX_FOLLOWUP_TURNS = 3;
const DEFAULT_FOLLOWUP_MAX_TOKENS = 500;
const SVG_ARTIFACT_MAX_TOKENS = 2500;

function getFollowUpMaxTokens(intent: FollowUpIntent) {
  return intent === "svg_artifact"
    ? SVG_ARTIFACT_MAX_TOKENS
    : DEFAULT_FOLLOWUP_MAX_TOKENS;
}

function normalizeFollowUpReply(reply: string, intent: FollowUpIntent) {
  const trimmed = reply.trim();

  if (intent !== "svg_artifact") {
    return trimmed;
  }

  const fenceCount = (trimmed.match(/```/g) ?? []).length;
  if (fenceCount % 2 === 1 && /<\/svg>\s*$/i.test(trimmed)) {
    return `${trimmed}\n\`\`\``;
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      topic,
      question,
      correctAnswer,
      originalExplanation,
      history: rawHistory,
      message: rawMessage,
      intent: rawIntent,
      language,
    } = body as {
      subject?: string;
      topic?: string;
      question?: string;
      correctAnswer?: string;
      originalExplanation?: string;
      history?: FollowUpTurn[];
      message?: string;
      intent?: FollowUpIntent;
      language?: Language;
    };

    if (!question || !originalExplanation || !rawMessage) {
      return Response.json(
        { error: "Missing required field: question, originalExplanation, or message" },
        { status: 400 },
      );
    }

    const history = Array.isArray(rawHistory) ? rawHistory : [];
    const userTurns = history.filter((t) => t.role === "user").length;

    if (userTurns >= MAX_FOLLOWUP_TURNS) {
      return Response.json(
        {
          reply:
            "You've hit this session's follow-up limit (3 turns). Move on to the next question or start a new session to keep exploring.",
          limitReached: true,
        },
        { status: 200 },
      );
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `medmentor:followup:${ip}`,
      limit: 15,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      return Response.json(
        {
          reply: `Anthropic is busy right now. Please try again in ~${rateLimit.retryAfterSeconds}s.`,
          rateLimited: true,
        },
        { status: 200 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 503 },
      );
    }

    const intent: FollowUpIntent = rawIntent ?? "custom";
    const effectiveLanguage: Language = language || "bilingual";

    const { system, user } = buildFollowUpPrompt({
      subject: subject || "",
      topic: topic || "",
      question,
      correctAnswer: correctAnswer || "",
      originalExplanation,
      history,
      newUserMessage: rawMessage,
      newIntent: intent,
      language: effectiveLanguage,
    });

    const stream = await client.messages.stream({
      model: FOLLOWUP_MODEL,
      max_tokens: getFollowUpMaxTokens(intent),
      system,
      messages: [{ role: "user", content: user }],
    });

    let reply = "";
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        reply += event.delta.text;
      }
    }

    return Response.json({
      reply: normalizeFollowUpReply(reply, intent),
      turnsUsed: userTurns + 1,
      maxTurns: MAX_FOLLOWUP_TURNS,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Follow-up error:", errMsg);

    const lowered = errMsg.toLowerCase();
    let friendly = "AI follow-up is temporarily unavailable.";
    if (lowered.includes("429") || lowered.includes("rate_limit_error")) {
      friendly = "Anthropic is busy right now. Please try again in a moment.";
    } else if (lowered.includes("overloaded") || lowered.includes("timeout")) {
      friendly = "Anthropic is temporarily overloaded. Please try again in a moment.";
    }

    return Response.json({ error: friendly }, { status: 503 });
  }
}
