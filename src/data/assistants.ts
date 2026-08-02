// ============================================
// Atlas Munich – the helpers
//
// The roster used to live inside tools/page.tsx, which meant the hubs could
// not surface a helper without duplicating it. It is data, so it lives here.
//
// Presented task first, persona second: a reader looking for somewhere to live
// should not have to learn who "Riad" is before they can tell whether this is
// the thing that helps them. The names still carry the character work, they
// just stop being the headline.
// ============================================

import type { ChatbotType } from "@/chatbot/types";
import type { HubKey } from "@/types";
import { ASSISTANT_ACCENTS } from "@/components/chatbot/chat-themes";

export interface Assistant {
  /** Key under the `tools.tools` message namespace. */
  key: string;
  name: string;
  hub: HubKey;
  /** Live helpers carry a persona, an avatar and somewhere to go. */
  chatbot?: ChatbotType;
  avatar?: string;
  /** The explainer landing page. */
  href?: string;
  chatPath?: string;
  tint: string;
  acc: string;
  ring: string;
}

const accentOf = (chatbot: ChatbotType) => {
  const { tint, acc, ring } = ASSISTANT_ACCENTS[chatbot];
  return { tint, acc, ring };
};

export const assistants: Assistant[] = [
  {
    key: "housing",
    name: "Riad",
    hub: "map",
    chatbot: "riad",
    avatar: "/riad.webp",
    href: "/housing",
    chatPath: "/housing/chat",
    ...accentOf("riad"),
  },
  {
    key: "dalilah",
    name: "Dalilah",
    hub: "studies",
    chatbot: "dalilah",
    avatar: "/dalilah.webp",
    href: "/bureaucracy",
    chatPath: "/bureaucracy/chat",
    ...accentOf("dalilah"),
  },
  {
    key: "ilham",
    name: "Ilham",
    hub: "studies",
    chatbot: "ilham",
    avatar: "/ilham.webp",
    href: "/academic",
    chatPath: "/academic/chat",
    ...accentOf("ilham"),
  },
  {
    key: "loubna",
    name: "Loubna",
    hub: "studies",
    chatbot: "loubna",
    avatar: "/loubna.webp",
    href: "/healthcare",
    chatPath: "/healthcare/chat",
    ...accentOf("loubna"),
  },
  {
    key: "events",
    name: "Events",
    hub: "community",
    // Still in the workshop, so it stays neutral: no hue is earned yet.
    tint: "bg-muted",
    acc: "text-zinc-500 dark:text-zinc-400",
    ring: "ring-border",
  },
];

/** Live helpers have somewhere to go; the unbuilt one does not. */
export const isLive = (assistant: Assistant) => Boolean(assistant.chatPath);

export function getAssistantsForHub(hub: HubKey): Assistant[] {
  return assistants.filter((assistant) => assistant.hub === hub);
}
