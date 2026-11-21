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
    lastUpdated: "2026-11-21",
    lastVerified: "2026-11-21",
    primarySource: {
      title: "Mietspiegel für München (Landeshauptstadt München)",
      url: "https://stadt.muenchen.de/infos/mietspiegel.html",
    },
    readingTime: 12,
    featured: true,
    sections: [
      {
        id: "the-munich-market",
        title: "Understanding the Munich Market",
        content: `Munich consistently ranks as one of the most expensive cities to rent in Germany. Demand far exceeds supply, especially for furnished apartments near universities or the city centre. The city's 2025 rent index (Mietspiegel) puts the average net cold rent at 15.38 euros per square metre, and new listings are often well above that.

The good news is that with preparation and the right strategy, it is absolutely possible to find a good place. In our experience, most people who succeed have their documents ready in advance, respond to listings quickly, and treat every application like a job application.

One important thing to know early on: many landlords ask for proof of income or an enrolment certificate, a credit report, and a completed Selbstauskunft (a self-disclosure form). None of these is required by law, and there are limits on what a landlord may ask. They may only ask for proof of income once they have chosen you, they may not demand your free SCHUFA data copy, and they may not copy your ID. Have your documents ready before you start searching, but hand them over step by step.

Munich also has a rent brake (Mietpreisbremse), in force until 31 December 2029. For a new contract, the starting rent may be at most 10 percent above the local comparative rent, which you can look up with the city's free online Mietspiegel calculator. Flats first rented after 1 October 2014 and the first letting after a full modernisation are exempt. If a landlord relies on an exception, they must tell you before you sign.`,
      },
      {
        id: "where-to-search",
        title: "Where to Search for Apartments",
        content: `There are several platforms worth using in parallel, because listings often disappear within hours of going live.

**ImmobilienScout24** is the largest property portal in Germany. It covers both long-term rentals and short-term furnished options. You can set up email alerts for new listings matching your criteria, which is genuinely useful given how fast the market moves.

**WG-Gesucht** is the go-to site for WG rooms and student-friendly housing. The community feel means landlords are often more approachable, and you can write a personal profile that stays up and invites people to contact you directly.

**Immowelt** and **Kleinanzeigen** (formerly eBay Kleinanzeigen) are worth checking too, especially Kleinanzeigen for private landlords who bypass the big platforms. Be extra careful there. Never pay anything before you have seen the flat in person and signed a contract. A deposit only becomes due when the tenancy starts, and a "reservation fee" is a scam warning sign.

Some listings come through a broker (Makler). Under the "Bestellerprinzip", you only pay the broker fee if you hired the broker yourself and they took on the flat only because of your search order. When the landlord hired the broker, the landlord pays. A broker may never ask you for an advance payment.

Beyond the main portals, university notice boards (both physical and digital) often have rooms posted by students leaving Munich. The Studierendenwerk München Oberbayern runs more than 9,000 student rooms and flats in Munich, Freising and Rosenheim, at about 400.60 euros a month on average. There is a waiting period, so apply as early as possible, ideally months before your arrival.`,
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
        content: `In Munich, your application is your first impression. In our experience, popular listings get dozens of responses, so standing out matters. The strongest applications are complete, polished, and personal.

Start with a short introductory message in German if possible. You do not need to be fluent, but even a few sentences in German followed by English shows effort and goes a long way with private landlords. Introduce yourself, explain why you are moving to Munich, and say something specific about the apartment (not just a copy-paste).

Along with your message, prepare your documents as a single clean PDF: a short cover letter, your enrolment certificate or details of your job and employer, proof of income such as a payslip, a bank statement or a scholarship letter (with details the landlord does not need blacked out), a credit report made for landlords, and a completed Selbstauskunft form (landlords often provide their own). Do not send copies of your passport to landlords you have not met, because scammers use them for identity fraud. Showing your ID in person is enough, and a landlord may not copy it.

Speed matters. In our experience, it helps to set up notifications for the platforms you use and to reply within the first two hours of a new listing going live.`,
      },
      {
        id: "viewing-and-deciding",
        title: "Viewings and Making Your Decision",
        content: `If you are invited to a viewing (Besichtigung), treat it as a two-way interview. The landlord is assessing you, but you are also assessing the flat. Arrive on time, look tidy, and be ready to reconfirm your situation clearly.

During the viewing, check the condition of windows, heating, bathroom fixtures, and any included appliances. Look at the building's entrance, mailboxes, and general upkeep. Ask about the internet situation, the utilities (Nebenkosten), and how much the deposit is. The legal maximum is three months of cold rent, and you may pay it in three monthly instalments.

If you are applying while still abroad and cannot attend viewings in person, some landlords will offer a video call walkthrough. Be transparent about your situation. Many international applicants face this exact challenge. Even so, do not transfer any money until you have seen the flat in person and signed a contract.

Do not feel pressured to accept an apartment you have doubts about just because the market is competitive. Trust your gut, especially if something about the listing feels unusual.`,
      },
      {
        id: "your-rental-contract",
        title: "Understanding Your Rental Contract",
        content: `Your Mietvertrag (rental contract) is a legally binding document. Take time to read it carefully before signing, ideally with the help of a German speaker or a translation tool for any sections you are unsure about.

The key figures to understand are the Kaltmiete (the base cold rent without utilities), the Nebenkosten (operating costs like water, heating, building maintenance), and the Warmmiete (the total monthly payment combining both). Always ask for a breakdown of what is included in the Nebenkosten.

The deposit can be at most three months of cold rent. You may pay it in three equal monthly instalments, the first when the tenancy starts. The landlord must keep it separate from their own money, and any interest belongs to you. After you move out, you get it back minus legitimate claims, for example for damage beyond normal wear and tear.

Check the notice period. For an open-ended contract it is about three months: your signed letter must reach the landlord by the third working day of a month, and the tenancy then ends at the end of the month after next. Email or WhatsApp is not enough, so send a signed letter, ideally with proof of delivery. A furnished room inside the landlord's own flat has a shorter notice period.

Once you have moved in, you must register your address at one of Munich's Bürgerbüro offices (part of the KVR) within two weeks. Bring your passport or ID and the Wohnungsgeberbestätigung. This is the written move-in confirmation your landlord must give you within two weeks of moving in, and your rental contract does not replace it. The registration (Anmeldung) is a legal requirement, and many later steps ask for the registration certificate you receive.`,
      },
    ],
    faqs: [
      {
        id: "faq-apartment-1",
        question: "Do I need a SCHUFA report and how do I get one?",
        answer:
          "The SCHUFA is Germany's best-known credit reporting agency, a private company. Many landlords ask for a credit report to check that you pay your bills. You can request your SCHUFA data copy (Datenkopie nach Art. 15 DSGVO) for free at meineschufa.de whenever you need it, not just once a year. Landlords may not demand that free copy, though, because it contains much more than they need. If they want a credit check, give them a report made for renting. If you are new to Germany and have no SCHUFA history, a bank statement or payslip can show that you can pay the rent. Being upfront about this in your application is always better than not mentioning it.",
      },
      {
        id: "faq-apartment-2",
        question: "What is a Selbstauskunft and do I need to fill it out?",
        answer:
          "A Selbstauskunft is a self-disclosure form where you provide information about your income, your job, and the people who will move in with you. Many landlords ask for one as part of the application process, and they often provide their own version. Always fill it out honestly. Landlords may ask about your income, your job and employer, how many people will move in, and whether you are in insolvency proceedings. Questions about your nationality, criminal record, pregnancy, tenants' association membership, or your previous landlord's contact details are not allowed, so you can leave those blank.",
      },
      {
        id: "faq-apartment-3",
        question: "Is it safe to pay a deposit before seeing the apartment?",
        answer:
          "No. Never pay before you have seen the flat in person and signed a contract. A deposit only becomes due when the tenancy starts. Scams can happen even after a real viewing: in 2025, Munich police reported students who paid the deposit and first rent on the same day as the viewing and lost the money. If someone rushes you to pay to 'secure' a flat, that is a major warning sign of a rental scam.",
      },
      {
        id: "faq-apartment-4",
        question: "How long in advance should I start searching?",
        answer:
          "In our experience, it helps to start looking two to three months before your intended move-in date if you can. The Munich market is fast and competitive, and having this buffer gives you time to apply for multiple places without feeling desperate. If you are moving from abroad, reaching out to Moroccan student groups in Munich can also help you find sublets or temporary accommodation while you search in person.",
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
        title: "Studierendenwerk München Oberbayern",
        url: "https://www.studierendenwerk-muenchen-oberbayern.de/en/accommodation/",
        type: "official",
        description: "Student halls of residence in Munich, Freising and Rosenheim",
      },
      {
        id: "res-apartment-4",
        title: "SCHUFA free data copy",
        url: "https://www.meineschufa.de/dakobs/",
        type: "tool",
        description: "Request your free SCHUFA data copy (Art. 15 GDPR), as often as you need",
      },
    ],
    /* Facts and documents below were checked on 2026-11-21 against statute
       (BGB §§ 551, 556d-556g, 573c; WoVermittG § 2; BMG §§ 17, 19; Bavarian
       MiSchuV 2025), the City of Munich, the DSK guidance on tenant
       self-disclosure (V2.0, Jan 2026) and the Verbraucherzentrale. */
    dossier: {
      documentsMode: "prepare",
      facts: [
        {
          id: "deposit",
          kind: "money",
          value:
            "The deposit can be at most three months of cold rent, and you may pay it in three monthly instalments.",
        },
        {
          id: "no-prepayment",
          kind: "rule",
          value:
            "Never pay anything before you have seen the flat in person and signed the contract.",
        },
        {
          id: "broker-fee",
          kind: "rule",
          value:
            "You only pay a broker fee if you hired the broker yourself. Otherwise the landlord pays.",
        },
        {
          id: "rent-brake",
          kind: "rule",
          value:
            "Until the end of 2029, a new rent may be at most 10 percent above the Mietspiegel. Flats first rented after October 2014 are exempt.",
        },
        {
          id: "registration",
          kind: "deadline",
          value:
            "Your landlord must confirm your move-in within two weeks, and you must register within two weeks of moving in.",
        },
      ],
      documents: [
        {
          id: "passport-or-id",
          label: "Passport or ID card",
          note: "Show it in person. A landlord may not copy it, so do not send copies.",
          optional: true,
        },
        {
          id: "proof-of-income",
          label: "Proof of income",
          note: "A payslip or bank statement, with details they do not need blacked out. Only needed once you are chosen.",
          optional: true,
        },
        {
          id: "job-or-enrolment",
          label: "Enrolment certificate or job details",
          note: "Where you study, or your job and employer.",
          optional: true,
        },
        {
          id: "tenant-credit-report",
          label: "Credit report for landlords",
          note: "A report made for renting. Landlords may not demand your free SCHUFA data copy.",
          optional: true,
        },
        {
          id: "selbstauskunft",
          label: "Self-disclosure form (Selbstauskunft)",
          note: "Answer allowed questions truthfully. You can skip questions about nationality, pregnancy or criminal record.",
          optional: true,
        },
        {
          id: "cover-letter",
          label: "Short cover letter",
          note: "Who you are, how many people will move in, and why this flat.",
          optional: true,
        },
      ],
    },
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
    lastUpdated: "2026-11-21",
    lastVerified: "2026-11-21",
    primarySource: {
      title: "Wohnsitzanmeldung (Landeshauptstadt München)",
      url: "https://stadt.muenchen.de/service/info/wohnsitzanmeldung/1063475/n0/",
    },
    readingTime: 8,
    featured: true,
    sections: [
      {
        id: "what-is-anmeldung",
        title: "What Is the Anmeldung and Why Does It Matter",
        content: `The Anmeldung is the process of registering your home address with the city of Munich. In Germany, this is not optional and it is not just a formality. It is a legal requirement: you must register within two weeks of moving into a flat. The law does not say the address has to be permanent.

Many other steps build on it. Banks, offices and landlords often ask for proof of your registered address, and registering for the first time is what triggers your tax ID, which your employer needs before your first payslip. That is why it belongs at the top of your list.

At the appointment you receive a registration confirmation (Anmeldebestätigung), a printout of your registration with your new address. If someone later asks for a formal Meldebescheinigung, you can request one separately. It is free as a PDF through the city's online service once you are registered in Munich, or 5 euros on paper. Keep your confirmation somewhere safe.`,
      },
      {
        id: "when-to-register",
        title: "When to Register",
        content: `You must register within 14 days of moving into your Munich home. This is the legal deadline, and it also applies when you move within the city. You cannot register before you move in, because a registration with a future date is not legally possible. In practice, register as soon as you can, because your other paperwork waits on it.

A hotel or hostel stay does not count as moving in. If you are not registered anywhere else in Germany, you only have to register once a hotel or hostel stay goes beyond three months. A sublet or a temporary furnished flat does count as a home, so the 14 days start on the day you move in, even if you plan to move again soon.

One important nuance: you can only register at an address where you actually live. Your landlord, or whoever gives you the flat, must confirm your move-in in writing within two weeks. This confirmation is called the Wohnungsgeberbestätigung. Ask for it when you sign your rental contract or when you first move in. If you do not have it yet, you can still register by filling in the city's declaration explaining why it is missing, and hand in the confirmation later.`,
      },
      {
        id: "what-you-need",
        title: "What to Bring to the Bürgerbüro",
        content: `Bring the originals of the following documents to your appointment:

**Your passport or national ID card.** You need a valid one for every person you register, including children. German citizens bring their ID card, and their passport too if they have one, so the address can be updated.

**Wohnungsgeberbestätigung.** The form signed by your landlord confirming your move-in. You can download the form from the city's website and ask your landlord to fill it in and sign it before your appointment. If you do not have it yet, bring the city's declaration on the missing landlord confirmation instead.

**The registration form (Meldeschein).** It is not on the city's list of required documents, but filling it in before you arrive saves time. You can download it from the city's website. Flatmates each register for themselves, but spouses, partners and children moving in together share one form, and one of them can register everyone.

**A power of attorney, if someone registers for you.** The person you send needs a signed Vollmacht, their own ID and the original IDs of everyone being registered. The city's form includes a Vollmacht page.

**Your vehicle papers, if you have a car.** You can update the address in your vehicle papers at the same visit if you keep your number plate. This costs 12.60 euros.

Having everything in order before you go makes the appointment smoother.`,
      },
      {
        id: "the-appointment",
        title: "Getting Your Appointment and What to Expect",
        content: `Appointments for the Anmeldung are booked through the city's online booking system at stadt.muenchen.de. There are six citizen service offices (Bürgerbüros): Orleansplatz, Leonrodstraße, Scheidplatz, Forstenrieder Allee, Pasing and Ruppertstraße. You can pick any of them.

The Bürgerbüros only see people who have booked an appointment, so there are no walk-ins. In our experience, slots go fastest around the start of the university semesters in October and April. If you cannot get an appointment within your 14-day window, book the earliest available slot and keep checking for cancellations. If you qualify for online registration (see below), that avoids the wait completely.

At the appointment, an officer reviews your documents, processes the registration and gives you your registration confirmation on the spot. Keep it safe, as you may be asked for it.

The forms are in German. In our experience, staff are generally helpful even if your German is limited.`,
        subsections: [
          {
            id: "online-option",
            title: "Can You Register Online?",
            content: `Yes, if you meet the conditions. Munich accepts online registration through the national service wohnsitzanmeldung.gov.de, and it is free. You need a German ID card or eID card with the online ID function switched on, its 6-digit PIN, and a smartphone with NFC and the AusweisApp. You also upload your Wohnungsgeberbestätigung. The service is meant for people moving within Germany, because it pulls your data from your previous registration. If you are arriving from abroad with a passport, register in person at a Bürgerbüro.`,
          },
        ],
      },
      {
        id: "after-registration",
        title: "After Your Registration",
        content: `Once registered, you receive your registration confirmation immediately. After your first registration in Germany, the Federal Central Tax Office (Bundeszentralamt für Steuern, BZSt) sends your Steueridentifikationsnummer (tax ID number) to your registered address by post. This takes about two to four weeks. Put your full name clearly on your mailbox so the letter reaches you. If it does not arrive, you can ask the BZSt to send it again through its online form.

Your tax ID is a permanent number assigned to you in Germany. Your employer needs it before your first payslip, so if you are starting a job soon after arrival, let your employer know they may need to wait a couple of weeks or that you will provide it as soon as the letter arrives.

If you move to a new address within Munich, you will need to update your registration (an Ummeldung) within 14 days of the move. This applies even to a move within the same building, for example to another floor. The process is the same as the initial registration. You do not need to deregister from your old German address, because that happens automatically.`,
      },
    ],
    faqs: [
      {
        id: "faq-anmeldung-1",
        question: "What happens if I miss the 14-day deadline?",
        answer:
          "Registering late is an administrative offence that can be fined up to 1,000 euros. If you have missed the deadline, register as soon as you can. Do not delay once you have moved in.",
      },
      {
        id: "faq-anmeldung-2",
        question: "My landlord refuses to give me the Wohnungsgeberbestätigung. What can I do?",
        answer:
          "By German law, landlords must provide the Wohnungsgeberbestätigung within two weeks of your move-in date. If your landlord refuses or delays, you must tell the registration office straight away. In Munich, you can register anyway using the city's declaration on the missing landlord confirmation, and send the confirmation later through the city's contact form. In our experience, if you live in a student residence, the administration office handles this form for you.",
      },
      {
        id: "faq-anmeldung-3",
        question: "Can I register at a friend's address temporarily?",
        answer:
          "Only if you really live there. The person who provides the room must sign the Wohnungsgeberbestätigung for you. Offering an address for a registration when nobody actually moves in is prohibited and can be fined up to 50,000 euros. Always register at the address where you actually live, even if it is temporary.",
      },
    ],
    resources: [
      {
        id: "res-anmeldung-1",
        title: "Munich Bürgerbüro Appointment Booking",
        url: "https://stadt.muenchen.de/buergerservice/terminvereinbarung.html#/services/1063475",
        type: "official",
        description: "Book your Anmeldung appointment here",
      },
      {
        id: "res-anmeldung-2",
        title: "Wohnungsgeberbestätigung Form",
        url: "https://stadt.muenchen.de/dms/Home/Stadtverwaltung/Kreisverwaltungsreferat/fachspezifisch/HA-II/Buergerbuero/Dokumente/Wohnungsgeberbestaetigung_Internet",
        type: "document",
        description: "Official landlord confirmation form",
      },
    ],
    /* Facts checked against official sources on 2026-11-21: the city's
       Wohnsitzanmeldung page, the Bürgerbüro pages, Bundesmeldegesetz
       §§ 17, 19, 23, 29 and wohnsitzanmeldung.gov.de. The city states no
       appointment duration, so there is deliberately no duration fact. */
    dossier: {
      documentsMode: "bring",
      facts: [
        {
          id: "deadline",
          kind: "deadline",
          value:
            "Register within two weeks after moving in. You cannot register before you move in.",
        },
        {
          id: "cost",
          kind: "cost",
          value:
            "Registering is free. Updating the address in your vehicle papers at the same visit costs 12.60 euros.",
        },
        {
          id: "where",
          kind: "where",
          value:
            "Go to any of Munich's six Bürgerbüros, by appointment only. No walk-ins.",
        },
        {
          id: "online",
          kind: "rule",
          value:
            "If you have a German ID card or eID card with the online function and are moving within Germany, you can register online for free instead.",
        },
      ],
      documents: [
        {
          id: "valid-id",
          label: "Valid passport or ID card",
          note: "One for every person you register, children included.",
        },
        {
          id: "wohnungsgeberbestaetigung",
          label: "Wohnungsgeberbestätigung (landlord confirmation)",
          note: "Signed by your landlord. If it is missing, bring the city's declaration on the missing confirmation.",
        },
        {
          id: "registration-form",
          label: "Registration form (Meldeschein)",
          note: "Recommended. Filling it in beforehand saves time.",
          optional: true,
        },
        {
          id: "power-of-attorney",
          label: "Power of attorney (Vollmacht)",
          note: "Only if someone registers for you. They also bring their own ID.",
          optional: true,
        },
        {
          id: "vehicle-papers",
          label: "Vehicle registration certificate (Zulassungsbescheinigung Teil I)",
          note: "Only to update your car papers at the same visit, keeping your number plate.",
          optional: true,
        },
      ],
      action: {
        title: "Book a Bürgerbüro appointment",
        url: "https://stadt.muenchen.de/buergerservice/terminvereinbarung.html#/services/1063475",
      },
    },
    relatedSlugs: ["residence-permit-students", "find-apartment-munich"],
  },

  {
    slug: "residence-permit-students",
    title: "Getting Your Residence Permit as a Student in Munich",
    summary:
      "If you are a non-EU student in Germany, you need a valid residence permit to legally stay and study. This guide explains the different permit types, the documents you need, and how to apply online at the Munich Servicestelle für Zuwanderung und Einbürgerung, which is part of the KVR.",
    categoryKey: "kvr-residence",
    tags: ["documents", "official", "urgent", "newcomer"],
    author: "Atlas Munich Team",
    lastUpdated: "2026-11-21",
    lastVerified: "2026-11-21",
    primarySource: {
      title: "Residence permit for study (Landeshauptstadt München)",
      url: "https://stadt.muenchen.de/service/en-GB/info/servicestelle-fur-zuwanderung-und-einburgerung/10424886/",
    },
    readingTime: 11,
    sections: [
      {
        id: "do-you-need-one",
        title: "Who Needs a Residence Permit",
        content: `If you are a citizen of an EU member state, you do not need a residence permit to study or work in Germany. Your EU citizenship gives you the right to live and study freely.

If you are a non-EU citizen, including citizens of Morocco, Algeria, Tunisia, and most other non-European countries, you need a valid residence permit (Aufenthaltserlaubnis) to legally stay in Germany beyond the period allowed by your entry visa.

Most students arrive on a national D visa, a sticker in your passport with a fixed end date. First register your address at the Bürgerbüro. Then, before that entry visa expires, apply online for a residence permit at the Servicestelle für Zuwanderung und Einbürgerung, which is part of the KVR. This is critical. If you apply in time, your stay remains legal until the office decides. If you let your visa run out first, you lose that automatic protection, and this can harm your legal status and future visa applications.

Citizens of a few countries, such as the USA, Canada, the United Kingdom, Japan or Australia, may enter Germany without a visa. They still have to apply for the residence permit before their studies start.`,
      },
      {
        id: "permit-types",
        title: "Understanding the Different Permit Types",
        content: `For students, the most relevant permit is the **Aufenthaltserlaubnis zu Studienzwecken** (residence permit for the purpose of study, § 16b AufenthG). It is issued to students admitted to a full-time programme at a state or state-recognised university. In Munich it is usually granted for three years, or only for the length of your course if that is shorter, and it can be extended.

If you have a guaranteed place on a full-time degree, a preparatory language course or a Studienkolleg is covered by this same student permit. A language course without a study place needs a separate permit for language courses.

There is also a permit for prospective students (Studienbewerber). It gives you up to nine months to apply for a university place while you are already in Germany.

After your studies, Germany offers a residence permit for job seekers that gives you up to 18 months to look for work. This is a separate application made after you graduate.`,
      },
      {
        id: "documents-needed",
        title: "Documents You Need for Your Application",
        content: `Gather all your documents before you apply. You upload them with your online application, and the Servicestelle says that missing or incomplete documents are one of the most common reasons for delays.

**Application form:** The fully completed official application form.

**Identity documents:** Your valid passport and one recent biometric photo. The photo is sent digitally by a certified photo studio or chemist's, or you can take it at a paid photo kiosk at the Servicestelle.

**Proof of admission:** Your admission letter or your enrollment certificate (Immatrikulationsbescheinigung) from your university. In our experience, you can download the enrollment certificate from your student portal.

**Proof of financial means:** You need to show that you can support yourself while studying. For a first application the usual way is a blocked account (Sperrkonto) with at least 11,904 euros, which releases 992 euros a month. Fintiba and Expatrio are providers many students use, not an official recommendation. Other accepted options are a formal declaration of commitment from a sponsor (Verpflichtungserklärung), a scholarship certificate, or a notarised declaration from your parents together with proof of their income for the last three months.

**Health insurance:** Proof of health insurance, such as the insurance card of a public (statutory) provider like TK, AOK or Barmer. Private insurance is accepted only if its type and scope of cover are adequate. The insurance must be valid for at least one year, and travel health insurance is not enough.

**Entry visa:** Your student entry visa, if your nationality needs one.

**Address registration:** This is not on the upload list, but you must register your address at the Bürgerbüro before you apply.

The office checks documents for authenticity and will write to you if it needs anything else.`,
      },
      {
        id: "application-process",
        title: "The Application Process Step by Step",
        content: `You do not book an appointment to apply. Instead, you send your application and documents through the city's online form for a residence permit for study. Upload your documents as PDF files where possible. You can also apply by post, but then you get no automatic confirmation and processing may take longer. By post, send copies, never originals.

The Servicestelle für Zuwanderung und Einbürgerung is separate from the Bürgerbüro where you do your Anmeldung, so make sure you use the residence permit form and not a Bürgerbüro booking.

As soon as you submit online, a confirmation appears. Save it as a PDF. It states that your current visa or permit stays valid beyond its expiry date and that you may keep working to the same extent as before. This is called the legal fiction (Legalfiktion). You can show the confirmation to authorities or to your employer.

The office checks your application and then sends you an appointment. Processing can take up to 12 months, so apply as early as you can and keep your confirmation safe. In our experience, it helps to bring the originals of everything you uploaded to that appointment.

A first permit costs 100 euros. There is no fee if your scholarship comes from German public funds, a German foundation or an EU-funded programme.

Once your electronic residence card (eAT) has been ordered, it is usually ready for pickup after four to six weeks, and you book the pickup appointment online. If you choose direct delivery, it is mailed to you within about three weeks.

When your card arrives, check your name spelling, the validity date and any conditions noted on it. A note referring to § 16b (3) AufenthG means the 140-day work rule below applies to you.`,
        subsections: [
          {
            id: "working-as-student",
            title: "How Much Can You Work as a Student?",
            content: `Students on a study residence permit in Germany may work up to 140 full days or 280 half days per calendar year (§ 16b (3) AufenthG). A day with up to four hours of work counts as a half day. Work during semester breaks counts toward the same limit. Jobs as a student assistant at your university (HiWi or tutor roles) and mandatory internships that your study regulations require do not count. Voluntary internships do count, whether paid or unpaid. The limit runs per calendar year, so renewing your permit does not give you a fresh 140 days.

Make sure you do not exceed the limit, as this can put your residence permit at risk. Keeping count is up to you and your employer. If you want to work more than 140 days, you need approval from the Servicestelle before you start, and it is only given in cases of special financial hardship.`,
          },
        ],
      },
      {
        id: "renewing-permit",
        title: "Renewing Your Permit",
        content: `Apply for your extension online before your current permit expires, using the same online form as your first application. You do not need an appointment to apply. There is no official minimum lead time, but processing can take months, so do not wait until the last moment.

Upload updated versions of your documents: a current enrollment certificate, updated proof of financial means, and proof of continued health insurance. From your 4th semester onwards, add your transcript of records. If you have gone past the standard period of study (Regelstudienzeit), add a certificate from your university confirming that you are studying properly, your prospects of success, and when you expect to graduate.

If you apply before your permit expires, your current permit, including its work conditions, stays valid until the office decides. The confirmation you save after submitting is your proof. If you apply late, you lose this automatic protection, and the office only restores it to avoid undue hardship.

An extension costs 93 euros, or 96 euros if it is for three months or less.

It is a good habit to set a calendar reminder three months before your permit expires so you always have enough time to gather your documents.`,
      },
    ],
    faqs: [
      {
        id: "faq-permit-1",
        question: "What is a blocked account (Sperrkonto) and do I need one?",
        answer:
          "A blocked account is a special bank account in Germany that shows the authorities you have enough money to support yourself. For a first student permit it must hold at least 11,904 euros, and you can withdraw at most 992 euros a month. Fintiba and Expatrio are providers many students use, not an official recommendation. You do not always need one: a sponsor's declaration of commitment (Verpflichtungserklärung), a scholarship certificate, or a notarised declaration from your parents with proof of their income are also accepted.",
      },
      {
        id: "faq-permit-2",
        question: "Can I travel to Morocco while my permit renewal is being processed?",
        answer:
          "It depends on which kind of legal fiction you have, so check before you book. If you applied before your visa or permit expired, your old permit continues to apply (Fortgeltungsfiktion). If you entered without a visa and applied for your first permit while holding none (Erlaubnisfiktion, § 81 (3) AufenthG), the Servicestelle says it does not allow you to re-enter Germany. When you travel, carry every document that proves your right to stay, even within the Schengen area. If you can, travel while your permit card is still valid, and ask the Servicestelle about your case before you book flights.",
      },
      {
        id: "faq-permit-3",
        question: "What is the difference between the KVR and the Ausländerbehörde?",
        answer:
          "The KVR (Kreisverwaltungsreferat) is the city department that handles many administrative services. Munich's foreigner authority (Ausländerbehörde) is now called the Servicestelle für Zuwanderung und Einbürgerung and is part of the KVR. It deals with residence permits, visas and immigration matters. You register your address at the Bürgerbüro, but you apply for your residence permit online with the Servicestelle, which then sends you an appointment.",
      },
    ],
    resources: [
      {
        id: "res-permit-1",
        title: "Residence permit for study (Munich Servicestelle)",
        url: "https://stadt.muenchen.de/service/en-GB/info/servicestelle-fur-zuwanderung-und-einburgerung/10424886/",
        type: "official",
        description: "Requirements, documents and the online application",
      },
      {
        id: "res-permit-2",
        title: "Fintiba Blocked Account",
        url: "https://www.fintiba.com",
        type: "tool",
        description: "A blocked account provider many students use, not an official recommendation",
      },
      {
        id: "res-permit-3",
        title: "TU Munich International Office",
        url: "https://www.tum.de/en/studies/international-students",
        type: "official",
        description: "Immigration advice specifically for TUM students",
      },
    ],
    /* Every fact below was checked against official sources (stadt.muenchen.de
       study permit page and SZE FAQ, AufenthG, AufenthV) on 2026-11-21. */
    dossier: {
      documentsMode: "prepare",
      facts: [
        {
          id: "apply-before-expiry",
          kind: "deadline",
          value:
            "Apply before your D visa or current permit expires. If you do, your stay remains legal until the office decides.",
        },
        {
          id: "fees",
          kind: "cost",
          value: "A first permit costs 100 euros. An extension costs 93 euros.",
        },
        {
          id: "online-application",
          kind: "where",
          value:
            "Register your address first, then apply with the online form. You need no appointment to apply. The office sends you one.",
        },
        {
          id: "blocked-account",
          kind: "money",
          value:
            "For a first application, a blocked account needs at least 11,904 euros, which releases 992 euros a month.",
        },
        {
          id: "processing-time",
          kind: "duration",
          value: "Processing can take up to 12 months.",
        },
      ],
      documents: [
        {
          id: "application-form",
          label: "Completed application form",
          note: "The official form, uploaded with your online application.",
        },
        {
          id: "passport",
          label: "Valid passport",
        },
        {
          id: "biometric-photo",
          label: "Biometric photo, sent digitally",
          note: "From a certified photo studio or chemist's, or the paid kiosk at the Servicestelle.",
        },
        {
          id: "admission",
          label: "Admission letter or enrollment certificate",
        },
        {
          id: "health-insurance",
          label: "Proof of health insurance",
          note: "Valid for at least one year. Travel insurance is not enough.",
        },
        {
          id: "proof-of-funds",
          label: "Proof of financing",
          note: "Blocked account, sponsor's declaration, scholarship or notarised parental declaration.",
        },
        {
          id: "entry-visa",
          label: "Student entry visa",
          note: "Only if your nationality needs a visa.",
          optional: true,
        },
        {
          id: "transcripts",
          label: "Transcript of records",
          note: "For extensions from the 4th semester onwards.",
          optional: true,
        },
      ],
      action: {
        title: "Apply online",
        url: "https://service.muenchen.de/intelliform/forms/01/02/02/kontaktabhaufenthaltfuerstudienzwecke/index",
      },
    },
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
    lastUpdated: "2026-09-24",
    lastVerified: "2025-01-10",
    primarySource: {
      title: "Studierendenwerk München Oberbayern",
      url: "https://www.studierendenwerk-muenchen-oberbayern.de/en/",
    },
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
          "Yes, most non-EU students can work up to 140 full days or 280 half days per calendar year on a student residence permit, including any work during semester breaks. This is enough to take on a Werkstudent (working student) position alongside your studies. Make sure your residence permit allows employment and check your specific permit conditions.",
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
        url: "https://www.lmu.de/en/study/important-contacts/international-office/",
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
        url: "https://www.mvv-muenchen.de/tickets-abos-preise/bayerisches-ermaessigungsticket",
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
    lastUpdated: "2026-09-24",
    lastVerified: "2026-09-24",
    primarySource: {
      title: "§ 16b AufenthG (Federal Ministry of Justice)",
      url: "https://www.gesetze-im-internet.de/aufenthg_2004/__16b.html",
    },
    readingTime: 10,
    featured: true,
    sections: [
      {
        id: "what-is-werkstudent",
        title: "What Is a Werkstudent Position?",
        content: `A Werkstudent (working student) contract is a specific type of employment designed for students enrolled at a German university. It allows you to work part-time, up to 20 hours per week during the lecture period, while paying far lower social insurance contributions than a regular employee.

The key advantage is the so-called Werkstudentenprivileg: as long as you stay within the 20-hour rule, you are exempt from health, long-term care, and unemployment insurance contributions, and only pay your share of pension insurance. This makes hiring students attractive for companies and means you take home a larger proportion of your gross salary than a regular part-time employee would.

If you are a non-EU student, a Werkstudent job also counts toward the annual work limit on your residence permit. The section on work hours below explains how that limit works.

Munich's job market is particularly strong for working students. The city is home to major multinational companies (BMW, Siemens, MAN, Allianz), a thriving startup ecosystem, and a large number of consultancies, engineering firms, and tech companies. Opportunities exist across nearly every field from engineering and data science to marketing, finance, law, and design.`,
      },
      {
        id: "where-to-find-jobs",
        title: "Where to Find Werkstudent Jobs",
        content: `The most effective search platforms are LinkedIn, Stepstone, Indeed, and Xing (a German professional network similar to LinkedIn that is widely used in the DACH region). Search for "Werkstudent" alongside your field. You will find plenty of results, especially in Munich.

University career portals are also valuable. The TUM Career Service job portal and LMU's career service post verified Werkstudent listings regularly. These companies have already signalled an interest in working with students from those specific institutions, which can give your application an advantage.

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
        content: `As a non-EU student on a study residence permit, you may work up to **140 full days or 280 half days per calendar year** (§ 16b (3) AufenthG). This limit was raised from 120/240 days on 1 March 2024. A day with up to four hours of work counts as a half day; anything longer counts as a full day.

**Semester-break work counts too.** You can work more hours, even full-time, outside the lecture period, but every day you work still comes off the same 140-day account. There is no separate, unlimited allowance for the holidays.

There is a second way to count, and the authority uses whichever is more favourable to you, week by week. Under this weekly rule, a week in which you work up to 20 hours during the lecture period counts as two and a half days. Outside the lecture period, a week also counts as two and a half days regardless of how the hours are spread across it. If your pattern is unusual, ask the Ausländerbehörde how it will be counted before you sign.

A few things do **not** count toward the 140 days:

- **Student jobs at your university** (for example as a HiWi or tutor, a *studentische Nebentätigkeit*). These are unlimited.
- **Mandatory internships** that are a required part of your degree.

The account resets every January, regardless of when you arrived. Keep a record of the days you work, because it is your job to prove them. Working beyond the limit without a separate permit is an administrative offence that can bring a fine of up to 5,000 euros and put your residence permit at risk.

Your residence permit states the conditions under which you may work, typically "Beschäftigung bis zu 140 Tage ... sowie Ausübung studentischer Nebentätigkeit erlaubt". Always carry a copy of your permit with you when working.`,
      },
      {
        id: "taxes-and-insurance",
        title: "Taxes, Insurance, and Your Payslip",
        content: `Once you start working, your employer will need your tax ID number (Steueridentifikationsnummer) and your social security number (Sozialversicherungsnummer). Your tax ID is sent to your registered address a few weeks after your Anmeldung. Your social security number is assigned the first time you work in Germany and is sent to you by the Deutsche Rentenversicherung.

On a Werkstudent contract, you benefit from the "Werkstudentenprivileg": as long as you work no more than 20 hours per week during the lecture period, you pay no health, long-term care, or unemployment insurance contributions. You do still pay your share of pension insurance. Your own student health insurance continues separately.

Income tax is withheld from your monthly pay, but you only owe it on annual taxable income above the basic tax allowance (Grundfreibetrag), which is **12,348 euros in 2026**. If you earned less than that over the year, filing a tax return usually gets the withheld tax back.

Your monthly payslip will show your gross salary, the deductions applied, and your net take-home pay. Keep all payslips, as you may need them for your residence permit renewal or future visa applications.`,
      },
    ],
    faqs: [
      {
        id: "faq-werk-1",
        question: "Can I have a Werkstudent job and a mini-job (603 euros) at the same time?",
        answer:
          "This is possible in some cases, but the social insurance rules become more complex. The mini-job ceiling is 603 euros a month in 2026, and if your combined hours or income push you over the Werkstudent thresholds, you may lose the Werkstudentenprivileg on one of the jobs. If you are a non-EU student, remember that both jobs count toward the same 140-day annual limit on your residence permit. Consult your university's social counselling service before taking on multiple jobs.",
      },
      {
        id: "faq-werk-2",
        question: "How much can I realistically earn as a Werkstudent in Munich?",
        answer:
          "The legal minimum wage is 13.90 euros per hour in 2026, and Werkstudent roles in Munich usually pay more, typically 15 to 25 euros per hour depending on the field and company. Tech, engineering, and finance roles tend to pay at the higher end. At 20 hours per week and 16 euros per hour, that is roughly 1,380 euros per month before deductions, which can significantly help with rent and living costs.",
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
        title: "TUM Career Service",
        url: "https://www.community.tum.de/en/career-service/",
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
    /* Every fact below is stated in this guide's own prose, which was fully
       re-verified on 2026-09-24 (see lastVerified). */
    dossier: {
      documentsMode: "prepare",
      facts: [
        {
          id: "work-limit",
          kind: "rule",
          value:
            "Non-EU students may work 140 full days or 280 half days per calendar year. Semester-break work counts toward the same limit.",
        },
        {
          id: "twenty-hours",
          kind: "rule",
          value:
            "Stay at or under 20 hours a week during the lecture period and you pay no health, care, or unemployment contributions, only pension.",
        },
        {
          id: "tax-allowance",
          kind: "money",
          value:
            "Income tax is only owed above 12,348 euros of taxable income in 2026. Earn less and a tax return usually gets the withheld tax back.",
        },
      ],
      documents: [
        {
          id: "cv",
          label: "German-style CV (Lebenslauf)",
          note: "Reverse chronological, one to two pages, usually with a photo.",
        },
        {
          id: "cover-letter",
          label: "Cover letter (Anschreiben)",
          note: "One page, written for this company.",
        },
        {
          id: "tax-id",
          label: "Tax ID (Steueridentifikationsnummer)",
          note: "Posted to your registered address a few weeks after your Anmeldung.",
        },
        {
          id: "social-security",
          label: "Social security number (Sozialversicherungsnummer)",
          note: "Assigned the first time you work in Germany and sent by the Deutsche Rentenversicherung.",
        },
        {
          id: "residence-permit",
          label: "Your residence permit",
          note: "Its work conditions must cover the job. Carry a copy when you work.",
          optional: true,
        },
        {
          id: "day-log",
          label: "A record of the days you work",
          note: "It is up to you to prove them against the 140-day limit.",
          optional: true,
        },
      ],
    },
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
    lastVerified: "2025-01-08",
    primarySource: {
      title: "MVV, Munich transport network",
      url: "https://www.mvv-muenchen.de/en/",
    },
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
        id: "faq-essential-1",
        question: "Can I use Apple Pay or Google Pay in Munich?",
        answer:
          "Yes, both Apple Pay and Google Pay are widely accepted in Munich. Most supermarkets, restaurants, and retail shops support contactless payment. N26 and DKB both support Apple Pay and Google Pay. Cash is still used frequently in Germany, especially at smaller shops and local markets, so it is worth keeping some on you.",
      },
      {
        id: "faq-essential-2",
        question: "Is there a Moroccan or Arabic food delivery option in Munich?",
        answer:
          "Several Moroccan and oriental restaurants in Munich deliver via Lieferando and Wolt. Searching for 'Marokkanisch', 'Oriental', or 'Halal' in these apps will show nearby options. The community around Schwabing, Neuhausen, and Maxvorstadt also has physical shops and restaurants worth visiting.",
      },
      {
        id: "faq-essential-3",
        question: "What is the best app for learning German?",
        answer:
          "Duolingo is a fun starting point but insufficient on its own for serious progress. Combining it with a structured course (like the free Deutsche Welle learner resources) and using Anki for vocabulary retention works well. The university language centres at TUM and LMU also offer free or cheap German courses which are more structured than self-study apps.",
      },
    ],
    resources: [
      {
        id: "res-apps-1",
        title: "MVV App",
        url: "https://www.mvv-muenchen.de/en/",
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
