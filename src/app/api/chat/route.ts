import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText, stepCountIs, type ModelMessage } from "ai";
import { buildSystemPrompt } from "@/chatbot/prompt-builder";
import { toolsForChatbot } from "@/chatbot/tools";
import { ChatRequest } from "@/chatbot/types";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

/** How many turns of history to carry. Older turns rarely change the answer. */
const MAX_HISTORY_MESSAGES = 20;
/** Guard against a pasted contract or listing blowing up the context. */
const MAX_MESSAGE_CHARS = 8000;
/** Reject oversized payloads before we even slice/filter them. */
const MAX_INCOMING_MESSAGES = 100;

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request.headers);
    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body: ChatRequest = await request.json();
    const { messages, chatbotType, locale, currentPath, declinedHandoffs, userLocation } = body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    if (messages.length > MAX_INCOMING_MESSAGES) {
      return NextResponse.json({ error: "Too many messages in request" }, { status: 400 });
    }

    if (!chatbotType) {
      return NextResponse.json({ error: "Chatbot type is required" }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Build system prompt using the facade pattern with current path context
    const systemPrompt = buildSystemPrompt(
      chatbotType,
      locale || "en",
      currentPath || "/",
      declinedHandoffs
    );

    // Real role-separated turns rather than one flattened transcript: the model
    // keeps track of who said what, and a user cannot fake an "Assistant:" line.
    const conversation: ModelMessage[] = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .filter((msg) => typeof msg.content === "string" && msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content.slice(0, MAX_MESSAGE_CHARS),
      }));

    if (conversation.length === 0) {
      return NextResponse.json({ error: "No usable messages" }, { status: 400 });
    }

    // Call OpenAI via AI SDK. Tools give a persona a structured way to signal
    // a handoff or run a grounded lookup, instead of a marker scraped out of
    // plain text. stepCountIs(3) lets a tool with a real `execute` (the
    // search tools) feed its result back for a final answer — a Zellija turn
    // can now cost more than one model call, unlike before this rewrite.
    const result = streamText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      messages: conversation,
      maxOutputTokens: 8192,
      abortSignal: request.signal,
      tools: toolsForChatbot(chatbotType, locale || "en", userLocation),
      stopWhen: stepCountIs(3),
      providerOptions: {
        openai: { reasoningEffort: "low" },
      },
    });

    // Structured UI-message stream: text deltas plus typed tool-call/result
    // parts, so the client can render a real map or handoff card instead of
    // parsing them back out of a wall of text.
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Atlas Munich Chatbot API",
    chatbots: ["zellija", "hamid", "jmila", "hamza"],
  });
}
