// ============================================
// Atlas Munich Chatbot API Route
// POST /api/chat
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/chatbot/prompt-builder";
import { ChatbotType, ChatRequest, ChatResponse } from "@/chatbot/types";

// Gemini API configuration
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

// Parse routing instructions from response
function parseRoutingInstruction(response: string): {
  cleanResponse: string;
  navigation?: { path: string; chatbot: ChatbotType };
} {
  const routeMatch = response.match(/\[ROUTE:([^\]:]+):([^\]]+)\]/);

  if (routeMatch) {
    const cleanResponse = response.replace(/\[ROUTE:[^\]]+\]/g, "").trim();
    return {
      cleanResponse,
      navigation: {
        path: routeMatch[1],
        chatbot: routeMatch[2] as ChatbotType,
      },
    };
  }

  return { cleanResponse: response };
}

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Build system prompt using the facade pattern with current path context
    const systemPrompt = buildSystemPrompt(chatbotType, locale || "en", currentPath || "/");

    // Convert messages to Gemini format
    const geminiMessages: GeminiMessage[] = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Prepare Gemini API request
    const geminiRequest: GeminiRequest = {
      contents: geminiMessages,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    // Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiRequest),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
    }

    const geminiData = await geminiResponse.json();

    // Extract response text
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    // Parse for routing instructions (Zellija routing feature)
    const { cleanResponse, navigation } = parseRoutingInstruction(responseText);

    // Build response
    const response: ChatResponse = {
      message: cleanResponse,
    };

    // Add navigation if present
    if (navigation) {
      response.navigation = {
        type: "navigate",
        path: navigation.path,
        targetChatbot: navigation.chatbot,
        message: `Switching to ${navigation.chatbot}...`,
      };
    }

    return NextResponse.json(response);
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
