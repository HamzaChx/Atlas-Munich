import { Guide, CategoryKey } from "@/types";

export const guides: Guide[] = [
  // ============================================
  // RENT & HOUSING
  // ============================================
  {
    slug: "finding-apartment-munich",
    title: "Finding an Apartment in Munich: Complete Guide",
    summary:
      "Navigate the competitive Munich housing market with our comprehensive guide covering where to search, what to expect, and how to succeed.",
    categoryKey: "rent-housing",
    tags: ["newcomer", "urgent", "tips"],
    lastUpdated: "2025-12-01",
    readingTime: 12,
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Munich has one of the most competitive housing markets in Germany. With a vacancy rate below 1%, finding an apartment requires preparation, patience, and the right strategy. This guide will help you navigate the process successfully.",
      },
      {
        id: "where-to-search",
        title: "Where to Search",
        content: "The best platforms for apartment hunting in Munich include:",
        subsections: [
          {
            id: "online-platforms",
            title: "Online Platforms",
            content:
              "- **ImmobilienScout24** - The largest real estate platform in Germany\n- **WG-Gesucht** - Best for shared apartments (WGs)\n- **Immowelt** - Another popular search engine\n- **eBay Kleinanzeigen** - Great for private listings\n- **Mr. Lodge** - For furnished apartments\n- **Facebook Groups** - 'Wohnung/WG in München', 'Expats in Munich'",
          },
          {
            id: "student-housing",
            title: "Student Housing",
            content:
              "- **Studentenwerk München** - Official student housing (apply early!)\n- **University housing offices** - TUM, LMU, HM each have their own\n- **Private student residences** - THE FIZZ, Youniq, Quarters",
          },
        ],
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content:
          "Prepare these documents before viewing appointments:\n\n- **Self-disclosure form (Selbstauskunft)** - Personal and financial information\n- **SCHUFA credit report** - Get it free once a year at meineschufa.de\n- **Proof of income** - Salary slips, employment contract, or scholarship letter\n- **ID/Passport copy** - Valid identification\n- **Previous landlord reference** - If available\n- **Bank statements** - Last 3 months",
      },
      {
        id: "understanding-costs",
        title: "Understanding Costs",
        content:
          "Be prepared for these typical costs:\n\n- **Kaltmiete (Cold rent)** - Base rent without utilities\n- **Warmmiete (Warm rent)** - Includes heating and some utilities\n- **Nebenkosten** - Additional costs (water, garbage, building maintenance)\n- **Kaution (Deposit)** - Usually 2-3 months cold rent\n- **Provision** - Agent fee (if applicable) - usually 2 months rent + VAT",
      },
      {
        id: "avoiding-scams",
        title: "Avoiding Scams",
        content:
          "🚨 **Red flags to watch for:**\n\n- Landlord is 'abroad' and can't show the apartment\n- Asked to pay before viewing\n- Price is significantly below market rate\n- Poor grammar/communication\n- Western Union or unusual payment methods\n- No proper contract offered\n\n✅ **Safe practices:**\n- Always visit in person before paying\n- Never pay in cash without receipt\n- Verify landlord identity\n- Use proper bank transfers\n- Read contracts carefully",
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
        answer:
          "Yes, most landlords require it. Get your free copy at meineschufa.de or pay ~30€ for instant access.",
      },
      {
        id: "faq-3",
        question: "Can I rent without a German bank account?",
        answer:
          "It's very difficult. Open a German bank account first - N26 or Commerzbank work well for newcomers.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "ImmobilienScout24",
        url: "https://immobilienscout24.de",
        type: "tool",
        description: "Largest apartment search platform",
      },
      {
        id: "r2",
        title: "WG-Gesucht",
        url: "https://wg-gesucht.de",
        type: "tool",
        description: "Best for shared apartments",
      },
      {
        id: "r3",
        title: "Studentenwerk München",
        url: "https://www.studentenwerk-muenchen.de/en/accommodation/",
        type: "official",
        description: "Student housing applications",
      },
      {
        id: "r4",
        title: "SCHUFA Free Copy",
        url: "https://www.meineschufa.de/de/datenkopie",
        type: "official",
        description: "Get your credit report",
      },
    ],
    relatedSlugs: ["anmeldung-guide", "first-weeks-munich"],
  },
   {
    slug: "munich-student-housing-basics-2025",
    title: "Munich Student Housing Basics",
    summary:
      "Short overview of what students can realistically expect to pay for housing in Munich, plus key options and budgeting tips.",
    categoryKey: "rent-housing",
    tags: ["newcomer", "tips", "budget-friendly"],
    lastUpdated: "2025-12-20",
    readingTime: 6,
    featured: false,
    sections: [
      {
        id: "market-reality",
        title: "Munich Rental Reality in 2025-2026",
        content:
          "Munich is one of the tightest rental markets in Europe. Vacancy is usually **below 1%**, which basically means everything is always taken. New contracts for normal apartments average around **€23/m² (cold)**, and small student-friendly studios are even more expensive per square meter.\n\nThe result: competition is high, good listings disappear quickly, and students often pay more than friends in other German cities. Planning and realistic budgeting are essential.",
      },
      {
        id: "student-housing-options",
        title: "Main Student Housing Options",
        content:
          "**Public dorms (Studierendenwerk)**\n- Average rent: around **€360/month** (by far the cheapest option)\n- Very long waiting times: **1–7 semesters**\n- You must **re-confirm your application every semester** with your enrollment certificate\n\n**Private student residences** (e.g. The FIZZ, Unity Alpha, Youniq)\n- Modern, furnished micro-apartments (~20 m²)\n- Typical range: **€620–800+ warm** per month\n- Often include utilities and internet\n- Easy to book from abroad, but **expensive** for students\n\n**WG rooms (shared flats)**\n- Usual price range: **€400–800 warm**, depending on district\n- You apply to join an existing WG and attend a **“WG-Casting”** (informal interview)\n- Great for social life and language practice\n\n**Own studio / small flat**\n- Small studios (20–35 m²) on the open market often cost **€900–1,300 cold**\n- On top of that, you pay Nebenkosten, electricity, internet, and the broadcasting fee",
      },
      {
        id: "warm-rent-and-costs",
        title: "Warm Rent, Nebenkosten & Hidden Costs",
        content:
          "In Germany, you will often see two terms:\n\n- **Kaltmiete (cold rent):** base rent for the apartment only\n- **Warmmiete (warm rent):** cold rent **plus** most building-related costs\n\n**Nebenkosten (operating costs)**\n- Typically **€2.50–4.00/m² per month**\n- Includes things like heating, water, trash, cleaning, and some building services\n- Example: 30 m² flat → about **€75–120** Nebenkosten per month\n\n**Usually *not* included in Nebenkosten**\n- **Electricity (Strom):** often **€50–80/month** for 1–2 people\n- **Internet/phone:** around **€30–50/month**\n- **Rundfunkbeitrag (broadcasting fee):** about **€18.36/month per flat**, no matter if you watch TV or not\n\nWhen you calculate your budget, always check if the price in the ad is **cold** or **warm** and then add electricity, internet, and the broadcasting fee.",
      },
      {
        id: "affordability-and-deposit",
        title: "How Much Can I Afford?",
        content:
          "German landlords usually follow a simple rule: your **warm rent should be around 30–40% of your net monthly income**.\n\n**Example:**\n- Warm rent: **€1,200/month**\n- Required net income: roughly **€3,000–4,000/month** for the household\n\nStudents often do not reach this on their own, so a **parental guarantee or sponsor** is common.\n\n**Deposit (Kaution)**\n- Legal maximum: **3× cold rent**\n- Can be paid in up to **three monthly installments** starting with the first rent\n- The landlord must keep it in a **separate, safe account** (Mietkautionskonto)",
      },
      {
        id: "location-strategy",
        title: "Location & S-Bahn Strategy",
        content:
          "Central districts (Schwabing, Maxvorstadt, Glockenbach, Lehel, etc.) are very attractive but also among the **most expensive** in Munich.\n\nTo save money, many students use the **“S-Bahn Strategy”**:\n\n- Look in **outer districts** like Riem, Allach, Untermenzing, Aubing, Neuaubing, or Lochhausen\n- Accept a **20–30 minute S-Bahn commute** to university\n- In return, you can often reduce your rent by **15–20%** compared to the city center\n\nAlways compare the **rental savings** with the **extra time and cost** of commuting.",
      },
      {
        id: "search-and-safety",
        title: "Search Strategy & Scam Warnings",
        content:
          "**When to start**\n- Begin your search **3–6 months before** you want to move in\n\n**Where to search**\n- **ImmobilienScout24:** main platform for full apartments\n- **WG-Gesucht:** best for WG rooms and temporary sublets\n- **Kleinanzeigen:** private listings (can be cheaper, but watch out for scams)\n\n**Prepare a Bewerbungsmappe (application portfolio)**\n- Short cover letter in German (who you are, what you study, non-smoker, etc.)\n- **SCHUFA** or another credit report\n- Proof of income or parental sponsorship\n- Self-disclosure form (Mieterselbstauskunft)\n- If possible: letter from previous landlord confirming you always paid on time\n\n**Scam red flags**\n- Landlord claims to be abroad and asks for money **before** any viewing\n- Keys will supposedly be sent by a platform (Airbnb, TripAdvisor, etc.) after payment\n- You are asked to send **passport/ID scans** before even visiting the flat\n\nNever transfer money or send high-quality ID scans to people you have not met in person. When sending a copy, always **watermark it** (e.g. “Copy for rental application only”).",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "How much should I realistically budget for a room or small flat?",
        answer:
          "For a WG room, expect **€400–800 warm** depending on location. For a small private studio, **€900–1,300 cold** plus Nebenkosten and other costs is common. Many students end up paying **€700–1,000+ warm** in total.",
      },
      {
        id: "faq-2",
        question: "Is it worth applying for Studierendenwerk dorms?",
        answer:
          "Yes, because the rent is much lower (~€360/month). But waiting times are long (1–7 semesters), so you should **also** look for WGs or private options in parallel.",
      },
      {
        id: "faq-3",
        question: "Can I get a place before I arrive in Munich?",
        answer:
          "It is possible, especially with private student residences or some WGs that do online interviews. However, it is **riskier**. Avoid any landlord who asks for large transfers before you or someone you trust has seen the flat in person.",
      },
    ],
    resources: [
      {
        id: "r-msh-1",
        title: "Studierendenwerk München Oberbayern – Housing",
        url: "https://www.studentenwerk-muenchen.de/en/accommodation/",
        type: "official",
        description:
          "Official public student dorms with detailed information on prices and waiting times.",
      },
      {
        id: "r-msh-2",
        title: "WG-Gesucht",
        url: "https://www.wg-gesucht.de",
        type: "tool",
        description: "Main platform for shared flats (WGs) and temporary rooms.",
      },
      {
        id: "r-msh-3",
        title: "ImmobilienScout24",
        url: "https://www.immobilienscout24.de",
        type: "tool",
        description: "Largest platform for apartments and studios in Munich.",
      },
      {
        id: "r-msh-4",
        title: "The FIZZ Munich",
        url: "https://www.the-fizz.com/en",
        type: "tool",
        description: "Example of private, furnished student residence with all-in pricing.",
      },
      {
        id: "r-msh-5",
        title: "Youniq Student Apartments",
        url: "https://www.youniq.de/en/",
        type: "tool",
        description: "Another private student housing provider in Germany.",
      },
    ],
    relatedSlugs: ["finding-apartment-munich", "first-weeks-munich", "essential-apps-munich"],
  },
  // ============================================
  // KVR & RESIDENCE PERMIT
  // ============================================
  {
    slug: "anmeldung-guide",
    title: "Anmeldung (City Registration) at KVR",
    summary:
      "Step-by-step guide to register your address at a Bürgerbüro within 14 days. Appointment required - no walk-ins allowed.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "documents", "official"],
    lastUpdated: "2025-12-15",
    readingTime: 8,
    featured: true,
    sections: [
      {
        id: "what-is-anmeldung",
        title: "What is Anmeldung?",
        content:
          "Anmeldung is the mandatory city registration that every resident in Germany must complete within 14 days of moving into a new address. This is required by law.\n\nYou need this registration for:\n- University enrollment (sometimes required)\n- Opening a bank account\n- Mobile phone / internet contracts\n- Receiving your Tax ID (sent to your registered address)\n- Applying for a residence permit",
      },
      {
        id: "where-to-go",
        title: "Where Do I Go?",
        content:
          "Register at a Bürgerbüro (citizen's office). There are several locations in Munich:\n\n- Ruppertstraße 19 (Main KVR location)\n- Orleansstraße 50 (Haidhausen)\n- Leonrodstraße 21 (Neuhausen)\n- Hanauer Straße 56 (Moosach)\n- Forstenrieder Allee 61a (Forstenried)\n- Riesenfeldstraße 75 (Milbertshofen)\n\n💡 Tip: Smaller offices outside the center often have shorter wait times.",
      },
      {
        id: "booking-appointment",
        title: "Booking an Appointment",
        content:
          "⚠️ Important: You ALWAYS need an appointment. No walk-ins allowed.\n\n**How to book:**\n1. Go to muenchen.de/termin\n2. Select 'Bürgerbüro' (Citizens Office)\n3. Choose 'An- oder Ummeldung' (Registration or Re-registration)\n4. Select your preferred location and time\n\n**Pro tips:**\n- Appointments open 2 weeks in advance at midnight\n- Set an alarm for 23:59 and refresh at 00:00 for best availability\n- Try different Bürgerbüro locations - some have better availability",
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content:
          "✅ **Must bring:**\n\n1. **Passport** (and visa, if applicable)\n2. **Wohnungsgeberbestätigung** - Landlord confirmation form\n   - This is MANDATORY - your landlord/dorm must sign it\n   - Without this, you CANNOT register\n3. **Registration form** (Anmeldeformular) - download from muenchen.de or get at office\n\n📋 **Good to have:**\n- Rental contract copy (optional but helpful)",
      },
      {
        id: "at-appointment",
        title: "What Happens at the Appointment",
        content:
          "The process is straightforward:\n\n1. You give your documents\n2. Staff enters your data into the system\n3. You receive a Meldebescheinigung (registration certificate)\n\n**Keep this Meldebescheinigung safe!** You'll need it for:\n- Bank accounts\n- Health insurance\n- Residence permit applications\n- Various contracts",
      },
      {
        id: "after-registration",
        title: "After Registration",
        content:
          "**What you'll receive:**\n- Meldebescheinigung immediately at the office\n- Tax ID (Steuer-ID) arrives by mail in 2-4 weeks\n\n⚠️ **Important:** Make sure your name is on the mailbox to receive your Tax ID!\n\n**Next steps:**\n- Open a German bank account\n- Get health insurance\n- Apply for residence permit (if non-EU)",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if I can't get a Wohnungsgeberbestätigung?",
        answer:
          "The landlord is legally required to provide it. If they refuse, you can report them to the authorities. For subletting, the main tenant signs it.",
      },
      {
        id: "faq-2",
        question: "What if I miss the 14-day deadline?",
        answer:
          "Register as soon as possible. Late registration can result in fines up to €1000, though for short delays (few days/weeks) they're usually lenient.",
      },
      {
        id: "faq-3",
        question: "Do I need to register if staying temporarily (under 3 months)?",
        answer:
          "For stays under 3 months, generally no. For longer stays or if you're starting university/work, you must register at your permanent address.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "Book Appointment",
        url: "https://stadt.muenchen.de/terminvereinbarung",
        type: "official",
        description: "Official KVR appointment booking",
      },
      {
        id: "r2",
        title: "Registration Form",
        url: "https://stadt.muenchen.de/service/info/anmeldung-einer-wohnung/1063481/",
        type: "document",
        description: "Download Anmeldeformular",
      },
      {
        id: "r3",
        title: "Wohnungsgeberbestätigung",
        url: "https://stadt.muenchen.de/dam/jcr:fbe8e4e4-8808-4d1a-bfb8-8c9c6c3a7c4e/wohnungsgeberbestaetigung.pdf",
        type: "document",
        description: "Landlord confirmation form",
      },
    ],
    relatedSlugs: ["residence-permit-guide", "finding-apartment-munich", "first-weeks-munich"],
  },
  {
    slug: "residence-permit-guide",
    title: "Student Residence Permit Application",
    summary:
      "Complete guide to applying for your student residence permit (Aufenthaltserlaubnis) online at the Munich Immigration Office.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "documents", "official"],
    lastUpdated: "2025-12-15",
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Non-EU students need a residence permit (Aufenthaltserlaubnis) to study in Germany. The student permit (§16b AufenthG) is typically issued for 2-3 years based on your study program length.\n\n**Who handles this?**\nAusländerbehörde / Service Centre for Immigration\nKVR, Ruppertstraße 19, 80337 München\nPhone: +49 89 233-96010\n\n⚠️ You do NOT walk in. Apply online or by post and wait for processing.",
      },
      {
        id: "before-arrival",
        title: "Before Coming to Germany",
        content:
          "Most non-EU students:\n1. Apply for a student visa in their home country\n2. Enter Germany with that visa (usually valid 3 months)\n3. Convert it to a residence permit in Munich\n\n⚠️ Apply for your residence permit BEFORE your visa or 90-day period expires!",
      },
      {
        id: "application-process",
        title: "How to Apply",
        content:
          "**Step-by-step process:**\n\n1. Complete Anmeldung first (city registration)\n2. Go to the Munich Immigration website\n3. Fill out the online application form\n4. Upload all documents (PDF/JPG format)\n5. Submit the application\n6. **Save the confirmation PDF** - very important!\n\n**What happens next:**\n- KVR checks your documents\n- They may request additional documents\n- You receive an appointment invitation for fingerprints/photo/pickup\n\n**Processing time:** Usually 4-8 weeks",
      },
      {
        id: "required-documents",
        title: "Required Documents",
        content:
          "📋 **Complete checklist:**\n\n- Application form (online)\n- Valid passport + visa\n- Biometric passport photo\n- Anmeldebestätigung (registration certificate)\n- University admission or enrollment certificate (Immatrikulationsbescheinigung)\n- **Proof of health insurance** (AOK, TK, DAK, etc.)\n- **Proof of sufficient funds:**\n  - Blocked account (Sperrkonto) - €11,208/year\n  - OR Scholarship letter\n  - OR Verpflichtungserklärung (sponsor declaration)\n  - OR Parents' guarantee + financial evidence\n- Rental contract (proof of address)",
      },
      {
        id: "blocked-account",
        title: "Blocked Account (Sperrkonto)",
        content:
          "A blocked account proves you have sufficient funds. Currently €934/month (€11,208/year minimum).\n\n**Popular providers:**\n- Expatrio - Most popular for students\n- Fintiba - Good alternative\n- Deutsche Bank - Traditional option\n\n💡 **Tip:** Keep your blocked account active and funded for permit renewals.",
      },
      {
        id: "costs-validity",
        title: "Costs & Validity",
        content:
          "**Validity:**\n- Usually 2-3 years (based on study program length)\n\n**Fees:**\n- First permit: ~€100\n- Extension: ~€93-96\n- Some scholarships = no fee\n\n**Payment:** Cash or EC card only (NO credit cards)",
      },
      {
        id: "work-rights",
        title: "Can I Work with a Student Permit?",
        content:
          "Yes! With a student residence permit you can work:\n\n- **120 full days OR 240 half days per year**\n- During university breaks, you can usually work full-time\n- Werkstudent jobs (max 20h/week during semester) count as half days\n\n⚠️ **Important:** More work requires special permission or a different permit type.\n\n💡 Werkstudent jobs (max 20h/week during semester) count as half days.",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if my visa expires before I get my permit?",
        answer:
          "If you applied in time, you get 'Fiktionswirkung' - your old visa/permit remains valid until a decision is made. You may need a Fiktionsbescheinigung as proof.",
      },
      {
        id: "faq-2",
        question: "Can I travel while waiting for my permit?",
        answer:
          "With a Fiktionsbescheinigung, you can usually travel. However, confirm with the immigration office first, especially for travel outside the EU.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "Munich Immigration Portal",
        url: "https://stadt.muenchen.de/service/info/aufenthaltserlaubnis-zum-studium/1080627/",
        type: "official",
        description: "Online application portal",
      },
      {
        id: "r2",
        title: "Expatrio Blocked Account",
        url: "https://expatrio.com",
        type: "tool",
        description: "Popular blocked account provider",
      },
      {
        id: "r3",
        title: "Fintiba",
        url: "https://fintiba.com",
        type: "tool",
        description: "Alternative blocked account",
      },
    ],
    relatedSlugs: ["anmeldung-guide", "permit-extension-guide", "fiktionsbescheinigung-guide"],
  },
  {
    slug: "first-weeks-munich",
    title: "Your First Weeks in Munich: Complete Checklist",
    summary:
      "Everything you need to do in your first 2-4 weeks after arriving in Munich, in the right order with proper timeline.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "tips"],
    lastUpdated: "2025-12-15",
    readingTime: 7,
    featured: true,
    sections: [
      {
        id: "before-arrival",
        title: "Before Arrival (If Possible)",
        content:
          "- [ ] Book temporary accommodation (Airbnb, hostel, friends)\n- [ ] Get travel insurance for the first days\n- [ ] Prepare Wohnungsgeberbestätigung form for landlord to sign\n- [ ] Have digital copies of all documents (passport, visa, admission letter)\n- [ ] Download MVG app for public transport",
      },
      {
        id: "week-1",
        title: "Week 1: Essential Setup",
        content:
          "**Day 1-3:**\n- [ ] Get a German SIM card (Aldi Talk, Lidl Connect, O2)\n- [ ] Buy an MVV transport ticket (Isarcard, single tickets, or day pass)\n- [ ] Book Anmeldung appointment ASAP at muenchen.de/termin\n  - ⚠️ Must register within 14 days of moving in!\n  - Try booking at midnight when new slots open\n\n**Day 4-7:**\n- [ ] Complete Anmeldung at Bürgerbüro\n  - Bring: Passport, Wohnungsgeberbestätigung, registration form\n  - Get your Meldebescheinigung (keep safe!)\n- [ ] Open a bank account (N26, Commerzbank, Sparkasse, Deutsche Bank)\n- [ ] Apply for health insurance (AOK, TK, DAK, Barmer)",
      },
      {
        id: "week-2",
        title: "Week 2: University & Residence Permit",
        content:
          "- [ ] Complete university enrollment (Immatrikulation)\n- [ ] Get student ID (Studierendenausweis)\n- [ ] Activate MVV semester ticket at MVG center or online\n- [ ] **(Non-EU students):** Apply for residence permit online\n  - Need: Anmeldebestätigung, health insurance, blocked account/funds proof\n  - Save the confirmation PDF!\n- [ ] Set up your blocked account withdrawal if needed",
      },
      {
        id: "week-3-4",
        title: "Weeks 3-4: Settling In",
        content:
          "- [ ] Receive Tax ID (Steuer-ID) by mail - check your mailbox!\n  - Make sure your name is on the mailbox\n- [ ] Register for university courses\n- [ ] Explore your campus and neighborhood\n- [ ] Join student groups / Moroccan community (MSV, Marokkanische Studentenverein)\n- [ ] Set up GEZ broadcasting fee or apply for student exemption\n  - Students on BAföG or low income can be exempt\n- [ ] Get a library card (Stadtbibliothek München)",
      },
      {
        id: "useful-contacts",
        title: "Important Contacts",
        content:
          "📞 **Emergency numbers:**\n- Police: 110\n- Fire/Ambulance: 112\n- Medical on-call (non-emergency): 116 117\n\n🏛️ **KVR Immigration Office:**\n- Ruppertstraße 19, 80337 München\n- Phone: +49 89 233-96010\n\n🏫 **University help:**\n- International office at your university\n- Student counseling (Studienberatung)\n- AStA/student union\n\n🇲🇦 **Moroccan Embassy (Berlin):**\n- Phone: +49 30 206 12 40",
      },
      {
        id: "common-mistakes",
        title: "Common Mistakes to Avoid",
        content:
          "❌ **Don't:**\n- Miss the 14-day Anmeldung deadline\n- Forget the Wohnungsgeberbestätigung - you cannot register without it!\n- Let your visa expire before applying for residence permit\n- Ignore mail - your Tax ID comes by post\n\n✅ **Do:**\n- Book appointments in advance (slots fill fast)\n- Keep all original documents safe\n- Save digital copies of everything\n- Apply for residence permit at least 2-3 weeks before visa expires",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What if I can't find an Anmeldung appointment?",
        answer:
          "Try booking at midnight when new slots open (2 weeks in advance). Check all Bürgerbüro locations - outer city offices often have better availability.",
      },
      {
        id: "faq-2",
        question: "How long until I receive my Tax ID?",
        answer:
          "Usually 2-4 weeks after Anmeldung. Make sure your name is clearly visible on your mailbox.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "Book Anmeldung Appointment",
        url: "https://stadt.muenchen.de/terminvereinbarung",
        type: "official",
        description: "KVR appointment booking",
      },
      {
        id: "r2",
        title: "MVG App",
        url: "https://www.mvg.de/services/apps/mvg-app.html",
        type: "tool",
        description: "Munich public transport app",
      },
      {
        id: "r3",
        title: "N26 Bank",
        url: "https://n26.com",
        type: "tool",
        description: "Popular mobile bank for students",
      },
    ],
    relatedSlugs: [
      "anmeldung-guide",
      "residence-permit-guide",
      "finding-apartment-munich",
      "health-insurance-guide",
    ],
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
        content:
          "After receiving your admission letter, you need to complete enrollment (Immatrikulation) to become an official student. This guide covers the major Munich universities.",
      },
      {
        id: "tum-enrollment",
        title: "TUM Enrollment",
        content:
          "**Online steps:**\n1. Log into TUMonline with your applicant ID\n2. Upload required documents\n3. Pay semester fee (~€85)\n4. Submit application for enrollment\n\n**In-person:**\n- Visit Studenten-Service-Zentrum if required\n- Location: Arcisstraße 21",
      },
      {
        id: "lmu-enrollment",
        title: "LMU Enrollment",
        content:
          "**Steps:**\n1. Log into LSF portal\n2. Complete online enrollment form\n3. Pay semester fee\n4. Upload documents\n5. Visit Studentenkanzlei with originals if required",
      },
      {
        id: "what-you-get",
        title: "What You Get After Enrollment",
        content:
          "- **Student ID** - Your Studierendenausweis\n- **MVV semester ticket** - Unlimited public transport in Munich zone\n- **Email account** - University email\n- **Library access** - All university libraries\n- **Discounts** - Student discounts everywhere!",
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
        content:
          "The semester ticket (Semesterticket) gives you unlimited travel on all MVV public transport:\n- U-Bahn\n- S-Bahn\n- Tram\n- Bus\n\n**Coverage:** Entire MVV network (zones M-6 or more)\n**Valid:** One semester (6 months)\n**Cost:** Included in semester fee",
      },
      {
        id: "activation",
        title: "Activation",
        content:
          "**TUM students:**\n- Download the MVGO app\n- Link your TUM account\n- Ticket appears automatically\n\n**LMU students:**\n- Similar process via MVGO\n- Or use the IsarCard Semester",
      },
      {
        id: "tips",
        title: "Tips",
        content:
          "- Always have student ID as backup\n- Ticket is personal - can't share\n- Works 24/7, no time restrictions\n- First-class requires upgrade ticket\n- Bicycle needs separate ticket",
      },
    ],
    relatedSlugs: ["university-enrollment", "useful-apps"],
  },
  // ============================================
  // CAREER
  // ============================================
  {
    slug: "werkstudent-guide",
    title: "Working as a Werkstudent in Munich",
    summary:
      "Complete guide to student jobs in Munich - from finding opportunities to understanding work permits and salary expectations.",
    categoryKey: "career",
    tags: ["tips", "newcomer"],
    lastUpdated: "2025-12-15",
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Munich offers Moroccan students great opportunities to **gain work experience, build a career, and expand your professional network** in Europe.\n\nWhether you're looking for a part-time job (*Werkstudentenjob*), an internship (*Praktikum*), or your first full-time role after graduation, there are plenty of paths to explore.",
      },
      {
        id: "what-is-werkstudent",
        title: "What is a Werkstudent?",
        content:
          "A Werkstudent is a working student employed part-time during their studies. It's one of the most valuable job types for students in Germany.\n\n**Key benefits:**\n- Work in your field of study - gain relevant experience\n- Better pay than typical student jobs (€15-25/hour)\n- Reduced social security contributions\n- Possible path to full-time job after graduation\n- Build professional network in Germany\n\n**Key rules:**\n- Maximum 20 hours/week during semester\n- Can work full-time during semester breaks\n- Must be enrolled at a university\n- Gain real work experience in your field",
      },
      {
        id: "work-permit",
        title: "Work Permit for Non-EU Students",
        content:
          "If you hold a **student visa**, you are allowed to work:\n\n- **120 full days OR 240 half days per year** (without needing a separate work permit)\n- During university breaks, you can usually work full-time\n- Werkstudent jobs (max 20h/week during semester) count as half days\n\n⚠️ **Important:** Don't exceed these limits or you risk your visa! Double-check with your university international office or the foreigner's office for your specific visa conditions.",
      },
      {
        id: "where-to-find",
        title: "Where to Find Jobs",
        content:
          "**General Job Portals:**\n- [**StepStone**](https://www.stepstone.de/) - Popular across Germany for professional jobs and internships\n- [**Indeed**](https://de.indeed.com/) - Great for part-time and full-time roles. Search keywords: *Werkstudent*, *Praktikum*, *Teilzeit*\n- [**LinkedIn**](https://www.linkedin.com/) - A must-have! Build your profile and connect with recruiters\n\n**Flexible & Short-Term Jobs:**\n- [**Zenjob**](https://www.zenjob.com/) - Perfect for flexible part-time work (logistics, events, retail). Accept shifts that fit your schedule via mobile app.\n\n**University Resources:**\n- TUM Career Service - Free career counseling, workshops, job listings, networking events\n- LMU Career Center - CV help, job fairs, career planning support\n\n**Tips:**\n- Apply 2-3 months in advance for internships\n- Many tech companies in Munich hire English speakers\n- Join career fairs at TUM/LMU to meet employers directly",
      },
      {
        id: "job-types",
        title: "Common Student Job Types",
        content:
          "**Popular options for Moroccan students in Munich:**\n\n📦 **Logistics/Warehouse:**\n- Via Zenjob, Amazon, DHL\n- Flexible hours, decent pay\n- Basic German often sufficient\n\n☕ **Service Industry:**\n- Cafés, restaurants, delivery jobs\n- Good for practicing German\n- Tips can add to income\n\n💻 **Werkstudent (Professional):**\n- Tech, engineering, business roles\n- €15-25/hour\n- Work in your field of study\n- Best for long-term career building\n\n🧑‍🏫 **University Jobs:**\n- Tutoring, research assistant, translation\n- Convenient location\n- Flexible with class schedule",
      },
      {
        id: "salary",
        title: "Salary Expectations",
        content:
          "**Typical Werkstudent hourly rates in Munich:**\n\n- **Entry level:** €12-15/hour\n- **Tech/Engineering:** €15-20/hour\n- **Experienced/Specialized:** €18-25/hour\n- **Basic student jobs:** €13-16/hour (minimum wage or slightly above)\n\n💡 **Tips:**\n- Don't undersell yourself - Munich is expensive!\n- Werkstudent roles pay significantly better than basic jobs\n- Negotiate based on your skills and experience\n- Tech companies often offer higher rates",
      },
      {
        id: "language-requirements",
        title: "Language Requirements",
        content:
          "**German proficiency:**\n- Many entry-level/part-time jobs require **basic German (A2-B1)**\n- However, international companies and startups in Munich often hire English speakers\n- Especially in IT, engineering, and research fields\n\n**Improve your German:**\n- Take courses through your university\n- Goethe-Institut classes\n- Volkshochschule (VHS) - affordable group courses\n- Duolingo or other apps for practice\n\n💡 **Tip:** Even basic German significantly increases your job opportunities and helps with workplace integration.",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Can I work more than 20 hours per week during semester?",
        answer:
          "During semester, stay within 20 hours/week to maintain student benefits. However, during semester breaks you can work full-time without issues.",
      },
      {
        id: "faq-2",
        question: "Do I need to speak German for all jobs?",
        answer:
          "Not necessarily. Many international companies in Munich (especially tech) operate in English. However, basic German (A2-B1) opens many more opportunities and helps with integration.",
      },
      {
        id: "faq-3",
        question: "What's the difference between 120 full days and 240 half days?",
        answer:
          "You can work either 120 days at any hours, OR 240 days at max 4 hours per day. Werkstudent jobs (up to 20h/week) count as half days, so you can work nearly year-round.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "StepStone",
        url: "https://www.stepstone.de/",
        type: "official",
        description: "Major German job portal",
      },
      {
        id: "r2",
        title: "Indeed Germany",
        url: "https://de.indeed.com/",
        type: "official",
        description: "Job search engine",
      },
      {
        id: "r3",
        title: "LinkedIn",
        url: "https://linkedin.com",
        type: "tool",
        description: "Professional networking",
      },
      {
        id: "r4",
        title: "Zenjob",
        url: "https://www.zenjob.com/",
        type: "tool",
        description: "Flexible student jobs",
      },
      {
        id: "r5",
        title: "TUM Career Service",
        url: "https://www.community.tum.de/career-service/",
        type: "official",
        description: "TUM career support",
      },
    ],
    relatedSlugs: ["cv-tips-germany", "university-enrollment"],
  },
  {
    slug: "cv-tips-germany",
    title: "German CV & Application Guide",
    summary:
      "How to write a CV and cover letter that works for German employers, including format, photo requirements, and cultural tips.",
    categoryKey: "career",
    tags: ["tips", "documents"],
    lastUpdated: "2025-12-15",
    readingTime: 8,
    sections: [
      {
        id: "german-cv-basics",
        title: "German CV Basics",
        content:
          "German CVs (Lebenslauf) differ significantly from other countries. Understanding these differences is crucial for success.\n\n**Key differences:**\n- Professional photo is expected\n- Personal information included (birth date, nationality)\n- Reverse chronological format (most recent first)\n- 1-2 pages maximum\n- Clean, professional design\n- Always PDF format",
      },
      {
        id: "structure",
        title: "CV Structure",
        content:
          "**Standard sections (in order):**\n\n1. **Personal Information + Photo**\n   - Full name, address, phone, email\n   - Date of birth, nationality\n   - Professional photo (top right)\n\n2. **Work Experience**\n   - Most recent first\n   - Company name, position, dates\n   - Key responsibilities and achievements\n\n3. **Education**\n   - University, degree, dates\n   - Relevant coursework or thesis topic\n   - High school (Abitur equivalent)\n\n4. **Skills**\n   - Technical skills relevant to the job\n   - Software, tools, methodologies\n\n5. **Languages**\n   - Level for each (A1-C2 or native)\n   - Arabic, French, English, German\n\n6. **Hobbies/Interests** (optional)\n   - Keep professional and relevant\n\n**Format tips:**\n- Use a clean, modern template\n- Consistent fonts and spacing\n- File name: 'Lebenslauf_YourName.pdf'\n- Black text on white background",
      },
      {
        id: "photo-tips",
        title: "Professional Photo Guidelines",
        content:
          "**Photo requirements:**\n- Recent, high-quality professional headshot\n- Business casual or formal attire\n- Neutral, light background\n- Friendly but professional expression\n- Face takes up 60-70% of the frame\n- Good lighting, well-groomed appearance\n\n**Where to get one:**\n- DM or Rossmann photo booths (€8-15)\n- Professional photographers (€50-150)\n- University photography services\n\n💡 **Important:** While photo requirements are changing in Germany due to anti-discrimination laws, most employers still expect them. Including a professional photo is recommended for Moroccan students applying in Munich.",
      },
      {
        id: "cover-letter",
        title: "Cover Letter (Anschreiben)",
        content:
          "**German cover letter essentials:**\n\n**Structure:**\n- Your address (top right)\n- Company address (left)\n- Date\n- Subject line: 'Bewerbung als [Position]'\n- 'Sehr geehrte Damen und Herren' or specific name\n- 3-4 paragraphs\n- 'Mit freundlichen Grüßen' + signature\n\n**Content:**\n1. Why you're interested in this specific company\n2. Why you're qualified (skills, experience)\n3. What you can contribute\n4. Availability and salary expectations (if asked)\n\n**Tips:**\n- Keep it to 1 page\n- Be specific, not generic\n- Show you researched the company\n- Highlight relevant skills for Moroccan students (multilingual, international perspective)",
      },
      {
        id: "application-tips",
        title: "Application Best Practices",
        content:
          "**Prepare a German-style application:**\n✅ **Use university resources:**\n- TUM/LMU career centers offer free CV reviews\n- They help with German-style formatting\n- Practice interviews available\n\n✅ **Start early:**\n- Apply 2-3 months before you need the job\n- Especially for internships and Werkstudent positions\n\n✅ **Tailor each application:**\n- Customize CV and cover letter for each role\n- Use keywords from the job description\n- Show genuine interest in the company\n\n✅ **Use your strengths:**\n- Highlight multilingual abilities (Arabic, French, English, German)\n- Emphasize international perspective\n- Many Moroccan students excel in engineering, IT, business\n\n✅ **Follow up:**\n- Send a polite follow-up email after 1-2 weeks\n- Shows initiative and genuine interest",
      },
      {
        id: "networking-events",
        title: "Networking & Career Fairs",
        content:
          "**Attend networking events:**\n- Join LMU/TUM career fairs\n- Connect with Moroccan student associations in Munich\n- Attend local startup meetups and tech events\n- Munich has a vibrant North African community\n\n**Career fair tips:**\n- Bring multiple copies of your CV\n- Dress professionally\n- Prepare a 30-second introduction in German and English\n- Research companies beforehand\n- Collect business cards and follow up",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Do I really need a photo on my CV?",
        answer:
          "While not legally required, most German employers still expect it. Including a professional photo is recommended, especially for Moroccan students in Munich's competitive job market.",
      },
      {
        id: "faq-2",
        question: "Should I write my CV in German or English?",
        answer:
          "Write in the language of the job posting. If the job is posted in German, use German. If it's in English (common in tech/startups), English is fine. When in doubt, prepare both versions.",
      },
      {
        id: "faq-3",
        question: "How do I list my Moroccan degree equivalents?",
        answer:
          "List your actual degree name, then add the German equivalent in parentheses. For example: 'Bachelor en Sciences (entspricht Bachelor of Science)'. University career centers can help with equivalencies.",
      },
    ],
    resources: [
      {
        id: "r1",
        title: "TUM Career Service CV Help",
        url: "https://www.community.tum.de/career-service/",
        type: "official",
        description: "Free CV reviews and templates",
      },
      {
        id: "r2",
        title: "LMU Career Center",
        url: "https://cs-lmu.matorixmatch.de/?&lang=en_UK",
        type: "official",
        description: "Career counseling and workshops",
      },
    ],
    relatedSlugs: ["werkstudent-guide", "university-enrollment"],
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
        content:
          "**MVGO** - Official MVV app\n- Buy tickets, plan routes\n- Link semester ticket\n\n**DB Navigator** - Deutsche Bahn\n- Train tickets throughout Germany\n- Delay info and alternatives\n\n**Google Maps** - Navigation\n- Real-time transit info",
      },
      {
        id: "banking",
        title: "Banking Apps",
        content:
          "**N26** - Mobile-first bank\n- Free basic account\n- Easy to open with passport\n\n**Sparkasse / Commerzbank** - Traditional banks\n- More features, physical branches\n\n**PayPal** - Online payments",
      },
      {
        id: "food-delivery",
        title: "Food & Delivery",
        content:
          "**Lieferando** - Food delivery\n- Filter by halal options\n\n**Gorillas / Flink** - Grocery delivery\n\n**Too Good To Go** - Discount surplus food\n- Great deals on bakery items",
      },
      {
        id: "communication",
        title: "Communication",
        content:
          "**WhatsApp** - Everyone uses it\n\n**Telegram** - Groups and channels\n\n**DeepL** - Translation (better than Google Translate for German)",
      },
      {
        id: "utilities",
        title: "Utilities",
        content:
          "**Doctolib** - Book doctor appointments\n\n**Expatrio/Fintiba** - Blocked account management\n\n**ImmoScout24** - Apartment search\n\n**WG-Gesucht** - Shared apartment search",
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
