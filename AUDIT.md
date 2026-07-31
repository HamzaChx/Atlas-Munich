# Atlas Munich — Audit Tickets

Audited: live site (atlasmunich.de) + codebase. 2026-07-19.
✅ = shipped (UI/UX pass, 2026-07-19). Priority: **P1** = do first (high user/impression impact) · **P2** = important · **P3** = polish/debt.

---

## A. UI/UX & Design

### A1 ✅ · Design reads as templated "AI gradient" style — needs an original identity — P1
Every page uses the same formula: blurred gradient orbs + gradient-text headline word + tricolor gradient divider + glassmorphism cards + per-page rainbow accent (violet /tools, orange /places, blue /faq, emerald home). This is the recognizable AI-generated look.
**Fix:** commit to one restrained palette (emerald + one warm Moroccan accent) across all pages; replace orbs/gradient-text with real zellige/mashrabiya geometry (the `MoroccanCorner`/`MashrabiyaPattern` SVGs are the strongest original asset — use them more, gradients less); consider a distinctive display font for headlines (Geist-only is generic).

### A2 ✅ · Strip "premium UI rule" prompt comments from shipped code — P1
Components and `globals.css` are littered with `/* Rule 35: 150-300ms */`-style comments from a generation prompt — the clearest "vibe-coded" tell for any contributor opening the repo. Delete them all; keep only comments that explain real constraints.

### A3 ✅ · UI strings untranslated despite trilingual site — P1
Hardcoded English in: footer "Privacy Policy / Terms & Conditions", CategoryCard "Explore" / "guides" / "New", guides-page Callout ("Heads up: info may change"), chat "Redirecting you to…" / "Type your message…", SearchBar "Search" + default placeholder, map "Loading map...", privacy/terms section headings ("Cookies & Tracking", "Your Rights", "Acceptable Use"…). Move all into `messages/*.json`.

### A4 · Page metadata (title/description/OG) never localized — P2
All `metadata` exports are static English, even when the body renders FR/DE. Use `generateMetadata` + `getTranslations` per page.

### A5 ✅ · /places defaults to map view — P2
First paint is a Leaflet loading spinner instead of content; place cards (the actual value) are hidden behind a toggle. Default to grid, keep map one tap away; on mobile especially.

### A6 ✅ · Places filters hide 4 categories — P2
Data contains `grocery`, `bakery`, `cowork`, `barber` places but filter chips only cover 5 categories — those places are reachable only via "All". Generate chips from data.

### A7 ✅ · Misleading stats copy — P2
"6+ Guides", "33+ FAQs" — the "+" on exact small counts reads as inflation; `/guides` metadata claims "60+ comprehensive guides" (there are 6); "46+ Verified Places" while some places aren't `verified`. Use honest numbers; SEO copy that overclaims hurts trust.

### A8 ✅ · Category count fallback renders "New guides" — P3
`count={n || "New"}` produces badge text "New guides" for empty categories. Handle 0 explicitly.

### A9 ✅ · Theme defaults to light, ignores system preference — P3
`defaultTheme="light"` without `enableSystem`. Respect `prefers-color-scheme` by default.

### A10 ✅ · Footer "Resources → Search" link points to /tools — P3
Label says search (`links.search`), target is the tools page. Rename or point to real search once A/B1 ships.

---

## B. Functionality & Retention (increase impressions/return visits)

### B1 · Search is non-functional — P1
The two prominent hero search bars drop the query: `SearchBar` pushes `/guides` without `?q=`, no page reads a query param, and Fuse.js is installed but never imported. JSON-LD even advertises `/guides?q={query}` to Google.
**Fix:** build a real client-side fuzzy search (Fuse over guides/places/FAQs) with a results page or command-palette overlay; wire `?q=` through.

