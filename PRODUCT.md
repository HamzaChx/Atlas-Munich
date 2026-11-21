# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Newcomers to Munich, mostly students and young professionals in their first weeks and months in the city. Many arrive from Morocco and North Africa and read Arabic, Darija or French more comfortably than German, but the site serves any newcomer: the Moroccan origin is the voice, not a gate.

They arrive under pressure: legal deadlines (the Anmeldung within 14 days of moving in), a German-only bureaucracy, a hard housing market, and no one yet to ask. They read on a phone, often in a queue, on a tram, or the night before an appointment.

## Product Purpose

Atlas Munich gets newcomers through the first steps of life in Munich (registration, residence permit, housing, health insurance, university, work) without paying a fixer and without getting lost. It combines step-by-step guides, a map of community-recommended places, persona assistants that answer questions in context, and a route into the community itself.

Success: a newcomer finishes a task like the Anmeldung correctly on the first attempt, knows what to bring and where to go, and feels that people who stood in the same place are behind them.

## Positioning

Made by Moroccans who already live in Munich and went through the same steps, written in their voice, and free. Every guide names the official source its facts rest on and says when they were last checked. Relocation agencies and generic expat blogs can copy the topics, not the community or the honesty about freshness.

## Operating Context

- Guides are markdown in `src/data/guides.ts` (English source of truth) with French and German prose overlays in `guides.fr.ts` / `guides.de.ts`, merged by id via `localizeGuides`.
- Each guide carries `lastVerified` (when facts were last checked against `primarySource`) separate from `lastUpdated`. `lastVerified` moves only after the guide is actually re-read against its source; the page warns once it is over six months old.
- Persona assistants, each owning a domain: Riad (housing, `/chat/housing`), Dalilah (bureaucracy, `/bureaucracy/chat`), Ilham (academic, `/academic/chat`), Loubna (healthcare, `/healthcare/chat`). Dedicated chats accept `?q=` to seed the first question.
- Installable PWA with an offline fallback.
- Locales: English, French, German, as a URL segment; every page prerenders.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind v4, next-intl, react-markdown, Leaflet maps, Serwist service worker, Vercel hosting.
- Content catalog is small: six guides today across housing, KVR and residence, university life, career, and useful apps.
- No accounts and no server-side user data. Anything personal (progress, preferences) stays in the visitor's browser.
- Undecided: an Arabic locale. Arabic and Darija remain an accent in the voice (the /chat landing, greetings), not a translated reading layer.

## Brand Commitments

- Name: Atlas Munich. Bilingual greeting "Servus · مرحبا" is a brand element.
- Voice: warm, direct, from people who did this themselves. Darija is welcome where it fits (the /chat landing, "Chno darrek?").
- No em dashes in any user-facing copy.
- No emoji.
- Binding visual rules the owner has set (detailed in the code and DESIGN.md once written): no gradient colors or blur filters where avoidable; selected states wear their own tint and accent, never black fill; filters over jump links; compact footer.

## Evidence on Hand

- Six guides with official primary sources (`src/data/guides.ts`). Only `find-werkstudent-job` was fully re-verified (2026-09-24); the others carry January 2025 `lastVerified` dates and are knowingly stale in places (for example the student-life guide still describes the discontinued MVV Semesterticket).
- Persona portraits and clay figures (`public/riad.webp`, `public/dalilah.webp`, `public/ilham.webp`, `public/loubna.webp`, `public/characters/`), the homepage hero film (`public/hero/`), the logo.
- Team portraits on /about.
- Absent, never to be fabricated: testimonials, member counts, partner logos, usage statistics. Real photography beyond the hero film will be supplied by the owner.

## Product Principles

1. Trust before polish: every fact names its source and its age; never stamp a date on unchecked content.
2. Reduce the panic: lead with what to do and bring, then explain.
3. One topic at a time: narrow what is shown rather than stacking everything on a long page.
4. The community is the product: people who went through it, not a faceless service.
5. Phone first, offline-capable, in the reader's language.

## Accessibility & Inclusion

- Many readers are non-native in every language the site offers: plain sentences, German terms explained the first time they appear.
- Body and label text meet WCAG AA contrast in both themes; full keyboard paths; reduced-motion respected.
