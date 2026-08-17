// ============================================
// Atlas Munich Chatbot - AI SDK tool definitions
//
// Structured signals a persona can emit mid-answer, rendered by the client
// as a real block (see ChatBlock in ./types) instead of scraped out of prose
// the way the old [ROUTE:...] marker was.
//
// Two shapes:
//   - client-resolved (no `execute`): the model's job is only to decide
//     whether/what to signal. proposeHandoff, citeGuide, showWhatsAppFallback.
//   - server-executed: real data lookups the model needs to see before it can
//     write a grounded answer. searchGuidesAndFaqs, searchPlaces.
// ============================================

import { tool, jsonSchema } from "ai";
import { getTranslations } from "next-intl/server";
import type { ChatbotType } from "./types";
import type { PlaceCategory } from "@/types";
import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { searchGuides } from "@/data/guides-search";
import { searchFaqs } from "@/data/faqs";
import { places } from "@/data/places";
import { filterPlaces } from "@/data/places-search";
import { logAbstention } from "@/lib/abstention-log";

export interface ProposeHandoffInput {
  chatbot: ChatbotType;
  reason: string;
}

/**
 * No `execute`: this is a client-resolved tool. The model's job is only to
 * decide *whether* and *why* to offer a handoff — the client renders a
 * confirm/deny card, and a later, separate user action (not this model turn)
 * decides whether the handoff actually happens.
 */
export const proposeHandoffTool = tool({
  description:
    "Offer to connect the user with a specialist persona (riad, dalilah, ilham, or loubna). Shows the user a confirm/deny card — it does not navigate them automatically, so always also answer their question yourself in the same turn.",
  inputSchema: jsonSchema<ProposeHandoffInput>({
    type: "object",
    properties: {
      chatbot: {
        type: "string",
        enum: ["riad", "dalilah", "ilham", "loubna"],
        description: "Which specialist to hand off to.",
      },
      reason: {
        type: "string",
        description:
          "A short, specific summary of what the user needs. Shown to them as your explanation, and reused as the specialist's first context if they accept.",
      },
    },
    required: ["chatbot", "reason"],
    additionalProperties: false,
  }),
});

/** Kept in sync by hand with `PlaceCategory` in @/types — small, stable union. */
const PLACE_CATEGORIES = [
  "restaurant",
  "grocery",
  "mosque",
  "butcher",
  "cafe",
  "bakery",
  "study-spot",
  "sport",
  "leisure",
  "park",
] as const satisfies readonly PlaceCategory[];

export interface CiteGuideInput {
  slug: string;
  title: string;
  summary: string;
}

/** Client-resolved: renders a citation chip for a guide already surfaced by
    searchGuidesAndFaqs. Only called for a confident, direct match. */
export const citeGuideTool = tool({
  description:
    "Show a citation chip linking to a specific guide you found via searchGuidesAndFaqs, so the user can open it without leaving the chat. Only call this for a guide you are confident directly answers their question — never invent a slug that searchGuidesAndFaqs did not return.",
  inputSchema: jsonSchema<CiteGuideInput>({
    type: "object",
    properties: {
      slug: {
        type: "string",
        description: "The guide's slug, exactly as returned by searchGuidesAndFaqs.",
      },
      title: { type: "string" },
      summary: { type: "string" },
    },
    required: ["slug", "title", "summary"],
    additionalProperties: false,
  }),
});

/** Client-resolved: zero-confidence fallback. No args — its whole point is a
    structured "I don't know, ask the community" signal instead of a guess. */
export const showWhatsAppFallbackTool = tool({
  description:
    "Call this instead of guessing when searchGuidesAndFaqs found nothing relevant to the user's question. Never fabricate an answer to a question you have no grounded source for — point them to the community instead.",
  inputSchema: jsonSchema<Record<string, never>>({
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  }),
});

export interface RequestLocationInput {
  reason: string;
}

/**
 * No `execute`: client-resolved, exactly like proposeHandoff. The client
 * renders a confirm/deny card; only a real click triggers the browser's own
 * geolocation permission prompt via useGeolocation. Coordinates, once
 * granted, travel back to the server as `userLocation` on the next request —
 * never through model-visible text, never stored beyond that request.
 */
export const requestLocationTool = tool({
  description:
    'Ask the user to share their current location so searchPlaces can search a radius around them instead of a named place. Shows a confirm/deny card — it does not grant access automatically, so don\'t assume it succeeded; the user\'s next message will simply carry a location if they accepted. Only call this when the user\'s request depends on where they are right now ("near me", "close to me", "what\'s around here") and no landmark, address or district was given to search by instead.',
  inputSchema: jsonSchema<RequestLocationInput>({
    type: "object",
    properties: {
      reason: {
        type: "string",
        description:
          "A short, specific reason shown to the user, e.g. 'to find halal spots closest to you'.",
      },
    },
    required: ["reason"],
    additionalProperties: false,
  }),
});

const RADIUS_OPTIONS_KM = [1, 3, 5, 10] as const;

/**
 * Builds the request-scoped tool set for Zellija. A factory, not a static
 * object, because searchGuidesAndFaqs needs the reader's locale to translate
 * category labels and resolve locale-overlaid guide content, and searchPlaces
 * needs the reader's opted-in coordinates (if any) to search by radius —
 * both only known once a request comes in.
 */