### B2 · /guides lists no guides — P1
The guides page shows only 5 category cards; there is no guide list, no featured guides, and the unused `FeaturedGuides` component never renders on the home page either. Surface actual guide cards (title, reading time, updated date) on /guides and home — content depth is invisible today.

### B3 · Real community events calendar — P1
An `Events` component and `events.ts` exist but are unused and contain only placeholder data; the "Event Planner" tool is "coming soon". A curated events page (student association meetups, career fairs, Eid/Ramadan community events) is the single strongest recurring-visit driver for this audience. Ship a simple data-driven `/events` page + home section.

### B4 · Chat conversations are lost on navigation and handoff — P1
`useChatbot` clears messages on every path change, and the Zellija auto-redirect (after a 15 s countdown) navigates — wiping the conversation the user just had. Persist history per bot in `sessionStorage`, carry context through handoffs, and cut the countdown to ~5 s with an immediate "Go now" button.

### B5 · Contribution funnel requires GitHub — P2
"Suggest a place" / "contribute" CTAs link to GitHub issues — a dead end for non-developer students. Add a simple form (or mailto/Tally/WhatsApp) path. Bonus: the Riad prompt references a "community WhatsApp group" that doesn't exist anywhere on the site — either create/link one (strong retention lever) or remove the mention.

