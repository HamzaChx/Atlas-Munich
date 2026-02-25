import { Guide } from "@/types";

export const guides: Guide[] = [
  // ─── RENT & HOUSING ──────────────────────────────────────────────────────────
  {
    slug: "find-apartment-munich",
    title: "How to Find an Apartment in Munich",
    summary:
      "Munich is one of Germany's most competitive rental markets. This guide walks you through the full process, from searching platforms to signing your contract, so you can approach it with confidence.",
    categoryKey: "rent-housing",
    tags: ["newcomer", "urgent", "tips"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-15",
    readingTime: 12,
    featured: true,
    sections: [
      {
        id: "the-munich-market",
        title: "Understanding the Munich Market",
        content: `Munich consistently ranks as one of the most expensive cities to rent in Germany. Demand far exceeds supply, especially for furnished apartments near universities or the city centre. The average rent for a one-bedroom apartment in central Munich sits between 1,400 and 1,800 euros per month, and even rooms in shared flats (known as WG-Zimmer) can cost anywhere from 600 to 1,000 euros.

The good news is that with preparation and the right strategy, it is absolutely possible to find a good place. Most people who succeed have their documents ready in advance, respond to listings quickly, and treat every application like a job application.

One important thing to know early on: in Germany, most landlords expect three months of bank statements, proof of income or an enrollment certificate, a SCHUFA credit report, and a completed Selbstauskunft (a self-disclosure form). Having these ready before you even start searching will save you a lot of stress.`,
      },
      {
        id: "where-to-search",
        title: "Where to Search for Apartments",
        content: `There are several platforms worth using in parallel, because listings often disappear within hours of going live.

**ImmobilienScout24** is the largest property portal in Germany. It covers both long-term rentals and short-term furnished options. You can set up email alerts for new listings matching your criteria, which is genuinely useful given how fast the market moves.

**WG-Gesucht** is the go-to site for WG rooms and student-friendly housing. The community feel means landlords are often more approachable, and you can write a personal profile that stays up and invites people to contact you directly.

**Immowelt** and **eBay Kleinanzeigen** are worth checking too, especially eBay Kleinanzeigen for private landlords who bypass the big platforms. Just be more cautious on eBay and avoid anyone asking for a deposit before you have seen the flat in person.

Beyond the main portals, university notice boards (both physical and digital) often have rooms posted by students leaving Munich. The TUM and LMU student housing offices also maintain waiting lists for their own student residences, which are significantly cheaper. These lists can be long, so sign up as early as possible, ideally months before your arrival.`,
        subsections: [
          {
            id: "wg-vs-private",
            title: "Shared Flat vs. Private Apartment",
            content: `A WG (Wohngemeinschaft) is a shared flat where you rent a private room and share the kitchen, bathroom, and living areas with others. This is by far the most affordable and social option for students and young professionals new to Munich. Costs are lower, you usually have instant community, and many WG flatmates are happy to help you navigate city life.

A private apartment gives you more independence and privacy. It is the better fit once you are settled, have a steady income, and ideally have a SCHUFA score already established. For most newcomers, starting in a WG and then moving to a private flat after six to twelve months is a practical and common path.`,
          },
        ],
      },
      {
        id: "your-application",
        title: "Building a Strong Application",
        content: `In Munich, your application is your first impression. Most landlords receive dozens of responses to every listing, so standing out matters. The strongest applications are complete, polished, and personal.

Start with a short introductory message in German if possible. You do not need to be fluent, but even a few sentences in German followed by English shows effort and goes a long way with private landlords. Introduce yourself, explain why you are moving to Munich, and say something specific about the apartment (not just a copy-paste).

Along with your message, attach your documents as a single clean PDF. This should include a brief cover letter, a recent photo (optional but common in Germany), your ID or passport copy, your enrollment certificate or employment contract, your last three payslips or proof of a scholarship or sufficient funds, your SCHUFA report, and a completed Selbstauskunft form (which landlords often provide or which you can download from WG-Gesucht).

Speed matters. Set up notifications for the platforms you use and aim to respond within the first two hours of a new listing going live.`,
      },
      {
        id: "viewing-and-deciding",
        title: "Viewings and Making Your Decision",
        content: `If you are invited to a viewing (Besichtigung), treat it as a two-way interview. The landlord is assessing you, but you are also assessing the flat. Arrive on time, look tidy, and be ready to reconfirm your situation clearly.

During the viewing, check the condition of windows, heating, bathroom fixtures, and any included appliances. Look at the building's entrance, mailboxes, and general upkeep. Ask about the internet situation, the utilities (Nebenkosten), and whether the deposit is three months cold rent as is standard in Germany.

If you are applying while still abroad and cannot attend viewings in person, some landlords will accept a video call walkthrough. Be transparent about your situation. Many international applicants face this exact challenge, and reasonable landlords often accommodate it.

Do not feel pressured to accept an apartment you have doubts about just because the market is competitive. Trust your gut, especially if something about the listing feels unusual.`,
      },
      {
        id: "your-rental-contract",
        title: "Understanding Your Rental Contract",
        content: `Your Mietvertrag (rental contract) is a legally binding document. Take time to read it carefully before signing, ideally with the help of a German speaker or a translation tool for any sections you are unsure about.

The key figures to understand are the Kaltmiete (the base cold rent without utilities), the Nebenkosten (operating costs like water, heating, building maintenance), and the Warmmiete (the total monthly payment combining both). Always ask for a breakdown of what is included in the Nebenkosten.

The deposit is typically two to three months of cold rent and is held in a separate account. By law, you are entitled to get it back within a reasonable period after moving out, minus any legitimate deductions for damages beyond normal wear and tear.

Check the notice period. The standard is three months, which means you need to announce your move-out three months before your intended departure date, always in writing and ideally via a letter with delivery confirmation.

Once you have signed and moved in, you will need to register your address at the KVR within two weeks. This Anmeldung is a legal requirement and unlocks many other administrative steps including opening a bank account and applying for your residence permit.`,
      },
    ],
    faqs: [
      {
        id: "faq-apartment-1",
        question: "Do I need a SCHUFA report and how do I get one?",
        answer:
          "The SCHUFA is Germany's main credit reporting agency. Many landlords request a SCHUFA report to confirm you have no outstanding debts. You can request a free copy once per year at the SCHUFA website. If you are new to Germany and have no SCHUFA history, some landlords will accept a bank statement showing sufficient funds instead. Being upfront about this in your application is always better than not mentioning it.",
      },
      {
        id: "faq-apartment-2",
        question: "What is a Selbstauskunft and do I need to fill it out?",
        answer:
          "A Selbstauskunft is a self-disclosure form where you provide information about your income, employment, and previous rental history. Many landlords require it as part of the application process. You can usually download a standard version from WG-Gesucht or ask the landlord to send their version. Always fill it out honestly.",
      },
      {
        id: "faq-apartment-3",
        question: "Is it safe to pay a deposit before seeing the apartment?",
        answer:
          "No. Never transfer money to a landlord before you have physically seen the apartment or at minimum verified it via a video call with a trusted person on-site. If someone is rushing you to pay a deposit to 'secure' a flat without a viewing, that is a major warning sign of a rental scam.",
      },
      {
        id: "faq-apartment-4",
        question: "How long in advance should I start searching?",
        answer:
          "Start looking at least two to three months before your intended move-in date if you can. The Munich market is fast and competitive, and having this buffer gives you time to apply for multiple places without feeling desperate. If you are moving from abroad, reaching out to Moroccan student groups in Munich can also help you find sublets or temporary accommodation while you search in person.",
      },
    ],
    resources: [
      {
        id: "res-apartment-1",
        title: "ImmobilienScout24",
        url: "https://www.immobilienscout24.de",
        type: "tool",
        description: "Germany's largest rental portal",
      },
      {
        id: "res-apartment-2",
        title: "WG-Gesucht",
        url: "https://www.wg-gesucht.de",
        type: "tool",
        description: "Best platform for WG rooms and student housing",
      },
      {
        id: "res-apartment-3",
        title: "Studentenwerk Munich",
        url: "https://www.studentenwerk-muenchen.de/en/accommodation/",
        type: "official",
        description: "Official student housing office for TUM and LMU",
      },
      {
        id: "res-apartment-4",
        title: "SCHUFA Free Report",
        url: "https://www.meineschufa.de",
        type: "official",
        description: "Request your free annual SCHUFA credit report",
      },
    ],
    relatedSlugs: ["anmeldung-city-registration", "understanding-nebenkosten"],
  },

  // ─── KVR & RESIDENCE ─────────────────────────────────────────────────────────
  {
    slug: "anmeldung-city-registration",
    title: "How to Complete Your Anmeldung in Munich",
    summary:
      "The Anmeldung is your official city registration in Munich. It is one of the first things you need to do after arriving, and nearly everything else depends on it. Here is exactly how to get it done.",
    categoryKey: "kvr-residence",
    tags: ["newcomer", "urgent", "documents", "official"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-20",
    readingTime: 8,
    featured: true,
    sections: [
      {
        id: "what-is-anmeldung",
        title: "What Is the Anmeldung and Why Does It Matter",
        content: `The Anmeldung is the process of registering your home address with the city of Munich. In Germany, this is not optional and it is not just a formality. It is a legal requirement that must be completed within two weeks of moving into a permanent address.

The Anmeldung unlocks a cascade of other things you will need in your daily life. Without it, you cannot open a German bank account, you cannot apply for your residence permit, you will face difficulties getting a mobile phone contract, and your employer needs it for your tax record setup. It truly is the first domino in settling into Munich life properly.

Once you register, you receive a document called the Meldebescheinigung. This is a printed confirmation of your registered address and it is one of the most requested documents throughout your time in Germany. Keep several copies of it.`,
      },
      {
        id: "when-to-register",
        title: "When to Register",
        content: `You must register within 14 days of moving into your permanent Munich address. This is the legal deadline. In practice, many people register as soon as possible to avoid delays with their other administrative tasks.

If you arrive in Munich and are initially staying in a hotel, hostel, or temporary accommodation that is not your permanent address, the clock does not start yet. The 14 days begin from the day you move into your actual place of residence.

One important nuance: you can only register at an address where you actually live and where the landlord or property owner gives permission. Your landlord needs to sign a document called the Wohnungsgeberbestätigung (confirmation from the accommodation provider) for your registration to go through. Ask for this document when you sign your rental contract or when you first move in.`,
      },
      {
        id: "what-you-need",
        title: "What to Bring to the KVR",
        content: `Bring the following documents to your appointment and have both originals and copies ready:

**Your passport or national ID card.** This is required for identification.

**Wohnungsgeberbestätigung.** The form signed by your landlord confirming your address. You can download the form from the Munich KVR website and ask your landlord to fill it in and sign it before your appointment.

**The Anmeldung form.** This is the actual registration form, available on the KVR website or at the office. Fill it in before you arrive to save time. If you share a flat, each person registers separately.

**Biometric-style photo.** Not always required, but worth having with you in case they need it for your tax file.

Everything should be in order and ready to present. Being organised will help the appointment go smoothly and quickly.`,
      },
      {
        id: "the-appointment",
        title: "Getting Your Appointment and What to Expect",
        content: `Appointments for the Anmeldung are made through the Munich KVR's online booking system at muenchen.de. The city has multiple citizen service offices (Bürgerbüros) spread across different districts. Going to one closer to your neighbourhood is often faster than the main city centre office.

Slots can fill up quickly, especially during university intake periods in October and April. If you cannot get an appointment within your 14-day window, book the earliest available slot and keep checking daily for cancellations. In some cases, Bürgerbüros also offer walk-in slots for urgent cases.

The appointment itself is usually brief, around 10 to 15 minutes. An officer will review your documents, process the registration, and give you your Meldebescheinigung on the spot. Keep this document safe as you will need it many times.

The process is conducted in German, but the forms and instructions are increasingly available in English on the KVR website. Staff are generally helpful even if your German is limited.`,
        subsections: [
          {
            id: "online-option",
            title: "Can You Register Online?",
            content: `Since 2024, Munich has started a pilot programme for online Anmeldung for certain cases. However, it is not universally available yet. Check the KVR website to see if you qualify. For most newcomers, an in-person appointment remains the standard approach and is the most reliable way to ensure there are no complications with your registration.`,
          },
        ],
      },
      {
        id: "after-registration",
        title: "After Your Registration",
        content: `Once registered, you will receive your Meldebescheinigung immediately. Shortly afterwards, the city will also send your Steueridentifikationsnummer (tax ID number) to your registered address by post. This takes about two to four weeks and arrives in a plain white envelope, so watch your mailbox carefully and do not throw it away by mistake.

Your tax ID is a permanent number assigned to you in Germany. Your employer needs it before your first payslip, so if you are starting a job soon after arrival, let your employer know they may need to wait a couple of weeks or that you will provide it as soon as the letter arrives.

If you move to a new address within Munich, you will need to update your registration (an Ummeldung) within 14 days of the move. The process is the same as the initial registration.`,
      },
    ],
    faqs: [
      {
        id: "faq-anmeldung-1",
        question: "What happens if I miss the 14-day deadline?",
        answer:
          "Missing the deadline can technically result in a fine, though this is rarely enforced for first-time arrivals. The important thing is to register as soon as you have a permanent address. Do not delay once you have moved in.",
      },
      {
        id: "faq-anmeldung-2",
        question: "My landlord refuses to give me the Wohnungsgeberbestätigung. What can I do?",
        answer:
          "By German law, landlords are legally required to provide the Wohnungsgeberbestätigung within two weeks of your move-in date. If your landlord refuses or delays, you can contact the KVR for advice. In practice, if you are in a student residence or a large student housing block, the administration office should handle this form for you.",
      },
      {
        id: "faq-anmeldung-3",
        question: "Can I register at a friend's address temporarily?",
        answer:
          "You can, but only if your friend's landlord also agrees and signs the Wohnungsgeberbestätigung. Using an address without the landlord's permission is not valid and could cause problems later. It is always better to register at your actual address, even if it is temporary.",
      },
    ],
    resources: [
      {
        id: "res-anmeldung-1",
        title: "Munich KVR Official Portal",
        url: "https://www.muenchen.de/rathaus/Stadtverwaltung/Kreisverwaltungsreferat/Buergerbuero/Wohnen.html",
        type: "official",
        description: "Book your Anmeldung appointment here",
      },
      {
        id: "res-anmeldung-2",
        title: "Wohnungsgeberbestätigung Form",
        url: "https://www.muenchen.de/media/lhm/Vordrucke_Buergerbuero/Wohnungsgeberbestaetigung.pdf",
        type: "document",
        description: "Official landlord confirmation form",
      },
    ],
    relatedSlugs: ["residence-permit-students", "find-apartment-munich"],
  },

  {
    slug: "residence-permit-students",
    title: "Getting Your Residence Permit as a Student in Munich",
    summary:
      "If you are a non-EU student in Germany, you need a valid residence permit to legally stay and study. This guide explains the different permit types, required documents, and the full application process at the Munich KVR.",
    categoryKey: "kvr-residence",
    tags: ["documents", "official", "urgent", "newcomer"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-18",
    readingTime: 11,
    sections: [
      {
        id: "do-you-need-one",
        title: "Who Needs a Residence Permit",
        content: `If you are a citizen of an EU member state, you do not need a residence permit to study or work in Germany. Your EU citizenship gives you the right to live and study freely.

If you are a non-EU citizen, including citizens of Morocco, Algeria, Tunisia, and most other non-European countries, you need a valid residence permit (Aufenthaltserlaubnis) to legally stay in Germany beyond the initial period allowed by your entry visa.

Most students arrive on a national visa (which looks like a sticker in your passport and is usually valid for 90 days). Before that entry visa expires, you need to apply for a proper residence permit at the Munich KVR. This is critical. Overstaying your visa, even by a few days, can have serious consequences for your legal status and future visa applications.`,
      },
      {
        id: "permit-types",
        title: "Understanding the Different Permit Types",
        content: `For students, the most relevant permit is the **Aufenthaltserlaubnis zu Studienzwecken** (residence permit for the purpose of study). This is issued to students enrolled at a recognised German university and is typically granted for one year at a time, renewable annually throughout your studies.

If you are applying for a language course (Deutschkurs) before your main university programme starts, you will initially receive a permit for the purpose of language learning, which converts once you enroll in your degree programme.

There is also a permit for prospective students (Studienbewerber) which gives you time to apply for a university place while already in Germany. This is sometimes used as a bridging permit.

After your studies, Germany offers a post-study job-seeker visa that gives you up to 18 months to search for a job matching your qualifications. This is a separate application made after graduation.`,
      },
      {
        id: "documents-needed",
        title: "Documents You Need for Your Application",
        content: `Gathering your documents before booking an appointment is important because appointments at the KVR foreigner authority (Ausländerbehörde) can be hard to get and you want to make yours count.

**Identity documents:** Your valid passport and two recent biometric passport photos (35mm x 45mm, plain background, taken recently).

**Proof of enrollment:** An official enrollment certificate (Immatrikulationsbescheinigung) from your university. This can be downloaded from your student portal.

**Proof of financial means:** You need to show that you can financially support yourself while studying. The standard way is a blocked account (Sperrkonto) at a German bank such as Fintiba, Expatrio, or Deutsche Bank, with the required minimum amount (currently around 11,208 euros per year). Alternatively, a scholarship letter from an organisation like DAAD or your university's financial aid office can serve as proof.

**Health insurance:** You need valid health insurance in Germany. Public student health insurance (gesetzliche Krankenversicherung) from providers like TK, AOK, or Barmer is the standard for full-time students. Private insurance is accepted in some cases but is less common for student permits.

**Rental registration:** Your Meldebescheinigung proving your registered address in Munich.

**Application form:** The KVR provides the official application form. You can fill it out online or download it from their website.`,
      },
      {
        id: "application-process",
        title: "The Application Process Step by Step",
        content: `Start by booking an appointment through the Munich KVR's online portal. The foreigner authority section is separate from the citizen services (Bürgerbüro) where you do your Anmeldung, so make sure you are booking the right service.

Appointments for residence permit applications can book up weeks in advance, especially at the start of each semester. Book as early as possible, ideally as soon as you arrive in Munich and have completed your Anmeldung.

On the day of your appointment, bring all your original documents plus one or two copies of each. Arrive a few minutes early. A staff member will review your documents, take your biometrics (photo and fingerprints) if this is your first German permit, and confirm your application is complete.

You will typically not receive your permit card on the same day. Instead, you leave with a temporary document (Fiktionsbescheinigung) that legally confirms your application is under review and allows you to stay and study in Germany while you wait. The physical permit card usually arrives within four to eight weeks.

Once your permit card arrives, check all the details including your name spelling, permitted activities (Beschäftigung erlaubt means you are allowed to work), date of validity, and any conditions noted on the card.`,
        subsections: [
          {
            id: "working-as-student",
            title: "How Much Can You Work as a Student?",
            content: `Students on a study residence permit in Germany are generally permitted to work up to 120 full days or 240 half-days per year. This roughly translates to about 20 hours per week during the semester, with more flexibility during semester breaks. Your permit card should note "Beschäftigung erlaubt" (employment permitted) along with the specific conditions.

Make sure you do not exceed the work limit, as this can jeopardise your residence permit status. If you plan to work more, speak to the International Office at your university or visit the KVR for personalised advice.`,
          },
        ],
      },
      {
        id: "renewing-permit",
        title: "Renewing Your Permit",
        content: `Start the renewal process at least six to eight weeks before your current permit expires. Do not wait until the last moment. Book a new appointment and prepare updated versions of all your documents including a current enrollment certificate, updated proof of financial means, and proof of continued health insurance.

If you need to renew and cannot get an appointment before your permit expires, contact the KVR in writing to request a Fiktionsbescheinigung, which extends your legal status while your application is being processed. Keep documentation of this communication.

It is a good habit to set a calendar reminder three months before your permit expires so you always have enough time to gather documents and find an appointment slot.`,
      },
    ],
    faqs: [
      {
        id: "faq-permit-1",
        question: "What is a blocked account (Sperrkonto) and do I need one?",
        answer:
          "A blocked account is a special bank account in Germany designed to show the authorities you have sufficient funds to support yourself. The account holds the required annual amount, which is released in monthly instalments. Fintiba and Expatrio are the most popular providers for international students. If you have a full scholarship, your scholarship letter can sometimes replace the blocked account requirement, but confirm this with the KVR.",
      },
      {
        id: "faq-permit-2",
        question: "Can I travel to Morocco while my permit renewal is being processed?",
        answer:
          "If your current permit has expired and you only have a Fiktionsbescheinigung, your travel situation becomes complicated. A Fiktionsbescheinigung is generally not valid for re-entry into Germany from outside the Schengen area without a valid national visa. If you plan to travel abroad, especially outside the EU, do so while your permit is still valid and consult with the KVR about your specific situation before booking flights.",
      },
      {
        id: "faq-permit-3",
        question: "What is the difference between the KVR and the Ausländerbehörde?",
        answer:
          "The KVR (Kreisverwaltungsreferat) is the overall city authority that handles many administrative services. The Ausländerbehörde is the foreigner authority, which is a department within the KVR specifically dealing with residence permits, visas, and immigration matters. For your residence permit, you need to book an appointment specifically at the Ausländerbehörde section.",
      },
    ],
    resources: [
      {
        id: "res-permit-1",
        title: "Munich KVR Ausländerbehörde",
        url: "https://www.muenchen.de/rathaus/Stadtverwaltung/Kreisverwaltungsreferat/Auslaenderwesen.html",
        type: "official",
        description: "Book residence permit appointments here",
      },
      {
        id: "res-permit-2",
        title: "Fintiba Blocked Account",
        url: "https://www.fintiba.com",
        type: "tool",
        description: "Open a Sperrkonto quickly for your visa application",
      },
      {
        id: "res-permit-3",
        title: "TU Munich International Office",
        url: "https://www.tum.de/en/studies/international-students",
        type: "official",
        description: "Immigration advice specifically for TUM students",
      },
    ],
    relatedSlugs: ["anmeldung-city-registration", "student-life-munich"],
  },

  // ─── UNIVERSITY LIFE ─────────────────────────────────────────────────────────
  {
    slug: "student-life-munich",
    title: "Your First Semester at TUM or LMU",
    summary:
      "Navigating a new university in a new country can feel overwhelming at first. This guide covers everything from enrolling and activating your student card to finding study spaces and making the most of your time at one of Germany's top universities.",
    categoryKey: "university-life",
    tags: ["newcomer", "tips", "community-verified"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-10",
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "enrollment-and-id",
        title: "Enrollment and Your Student Card",
        content: `Once you have accepted your place at TUM (Technical University of Munich) or LMU (Ludwig Maximilian University), the most important first step is completing your enrollment (Immatrikulation). This typically involves submitting your final documents, paying the semester contribution (Semesterbeitrag), and officially activating your student status.

Your student ID card (Studentenausweis) functions as more than just an identification document. At TUM, it is your TUMcard, and at LMU it is your LMU Card. Both double as a library card, a public transport card, and an access card for campus facilities depending on your programme. Keep it with you at all times during your student life.

The semester contribution is paid every six months and is separate from tuition (which is free for most programmes at public German universities). It covers the cost of your semester ticket, student union services, and administrative fees. At both TUM and LMU, this typically costs around 150 to 180 euros per semester.`,
      },
      {
        id: "semester-ticket",
        title: "The Semester Ticket and Getting Around Munich",
        content: `Your semester contribution includes one of Munich's most useful student perks: the semester ticket. This gives you unlimited travel on Munich's entire public transport network (MVV), including buses, trams, the S-Bahn, and the U-Bahn, for the full duration of the semester.

The ticket is loaded onto your student card. You do not need a separate card or paper ticket. Just tap or show your student card when needed. Make sure to validate it for the current semester before you travel.

The semester ticket covers all zones within the Munich network, which means you can travel to the airport, the suburbs, and popular weekend destinations like Starnberg or the Ammersee at no extra cost. This is a significant financial benefit compared to a standard MVV monthly pass.

If you plan to travel further within Bavaria, Bayern-Ticket offers affordable day passes for regional trains that are popular for group trips.`,
      },
      {
        id: "libraries-and-study",
        title: "Libraries, Study Spaces, and Campus Resources",
        content: `Munich's university libraries are world-class. Both TUM and LMU operate multiple library branches across their campuses, many of which offer extended opening hours including evenings and weekends during exam periods.

To access the library, you need your student card and to register with the library system (this is usually done automatically upon enrollment but worth confirming). You can borrow physical books, access thousands of digital journals and textbooks through university subscriptions, and book private study rooms online.

Beyond the university libraries, the Bayerische Staatsbibliothek (Bavarian State Library) near the Odeonsplatz area is open to students and offers quiet study space across multiple reading rooms along with an enormous collection. Registration is free with your student ID.

For informal study, many students use university cafeterias (Mensen) off-peak, university common rooms, and various cafes across the city. Spaces near TUM's main campus in Garching or the city campus in Arcisstrasse are popular. LMU students often gather around the Geschwister-Scholl-Platz area.`,
        subsections: [
          {
            id: "moodle-campus-online",
            title: "TUM Moodle, TUMOnline, and LMU Campus Online",
            content: `Both universities use digital learning platforms to manage your courses, grades, and communication. At TUM, TUMOnline is where you register for courses, view your exam results, and access official documents. Moodle is the learning management system where professors upload slides, assignments, and course materials.

At LMU, you will use LSF for course registration and LMU Moodle for course content. Make sure you explore these platforms during the first week of semester and register for all your courses promptly, as some have limited places.`,
          },
        ],
      },
      {
        id: "student-services",
        title: "Student Support Services",
        content: `Both TUM and LMU offer a wide range of support services for international students that are genuinely useful and worth knowing about early on.

The **International Office** at both universities helps with administrative questions related to your studies, handles exchange programmes, and provides guidance on visa-related academic matters. They often run orientation events specifically for international students at the start of each semester.

The **Studentenwerk München** (Munich Student Services) manages student housing waitlists, canteens (Mensen), psychological counselling, social counselship, and financial aid information for students in hardship. If you are on a tight budget or facing difficulties, their website has information on emergency funds and interest-free loans available to students.

**Language courses** through the university language centres (Sprachenzentrum at TUM, Sprachkurs at LMU) are often free or heavily subsidised for enrolled students. Improving your German even while studying in English makes life outside campus significantly easier.

German-language student organisations and societies (Hochschulgruppen) are a great way to meet local and international students. Both universities have dozens of clubs covering everything from football to entrepreneurship to cultural exchange.`,
      },
      {
        id: "academic-culture",
        title: "Academic Culture and What to Expect",
        content: `German academic culture has a few characteristics that can feel different if you are coming from a Moroccan or other non-European education system.

Lectures (Vorlesungen) are often large and can feel quite passive. Professors typically present material and expect students to complement lectures with independent reading and self-study. Tutorials (Übungen or Tutorien) are smaller sessions where you apply what you have learned, and these are usually more interactive.

Exams are high-stakes. Many courses have only one or two exams per semester, which count for the majority or all of your grade. There are fewer small assignments and quizzes than you might be used to. Starting your revision weeks in advance rather than cramming is strongly advised.

Office hours (Sprechstunden) are the designated times when you can speak directly with your professor or teaching assistant. Do not be afraid to use them. Asking questions shows engagement, and professors appreciate it.

Academic honesty is taken very seriously. Plagiarism, even unintentional, can have severe academic consequences including expulsion. If you are unsure how to cite sources or what constitutes plagiarism in a German academic context, ask your university or check their official academic integrity guidelines.`,
      },
    ],
    faqs: [
      {
        id: "faq-student-1",
        question: "Can I work while studying at TUM or LMU?",
        answer:
          "Yes, most non-EU students can work up to 120 full days or 240 half days per year on a student visa. This is enough to take on a Werkstudent (working student) position alongside your studies. Make sure your residence permit allows employment and check your specific permit conditions.",
      },
      {
        id: "faq-student-2",
        question: "What is the Mensa and how affordable is it?",
        answer:
          "The Mensa is the university cafeteria operated by Studentenwerk München. It serves subsidised meals with a student ID, typically ranging from 2 to 4 euros for a full lunch. Both TUM and LMU have multiple Mensen across their campuses. They are some of the most affordable places to eat a proper meal in Munich, and the quality is generally decent.",
      },
      {
        id: "faq-student-3",
        question: "Is the language of instruction German or English?",
        answer:
          "It depends on your programme. Many Master's programmes at both TUM and LMU are offered entirely in English. Bachelor's programmes tend to be predominantly in German. Check your specific programme details. Even in English programmes, daily life on campus and administrative interactions will often involve German.",
      },
    ],
    resources: [
      {
        id: "res-student-1",
        title: "TUM International Students",
        url: "https://www.tum.de/en/studies/international-students",
        type: "official",
        description: "TUM's official page for international student support",
      },
      {
        id: "res-student-2",
        title: "LMU International Office",
        url: "https://www.en.uni-muenchen.de/students/studying/international_students/index.html",
        type: "official",
        description: "LMU support for international students",
      },
      {
        id: "res-student-3",
        title: "Studentenwerk München",
        url: "https://www.studentenwerk-muenchen.de/en/",
        type: "official",
        description: "Housing, Mensa, counselling, and financial aid",
      },
      {
        id: "res-student-4",
        title: "MVV Semester Ticket Info",
        url: "https://www.mvv-muenchen.de/en/tickets-and-fares/tickets-daytickets/semester-ticket/index.html",
        type: "official",
        description: "Information on the student semester transport ticket",
      },
    ],
    relatedSlugs: ["find-werkstudent-job", "residence-permit-students"],
  },

  // ─── CAREER ──────────────────────────────────────────────────────────────────
  {
    slug: "find-werkstudent-job",
    title: "How to Find a Werkstudent Job in Munich",
    summary:
      "A Werkstudent position lets you earn income, build experience, and stay in Germany legally while studying. This guide explains how to find good opportunities, write a German-style application, and understand the rules around working hours and taxes.",
    categoryKey: "career",
    tags: ["tips", "community-verified", "budget-friendly"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-12",
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "what-is-werkstudent",
        title: "What Is a Werkstudent Position?",
        content: `A Werkstudent (working student) contract is a specific type of employment designed for students enrolled at a German university. It allows you to work part-time, typically 20 hours per week during the semester, and more during semester breaks, while enjoying reduced social insurance contributions compared to regular employment.

The key advantage is that on a Werkstudent contract, both employer and employee pay significantly lower health, nursing care, and pension insurance contributions. This makes hiring students attractive for companies and means you take home a larger proportion of your gross salary than a regular part-time employee would.

Munich's job market is particularly strong for working students. The city is home to major multinational companies (BMW, Siemens, MAN, Allianz), a thriving startup ecosystem, and a large number of consultancies, engineering firms, and tech companies. Opportunities exist across nearly every field from engineering and data science to marketing, finance, law, and design.`,
      },
      {
        id: "where-to-find-jobs",
        title: "Where to Find Werkstudent Jobs",
        content: `The most effective search platforms are LinkedIn, Stepstone, Indeed, and Xing (a German professional network similar to LinkedIn that is widely used in the DACH region). Search for "Werkstudent" alongside your field. You will find plenty of results, especially in Munich.

University career portals are also valuable. TUM's TalentBridge and LMU's career centre post verified Werkstudent listings regularly. These companies have already signalled an interest in working with students from those specific institutions, which can give your application an advantage.

Company websites are underestimated. Many large firms list Werkstudent openings directly on their careers pages under tags like "Students" or "Working Students." BMW, Siemens, and many consulting firms hire dozens of working students continuously.

Networking also works well. Talking to professors, attending career fairs at your university (TUM Career Fair, LMU Career Service events), and connecting with Moroccan professional networks in Munich can all open doors that job boards would not show you.`,
      },
      {
        id: "german-application",
        title: "Writing a German-Style Application",
        content: `German job applications have a specific structure that differs from what you might be used to. Understanding this structure and adapting to it significantly increases your chances of getting a response.

**Your CV (Lebenslauf)** in Germany is almost always in reverse chronological order and typically includes a professional photo at the top right corner. This is standard practice in Germany and expected. Keep the design clean and professional. One to two pages is ideal. Include your education, any work experience, language skills (B2 German or above is a strong plus), and technical skills relevant to the role.

**The cover letter (Anschreiben)** is still used widely in Germany, even for student positions. Keep it to one page. The letter should explain why you are applying to this specific company, what relevant skills or experience you bring, and what you hope to contribute. Avoid generic phrases. Personalise each letter.

**Language:** If the job posting is in German, your application should be in German. If it is in English, apply in English. Demonstrating at least a B1 to B2 level of German, even if not native, is a real advantage in Munich's market.

Make sure every document is saved as a PDF with clear filenames (for example, CV_YourName.pdf). Send your application as a single organised package in one email unless the employer specifies otherwise.`,
        subsections: [
          {
            id: "application-tips",
            title: "Practical Tips That Make a Difference",
            content: `Tailor each application rather than sending the same one everywhere. Read the job description carefully and mirror the language they use.

Follow up after one to two weeks if you have not heard back. A short, polite email checking on the status of your application is acceptable and can demonstrate genuine interest.

Prepare for interviews by researching the company, understanding their products or services, and having clear answers ready for common questions about your background, your academic focus, and why you want this specific role. Technical questions are common for engineering and data roles.`,
          },
        ],
      },
      {
        id: "work-hours-rules",
        title: "Work Hours, Study Rules, and Visa Conditions",
        content: `As a non-EU student on a study residence permit, you are permitted to work a maximum of 120 full days or 240 half days per year. In practice, this means you can work up to 20 hours per week during the semester without exceeding the annual limit. During semester breaks (usually January to March and July to September), you can often work full-time without it counting against your annual allowance, though this depends on your permit's specific conditions.

Keep track of your hours carefully. Exceeding the work limit can jeopardise your residence permit renewal. If you are unsure whether a specific working arrangement is within the rules, ask the International Office at your university.

Your residence permit card should state "Beschäftigung erlaubt" (employment permitted) or specify the conditions under which you may work. Always carry a copy of your permit with you when working.`,
      },
      {
        id: "taxes-and-insurance",
        title: "Taxes, Insurance, and Your Payslip",
        content: `Once you start working, your employer will need your tax ID number (Steueridentifikationsnummer) and your social security number (Sozialversicherungsnummer). Your tax ID is sent to your registered address a few weeks after your Anmeldung. Your social security number is assigned the first time you work in Germany and is sent to you by the Deutsche Rentenversicherung.

On a Werkstudent contract, you benefit from the "Werkstudentenprivileg," which means health, nursing care, and pension insurance contributions are waived as long as you work no more than 20 hours per week during the semester. You still pay income tax and solidarity surcharge on your earnings if your annual income exceeds the basic tax allowance (currently around 11,600 euros).

Your monthly payslip will show your gross salary, the deductions applied, and your net take-home pay. Keep all payslips, as you may need them for your residence permit renewal or future visa applications.`,
      },
    ],
    faqs: [
      {
        id: "faq-werk-1",
        question: "Can I have a Werkstudent job and a mini-job (450 euros) at the same time?",
        answer:
          "This is possible in some cases but the rules around social insurance become more complex. If combined income pushes you over certain thresholds, you may lose the Werkstudentenprivileg on one of the jobs. It is best to consult your tax advisor or your university's social counselling service before taking on multiple jobs simultaneously.",
      },
      {
        id: "faq-werk-2",
        question: "How much can I realistically earn as a Werkstudent in Munich?",
        answer:
          "Werkstudent hourly rates in Munich typically range from 12 to 25 euros per hour depending on the field and company. Tech, engineering, and finance roles tend to pay at the higher end. At 20 hours per week and a 15 euro hourly rate, that is around 1,200 euros per month before tax, which can significantly help with rent and living costs.",
      },
      {
        id: "faq-werk-3",
        question: "Do I need to speak German to find a Werkstudent job?",
        answer:
          "Not necessarily, especially in international tech and consulting firms where English is the working language. However, for client-facing roles or positions at German-focused companies, B2 German is often a firm requirement. Even in English-language workplaces, learning German helps with team integration and day-to-day office life.",
      },
    ],
    resources: [
      {
        id: "res-werk-1",
        title: "TUM TalentBridge",
        url: "https://www.tum.de/en/career",
        type: "official",
        description: "TUM's official student career portal",
      },
      {
        id: "res-werk-2",
        title: "Stepstone Jobs",
        url: "https://www.stepstone.de",
        type: "tool",
        description: "Search 'Werkstudent Munich' for current openings",
      },
      {
        id: "res-werk-3",
        title: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs",
        type: "tool",
        description: "Search for Werkstudent roles across Munich companies",
      },
    ],
    relatedSlugs: ["student-life-munich", "residence-permit-students"],
  },

  // ─── USEFUL APPS ─────────────────────────────────────────────────────────────
  {
    slug: "essential-apps-munich",
    title: "Essential Apps for Daily Life in Munich",
    summary:
      "The right apps make settling into Munich much smoother. This guide covers the tools that Moroccan students and professionals actually use every day, from transport and banking to food delivery and communication.",
    categoryKey: "useful-apps",
    tags: ["tips", "community-verified", "budget-friendly"],
    author: "Atlas Munich Team",
    lastUpdated: "2025-01-08",
    readingTime: 9,
    sections: [
      {
        id: "transport-apps",
        title: "Getting Around Munich",
        content: `Munich's public transport system is excellent, and the right apps make navigating it effortless.

**MVV App** is the official Munich transport app. Use it to plan routes, buy tickets, check live departure times, and get alerts for delays. If you do not have a semester ticket yet (or during journeys outside the covered zones), you can buy digital tickets directly in the app. The route planner handles complex journeys combining U-Bahn, S-Bahn, bus, and tram.

**Google Maps** works well for Munich and generally shows accurate transit directions, real-time departures, and walking navigation. Most students use it as a convenient fallback when they just need a quick route.

**DB Navigator** is the Deutsche Bahn (German rail) app. You need it for any intercity travel within Germany, booking train tickets, and accessing your BahnCard. If you plan to travel frequently around Germany or visit other European cities, this app becomes essential.

**MVG Rad** is the city's official bike-sharing service. Bikes are available at docking stations across Munich. Download the app, register, and you can rent a bike for short trips around the city. There are also e-bikes available. The pricing is reasonable for short trips and it is a great way to explore neighbourhoods.`,
      },
      {
        id: "banking-apps",
        title: "Banking and Finances",
        content: `Setting up a German bank account is one of the most important early tasks in Munich. Your Anmeldung is typically required before you can open a German bank account.

**N26** is a popular online bank with a fully English app, no maintenance fee for the basic account, and free international transfers (with limits). It is quick to open and does not require visiting a branch. Many students start with N26 because of how frictionless the setup is.

**DKB (Deutsche Kreditbank)** is well-regarded among students and offers a free current account, a Visa card with no foreign transaction fees, and access to DKB's large network of ATMs. The app and interface are in German, but the English translation has improved considerably. Many long-term residents consider it a more robust choice for day-to-day banking.

**Commerzbank** and **Deutsche Bank** are the two largest traditional banks with branches across Munich. If you prefer speaking to someone in person or your situation involves more complex banking needs, these are solid options. They tend to have stricter document requirements for account opening.

For sending money internationally (to family in Morocco, for example), **Wise** (formerly TransferWise) offers mid-market exchange rates and low fees. It is far more cost-effective than a bank wire transfer and the app is easy to use.`,
      },
      {
        id: "food-apps",
        title: "Food Delivery and Groceries",
        content: `Munich has a solid food delivery scene, and multiple apps are worth having.

**Lieferando** is the dominant food delivery platform in Germany, equivalent to what Uber Eats or Deliveroo are in other markets. Most local restaurants in Munich, including several halal options, are on Lieferando. You can filter by cuisine, rating, and halal if the restaurant lists it.

**Wolt** has grown significantly in Munich and often offers faster delivery times and better coverage in certain districts. It is worth comparing both apps for a given restaurant to check pricing and delivery fees.

For groceries, **Rewe** and **Edeka** are the main supermarket chains with their own apps and (in central areas) same-day or next-day delivery services. For discounted groceries and meal kits, apps like **Too Good To Go** let you buy surplus food from restaurants and bakeries at a fraction of the price. This is popular among budget-conscious students and actually great for reducing food waste.

**Penny** and **Lidl** are popular budget supermarkets. Both have apps with weekly deals and digital discount coupons.`,
      },
      {
        id: "communication-apps",
        title: "Staying Connected",
        content: `Communication apps are essential and you likely already use most of these, but a few notes specific to life in Munich are worth sharing.

**WhatsApp** remains the dominant messaging tool in Morocco and is also widely used among international students in Munich. Most Moroccan student groups, shared flat group chats, and community networks in Munich operate on WhatsApp.

**Telegram** is commonly used for university course groups, lecture note sharing, and larger community announcements. Many TUM and LMU student groups have active Telegram channels.

For non-emergency communication with German authorities, companies, or landlords, **email** is still king in Germany. Germans tend to communicate formally and in writing, so having a professional-looking email address is important.

**DEEPL** deserves a mention: it is the best translation tool available and is significantly more accurate than Google Translate for German. Use it when reading official letters, contracts, or university documents. The app version is handy for quick on-the-go translations.`,
        subsections: [
          {
            id: "mobile-contracts",
            title: "Choosing a Mobile Plan",
            content: `For your SIM card and mobile data, the main providers in Germany are Telekom, Vodafone, and O2. Students often go for lighter-cost options through their sub-brands or virtual network operators (MVNOs).

**Aldi Talk** and **Congstar** (a Telekom subsidiary) are popular for affordable prepaid or monthly plans. **Klarmobil** and **SimScale** offer competitive data packages. For most students in Munich, a plan with at least 10GB of data and good coverage in the city centre and campus areas is sufficient. Telekom network coverage is the best in Germany, so any provider running on the Telekom network (including Congstar) will give you the most reliable signal.`,
          },
        ],
      },
      {
        id: "admin-and-study",
        title: "Admin, Study, and Productivity",
        content: `A few other apps that students in Munich consistently recommend:

**Adobe Scan** or **Microsoft Lens** are handy for scanning physical documents (like your rental agreement or Meldebescheinigung) into clean PDFs on your phone. You will need digital copies of documents frequently.

**ELSTER** is the official German tax app (also available as a web portal). As a Werkstudent, you may need to file a tax return (Steuererklärung) if you earned above the annual basic allowance. ELSTER is the official tool for this. There are also third-party tools like **Taxfix** or **Wundertax** with friendlier interfaces designed for foreigners navigating the German tax system.

**Anki** is a flashcard app widely used by students for language learning and exam preparation. If you are working on your German, building an Anki deck with vocabulary and grammar is one of the most efficient methods.

**Notion** and **Obsidian** are popular productivity tools among students for organising notes, assignments, and research. Many students in international programmes use these to manage the higher volume of independent study expected in German universities.`,
      },
    ],
    faqs: [
      {
        id: "faq-apps-1",
        question: "Can I use Apple Pay or Google Pay in Munich?",
        answer:
          "Yes, both Apple Pay and Google Pay are widely accepted in Munich. Most supermarkets, restaurants, and retail shops support contactless payment. N26 and DKB both support Apple Pay and Google Pay. Cash is still used frequently in Germany, especially at smaller shops and local markets, so it is worth keeping some on you.",
      },
      {
        id: "faq-apps-2",
        question: "Is there a Moroccan or Arabic food delivery option in Munich?",
        answer:
          "Several Moroccan and oriental restaurants in Munich deliver via Lieferando and Wolt. Searching for 'Marokkanisch', 'Oriental', or 'Halal' in these apps will show nearby options. The community around Schwabing, Neuhausen, and Maxvorstadt also has physical shops and restaurants worth visiting.",
      },
      {
        id: "faq-apps-3",
        question: "What is the best app for learning German?",
        answer:
          "Duolingo is a fun starting point but insufficient on its own for serious progress. Combining it with a structured course (like the free Deutsche Welle learner resources) and using Anki for vocabulary retention works well. The university language centres at TUM and LMU also offer free or cheap German courses which are more structured than self-study apps.",
      },
    ],
    resources: [
      {
        id: "res-apps-1",
        title: "MVV App",
        url: "https://www.mvv-muenchen.de/en/planning/mvv-app/index.html",
        type: "tool",
        description: "Official Munich public transport app",
      },
      {
        id: "res-apps-2",
        title: "N26 Online Bank",
        url: "https://n26.com",
        type: "tool",
        description: "English-friendly online bank, popular with students",
      },
      {
        id: "res-apps-3",
        title: "Wise International Transfers",
        url: "https://wise.com",
        type: "tool",
        description: "Low-cost international money transfers",
      },
      {
        id: "res-apps-4",
        title: "Deutsche Welle German Courses",
        url: "https://www.dw.com/en/learn-german/s-2469",
        type: "community",
        description: "Free structured German language courses for all levels",
      },
    ],
    relatedSlugs: ["anmeldung-city-registration", "find-werkstudent-job"],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(categoryKey: string): Guide[] {
  return guides.filter((g) => g.categoryKey === categoryKey);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}

export function getRelatedGuides(guide: Guide, limit = 4): Guide[] {
  const explicitly = guide.relatedSlugs
    ? guides.filter((g) => guide.relatedSlugs!.includes(g.slug))
    : [];

  if (explicitly.length >= limit) return explicitly.slice(0, limit);

  const byCat = guides.filter((g) => g.categoryKey === guide.categoryKey && g.slug !== guide.slug);
  const combined = [
    ...explicitly,
    ...byCat.filter((g) => !explicitly.find((e) => e.slug === g.slug)),
  ];
  return combined.slice(0, limit);
}
