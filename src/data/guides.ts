import { Guide, CategoryKey } from "@/types";

export const guides: Guide[] = [
  // ============================================
  // RENT & HOUSING
  // ============================================
  {
    slug: "finding-apartment-munich",
    title: "Finding an Apartment in Munich: Complete Guide",
    summary: "Navigate the competitive Munich housing market with our comprehensive guide covering where to search, what to expect, and how to succeed.",
    categoryKey: "rent-housing",
    tags: ["newcomer", "urgent", "tips"],
    lastUpdated: "2025-12-01",
    readingTime: 12,
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: "Munich has one of the most competitive housing markets in Germany. With a vacancy rate below 1%, finding an apartment requires preparation, patience, and the right strategy. This guide will help you navigate the process successfully.",
      },
      {
        id: "where-to-search",
        title: "Where to Search",
        content: "The best platforms for apartment hunting in Munich include:",
        subsections: [
          {
            id: "online-platforms",
            title: "Online Platforms",
            content: "• **ImmobilienScout24** - The largest real estate platform in Germany\n• **WG-Gesucht** - Best for shared apartments (WGs)\n• **Immowelt** - Another popular search engine\n• **eBay Kleinanzeigen** - Great for private listings\n• **Mr. Lodge** - For furnished apartments\n• **Facebook Groups** - 'Wohnung/WG in München', 'Expats in Munich'",
          },
          {
            id: "student-housing",
            title: "Student Housing",
            content: "• **Studentenwerk München** - Official student housing (apply early!)\n• **University housing offices** - TUM, LMU, HM each have their own\n• **Private student residences** - THE FIZZ, Youniq, Quarters",
          },
        ],
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content: "Prepare these documents before viewing appointments:\n\n• **Self-disclosure form (Selbstauskunft)** - Personal and financial information\n• **SCHUFA credit report** - Get it free once a year at meineschufa.de\n• **Proof of income** - Salary slips, employment contract, or scholarship letter\n• **ID/Passport copy** - Valid identification\n• **Previous landlord reference** - If available\n• **Bank statements** - Last 3 months",
      },
      {
        id: "understanding-costs",
        title: "Understanding Costs",
        content: "Be prepared for these typical costs:\n\n• **Kaltmiete (Cold rent)** - Base rent without utilities\n• **Warmmiete (Warm rent)** - Includes heating and some utilities\n• **Nebenkosten** - Additional costs (water, garbage, building maintenance)\n• **Kaution (Deposit)** - Usually 2-3 months cold rent\n• **Provision** - Agent fee (if applicable) - usually 2 months rent + VAT",
      },
      {
        id: "avoiding-scams",
        title: "Avoiding Scams",
        content: "🚨 **Red flags to watch for:**\n\n• Landlord is 'abroad' and can't show the apartment\n• Asked to pay before viewing\n• Price is significantly below market rate\n• Poor grammar/communication\n• Western Union or unusual payment methods\n• No proper contract offered\n\n✅ **Safe practices:**\n• Always visit in person before paying\n• Never pay in cash without receipt\n• Verify landlord identity\n• Use proper bank transfers\n• Read contracts carefully",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "How long does it take to find an apartment?",
        answer: "On average, 2-4 months. Start searching 3-4 months before you need to move.",
      },
      {
        id: "faq-2",
        question: "Do I need a SCHUFA to rent?",
        answer: "Yes, most landlords require it. Get your free copy at meineschufa.de or pay ~30€ for instant access.",
      },
      {
        id: "faq-3",
        question: "Can I rent without a German bank account?",
        answer: "It's very difficult. Open a German bank account first - N26 or Commerzbank work well for newcomers.",
      },
    ],
    resources: [
      { id: "r1", title: "ImmobilienScout24", url: "https://immobilienscout24.de", type: "tool", description: "Largest apartment search platform" },
      { id: "r2", title: "WG-Gesucht", url: "https://wg-gesucht.de", type: "tool", description: "Best for shared apartments" },
      { id: "r3", title: "Studentenwerk München", url: "https://www.studentenwerk-muenchen.de/en/accommodation/", type: "official", description: "Student housing applications" },
      { id: "r4", title: "SCHUFA Free Copy", url: "https://www.meineschufa.de/de/datenkopie", type: "official", description: "Get your credit report" },
    ],
    relatedSlugs: ["anmeldung-guide", "first-weeks-munich"],
  },
  {
    slug: "anmeldung-guide",
    title: "Anmeldung (City Registration) at KVR",
    summary: "Step-by-step guide to register your address at a Bürgerbüro within 14 days. Appointment required - no walk-ins allowed.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "documents", "official"],
    lastUpdated: "2025-12-15",
    readingTime: 8,
    featured: true,
    sections: [
      {
        id: "what-is-anmeldung",
        title: "What is Anmeldung?",
        content: "Anmeldung is the mandatory city registration that every resident in Germany must complete within 14 days of moving into a new address. This is required by law.\n\nYou need this registration for:\n• University enrollment (sometimes required)\n• Opening a bank account\n• Mobile phone / internet contracts\n• Receiving your Tax ID (sent to your registered address)\n• Applying for a residence permit",
      },
      {
        id: "where-to-go",
        title: "Where Do I Go?",
        content: "Register at a Bürgerbüro (citizen's office). There are several locations in Munich:\n\n• Ruppertstraße 19 (Main KVR location)\n• Orleansstraße 50 (Haidhausen)\n• Leonrodstraße 21 (Neuhausen)\n• Hanauer Straße 56 (Moosach)\n• Forstenrieder Allee 61a (Forstenried)\n• Riesenfeldstraße 75 (Milbertshofen)\n\n💡 Tip: Smaller offices outside the center often have shorter wait times.",
      },
      {
        id: "booking-appointment",
        title: "Booking an Appointment",
        content: "⚠️ Important: You ALWAYS need an appointment. No walk-ins allowed.\n\n**How to book:**\n1. Go to muenchen.de/termin\n2. Select 'Bürgerbüro' (Citizens Office)\n3. Choose 'An- oder Ummeldung' (Registration or Re-registration)\n4. Select your preferred location and time\n\n**Pro tips:**\n• Appointments open 2 weeks in advance at midnight\n• Set an alarm for 23:59 and refresh at 00:00 for best availability\n• Try different Bürgerbüro locations - some have better availability",
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content: "✅ **Must bring:**\n\n1. **Passport** (and visa, if applicable)\n2. **Wohnungsgeberbestätigung** - Landlord confirmation form\n   • This is MANDATORY - your landlord/dorm must sign it\n   • Without this, you CANNOT register\n3. **Registration form** (Anmeldeformular) - download from muenchen.de or get at office\n\n📋 **Good to have:**\n• Rental contract copy (optional but helpful)",
      },
      {
        id: "at-appointment",
        title: "What Happens at the Appointment",
        content: "The process is straightforward:\n\n1. You give your documents\n2. Staff enters your data into the system\n3. You receive a Meldebescheinigung (registration certificate)\n\n**Keep this Meldebescheinigung safe!** You'll need it for:\n• Bank accounts\n• Health insurance\n• Residence permit applications\n• Various contracts",
      },
      {
        id: "after-registration",
        title: "After Registration",
        content: "**What you'll receive:**\n• Meldebescheinigung immediately at the office\n• Tax ID (Steuer-ID) arrives by mail in 2-4 weeks\n\n⚠️ **Important:** Make sure your name is on the mailbox to receive your Tax ID!\n\n**Next steps:**\n• Open a German bank account\n• Get health insurance\n• Apply for residence permit (if non-EU)",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if I can't get a Wohnungsgeberbestätigung?",
        answer: "The landlord is legally required to provide it. If they refuse, you can report them to the authorities. For subletting, the main tenant signs it.",
      },
      {
        id: "faq-2",
        question: "What if I miss the 14-day deadline?",
        answer: "Register as soon as possible. Late registration can result in fines up to €1000, though for short delays (few days/weeks) they're usually lenient.",
      },
      {
        id: "faq-3",
        question: "Do I need to register if staying temporarily (under 3 months)?",
        answer: "For stays under 3 months, generally no. For longer stays or if you're starting university/work, you must register at your permanent address.",
      },
    ],
    resources: [
      { id: "r1", title: "Book Appointment", url: "https://stadt.muenchen.de/terminvereinbarung", type: "official", description: "Official KVR appointment booking" },
      { id: "r2", title: "Registration Form", url: "https://stadt.muenchen.de/service/info/anmeldung-einer-wohnung/1063481/", type: "document", description: "Download Anmeldeformular" },
      { id: "r3", title: "Wohnungsgeberbestätigung", url: "https://stadt.muenchen.de/dam/jcr:fbe8e4e4-8808-4d1a-bfb8-8c9c6c3a7c4e/wohnungsgeberbestaetigung.pdf", type: "document", description: "Landlord confirmation form" },
    ],
    relatedSlugs: ["residence-permit-guide", "finding-apartment-munich", "first-weeks-munich"],
  },
  {
    slug: "residence-permit-guide",
    title: "Student Residence Permit Application",
    summary: "Complete guide to applying for your student residence permit (Aufenthaltserlaubnis) online at the Munich Immigration Office.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "documents", "official"],
    lastUpdated: "2025-12-15",
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: "Non-EU students need a residence permit (Aufenthaltserlaubnis) to study in Germany. The student permit (§16b AufenthG) is typically issued for 2-3 years based on your study program length.\n\n**Who handles this?**\nAusländerbehörde / Service Centre for Immigration\nKVR, Ruppertstraße 19, 80337 München\nPhone: +49 89 233-96010\n\n⚠️ You do NOT walk in. Apply online or by post and wait for processing.",
      },
      {
        id: "before-arrival",
        title: "Before Coming to Germany",
        content: "Most non-EU students:\n1. Apply for a student visa in their home country\n2. Enter Germany with that visa (usually valid 3 months)\n3. Convert it to a residence permit in Munich\n\n⚠️ Apply for your residence permit BEFORE your visa or 90-day period expires!",
      },
      {
        id: "application-process",
        title: "How to Apply",
        content: "**Step-by-step process:**\n\n1. Complete Anmeldung first (city registration)\n2. Go to the Munich Immigration website\n3. Fill out the online application form\n4. Upload all documents (PDF/JPG format)\n5. Submit the application\n6. **Save the confirmation PDF** - very important!\n\n**What happens next:**\n• KVR checks your documents\n• They may request additional documents\n• You receive an appointment invitation for fingerprints/photo/pickup\n\n**Processing time:** Usually 4-8 weeks",
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content: "📋 **Complete checklist:**\n\n• Application form (online)\n• Valid passport + visa\n• Biometric passport photo\n• Anmeldebestätigung (registration certificate)\n• University admission or enrollment certificate (Immatrikulationsbescheinigung)\n• **Proof of health insurance** (AOK, TK, DAK, etc.)\n• **Proof of sufficient funds:**\n  - Blocked account (Sperrkonto) - €11,208/year\n  - OR Scholarship letter\n  - OR Verpflichtungserklärung (sponsor declaration)\n  - OR Parents' guarantee + financial evidence\n• Rental contract (proof of address)",
      },
      {
        id: "blocked-account",
        title: "Blocked Account (Sperrkonto)",
        content: "A blocked account proves you have sufficient funds. Currently €934/month (€11,208/year minimum).\n\n**Popular providers:**\n• Expatrio - Most popular for students\n• Fintiba - Good alternative\n• Deutsche Bank - Traditional option\n\n💡 **Tip:** Keep your blocked account active and funded for permit renewals.",
      },
      {
        id: "costs-validity",
        title: "Costs & Validity",
        content: "**Validity:**\n• Usually 2-3 years (based on study program length)\n\n**Fees:**\n• First permit: ~€100\n• Extension: ~€93-96\n• Some scholarships = no fee\n\n**Payment:** Cash or EC card only (NO credit cards)",
      },
      {
        id: "work-rights",
        title: "Can I Work with a Student Permit?",
        content: "Yes! With a student residence permit you can work:\n\n• **120 full days OR 240 half days per year**\n• (Updated rules may allow 140/280 - check current regulations)\n\n⚠️ More work requires special permission or a different permit type.\n\n💡 Werkstudent jobs (max 20h/week during semester) count as half days.",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if my visa expires before I get my permit?",
        answer: "If you applied in time, you get 'Fiktionswirkung' - your old visa/permit remains valid until a decision is made. You may need a Fiktionsbescheinigung as proof.",
      },
      {
        id: "faq-2",
        question: "Can I travel while waiting for my permit?",
        answer: "With a Fiktionsbescheinigung, you can usually travel. However, confirm with the immigration office first, especially for travel outside the EU.",
      },
    ],
    resources: [
      { id: "r1", title: "Munich Immigration Portal", url: "https://stadt.muenchen.de/service/info/aufenthaltserlaubnis-zum-studium/1080627/", type: "official", description: "Online application portal" },
      { id: "r2", title: "Expatrio Blocked Account", url: "https://expatrio.com", type: "tool", description: "Popular blocked account provider" },
      { id: "r3", title: "Fintiba", url: "https://fintiba.com", type: "tool", description: "Alternative blocked account" },
    ],
    relatedSlugs: ["anmeldung-guide", "permit-extension-guide", "fiktionsbescheinigung-guide"],
  },
  {
    slug: "first-weeks-munich",
    title: "Your First Weeks in Munich: Complete Checklist",
    summary: "Everything you need to do in your first 2-4 weeks after arriving in Munich, in the right order with proper timeline.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "tips"],
    lastUpdated: "2025-12-15",
    readingTime: 7,
    featured: true,
    sections: [
      {
        id: "before-arrival",
        title: "Before Arrival (If Possible)",
        content: "☐ Book temporary accommodation (Airbnb, hostel, friends)\n☐ Get travel insurance for the first days\n☐ Prepare Wohnungsgeberbestätigung form for landlord to sign\n☐ Have digital copies of all documents (passport, visa, admission letter)\n☐ Download MVG app for public transport",
      },
      {
        id: "week-1",
        title: "Week 1: Essential Setup",
        content: "**Day 1-3:**\n☐ Get a German SIM card (Aldi Talk, Lidl Connect, O2)\n☐ Buy an MVV transport ticket (Isarcard, single tickets, or day pass)\n☐ Book Anmeldung appointment ASAP at muenchen.de/termin\n  • ⚠️ Must register within 14 days of moving in!\n  • Try booking at midnight when new slots open\n\n**Day 4-7:**\n☐ Complete Anmeldung at Bürgerbüro\n  • Bring: Passport, Wohnungsgeberbestätigung, registration form\n  • Get your Meldebescheinigung (keep safe!)\n☐ Open a bank account (N26, Commerzbank, Sparkasse, Deutsche Bank)\n☐ Apply for health insurance (AOK, TK, DAK, Barmer)",
      },
      {
        id: "week-2",
        title: "Week 2: University & Residence Permit",
        content: "☐ Complete university enrollment (Immatrikulation)\n☐ Get student ID (Studierendenausweis)\n☐ Activate MVV semester ticket at MVG center or online\n☐ **(Non-EU students):** Apply for residence permit online\n  • Need: Anmeldebestätigung, health insurance, blocked account/funds proof\n  • Save the confirmation PDF!\n☐ Set up your blocked account withdrawal if needed",
      },
      {
        id: "week-3-4",
        title: "Weeks 3-4: Settling In",
        content: "☐ Receive Tax ID (Steuer-ID) by mail - check your mailbox!\n  • Make sure your name is on the mailbox\n☐ Register for university courses\n☐ Explore your campus and neighborhood\n☐ Join student groups / Moroccan community (MSV, Marokkanische Studentenverein)\n☐ Set up GEZ broadcasting fee or apply for student exemption\n  • Students on BAföG or low income can be exempt\n☐ Get a library card (Stadtbibliothek München)",
      },
      {
        id: "useful-contacts",
        title: "Important Contacts",
        content: "📞 **Emergency numbers:**\n• Police: 110\n• Fire/Ambulance: 112\n• Medical on-call (non-emergency): 116 117\n\n🏛️ **KVR Immigration Office:**\n• Ruppertstraße 19, 80337 München\n• Phone: +49 89 233-96010\n\n🏫 **University help:**\n• International office at your university\n• Student counseling (Studienberatung)\n• AStA/student union\n\n🇲🇦 **Moroccan Embassy (Berlin):**\n• Phone: +49 30 206 12 40",
      },
      {
        id: "common-mistakes",
        title: "Common Mistakes to Avoid",
        content: "❌ **Don't:**\n• Miss the 14-day Anmeldung deadline\n• Forget the Wohnungsgeberbestätigung - you cannot register without it!\n• Let your visa expire before applying for residence permit\n• Ignore mail - your Tax ID comes by post\n\n✅ **Do:**\n• Book appointments in advance (slots fill fast)\n• Keep all original documents safe\n• Save digital copies of everything\n• Apply for residence permit at least 2-3 weeks before visa expires",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if I can't find an Anmeldung appointment?",
        answer: "Try booking at midnight when new slots open (2 weeks in advance). Check all Bürgerbüro locations - outer city offices often have better availability.",
      },
      {
        id: "faq-2",
        question: "How long until I receive my Tax ID?",
        answer: "Usually 2-4 weeks after Anmeldung. Make sure your name is clearly visible on your mailbox.",
      },
    ],
    resources: [
      { id: "r1", title: "Book Anmeldung Appointment", url: "https://stadt.muenchen.de/terminvereinbarung", type: "official", description: "KVR appointment booking" },
      { id: "r2", title: "MVG App", url: "https://www.mvg.de/services/apps/mvg-app.html", type: "tool", description: "Munich public transport app" },
      { id: "r3", title: "N26 Bank", url: "https://n26.com", type: "tool", description: "Popular mobile bank for students" },
    ],
    relatedSlugs: ["anmeldung-guide", "residence-permit-guide", "finding-apartment-munich", "health-insurance-guide"],
  },
  // ============================================
  // UNIVERSITY LIFE
  // ============================================
  {
    slug: "university-enrollment",
    title: "University Enrollment & Registration",
    summary: "How to complete enrollment at TUM, LMU, and other Munich universities.",
    categoryKey: "university-life",
    tags: ["newcomer", "documents"],
    lastUpdated: "2025-10-15",
    readingTime: 7,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: "After receiving your admission letter, you need to complete enrollment (Immatrikulation) to become an official student. This guide covers the major Munich universities.",
      },
      {
        id: "tum-enrollment",
        title: "TUM Enrollment",
        content: "**Online steps:**\n1. Log into TUMonline with your applicant ID\n2. Upload required documents\n3. Pay semester fee (~€85)\n4. Submit application for enrollment\n\n**In-person:**\n• Visit Studenten-Service-Zentrum if required\n• Location: Arcisstraße 21",
      },
      {
        id: "lmu-enrollment",
        title: "LMU Enrollment",
        content: "**Steps:**\n1. Log into LSF portal\n2. Complete online enrollment form\n3. Pay semester fee\n4. Upload documents\n5. Visit Studentenkanzlei with originals if required",
      },
      {
        id: "what-you-get",
        title: "What You Get After Enrollment",
        content: "• **Student ID** - Your Studierendenausweis\n• **MVV semester ticket** - Unlimited public transport in Munich zone\n• **Email account** - University email\n• **Library access** - All university libraries\n• **Discounts** - Student discounts everywhere!",
      },
    ],
    relatedSlugs: ["semester-ticket-guide", "student-discounts"],
  },
  {
    slug: "semester-ticket-guide",
    title: "MVV Semester Ticket Guide",
    summary: "Everything about the student semester ticket - coverage, activation, and tips.",
    categoryKey: "university-life",
    tags: ["tips", "budget-friendly"],
    lastUpdated: "2025-10-01",
    readingTime: 5,
    sections: [
      {
        id: "overview",
        title: "What's Included",
        content: "The semester ticket (Semesterticket) gives you unlimited travel on all MVV public transport:\n• U-Bahn\n• S-Bahn\n• Tram\n• Bus\n\n**Coverage:** Entire MVV network (zones M-6 or more)\n**Valid:** One semester (6 months)\n**Cost:** Included in semester fee",
      },
      {
        id: "activation",
        title: "Activation",
        content: "**TUM students:**\n• Download the MVGO app\n• Link your TUM account\n• Ticket appears automatically\n\n**LMU students:**\n• Similar process via MVGO\n• Or use the IsarCard Semester",
      },
      {
        id: "tips",
        title: "Tips",
        content: "• Always have student ID as backup\n• Ticket is personal - can't share\n• Works 24/7, no time restrictions\n• First-class requires upgrade ticket\n• Bicycle needs separate ticket",
      },
    ],
    relatedSlugs: ["university-enrollment", "useful-apps"],
  },
  // ============================================
  // CAREER
  // ============================================
  {
    slug: "werkstudent-guide",
    title: "Working as a Werkstudent",
    summary: "Everything about student jobs, work permits, and finding Werkstudent positions in Munich.",
    categoryKey: "career",
    tags: ["tips", "newcomer"],
    lastUpdated: "2025-11-01",
    readingTime: 8,
    sections: [
      {
        id: "what-is-werkstudent",
        title: "What is a Werkstudent?",
        content: "A Werkstudent is a working student employed part-time during their studies. It's one of the most common student jobs in Germany.\n\n**Key rules:**\n• Max 20 hours/week during semester\n• Can work full-time during semester breaks\n• Reduced social security contributions\n• Gain real work experience",
      },
      {
        id: "work-permit",
        title: "Work Permit for Non-EU Students",
        content: "Your student visa typically allows:\n• 120 full days OR 240 half days per year\n• Werkstudent counts as half days\n• Internships required by curriculum are exempt\n\n⚠️ **Important:** Don't exceed limits or you risk your visa!",
      },
      {
        id: "finding-jobs",
        title: "Where to Find Jobs",
        content: "**Job platforms:**\n• LinkedIn - Best for tech and business\n• Indeed.de - General listings\n• StepStone - Professional roles\n• XING - German professional network\n• Glassdoor - Company reviews + jobs\n\n**University resources:**\n• TUM Career Service\n• LMU Job Board\n• University job fairs\n\n**Munich-specific:**\n• Munich Startup scene\n• Many tech companies need bilingual students",
      },
      {
        id: "salary-expectations",
        title: "Salary Expectations",
        content: "Typical Werkstudent hourly rates:\n• Entry level: €12-15/hour\n• Tech/Engineering: €15-20/hour\n• Experienced: €18-25/hour\n\n💡 **Tip:** Don't undersell yourself - Munich is expensive!",
      },
    ],
    resources: [
      { id: "r1", title: "TUM Career Service", url: "https://www.tum.de/en/studies/during-your-studies/career-service/", type: "official" },
      { id: "r2", title: "LinkedIn", url: "https://linkedin.com", type: "tool" },
    ],
    relatedSlugs: ["cv-tips-germany", "internship-guide"],
  },
  {
    slug: "cv-tips-germany",
    title: "German CV (Lebenslauf) Guide",
    summary: "How to write a CV that works for German employers, including format, photo, and cultural tips.",
    categoryKey: "career",
    tags: ["tips", "documents"],
    lastUpdated: "2025-10-15",
    readingTime: 6,
    sections: [
      {
        id: "german-cv-basics",
        title: "German CV Basics",
        content: "German CVs differ from other countries:\n\n**Key differences:**\n• Photo is expected (professional headshot)\n• Personal info included (birth date, nationality)\n• Reverse chronological format\n• 1-2 pages maximum\n• Clean, professional design",
      },
      {
        id: "structure",
        title: "CV Structure",
        content: "**Standard sections:**\n1. Personal Information + Photo\n2. Work Experience\n3. Education\n4. Skills\n5. Languages\n6. Hobbies/Interests (optional)\n\n**Format tips:**\n• Use a clean, modern template\n• PDF format only\n• File name: 'Lebenslauf_YourName.pdf'",
      },
      {
        id: "photo-tips",
        title: "Photo Tips",
        content: "**Professional photo guidelines:**\n• Recent, high-quality\n• Business casual or formal attire\n• Neutral background\n• Friendly but professional expression\n• Face takes up 60-70% of frame\n\n💡 **Where to get one:** DM or Rossmann photo booths, or professional photographers",
      },
    ],
    relatedSlugs: ["werkstudent-guide", "internship-guide"],
  },
  // ============================================
  // USEFUL APPS
  // ============================================
  {
    slug: "essential-apps-munich",
    title: "Essential Apps for Life in Munich",
    summary: "Must-have apps for transport, banking, food, and daily life in Munich.",
    categoryKey: "useful-apps",
    tags: ["newcomer", "tips"],
    lastUpdated: "2025-12-01",
    readingTime: 5,
    featured: true,
    sections: [
      {
        id: "transport",
        title: "Transport Apps",
        content: "**MVGO** - Official MVV app\n• Buy tickets, plan routes\n• Link semester ticket\n\n**DB Navigator** - Deutsche Bahn\n• Train tickets throughout Germany\n• Delay info and alternatives\n\n**Google Maps** - Navigation\n• Real-time transit info",
      },
      {
        id: "banking",
        title: "Banking Apps",
        content: "**N26** - Mobile-first bank\n• Free basic account\n• Easy to open with passport\n\n**Sparkasse / Commerzbank** - Traditional banks\n• More features, physical branches\n\n**PayPal** - Online payments",
      },
      {
        id: "food-delivery",
        title: "Food & Delivery",
        content: "**Lieferando** - Food delivery\n• Filter by halal options\n\n**Gorillas / Flink** - Grocery delivery\n\n**Too Good To Go** - Discount surplus food\n• Great deals on bakery items",
      },
      {
        id: "communication",
        title: "Communication",
        content: "**WhatsApp** - Everyone uses it\n\n**Telegram** - Groups and channels\n\n**DeepL** - Translation (better than Google Translate for German)",
      },
      {
        id: "utilities",
        title: "Utilities",
        content: "**Doctolib** - Book doctor appointments\n\n**Expatrio/Fintiba** - Blocked account management\n\n**ImmoScout24** - Apartment search\n\n**WG-Gesucht** - Shared apartment search",
      },
    ],
    relatedSlugs: ["first-weeks-munich"],
  },
];

// Helper functions
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(categoryKey: CategoryKey): Guide[] {
  return guides.filter((g) => g.categoryKey === categoryKey);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  if (!guide.relatedSlugs) return [];
  return guide.relatedSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== undefined);
}

export function searchGuides(query: string): Guide[] {
  const q = query.toLowerCase();
  return guides.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  );
}
