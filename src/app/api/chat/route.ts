import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { buildSystemPrompt } from "@/chatbot/prompt-builder";
import { ChatRequest } from "@/chatbot/types";

/** How many turns of history to carry. Older turns rarely change the answer. */
const MAX_HISTORY_MESSAGES = 20;
/** Guard against a pasted contract or listing blowing up the context. */
const MAX_MESSAGE_CHARS = 8000;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, chatbotType, locale, currentPath } = body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
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
    const systemPrompt = buildSystemPrompt(chatbotType, locale || "en", currentPath || "/");

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

    // Call OpenAI via AI SDK — stream plain text, no reasoning overhead
    const result = streamText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      messages: conversation,
      temperature: 1,
      maxOutputTokens: 8192,
      abortSignal: request.signal,
      providerOptions: {
        openai: { reasoningEffort: "minimal" },
      },
    });

    // Return a plain-text chunked stream so the client can render inline
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          // Headers are already sent, so surface the failure in the stream
          // itself instead of dying silently mid-sentence.
          console.error("Chat stream error:", error);
          controller.error(error);
          return;
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // Let proxies stream token by token instead of buffering the answer.
        "X-Accel-Buffering": "no",
      },
    });
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
