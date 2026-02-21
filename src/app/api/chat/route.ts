import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/chatbot/prompt-builder";
import { ChatRequest } from "@/chatbot/types";

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

    // Build conversation prompt from message history
    const conversationHistory = messages
      .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
      .join("\n");

    // Call OpenAI via AI SDK — stream plain text, no reasoning overhead
    const result = streamText({
      model: openai("gpt-5-nano"),
      system: systemPrompt,
      prompt: conversationHistory,
      temperature: 1,
      maxOutputTokens: 8192,
      providerOptions: {
        openai: { reasoningEffort: "minimal" },
      },
    });

    // Return a plain-text chunked stream so the client can render inline
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
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
