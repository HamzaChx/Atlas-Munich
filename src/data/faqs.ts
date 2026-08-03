import { FAQ, CategoryKey, HubKey } from "@/types";

export const faqs: FAQ[] = [
  // General / Newcomer FAQs
  {
    id: "faq-general-1",
    hub: "community",
    question: "What should I do in my first week in Munich?",
    answer: "Priority tasks: 1) Get a SIM card, 2) Find temporary housing if needed, 3) Book Anmeldung appointment, 4) Open a bank account. See our 'First Weeks in Munich' guide for a complete checklist.",
    tags: ["newcomer", "urgent"],
  },
  {
    id: "faq-general-2",
    hub: "community",
    question: "How much money do I need per month to live in Munich?",
    answer: "Budget around €1000-1400/month minimum: Rent €500-800, Food €400-500, Transport €43 (Deutschland Ticket), Health Insurance €140, Others €100-150. Munich is one of Germany's most expensive cities.",
    tags: ["newcomer", "budget-friendly"],
  },
  {
    id: "faq-general-3",
    hub: "community",
    question: "Is Munich a good city for international students?",
    answer: "Yes! Munich has top universities (TUM, LMU), a strong job market, excellent public transport, beautiful surroundings (Alps nearby), and a vibrant international community. The main challenges are high rents and finding housing.",
    tags: ["newcomer"],
  },
  
  // Housing FAQs
  {
    id: "faq-housing-1",
    hub: "essentials",
    question: "How hard is it to find an apartment in Munich?",
    answer: "Very competitive - Munich has less than 1% vacancy rate. Start searching 3-4 months early, prepare all documents in advance, and be ready to act fast. Consider temporary housing (Zwischenmiete) while searching.",
    categoryKey: "rent-housing",
    tags: ["newcomer", "urgent"],
  },
  // "What is a Wohnungsgeberbestätigung?" lived here and again as faq-kvr-5.
  // The KVR copy has the fuller answer and sits with the rest of the Anmeldung
  // material, so that is the one that survives.
  {
    id: "faq-housing-3",
    hub: "essentials",
    question: "How much deposit (Kaution) is normal?",
    answer: "Typically 2-3 months cold rent (Kaltmiete). It must be returned after you move out, minus any damages. The landlord must keep it in a separate account.",
    categoryKey: "rent-housing",
    tags: ["tips"],
  },
  {
    id: "faq-housing-4",
    hub: "essentials",
    question: "What is the difference between Kaltmiete and Warmmiete?",
    answer: "Kaltmiete (cold rent) is the base rent. Warmmiete (warm rent) includes heating and basic utilities. Always clarify what's included - electricity and internet are usually separate.",
    categoryKey: "rent-housing",
  },
  {
    id: "faq-housing-5",
    hub: "essentials",
    question: "Can I rent without a SCHUFA?",
    answer: "Yes but it doesn't hurt to have one since most landlords require SCHUFA (credit report). If you're new to Germany, get a SCHUFA showing 'no negative entries' - this is actually good for newcomers.",
    categoryKey: "rent-housing",
    tags: ["documents"],
  },
  
  // KVR & Immigration FAQs
  {
    id: "faq-kvr-1",
    hub: "essentials",
    question: "What is the KVR?",
    answer: "KVR (Kreisverwaltungsreferat) is Munich's main city office handling address registration, residence permits for non-EU students, and emergency cases. You'll mainly deal with: Bürgerbüro (citizen's office) for address registration, and Ausländerbehörde/Service Centre for Immigration at Ruppertstraße 19 for residence permits and extensions.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "official"],
  },
  {
    id: "faq-kvr-2",
    hub: "essentials",
    question: "How do I book a KVR/Bürgerbüro appointment for Anmeldung?",
    answer: "Book online at muenchen.de/termin. Appointments are required - no walk-ins allowed. Tip: Appointments are released 2 weeks in advance around midnight. Set an alarm for 23:59 and refresh at 00:00 for best availability. Multiple Bürgerbüro locations exist: Pasing, Orleansplatz, Scheidplatz, etc.",
    categoryKey: "kvr-residence",
    tags: ["tips", "official"],
  },
  {
    id: "faq-kvr-3",
    hub: "essentials",
    question: "What happens if I miss the 14-day Anmeldung deadline?",
    answer: "You could face a fine up to €1000. However, for short delays (few days/weeks), they're usually understanding. Register as soon as possible. Important: You need Anmeldung for university enrollment, bank accounts, mobile contracts, and receiving your Tax ID.",
    categoryKey: "kvr-residence",
    tags: ["urgent", "official"],
  },
  {
    id: "faq-kvr-4",
    hub: "essentials",
    question: "What documents do I need for Anmeldung?",
    answer: "Required: 1) Passport (and visa if applicable), 2) Wohnungsgeberbestätigung (landlord confirmation form - essential!), 3) Registration form (available online or at office). Optional: rental contract. Without the Wohnungsgeberbestätigung, you cannot register. After registration, you receive a Meldebescheinigung - keep this safe!",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-5",
    hub: "essentials",
    question: "What is a Wohnungsgeberbestätigung?",
    answer: "It's a mandatory landlord confirmation form for Anmeldung. Your landlord/dorm must sign it to confirm you live at that address. Without it, you absolutely cannot complete city registration. Make sure to get it before your KVR appointment!",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-6",
    hub: "essentials",
    question: "How do I apply for a student residence permit?",
    answer: "Apply online through the Munich Immigration website (not in person). Steps: 1) Fill out online form, 2) Upload documents (PDF/JPG), 3) Submit and save confirmation PDF, 4) Wait for KVR to process, 5) Get appointment invitation for fingerprints/photo/pickup. Apply before your visa or 90-day period expires!",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-7",
    hub: "essentials",
    question: "What documents do I need for a residence permit?",
    answer: "Required: Application form, passport + visa, biometric photo, university admission/enrollment certificate, proof of health insurance, proof of sufficient funds (blocked account, scholarship, Verpflichtungserklärung, or parents' guarantee with financial evidence), and proof of address registration (Meldebescheinigung).",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-8",
    hub: "essentials",
    question: "How long does a residence permit take and what does it cost?",
    answer: "Processing: Usually 4-8 weeks. Validity: Typically 2-3 years based on study program length. Costs: First permit ~€100, extension ~€93-96. Some scholarships = no fee. Payment: Cash or EC card only (no credit cards). You'll get a Fiktionsbescheinigung while waiting if you applied in time.",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-9",
    hub: "essentials",
    question: "What is a Fiktionsbescheinigung?",
    answer: "It's a temporary document stating your previous residence permit remains valid while your new application is processed. It allows legal stay, usually permits travel, and confirms work rights (if your previous permit allowed work). You need it when your card expires before the new one is ready, when traveling soon, or when employers need updated proof.",
    categoryKey: "kvr-residence",
    tags: ["documents", "official"],
  },
  {
    id: "faq-kvr-10",
    hub: "essentials",
    question: "When should I extend my residence permit?",
    answer: "Apply 3-4 months BEFORE expiry. Required documents: Passport, current permit, biometric photo, new enrollment certificate, health insurance proof, proof of funds. After ~4th semester, you also need study progress proof (transcript or certificate confirming active progress). If you changed universities/programs, bring exmatriculation letter and new enrollment certificate.",
    categoryKey: "kvr-residence",
    tags: ["urgent", "official"],
  },
  {
    id: "faq-kvr-11",
    hub: "essentials",
    question: "How do I get an emergency KVR appointment?",
    answer: "Emergency slots appear online same day (early morning) and disappear quickly. Valid emergencies: permit expiring/expired, urgent travel within 7 days, risk of losing job or benefits (BAföG, scholarship). Bring proof of emergency (employer letter, travel docs, medical/funeral docs) plus passport and application confirmation. Do NOT show up without an appointment.",
    categoryKey: "kvr-residence",
    tags: ["urgent", "official"],
  },
  {
    id: "faq-kvr-12",
    hub: "essentials",
    question: "Do I need to register if staying in temporary housing (Airbnb/hotel)?",
    answer: "For stays under 3 months, generally no. For longer stays or if starting university/work, you need to register at your permanent address. Remember: You have 14 days to register once you move into permanent housing.",
    categoryKey: "kvr-residence",
    tags: ["newcomer"],
  },
  {
    id: "faq-kvr-13",
    hub: "essentials",
    question: "What is the Immigration Office contact info?",
    answer: "Ausländerbehörde (Immigration Office): KVR, Ruppertstraße 19, 80337 Munich. Phone: +49 89 233-96010. Always requires appointment - never show up without one. For Bürgerbüros (address registration): Multiple locations throughout Munich, all requiring appointments.",
    categoryKey: "kvr-residence",
    tags: ["official"],
  },
  
  // University FAQs
  {
    id: "faq-uni-1",
    hub: "essentials",
    question: "How does the semester ticket work?",
    answer: "It's included in your semester fee and gives you unlimited travel on all MVV transport (U-Bahn, S-Bahn, tram, bus) for 6 months. Activate it via the MVGO app linked to your student account.",
    categoryKey: "university-life",
    tags: ["tips"],
  },
  {
    id: "faq-uni-2",
    hub: "essentials",
    question: "When should I enroll at university?",
    answer: "Immediately after receiving your admission letter! There are enrollment deadlines, typically 2-4 weeks before semester starts. You need Anmeldung, health insurance, and visa (non-EU) before enrolling.",
    categoryKey: "university-life",
    tags: ["urgent", "documents"],
  },
  {
    id: "faq-uni-3",
    hub: "essentials",
    question: "What is a Studierendenwerk?",
    answer: "The Studentenwerk München provides services for students: affordable cafeterias (Mensa), student housing, counseling, financial aid (BAföG), and more. Very helpful for budget living!",
    categoryKey: "university-life",
  },
  
  // Halal Food FAQs (categorized as general since there's a dedicated Places page)
  {
    id: "faq-food-1",
    hub: "essentials",
    question: "Where can I find halal meat in Munich?",
    answer: "Main areas: Around Munich Hauptbahnhof, Giesing, Neuperlach, and Moosach. Look for Turkish/Arabic butchers (Metzger) or supermarkets like Turkish markets. See our Places directory for verified spots.",
    categoryKey: undefined,
    tags: ["community-verified"],
  },
  {
    id: "faq-food-2",
    hub: "essentials",
    question: "Are there Moroccan restaurants in Munich?",
    answer: "Yes! There are several Moroccan and North African restaurants. Check our Places directory for recommendations. Also, the Arab community often organizes food events.",
    categoryKey: undefined,
    tags: ["community-verified"],
  },
  {
    id: "faq-food-3",
    hub: "essentials",
    question: "Where can I find Moroccan spices and ingredients?",
    answer: "Turkish and Arabic grocery stores usually have most spices, couscous, and ingredients. Check stores around Hauptbahnhof, Giesing, and in Neuperlach.",
    categoryKey: undefined,
    tags: ["tips"],
  },
  
  // Career FAQs
  {
    id: "faq-career-1",
    hub: "career",
    question: "Can international students work in Germany?",
    answer: "Yes! EU students can work without restrictions. Non-EU students with a student residence permit can work 120 full days OR 240 half days per year (updated rules may allow 140/280 - check current info). More work requires special permission or another permit type.",
    categoryKey: "career",
    tags: ["official"],
  },
  {
    id: "faq-career-2",
    hub: "career",
    question: "What is a Werkstudent?",
    answer: "A 'working student' employed part-time (max 20h/week during semester, full-time during breaks). Great for gaining experience, reduced taxes, and building your career while studying.",
    categoryKey: "career",
    tags: ["tips"],
  },
  {
    id: "faq-career-3",
    hub: "career",
    question: "How do I find a job in Munich as a student?",
    answer: "Best resources: LinkedIn, your university career center, StepStone, Indeed.de. Networking events and career fairs are also very effective. Speaking German (even basic) significantly helps.",
    categoryKey: "career",
    tags: ["tips"],
  },
  {
    id: "faq-career-4",
    hub: "career",
    question: "Is my Moroccan degree recognized in Germany?",
    answer: "It depends. Check anabin.de database for official recognition status. Many degrees are recognized for studying further but may need evaluation (Zeugnisbewertung) for professional work.",
    categoryKey: "career",
    tags: ["documents", "official"],
  },
  
  // Apps & Tools FAQs
  {
    id: "faq-apps-1",
    hub: "career",
    question: "What apps do I need for Munich?",
    answer: "Essential: MVGO (transport), N26/banking app, Google Maps, WhatsApp, DB Navigator (trains). Useful: Lieferando (food), DeepL (translation), DoctoLib (doctor appointments).",
    categoryKey: "useful-apps",
    tags: ["newcomer", "tips"],
  },
  {
    id: "faq-apps-2",
    hub: "career",
    question: "How do I buy public transport tickets?",
    answer: "Best: MVGO app (link semester ticket or buy single tickets). Also: Ticket machines at stations, DB Navigator app. Students with semester ticket don't need to buy extra tickets in MVV zone.",
    categoryKey: "useful-apps",
    tags: ["tips"],
  },
];

// Helper functions
export function getAllFaqs(): FAQ[] {
  return faqs;
}

export function getFaqsByCategory(categoryKey: CategoryKey): FAQ[] {
  return faqs.filter((faq) => faq.categoryKey === categoryKey);
}

export function searchFaqs(query: string): FAQ[] {
  const q = query.toLowerCase();
  return faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
  );
}

export function getFaqById(id: string): FAQ | undefined {
  return faqs.find((faq) => faq.id === id);
}

export function getFaqsByHub(hub: HubKey): FAQ[] {
  return faqs.filter((faq) => faq.hub === hub);
}

/**
 * Where a question now lives.
 *
 * `/faq` is being dismantled, but its deep links cannot simply be redirected:
 * a fragment is never sent to the server, so a 301 would silently drop
 * `#faq-kvr-3` and land the reader on a page that does not contain their
 * question. The old page resolves them through here instead.
 */
export function faqHref(id: string): string {
  const faq = getFaqById(id);
  if (!faq?.hub) return "/guides";
  return `/${faq.hub}#${id}`;
}