### B6 · No lightweight engagement loops — P2
No "was this guide helpful?" feedback, no bookmarking, no newsletter/WhatsApp signup, no "recently updated" surfacing (`lastUpdated` exists in data but isn't leveraged as freshness signal). Pick 1–2; guide feedback + a channel signup are cheapest.

### B7 · Place cards lack actionable info — P2
No Google Maps/directions link, no opening hours, no per-district filter. A "directions" deep link (`https://maps.google.com/?q=<address>`) is a 10-minute win.

### B8 · FR/DE content invisible to search engines — P2
Locale is cookie-based, so crawlers only ever see English; FAQ content (`faqs.ts`) additionally has no FR/DE translations at all. Consider `/fr`, `/de` route prefixes with hreflang (large SEO surface for French-speaking Moroccan students), and translate FAQs.

### B9 · No web manifest / installability — P3
Only a (4 MB!) `logo.png` favicon. Add proper favicon set + `manifest.ts` so the site can live on students' home screens.

---

## C. Bugs & Flaws

### C1 · `npm run lint` is broken → pre-commit gate dead — P1
The `"minimatch": ">=10.2.1"` override breaks `@eslint/eslintrc` (`no default export`); ESLint crashes, so husky/lint-staged can't run. Remove/scope the override or migrate config off `@eslint/eslintrc`.

### C2 · /api/chat is an unprotected paid endpoint — P1
No rate limiting, no message-count/length caps, callable by anyone → OpenAI cost abuse. Add per-IP rate limiting (e.g. Upstash or Vercel WAF rules), cap `messages` length/size, and trim history.

### C3 · Chat API flattens history into one prompt string — P2
Messages are joined as `"User: … Assistant: …"` text, so users can spoof assistant turns and the model loses turn structure. Pass the `messages` array to `streamText` directly.

### C4 · Chatbot prompts link to non-existent routes — P2
Prompts reference `/guides/anmeldung-guide` and `/guides/healthcare` (real slug: `anmeldung-city-registration`; no healthcare guide exists) → bots confidently send users to 404s. Generate route lists from `guides.ts` instead of hardcoding.

### C5 · SearchBar spinner never resolves — P3
`setIsSearching(true)` before `router.push` is never reset (and the query is dropped, see B1).

### C6 · `sitemap.ts` stamps `lastModified: new Date()` on everything — P3
Every URL claims modification at build time, defeating the field. Use real dates (guides already have `lastUpdated`).

### C7 · Misc — P3
`public/googled52b7aabc83b6473(2).html` — the `(2)` in the filename means Google can never fetch it (meta verification covers it; delete). Header `locale as "en" | "fr"` cast silently excludes `de`. README: claims MIT license but no LICENSE file, "Next.js 15" (it's 16), live-demo link points to old `atlas-munich.vercel.app`, and advertises features that don't exist (fuzzy search, Darija locale).

---

## D. Codebase Quality / Tech Debt

### D1 · Dead code & data — P2
Unused: `Hero`, `Stats`, `Categories`, `FeaturedGuides`, `Events` components; `guides-index.ts` (10 entries pointing at routes that don't exist); `apps.ts`; `events.ts` placeholders; `system-prompt.xml`; shadcn `tabs`/`select`/`label`/`textarea`; deps `fuse.js` (see B1), `@next/mdx`, `rehype-raw`. Delete or wire up — the guides-index/apps data especially, since it looks like real content that never shipped.

### D2 · Design tokens defined but ignored — P2
`globals.css` defines a full token system (`--primary`, spacing, durations, shadcn vars) yet components hardcode `zinc-*/emerald-*` classes and repeat `ease-[cubic-bezier(0.16,1,0.3,1)]` ~100×. Either adopt the tokens (enables A1 restyling in one place) or delete the unused ones.

### D3 · Hand-rolled markdown renderer in Chatbot — P3
`Chatbot.tsx` re-implements markdown parsing (~130 lines) while `react-markdown` is already a dependency used elsewhere. Consolidate.

### D4 ✅ · Footer/Category link lists are copy-paste — P3
`Footer.tsx` repeats an identical 6-line link block 9×; map over a data array. Same pattern in several pages.

### D5 · Asset hygiene — P3
`logo.png` is 4 MB and used as favicon/header logo (largest asset on every page) — export a ≤50 KB version + real .ico/.svg. Delete unused `next.svg`/`vercel.svg`/`file.svg`/`globe.svg`/`window.svg` and the duplicate `.png` avatar originals (`.webp` versions are the ones used).

---

## E. Accessibility & Resilience (missed in first pass)

### E1 · No custom 404 / error / loading pages — P1
No `not-found.tsx`, `error.tsx`, `global-error.tsx`, or `loading.tsx` anywhere — broken links (including the chatbot 404s from C4) land on Next's bare default. A branded 404 with search + popular guides turns dead ends into impressions.

### E2 ✅ · Animations ignore `prefers-reduced-motion` — P2
The site ships ~15 keyframe animations (orb pulses, chat entrances, FAB glow, floating cards) with zero `prefers-reduced-motion` handling. Add a global `@media (prefers-reduced-motion: reduce)` kill-switch in `globals.css`.

### E3 · No skip-to-content link — P2
Keyboard/screen-reader users must tab through the whole header + language switcher on every page. Add a visually-hidden "Skip to content" link before the header targeting `<main>`.

### E4 · Language switcher isn't a real listbox — P3
It has `role="listbox"`/`aria-haspopup` but no arrow-key navigation, no focus trap, and click-outside only via `mousedown`. Either implement keyboard support or swap in the already-installed Radix `Select`/`DropdownMenu`.

### E5 · Contrast risks from gradient text — P3
Headline words rendered via `bg-clip-text` gradients (amber-on-white links, emerald→teal headings) sit near or below WCAG AA at small sizes. Audit with axe/Lighthouse; keep gradients to large display text only.

---

## F. SEO, Measurement & Delivery (missed in first pass)

### F1 · No structured data for the actual content — P1
Only `WebSite`/`Organization` JSON-LD exists. Missing: `FAQPage` on /faq and guide FAQ blocks (rich-result eligible), `Article` on guide pages, `BreadcrumbList`, and `LocalBusiness` (name/address/geo/rating already in `places.ts`) per place. This is the highest-leverage free SEO work available.

### F2 · Zero product analytics — P1
Vercel Analytics is mounted but not one custom event is tracked: no search queries, chat opens, bot handoffs, guide read-depth, place-card clicks, language switches. You can't grow impressions blind — define ~8 events and instrument them (`track()` from `@vercel/analytics`).

### F3 · One static OG image for every page — P2
All pages share `atlas.png` (452 KB). Generate per-guide/per-place OG images with `next/og` (title + category color + zellige motif) — dramatically better link previews in the WhatsApp groups where this site will actually spread.

### F4 · No security headers — P2
`next.config.ts` sets caching only. Add `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, and `Permissions-Policy`.

### F5 · No CI, no tests, pre-commit disabled — P2
`.github/workflows` doesn't exist, there are zero tests, and `.husky/pre-commit` is commented out ("Temporarily disabled"). Minimum bar: a GitHub Action running `tsc --noEmit` + lint (after C1) + build on PRs; a few unit tests for `prompt-builder` and data integrity (e.g. "every route referenced in prompts exists").

### F6 · No RSS/Atom feed or "new content" surface — P3
A `/feed.xml` for guides + events is cheap and feeds aggregators, and pairs with B6's freshness signals.

---

## G. Next-Level Roadmap (make it the default home page for Moroccan students in Munich)

### G1 · Personalized arrival checklist ("My first 90 days") — P1
The killer feature for this audience. User enters arrival date → generated timeline of deadlines (Anmeldung day 14, insurance, permit day 90, semester ticket…) with checkboxes persisted in `localStorage`, ICS calendar export, and links into the matching guides/bots. The unused `guides-index.ts` ("First 14 Days in Munich") is literally this feature's data model, already written.

### G2 · "Ask Atlas" — AI answers with citations, replacing dumb search — P2
Combine B1's search with the existing chat stack: one search box that returns fuzzy matches instantly and offers "Ask Atlas" for a streamed AI answer citing guide sections it drew from. Implement retrieval (embed guide sections, top-k into context) instead of today's approach of pasting the entire places/guides JSON into every prompt — better answers and far cheaper tokens.

### G3 · Darija/Arabic locale with RTL — P2
The README already promises it and no competitor has it. Add `ar` locale (Darija tone), `dir="rtl"` support, and Arabic-capable font. Strong differentiation + community signal; pairs with B8's locale-prefix URLs.

### G4 · Munich cost-of-living & rent-check calculator — P2
Interactive tool: pick district + room type → expected rent range, Nebenkosten, insurance, MVV, total monthly budget; flag "this listing looks overpriced/scam-priced" (Riad's prompt already encodes district price knowledge — extract it into data). Highly shareable, link-magnet for SEO.

### G5 · Modernize the chat stack — P2
Migrate the hand-rolled `useChatbot` + manual streaming to AI SDK v6 `useChat` + `toUIMessageStreamResponse` (fixes C3 for free, adds retries/abort/resume), route models through Vercel AI Gateway for provider fallback and cost observability, and add suggested follow-up chips after each answer.

### G6 · Content expansion to match the bots — P2
Chatbots confidently cover healthcare, banking, taxes, and mental health, but only 6 written guides exist and there's no healthcare guide at all (C4). Write the missing pillar guides — healthcare/insurance, banking & blocked accounts, taxes for Werkstudenten, driving license conversion, bringing family — each one is a long-tail SEO page the bots can then cite.

### G7 · Offline-capable PWA — P3
Extends B9: precache guides so they work offline — the exact moment students need the Anmeldung checklist (KVR basement, no signal) is when connectivity fails. Serwist/next-pwa + manifest.

### G8 · Community proof & spotlight — P3
Real testimonials, "member of the month", photos from meetups, a public contributor wall fed from GitHub + form submissions (B5). Social proof converts first-time visitors into returning members.

### G9 · WhatsApp-first sharing — P3
`ShareButton` only does native-share/clipboard. Add explicit WhatsApp share (`wa.me/?text=`) with pre-written Darija/French message — that's where Moroccan student content actually circulates — and add share buttons to place cards and FAQ answers (deep-linkable anchors per FAQ).