export function buildZellijaTools(locale: string, userLocation?: { lat: number; lng: number }) {
  return {
    proposeHandoff: proposeHandoffTool,
    citeGuide: citeGuideTool,
    showWhatsAppFallback: showWhatsAppFallbackTool,
    requestLocation: requestLocationTool,

    searchGuidesAndFaqs: tool({
      description:
        "Search Atlas Munich's own guides and FAQs for content relevant to the user's question. Call this before answering anything about housing, bureaucracy, university life, or Munich life in general, unless the answer is already earlier in this conversation. If it returns nothing relevant, call showWhatsAppFallback instead of answering from general knowledge.",
      inputSchema: jsonSchema<{ query: string }>({
        type: "object",
        properties: {
          query: { type: "string", description: "What to search for, in the user's own words." },
        },
        required: ["query"],
        additionalProperties: false,
      }),
      execute: async ({ query }: { query: string }) => {
        const localizedGuides = await localizeGuides(guides, locale);
        const tCategory = await getTranslations({ locale, namespace: "categories" });
        const labeled = localizedGuides.map((g) => ({
          ...g,
          topicLabel: tCategory(`${g.categoryKey}.title`),
        }));
        const guideHits = searchGuides(labeled, query).slice(0, 3);
        const faqHits = searchFaqs(query).slice(0, 3);

        if (guideHits.length === 0 && faqHits.length === 0) {
          logAbstention({ persona: "zellija", matchedGuide: false });
        }

        return {
          guides: guideHits.map((g) => ({ slug: g.slug, title: g.title, summary: g.summary })),
          faqs: faqHits.map((f) => ({ question: f.question, answer: f.answer })),
        };
      },
    }),

    searchPlaces: tool({
      description:
        "Search Munich places (halal restaurants, mosques, groceries, study spots, and more) matching the user's request. Results render as a live map for the user, so you don't need to list addresses yourself — just describe what you found in a sentence or two. Pass null for any filter you don't need, rather than omitting it. Set useUserLocation true (with radiusKm) for a \"near me\" style request instead of guessing a district — if the user hasn't shared their location yet this returns locationNeeded: true instead of places, meaning call requestLocation next rather than reporting zero results.",
      // OpenAI's strict tool schemas don't support optional properties — every
      // key must be listed in `required`, with `null` as an explicit value for
      // anything the model chooses not to set. An omitted `required` entry
      // here previously made this schema invalid, which silently broke tool
      // calling for the whole request, not just this one tool.
      inputSchema: jsonSchema<{
        query: string | null;
        category: PlaceCategory | null;
        district: string | null;
        useUserLocation: boolean;
        radiusKm: (typeof RADIUS_OPTIONS_KM)[number] | null;
      }>({
        type: "object",
        properties: {
          query: {
            type: ["string", "null"],
            description: "Free-text search, e.g. a cuisine or a place name.",
          },
          category: {
            type: ["string", "null"],
            enum: [...PLACE_CATEGORIES, null],
            description: "Narrow to one place category.",
          },
          district: {
            type: ["string", "null"],
            description: "Narrow to a Munich district/neighbourhood.",
          },
          useUserLocation: {
            type: "boolean",
            description:
              "Search a radius around the user's own opted-in location instead of a district. Only meaningful together with radiusKm.",
          },
          radiusKm: {
            type: ["number", "null"],
            enum: [...RADIUS_OPTIONS_KM, null],
            description:
              "Radius in km around the user's location. Only used when useUserLocation is true; pass null otherwise or to default to 3km.",
          },
        },
        required: ["query", "category", "district", "useUserLocation", "radiusKm"],
        additionalProperties: false,
      }),
      execute: async ({
        query,
        category,
        district,
        useUserLocation,
        radiusKm,
      }: {
        query: string | null;
        category: PlaceCategory | null;
        district: string | null;
        useUserLocation: boolean;
        radiusKm: (typeof RADIUS_OPTIONS_KM)[number] | null;
      }) => {
        if (useUserLocation && !userLocation) {
          return { places: [], locationNeeded: true };
        }

        let matches = filterPlaces(places, {
          query: query ?? undefined,
          category: category ?? undefined,
          district: useUserLocation ? undefined : (district ?? undefined),
          near:
            useUserLocation && userLocation
              ? { ...userLocation, radiusKm: radiusKm ?? 3 }
              : undefined,
        });

        // `district` only matches the dataset's formal district names
        // (e.g. "Schwabing"). A model-guessed district is often a landmark
        // or U-Bahn stop instead (e.g. "Münchner Freiheit"), which never
        // matches there. Retrying with query+district joined into one string
        // used to require both to appear together in the same field, which
        // they almost never do (the landmark shows up in one place's
        // description, the food term in another's) — that silently returned
        // zero results for completely reasonable searches like "meat near
        // Münchner Freiheit". Drop the district constraint instead: prefer
        // the food-term query on its own, and only fall back to searching
        // for the district/landmark text when no query was given at all.
        if (!useUserLocation && matches.length === 0 && district) {
          matches = filterPlaces(places, {
            query: query ?? district,
            category: category ?? undefined,
          });
        }

        return { places: matches.slice(0, 5) };
      },
    }),
  };
}

export function toolsForChatbot(
  chatbotType: ChatbotType,
  locale: string,
  userLocation?: { lat: number; lng: number }
) {
  return chatbotType === "zellija" ? buildZellijaTools(locale, userLocation) : undefined;
}
