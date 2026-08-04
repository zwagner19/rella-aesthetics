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
      body: "A typical Botox appointment takes 15–20 minutes with minimal downtime.",
      steps: [
        "Consultation to assess facial anatomy and goals",
        "Targeted injections using fine needles — most patients feel only a slight pinch",
        "Minimal downtime — most patients return to their daily routine immediately",
        "Timing varies by product; full effect is assessed around 2 weeks",
        "Discuss the appropriate repeat-treatment interval, often around 3–4 months",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Botox is $18/unit and Dysport is $6/unit. The 2026 Tox Membership is $30/month with a one-year commitment; members pay $13/unit for Botox and $4.40/unit for Dysport.",
      note: "Your provider will map the recommended units and total before treatment. Any booking deposit is separate from per-unit treatment pricing.",
    },
    faq: [
      { question: "Does Botox hurt?", answer: "Most patients describe a slight pinch. No anesthesia is needed, and the procedure takes about 15 minutes." },
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
    heroDescription: "Restore lost volume, define contours, and enhance your natural features with premium hyaluronic acid fillers.",
    whatItIs: {
      heading: "What Are Dermal Fillers?",
      body: "Dermal fillers are injectable gels — typically hyaluronic acid — used to restore volume, smooth deep lines, and enhance facial contours. Rella carries multiple filler products for areas such as the cheeks, lips, and facial folds. The appropriate area, product, and expected duration depend on your anatomy and treatment plan.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Fillers are ideal for patients experiencing age-related volume loss or those seeking subtle enhancement.",
      bullets: [
        "Cheek and midface volume restoration",
        "Lip enhancement and definition",
        "Facial balancing when clinically appropriate",
        "Nasolabial folds and marionette lines",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Filler treatments typically take 30–45 minutes depending on the areas treated.",
      steps: [
        "Facial assessment to determine volume needs and product selection",
        "Topical numbing applied for comfort",
        "Precise injections using cannula or needle technique based on the area",
        "Immediate visible improvement with continued settling over 2 weeks",
        "Minimal downtime — some bruising or swelling is normal for 2–5 days",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "The current dermal-filler base service amount is $840. Active product prices range from $540 to $960, and the appropriate product and total depend on the treatment plan.",
      note: "Your provider will review the recommendation and expected total before treatment.",
    },
    faq: [
      { question: "How long do fillers last?", answer: "Most fillers last 6–18 months depending on the product and treatment area. Lip filler typically lasts 6–9 months, while cheek filler can last 12–18 months." },
      { question: "Is the procedure painful?", answer: "We apply topical numbing cream before treatment, and most fillers contain lidocaine for added comfort. Most patients rate discomfort as minimal." },
      { question: "Can fillers be reversed?", answer: "Yes. Hyaluronic acid fillers can be dissolved with hyaluronidase if needed, providing an added safety measure." },
      { question: "How much filler will I need?", answer: "This depends on your goals and the areas being treated. During your consultation, your provider will create a personalized treatment plan." },
    ],
    image: "/images/service-fillers.jpg",
  },
  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    metaTitle: "Chemical Peels in Vacaville & Napa CA",
    metaDescription: "Reveal smoother, brighter skin with medical-grade chemical peels at Rella Aesthetics. Customized treatments for acne, pigmentation, and aging skin.",
    heroEyebrow: "Skin Care",
    heroTitle: "Chemical Peels",
    heroDescription: "Medical-grade peels that reveal smoother, brighter skin by removing damaged outer layers and stimulating cell renewal.",
    whatItIs: {
      heading: "What Is a Chemical Peel?",
      body: "Chemical peels use controlled acid solutions to exfoliate damaged skin layers, revealing fresh, rejuvenated skin beneath. We offer light, medium, and deep peel options customized to your skin type, concerns, and desired downtime. Peels effectively address hyperpigmentation, acne scars, fine lines, and uneven texture.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Chemical peels benefit a wide range of skin concerns and types.",
      bullets: [
        "Sun damage and hyperpigmentation",
        "Acne scars and active breakouts",
        "Fine lines and early signs of aging",
        "Uneven skin tone and texture",
        "Dull or lackluster complexion",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Treatment takes 30–45 minutes. Downtime varies by peel depth.",
      steps: [
        "Skin analysis and peel selection based on your concerns",
        "Gentle cleansing and prep of the treatment area",
        "Application of the peel solution — a tingling or warm sensation is normal",
        "Neutralization and soothing post-treatment care",
        "Light peels: no downtime. Medium peels: 3–7 days of peeling",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Peel pricing depends on the selected product, depth, and whether a single treatment or series is appropriate. Rella will review the current price before you book or treat.",
    },
    faq: [
      { question: "How many peels do I need?", answer: "Most patients see significant improvement after 3–6 treatments spaced 4–6 weeks apart. Your provider will recommend a series based on your goals." },
      { question: "Is there downtime?", answer: "Light peels have no downtime. Medium and deep peels involve 3–7 days of visible peeling and redness." },
      { question: "Can I wear makeup after a peel?", answer: "For light peels, makeup can be applied the next day. For deeper peels, wait until peeling has resolved — typically 5–7 days." },
    ],
    image: "/images/service-peels.jpg",
  },
  {
    slug: "facials",
    title: "Facials",
    metaTitle: "Professional Facials in Vacaville & Napa CA",
    metaDescription: "Customized professional facials at Rella Aesthetics. Targeted treatments for acne, hydration, anti-aging, and sensitive skin in Vacaville and Napa.",
    heroEyebrow: "Skin Care",
    heroTitle: "Facials",
    heroDescription: "Customized professional facials designed to address your unique skin concerns with medical-grade products and expert technique.",
    whatItIs: {
      heading: "What Is a Professional Facial?",
      body: "Our facials go beyond spa relaxation — they are targeted skin treatments using medical-grade products and techniques. Each facial is customized after a thorough skin analysis to address your specific concerns, from acne and congestion to dehydration and early aging.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Professional facials are beneficial for nearly every skin type and concern.",
      bullets: [
        "Acne-prone or congested skin",
        "Dehydrated or dull complexion",
        "Sensitive skin needing gentle, targeted care",
        "Anti-aging maintenance between advanced treatments",
        "General skin health and preventive care",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Sessions typically last 45–60 minutes.",
      steps: [
        "Skin analysis to identify concerns and customize your treatment",
        "Deep cleansing, steam, and exfoliation",
        "Extractions (if needed) and targeted treatment serums",
        "Mask application tailored to your skin type",
        "SPF and hydrating finish — leave glowing",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Facial pricing depends on the selected treatment and any appropriate enhancements. Review the current service options and total before booking.",
    },
    faq: [
      { question: "How often should I get a facial?", answer: "We recommend monthly facials for optimal skin health. Your provider may suggest a different frequency based on your skin concerns and treatment plan." },
      { question: "Will I break out after a facial?", answer: "Some purging is normal after a deep-cleansing facial, especially for acne-prone skin. This typically resolves within a few days." },
      { question: "Can I combine a facial with other treatments?", answer: "Yes, facials pair well with chemical peels, microneedling, and LED therapy. Your provider will recommend the best combination." },
    ],
    image: "/images/service-facials.jpg",
  },
  {
    slug: "hydrafacial",
    title: "HydraFacial",
    metaTitle: "HydraFacial Treatments in Vacaville & Napa CA",
    metaDescription: "Experience the HydraFacial at Rella Aesthetics — deep cleansing, exfoliation, and hydration in one advanced treatment. No downtime. Immediate glow.",
    heroEyebrow: "Skin Care",
    heroTitle: "HydraFacial",
    heroDescription: "The ultimate skin refresh — deep cleansing, gentle exfoliation, and intense hydration in one comfortable treatment.",
    whatItIs: {
      heading: "What Is a HydraFacial?",
      body: "HydraFacial is a patented multi-step treatment that combines cleansing, exfoliation, extraction, and hydration using a specialized vortex technology. It delivers medical-grade serums deep into the skin while removing impurities. The result is instantly visible — clearer, more radiant skin with zero downtime.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "HydraFacial is suitable for all skin types and can be customized with targeted boosters.",
      bullets: [
        "All skin types including sensitive skin",
        "Patients wanting immediate visible results",
        "Fine lines and loss of firmness",
        "Enlarged pores and congestion",
        "Pre-event glow with no downtime",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "A HydraFacial takes 30–45 minutes. No downtime — walk out glowing.",
      steps: [
        "Cleanse + peel using gentle exfoliating acids",
        "Extract + hydrate using vortex suction to remove debris and infuse serums",
        "Fuse + protect with antioxidants and peptides for lasting glow",
        "Optional booster add-ons for targeted concerns (brightening, firming, acne)",
        "Immediate results — wear makeup or return to your day right away",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Signature HydraFacial is $240, Deluxe HydraFacial is $300, and Platinum HydraFacial is $390. Your provider can help you choose the appropriate tier.",
    },
    faq: [
      { question: "How is a HydraFacial different from a regular facial?", answer: "HydraFacial uses patented vortex technology to deeply cleanse, extract, and hydrate simultaneously. Traditional facials rely on manual techniques. HydraFacial is more consistent and delivers serums more effectively." },
      { question: "How often should I get a HydraFacial?", answer: "Monthly treatments are recommended for optimal skin health. Many patients enjoy it as a pre-event treatment for an immediate glow." },
      { question: "Is there any downtime?", answer: "None. Your skin may appear slightly flushed for 30–60 minutes, but you can apply makeup and resume normal activities immediately." },
    ],
    image: "/images/service-hydrafacial.jpg",
  },
  {
    slug: "microneedling",
    title: "Microneedling",
    metaTitle: "Microneedling in Vacaville & Napa CA",
    metaDescription: "Stimulate collagen production and improve skin texture with medical microneedling at Rella Aesthetics. Expert treatments in Vacaville and Napa.",
    heroEyebrow: "Skin Care",
    heroTitle: "Microneedling",
    heroDescription: "Stimulate your skin's natural healing to improve texture, reduce scarring, and boost collagen production.",
    whatItIs: {
      heading: "What Is Microneedling?",
      body: "Microneedling (collagen induction therapy) uses fine, sterile needles to create controlled micro-injuries in the skin. This triggers the body's natural wound-healing process, stimulating collagen and elastin production. The result is firmer, smoother, more even-toned skin over a series of treatments.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Microneedling is effective for a wide range of concerns and skin types.",
      bullets: [
        "Acne scars and post-inflammatory hyperpigmentation",
        "Fine lines and early wrinkles",
        "Enlarged pores and rough texture",
        "Stretch marks (body treatments available)",
        "Dull skin needing collagen boost",
      ],
    },
    whatToExpect: {
      heading: "What to Expect",
      body: "Treatment takes 30–45 minutes. Expect 2–3 days of redness similar to a mild sunburn.",
      steps: [
        "Cleanse and apply topical numbing cream (20–30 minutes)",
        "Microneedling with customized depth settings for each area",
        "Application of the appropriate topical products during treatment",
        "Calming mask and SPF applied post-treatment",
        "Redness subsides within 48–72 hours; new collagen develops over 4–6 weeks",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Microneedling pricing depends on the treatment area, selected modality, and whether a series is recommended. Rella will review the current total before treatment.",
    },
    faq: [
      { question: "How many sessions do I need?", answer: "Most patients see optimal results after 3–6 sessions spaced 4–6 weeks apart. Maintenance treatments are recommended every 3–6 months." },
      { question: "Does microneedling hurt?", answer: "A topical numbing cream is applied before treatment. Most patients describe the sensation as mild pressure or light prickling." },
      { question: "When will I see results?", answer: "Initial improvement is visible within 1–2 weeks as redness fades. Collagen remodeling continues for 3–6 months, with progressive improvement after each session." },
    ],
    image: "/images/service-microneedling.jpg",
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
      body: "Sessions typically take 30–60 minutes, with monitoring throughout the infusion.",
      steps: [
        "Brief health screening and IV formula selection",
        "Small IV catheter placed in the arm (quick, minimal discomfort)",
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
    metaDescription: "IPL, laser hair removal, spider vein removal, and Erbium skin resurfacing at Rella Aesthetics. Expert laser services in Vacaville and Napa.",
    heroEyebrow: "Body & Wellness",
    heroTitle: "Laser Treatments",
    heroDescription: "Advanced laser technology for hair removal, vein treatment, skin resurfacing, and photofacial rejuvenation.",
    whatItIs: {
      heading: "What Are Laser Treatments?",
      body: "We offer a comprehensive suite of laser and light-based treatments including IPL photofacials for sun damage and redness, laser hair removal for long-lasting smoothness, spider vein treatment, and Erbium laser resurfacing for deeper skin concerns. Each treatment uses calibrated wavelengths to target specific skin concerns with precision.",
    },
    whoItsFor: {
      heading: "Who Is It For?",
      body: "Laser treatments address a wide range of aesthetic concerns.",
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
      body: "Treatment time and downtime vary by procedure.",
      steps: [
        "Consultation to determine the right laser modality for your goals",
        "Skin prep and protective eyewear application",
        "Laser treatment — sensation varies from warm snapping to mild heat",
        "Post-treatment cooling and soothing products applied",
        "Downtime: IPL 1–3 days (darkening then flaking); Erbium 5–7 days; hair removal none",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "IPL Full Face is $420 and CO2 CoolPeel Full Face is $1,440. Pricing for other laser services depends on the treatment area, device, and plan; Rella will review the current total before treatment.",
    },
    faq: [
      { question: "How many laser sessions do I need?", answer: "IPL typically requires 3–5 sessions. Laser hair removal needs 6–8 sessions. Erbium resurfacing may require 1–3 sessions. Your provider will create a customized plan." },
      { question: "Does laser treatment hurt?", answer: "Sensation varies by treatment type. Most patients describe IPL as a rubber band snap. Topical numbing is available for more intensive treatments." },
      { question: "Can laser treatments be done on all skin types?", answer: "Safety and suitability depend on the device, wavelength, settings, treatment goal, and your skin type. A consultation is required to identify the appropriate option." },
    ],
    image: "/images/service-laser.jpg",
  },
  {
    slug: "weight-loss",
    title: "Medical Weight Loss",
    metaTitle: "Medical Weight Loss in Vacaville & Napa, CA",
    metaDescription: "Start with a no-card, 30-minute phone consultation for physician-led medical weight management in Vacaville or Napa. Review your goals, options, next steps, and costs before deciding.",
    heroEyebrow: "Body & Wellness",
    heroTitle: "Medical Weight Loss",
    heroDescription: "Start with Zachary Wagner, DO, an American Board of Obesity Medicine diplomate, for medical weight management built around your history, goals, monitoring needs, and the right next step.",
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
      body: "The program begins with a starting-point phone consultation with Zachary Wagner, DO, followed by the appropriate clinical evaluation and support.",
      steps: [
        "A 30-minute phone consultation to discuss goals and questions",
        "The appropriate clinical evaluation and labs when indicated",
        "An individualized treatment and monitoring plan",
        "Follow-up that may include lifestyle, nutrition, and medication support",
        "Maintenance planning based on progress and clinical needs",
      ],
    },
    pricing: {
      heading: "Pricing",
      body: "Program cost depends on the care plan, medication choice, labs, and follow-up needs. Rella will explain the applicable options and costs before you decide.",
      note: "The starting-point phone consultation requires no card and does not guarantee treatment or a prescription.",
    },
    faq: [
      { question: "What happens during the first consultation?", answer: "During your phone consultation with Zachary Wagner, DO, you will discuss your goals, relevant history, what you have tried, how the program works, likely next steps, and cost questions. It is not a guarantee of treatment or a prescription." },
      { question: "Does Rella offer semaglutide or other GLP-1 options?", answer: "GLP-1 medications may be discussed when clinically appropriate. The appropriate medication, source, dosing, and availability depend on your history and current clinical circumstances." },
      { question: "Do I need a card to see consultation times?", answer: "No. The 30-minute weight-loss starting-point phone consultation does not require a card." },
      { question: "How much weight can I lose?", answer: "Results vary by person, treatment plan, health factors, and follow-through. Rella does not promise a specific result and will discuss realistic expectations for the plan being considered." },
    ],
    image: "/images/service-weightloss.jpg",
  },
];
