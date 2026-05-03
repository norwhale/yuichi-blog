import OpenAI from "openai";
import { checkRateLimit, getClientIp } from "@/lib/medmentor/rateLimit";

/**
 * MedMentor · BETA · Image generation
 *
 * Calls DALL-E 3 (1024x1024 standard, $0.04/image) to illustrate a chemistry
 * structure or anatomy figure the student asked about. Gated behind aggressive
 * rate limits to cap blast radius: 3 images / 10 min / IP, 20 / day / IP.
 *
 * Requires OPENAI_API_KEY. If absent, returns 503 with a friendly note so the
 * UI can hide the button.
 */

const DAILY_BUDGET = 20; // per IP
const BURST_BUDGET = 3; // per IP per 10 minutes

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error:
            "Image generation is not configured yet (OPENAI_API_KEY missing). The MedMentor team is still in beta rollout.",
          configured: false,
        },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      subject,
      topic,
      correctAnswer,
      prompt: rawPrompt,
      style,
    } = body as {
      subject?: string;
      topic?: string;
      correctAnswer?: string;
      prompt?: string;
      style?: "chemistry" | "anatomy" | "process";
    };

    if (!subject || !topic) {
      return Response.json({ error: "Missing subject or topic" }, { status: 400 });
    }

    const ip = getClientIp(request);

    const burst = checkRateLimit({
      key: `medmentor:image:burst:${ip}`,
      limit: BURST_BUDGET,
      windowMs: 10 * 60_000,
    });
    if (!burst.allowed) {
      return Response.json(
        {
          error: `Image generation limit reached. Try again in ${burst.retryAfterSeconds}s.`,
          retryAfterSeconds: burst.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const daily = checkRateLimit({
      key: `medmentor:image:daily:${ip}`,
      limit: DAILY_BUDGET,
      windowMs: 24 * 60 * 60_000,
    });
    if (!daily.allowed) {
      return Response.json(
        {
          error: `Daily image budget reached (${DAILY_BUDGET}/day). Resets in ${Math.ceil(
            daily.retryAfterSeconds / 3600,
          )}h.`,
          retryAfterSeconds: daily.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    // Compose a tight, medically-accurate prompt around the topic.
    const styleHint =
      style === "chemistry"
        ? "2D chemistry structure diagram style, clean line art, labeled atoms, white background"
        : style === "anatomy"
          ? "medical textbook anatomical illustration, labeled structures, clean vector style, white background"
          : "educational scientific illustration, labeled steps, clean minimal style, white background";

    const basePrompt =
      rawPrompt && rawPrompt.trim().length > 0
        ? rawPrompt.trim()
        : `${topic} in ${subject}. Correct answer context: ${correctAnswer || "n/a"}.`;

    const finalPrompt = `${basePrompt}\n\nStyle: ${styleHint}. Avoid photorealism. Avoid text blocks. Keep labels short and legible. No watermarks. Suitable for a medical-school study aid.`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const result = await client.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt.slice(0, 3900), // DALL-E 3 prompt max 4000 chars
      n: 1,
      size: "1024x1024",
      quality: "standard", // $0.040 per image
      response_format: "url",
    });

    const url = result.data?.[0]?.url;
    const revisedPrompt = result.data?.[0]?.revised_prompt;

    if (!url) {
      return Response.json(
        { error: "OpenAI returned no image URL" },
        { status: 502 },
      );
    }

    return Response.json({
      url,
      revisedPrompt,
      model: "dall-e-3",
      costUsd: 0.04,
      remainingDaily: daily.remaining,
      remainingBurst: burst.remaining,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Generate image error:", message);

    const lowered = message.toLowerCase();
    if (lowered.includes("content_policy") || lowered.includes("safety")) {
      return Response.json(
        {
          error:
            "The image generator rejected this prompt on safety grounds. Try rephrasing with a more clinical/structural description.",
        },
        { status: 400 },
      );
    }

    return Response.json(
      { error: `Image generation failed: ${message}` },
      { status: 500 },
    );
  }
}
