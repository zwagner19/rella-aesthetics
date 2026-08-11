export interface ServicePageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  whatItIs: { heading: string; body: string };
  whoItsFor: { heading: string; body: string; bullets: string[] };
  whatToExpect: { heading: string; body: string; steps: string[] };
  pricing: { heading: string; body: string; note?: string };
  faq: { question: string; answer: string }[];
  image: string;
  availableLocations?: readonly ("vacaville" | "napa")[];
}

export const servicePages: ServicePageData[] = [
  {
    slug: "botox",
    title: "Botox & Dysport",
    metaTitle: "Botox & Dysport Injections in Vacaville & Napa",
    metaDescription: "Temporarily soften the appearance of dynamic lines with consultation-led Botox and Dysport treatment at Rella Aesthetics in Vacaville and Napa, CA.",
    heroEyebrow: "Injectables",
    heroTitle: "Botox & Dysport",
    heroDescription: "Consultation-led neuromodulator treatment to temporarily soften the appearance of dynamic facial lines.",
    whatItIs: {
      heading: "What Is Botox?",
      body: "Botox and Dysport are distinct prescription neuromodulators that temporarily reduce targeted muscle activity. Botox results may begin to appear in 4–7 days, while Dysport can show results in 2–5 days; full effect is assessed around two weeks, and results typically last 3–4 months. Your provider will assess your facial movement, goals, and treatment history before recommending product and placement.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Neuromodulator treatment may be considered by adults seeking temporary improvement in the appearance of dynamic expression lines. Other treatment goals require an individualized assessment.",
      bullets: [
        "Forehead lines and frown lines (11s)",
        "Crow's feet around the eyes",
        "Temporary softening of dynamic expression lines",
        "Brow lift and jawline slimming",
        "Excessive sweating (hyperhidrosis)",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Neuromodulator appointments are often brief, but visit length and recovery guidance depend on the assessment, areas, and plan.",
      steps: [
        "Consultation to assess facial anatomy and goals",
        "Targeted injections using fine needles, with sensation and comfort varying by person",
        "Review of possible temporary effects, aftercare, and when normal activities can resume",
        "Timing varies by product; full effect is assessed around 2 weeks",
        "Discuss the appropriate repeat-treatment interval, often around 3–4 months",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Botox is $18/unit and Dysport is $6/unit. The 2026 Tox Membership is $30/month with a one-year commitment; members pay $13/unit for Botox and $4.40/unit for Dysport.",
      note: "Your provider will map the recommended units and total before treatment. Rella accepts Allē rewards for Botox and Aspire rewards for Dysport; bring your account information to the visit. Any booking deposit is separate from per-unit treatment pricing.",
    },
    faq: [
      { question: "Does Botox hurt?", answer: "Sensation varies by person and treatment area. The injections use fine needles, and your provider can discuss comfort needs and the expected visit length before treatment." },
      { question: "How long does Botox last?", answer: "Results typically last 3–4 months, but timing varies by person, treatment area, and plan." },
      { question: "Will I look frozen?", answer: "Your provider will discuss your desired movement, treatment areas, product-specific dosing, and placement before treatment. Individual results vary." },
      { question: "What is the difference between Botox and Dysport?", answer: "Both temporarily reduce targeted muscle activity, but they are distinct prescription products with product-specific dosing and non-interchangeable units. Your provider will recommend the appropriate option for your goals." },
      { question: "When will I see results?", answer: "Botox softening may begin in 4–7 days, while Dysport can show results in 2–5 days. Full effect is assessed around two weeks, and individual response varies." },
    ],
    image: "/images/service-botox.jpg",
  },
  {
    slug: "dermal-fillers",
    title: "Dermal Fillers",
    metaTitle: "Dermal Fillers in Vacaville & Napa CA",
    metaDescription: "Explore consultation-led dermal filler treatments for facial volume, contour, and lips at Rella Aesthetics in Vacaville and Napa.",
    heroEyebrow: "Injectables",
    heroTitle: "Dermal Fillers",
    heroDescription: "Plan subtle, anatomy-aware volume and contour enhancements with filler options selected during a consultation.",
    whatItIs: {
      heading: "What Are Dermal Fillers?",
      body: "Dermal fillers are injectable gels that may be used to add volume or support a facial-contouring plan. Rella carries multiple products, including hyaluronic acid fillers, for areas such as the cheeks, lips, and facial folds. The appropriate area, product, amount, and expected duration depend on your anatomy and treatment plan.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Filler may be considered after a provider reviews your goals, anatomy, health history, prior treatments, and the risks relevant to the proposed area and product.",
      bullets: [
        "Cheek and midface volume restoration",
        "Lip enhancement and definition",
        "Facial balancing when clinically appropriate",
        "Nasolabial folds and marionette lines",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Appointment length, product selection, technique, and recovery guidance vary with the areas being considered and the treatment plan.",
      steps: [
        "Review of facial anatomy, health history, goals, and product options",
        "A comfort plan based on the product, area, and your individual needs",
        "Injection technique selected for the proposed area and plan",
        "Aftercare covering possible swelling, bruising, tenderness, and when to contact Rella",
        "Product-specific expectations for settling, follow-up, and duration",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "The current dermal-filler base service amount is $840. Active product prices range from $540 to $960, and the appropriate product and total depend on the treatment plan.",
      note: "Your provider will review the recommendation and expected total before treatment.",
    },
    faq: [
      { question: "How long do fillers last?", answer: "Expected duration varies by product, treatment area, amount, and individual response. Your provider will review the labeling and expectations for the exact product being considered." },
      { question: "Is the procedure painful?", answer: "Comfort varies by person, product, area, and technique. Some products contain lidocaine, and topical numbing or other comfort measures may be considered as part of your plan." },
      { question: "Can fillers be reversed?", answer: "Some hyaluronic acid filler may be reduced or dissolved with hyaluronidase when clinically indicated. Removal is not risk-free and may be difficult or impossible for some filler materials, so it requires an individual evaluation." },
      { question: "How much filler will I need?", answer: "This depends on your goals and the areas being treated. During your consultation, your provider will create a personalized treatment plan." },
    ],
    image: "/images/service-fillers.jpg",
  },
  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    metaTitle: "Chemical Peels in Vacaville, CA",
    metaDescription: "Explore consultation-led MicroPeel and TCA peel options currently listed at Rella Aesthetics in Vacaville. Review selection, downtime, and pricing before treatment.",
    heroEyebrow: "Skin Care",
    heroTitle: "Chemical Peels",
    heroDescription: "Consultation-led peel options in Vacaville, selected around your skin, goals, and expected recovery.",
    whatItIs: {
      heading: "What Is a Chemical Peel?",
      body: "Chemical peels use controlled solutions to exfoliate the skin. Rella's current Vacaville booking menu lists MicroPeel Sensitive, MicroPeel Plus 20, TCA Peel, and Universal Peel. The appropriate option depends on your skin, concerns, recent treatments, and expected recovery.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "A peel may be considered after a skin assessment when the available formulation and recovery profile fit your goals.",
      bullets: [
        "Sun damage and hyperpigmentation",
        "The appearance of post-acne marks and uneven texture",
        "Fine lines and early signs of aging",
        "Uneven skin tone and texture",
        "Dull or lackluster complexion",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Appointment length and downtime vary by the selected peel and your individual skin response.",
      steps: [
        "Skin analysis and peel selection based on your concerns",
        "Gentle cleansing and prep of the treatment area",
        "Application of the selected peel with comfort and skin response monitored",
        "Neutralization and soothing post-treatment care",
        "Product-specific aftercare and recovery guidance before you leave",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Peel pricing depends on the selected product and whether a single treatment or series is appropriate. Rella will review the current Vacaville option and total before you book or treat.",
    },
    faq: [
      { question: "How many peels do I need?", answer: "That depends on the selected product, your skin response, and your goals. The team will explain whether a single treatment or series is appropriate before you decide." },
      { question: "Is there downtime?", answer: "Downtime varies by product and individual response. Temporary redness, sensitivity, flaking, or peeling can occur; review the expected recovery for the exact peel before treatment." },
      { question: "Can I wear makeup after a peel?", answer: "Follow the aftercare instructions for the exact peel and your skin response. Ask your provider when makeup and active skin-care products can be resumed." },
    ],
    image: "/images/service-peels.jpg",
    availableLocations: ["vacaville"],
  },
  {
    slug: "facials",
    title: "Facials",
    metaTitle: "Professional Facials in Vacaville & Napa CA",
    metaDescription: "Explore professional facial options selected around your skin, goals, and current needs at Rella Aesthetics in Vacaville and Napa.",
    heroEyebrow: "Skin Care",
    heroTitle: "Facials",
    heroDescription: "Choose a professional facial around your skin, current concerns, recent treatments, and goals.",
    whatItIs: {
      heading: "What Is a Professional Facial?",
      body: "A professional facial combines skin assessment with the steps and products included in the selected service. The available options may focus on cleansing, exfoliation, hydration, or other cosmetic skin-care goals; your provider can explain the exact protocol before treatment.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "The appropriate facial depends on your skin, sensitivities, current concerns, recent procedures, home-care products, and timing around important events.",
      bullets: [
        "Congestion and cosmetic skin-care concerns",
        "Dry or dull-looking skin",
        "A gentler option when appropriate for sensitive skin",
        "Maintenance between other services when the timing is appropriate",
        "A provider-guided skin-care routine",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Appointment length and treatment steps vary by the facial selected and any appropriate enhancements.",
      steps: [
        "Review of your skin, concerns, sensitivities, products, and recent treatments",
        "Cleansing and exfoliation selected for the service and your skin",
        "Extractions or targeted products only when included and appropriate",
        "Finishing products and sun-care guidance based on the treatment",
        "Aftercare and timing for resuming active products or other services",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Facial pricing depends on the selected treatment and any appropriate enhancements. Review the current service options and total before booking.",
    },
    faq: [
      { question: "How often should I get a facial?", answer: "Frequency should be individualized around the selected service, your skin response, goals, home care, and any other planned treatments." },
      { question: "Will I break out after a facial?", answer: "Skin response varies. Temporary redness, sensitivity, dryness, or breakouts can occur after some services. Tell your provider about current irritation or active concerns and contact Rella if a reaction is unexpected or persistent." },
      { question: "Can I combine a facial with other treatments?", answer: "Possibly, but the order and spacing depend on the exact products and procedures being considered. Your provider should review the combination before it is scheduled." },
    ],
    image: "/images/service-facials.jpg",
  },
  {
    slug: "hydrafacial",
    title: "HydraFacial",
    metaTitle: "HydraFacial Treatments in Vacaville & Napa CA",
    metaDescription: "Explore Signature, Deluxe, and Platinum HydraFacial options at Rella Aesthetics, with tier selection based on your skin and goals.",
    heroEyebrow: "Skin Care",
    heroTitle: "HydraFacial",
    heroDescription: "A multi-step facial that combines cleansing, exfoliation, extraction, and hydration in one appointment.",
    whatItIs: {
      heading: "What Is a HydraFacial?",
      body: "HydraFacial is a branded, multi-step facial that uses Vortex-Fusion technology to cleanse, exfoliate, extract, and hydrate. Rella offers Signature, Deluxe, and Platinum tiers; the appropriate tier and any booster depend on your skin, goals, sensitivities, and recent treatments.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "HydraFacial may be considered for a range of cosmetic skin-care goals after a provider reviews your skin and confirms that the selected tier and products are appropriate that day.",
      bullets: [
        "Cleansing, exfoliation, and hydration goals",
        "The appearance of dull or congested skin",
        "A tiered facial with optional targeted boosters",
        "Skin-care maintenance when the service is appropriate",
        "Pre-event planning with enough time for your individual skin response",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Signature and Deluxe appointments are listed at 45 minutes; Platinum is listed at 75 minutes. Recovery and visible response vary by person and the selected tier.",
      steps: [
        "Review your skin, sensitivities, recent procedures, home care, and goals",
        "Cleanse and exfoliate using the products included in the selected tier",
        "Extract and hydrate using the HydraFacial handpiece and solutions",
        "Add a booster or expanded steps only when included and appropriate",
        "Review aftercare, possible temporary flushing or sensitivity, and event timing",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Signature HydraFacial is $240, Deluxe HydraFacial is $300, and Platinum HydraFacial is $390. Your provider can help you choose the appropriate tier.",
    },
    faq: [
      { question: "How is a HydraFacial different from a regular facial?", answer: "HydraFacial uses a branded handpiece and solutions in a defined cleanse, exfoliate, extract, and hydrate process. Other facials may use different products, devices, and manual techniques; your provider can compare the exact options available at Rella." },
      { question: "How often should I get a HydraFacial?", answer: "Frequency should be individualized around your skin response, goals, products, other procedures, and budget. Your provider can discuss a one-time or ongoing plan without requiring a fixed schedule." },
      { question: "Is there any downtime?", answer: "Recovery varies. Temporary flushing, sensitivity, dryness, or irritation can occur, and timing around makeup, active products, sun exposure, and events should follow your provider's aftercare guidance." },
    ],
    image: "/images/service-hydrafacial.jpg",
  },
  {
    slug: "microneedling",
    title: "Microneedling",
    metaTitle: "Microneedling in Vacaville, CA",
    metaDescription: "Explore clinician-guided microneedling at Rella Aesthetics, with candidacy, device settings, recovery, and treatment planning reviewed first.",
    heroEyebrow: "Skin Care",
    heroTitle: "Microneedling",
    heroDescription: "A controlled microchannel treatment planned around candidacy, treatment area, skin response, and recovery.",
    whatItIs: {
      heading: "What Is Microneedling?",
      body: "Microneedling uses small needles to create controlled microchannels in the skin. The device, treatment area, depth, number of procedures, and expected response require an individual plan; not everyone is an appropriate candidate.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Microneedling may be considered after a provider reviews your skin, health history, medications, recent sun exposure, prior procedures, and the indication for the device being used.",
      bullets: [
        "The appearance of facial acne scars",
        "The appearance of facial lines and wrinkles",
        "Texture concerns when appropriate for the selected device",
        "A provider-guided plan with realistic expectations",
        "Patients able to follow pre- and post-treatment instructions",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Appointment length, comfort measures, recovery, and the number of procedures vary by device, depth, area, and individual skin response.",
      steps: [
        "Review of your skin, health history, medications, recent procedures, and sun exposure",
        "Cleansing and a comfort plan, which may include topical numbing when appropriate",
        "Treatment with settings selected for the device, area, and plan",
        "Post-treatment instructions for sun exposure, makeup, and skin-care products",
        "Review of possible redness, tightness, dryness, peeling, bruising, or other risks",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Microneedling pricing depends on the treatment area, selected modality, and whether a series is recommended. Rella will review the current total before treatment.",
    },
    faq: [
      { question: "How many sessions do I need?", answer: "The number and spacing of procedures should be individualized to the device, indication, treatment area, skin response, and your goals. More than one procedure may be needed, and maintenance is not automatic." },
      { question: "Does microneedling hurt?", answer: "Sensation varies with the device, depth, area, and person. Topical numbing may be used when appropriate; tell your provider about allergies or sensitivities to numbing medications." },
      { question: "When will I see results?", answer: "Response and timing vary, and the desired cosmetic outcome is not guaranteed. Your provider will explain what can reasonably be assessed after recovery and whether another procedure should be considered." },
    ],
    image: "/images/service-microneedling.jpg",
    availableLocations: ["vacaville"],
  },
  {
    slug: "iv-hydration",
    title: "IV Hydration",
    metaTitle: "IV Hydration Therapy in Vacaville & Napa CA",
    metaDescription: "Clinician-guided IV hydration with health screening, monitored administration, and individualized formulation at Rella Aesthetics in Vacaville and Napa.",
    heroEyebrow: "Body & Wellness",
    heroTitle: "IV Hydration",
    heroDescription: "Clinician-guided IV hydration with screening, monitored administration, and ingredients selected for the plan being considered.",
    whatItIs: {
      heading: "What Is IV Hydration?",
      body: "IV hydration delivers fluids and selected ingredients intravenously, bypassing digestive absorption. Suitability, formulation, and frequency depend on your history, goals, current symptoms, and clinical screening. Treatments are administered by licensed medical professionals in a monitored setting.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "IV hydration may be considered for adults seeking clinician-guided hydration support after an appropriate screening.",
      bullets: [
        "Review of hydration and wellness goals",
        "Screening for ingredient and health-history considerations",
        "A monitored alternative when a clinician considers IV delivery appropriate",
        "Clear guidance on formulation and follow-up",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Appointment and infusion time vary with the screening, formulation, access, and individual circumstances, with monitoring throughout administration.",
      steps: [
        "Brief health screening and IV formula selection",
        "Placement of a small IV catheter, with sensation and comfort varying by person",
        "Monitored infusion over the time appropriate for the selected formula",
        "Post-infusion guidance and follow-up instructions",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "IV pricing depends on the selected formulation and any clinically appropriate additions. Rella will review the current ingredients and total before treatment.",
    },
    faq: [
      { question: "How often should I get an IV drip?", answer: "Frequency should be individualized. A clinician can review your history, goals, formulation, and whether repeat treatment is appropriate." },
      { question: "Is IV therapy appropriate for everyone?", answer: "No. IV hydration requires screening, and some health conditions, medications, symptoms, or ingredient considerations may make it inappropriate. The team will review what applies to you." },
      { question: "Will I feel an effect immediately?", answer: "Experiences vary by person, hydration status, formulation, and underlying circumstances. Rella does not promise a specific or immediate result." },
    ],
    image: "/images/service-iv.jpg",
  },
  {
    slug: "laser-treatments",
    title: "Laser Treatments",
    metaTitle: "Laser Treatments in Vacaville & Napa CA",
    metaDescription: "Explore consultation-led IPL, laser hair removal, spider-vein, and resurfacing options at Rella Aesthetics in Vacaville and Napa.",
    heroEyebrow: "Body & Wellness",
    heroTitle: "Laser Treatments",
    heroDescription: "Consultation-led laser and light-based options selected around your skin, goals, treatment area, and recovery needs.",
    whatItIs: {
      heading: "What Are Laser Treatments?",
      body: "Rella's laser and light-based menu includes options such as IPL photofacials, laser hair removal, spider-vein treatment, Erbium resurfacing, and CO2 CoolPeel. The appropriate modality, settings, treatment area, and expected recovery depend on an individual assessment.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "A laser or light-based service may be considered after a provider reviews your goals, skin type, medical history, medications, recent sun exposure, and the device-specific indication.",
      bullets: [
        "Sun damage, brown spots, and redness (IPL)",
        "Unwanted body and facial hair (laser hair removal)",
        "Spider veins and broken capillaries",
        "Acne scars and deep texture concerns (Erbium resurfacing)",
        "General skin rejuvenation and tone improvement",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Treatment time, sensation, recovery, and risk vary substantially by modality, settings, treatment area, and individual response.",
      steps: [
        "Review of your skin, treatment area, goals, medications, recent sun, and event timing",
        "Skin preparation and protective eyewear for the selected procedure",
        "Treatment using device-specific settings, with sensation varying by procedure and person",
        "Procedure-specific aftercare and sun-exposure guidance",
        "Review of expected recovery and material risks, including burns, scarring, infection, incomplete treatment, or skin-color changes",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "IPL Full Face is $420 and CO2 CoolPeel Full Face is $1,440. Pricing for other laser services depends on the treatment area, device, and plan; Rella will review the current total before treatment.",
    },
    faq: [
      { question: "How many laser sessions do I need?", answer: "The number and spacing of procedures depend on the modality, indication, treatment area, settings, individual response, and goals. Your provider will explain the proposed plan without promising a fixed series or result." },
      { question: "Does laser treatment hurt?", answer: "Sensation varies by modality, settings, area, and person. Your provider can explain the comfort options appropriate for the exact procedure being considered." },
      { question: "Can laser treatments be done on all skin types?", answer: "Safety and suitability depend on the device, wavelength, settings, treatment goal, and your skin type. A consultation is required to identify the appropriate option." },
    ],
    image: "/images/service-laser.jpg",
  },
  {
    slug: "weight-loss",
    title: "Medical Weight Loss",
    metaTitle: "Medical Weight Loss in Vacaville & Napa, CA",
    metaDescription: "Find out if you medically qualify for GLP-1 weight-loss treatment in a 30-minute phone consultation with an ABOM-certified physician serving Vacaville and Napa.",
    heroEyebrow: "Body & Wellness",
    heroTitle: "Medical Weight Loss",
    heroDescription: "Talk with Zachary Wagner, DO, an ABOM-certified physician, to determine whether you medically qualify for individualized weight-loss treatment, including GLP-1 options when appropriate.",
    whatItIs: {
      heading: "What Is Medical Weight Loss?",
      body: "Medical weight management begins with a clinical evaluation of your goals, history, prior attempts, and health needs. A personalized plan may include lifestyle support, monitoring, labs when appropriate, and medication only when clinically appropriate.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Our program is designed for patients who have struggled with traditional diet and exercise alone.",
      bullets: [
        "BMI of 27+ with weight-related health concerns",
        "BMI of 30+ (obesity classification)",
        "Patients who have plateaued with diet and exercise",
        "Those seeking a medically supervised, non-surgical approach",
        "Patients committed to long-term lifestyle changes",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "The program begins with a 30-minute medical qualification consultation with Zachary Wagner, DO, followed by the appropriate labs, treatment, monitoring, and support.",
      steps: [
        "A 30-minute phone consultation to determine whether you medically qualify",
        "The appropriate additional information and labs when indicated",
        "An individualized treatment and monitoring plan",
        "Follow-up that may include lifestyle, nutrition, and medication support",
        "Maintenance planning based on progress and clinical needs",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Program cost depends on the care plan, medication choice, labs, and follow-up needs. Rella will explain the applicable options and costs before you decide.",
      note: "The medical qualification consultation requires no card and does not guarantee treatment, a prescription, or a specific medication.",
    },
    faq: [
      { question: "What happens during the first consultation?", answer: "The 30-minute phone consultation with Zachary Wagner, DO, is used to review relevant history, goals, prior attempts, and safety considerations and determine whether you medically qualify to proceed. It does not guarantee a prescription or a specific medication." },
      { question: "Does Rella offer semaglutide or other GLP-1 options?", answer: "GLP-1 medications may be discussed when clinically appropriate. The appropriate medication, source, dosing, and availability depend on your history and current clinical circumstances." },
      { question: "Do I need a card to see consultation times?", answer: "No. The 30-minute medical qualification phone consultation does not require a card." },
      { question: "How much weight can I lose?", answer: "Results vary by person, treatment plan, health factors, and follow-through. Rella does not promise a specific result and will discuss realistic expectations for the plan being considered." },
    ],
    image: "/images/service-weightloss.jpg",
  },
];
