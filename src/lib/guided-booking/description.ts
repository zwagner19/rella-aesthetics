// The live catalog owns treatment facts. Reservation policy belongs in the
// existing review/payment steps, rather than in every treatment description.
const POLICY = /\b(?:deposits?|cancell?ations?|cancelled|canceled|reschedul(?:e|ed|ing)|no[\s-]?shows?|forfeit(?:s|ed)?|refund(?:s|ed|able)?|reservation (?:fees?|polic(?:y|ies))|booking (?:fees?|polic(?:y|ies))|card on file|credit card|account credit|treatment credit|applied (?:toward|to) your treatment|48[\s-]*hours?|manager review|documented emergencies)\b/i;
const MAX_SENTENCE_LENGTH = 360;
const MAX_DESCRIPTION_LENGTH = 520;
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const PREREQUISITE = /\b(?:must book (?:your|an?) initial|please only book this service if|initial .{0,50}consult.{0,30}before booking)\b/i;
const EVENT_CONTEXT = /^select (?:the|your) (?:nurse|provider)\b/i;
const PRICE_BLOCK = /^(?:\$\d|package of \d+.*\$|\d+[\s-]*minute session.*\$)/i;

function plainText(value: string): string {
  const entities: Record<string, string> = {
    amp: "&", nbsp: " ", quot: '"', apos: "'", lt: "<", gt: ">",
  };
  return value
    .replace(/&(#x[\da-f]+|#\d+|amp|nbsp|quot|apos|lt|gt);/gi, (entity, code: string) => {
      if (!code.startsWith("#")) return entities[code.toLowerCase()] ?? entity;
      const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : " ";
    })
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<\/?(?:p|div|li|br|h[1-6])\b[^>]*>/gi, "\n\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\*{1,3}/g, "")
    .replace(/\r\n?/g, "\n");
}

/** Preserve actual service prerequisites for the existing review step. */
export function treatmentBookingNotes(description: string | null | undefined): string | undefined {
  const notes: string[] = [];
  for (const line of plainText(description ?? "").split(/\n+/)) {
    let eventContext = false;
    for (const { segment } of segmenter.segment(line.replace(/\s+/g, " ").trim())) {
      const sentence = segment.trim();
      if (!POLICY.test(sentence) && (PREREQUISITE.test(sentence) || (eventContext && EVENT_CONTEXT.test(sentence)))) {
        notes.push(sentence);
        eventContext = /party|event/i.test(sentence);
      } else eventContext = false;
    }
  }
  return notes.length ? [...new Set(notes)].join(" ") : undefined;
}

function fallback(displayName: string): [string, string] {
  if (/consult/i.test(displayName)) {
    return [
      "Meet with a Rella provider to discuss your goals and treatment options.",
      "Your provider can help you understand the appropriate next steps.",
    ];
  }
  if (/follow[\s-]?up|touch[\s-]?up/i.test(displayName)) {
    return [
      "Review your treatment with a Rella provider and discuss any questions.",
      "Your provider can help you understand the appropriate next steps.",
    ];
  }
  return [
    "Learn more about this treatment with a Rella provider.",
    "Your provider can discuss how it fits your goals and treatment plan.",
  ];
}

/** Keep complete treatment sentences; never cut a clinical statement mid-sentence. */
export function treatmentDescription(description: string | null | undefined, displayName: string): string {
  const raw = description ?? "";
  // These source descriptions refer to a different offer/peel than their title.
  // Use neutral copy until the source catalog is corrected; never infer a claim.
  if ((/micro\s*peel plus 30/i.test(displayName) && /micro\s*peel plus 20/i.test(raw))
    || (/bye\s*bye baggy eyes/i.test(displayName) && /botox/i.test(raw))
    || (/\$13\s*\/?\s*(?:unit|\/)/i.test(displayName) && /\$11\s*\/?\s*unit/i.test(raw))
    || /^use this service for booking\b/i.test(raw.trim())) {
    return fallback(displayName).join(" ");
  }
  // Small editorial repairs retain the source facts while removing fragments
  // and instructions that do not explain the treatment itself.
  if (/^established patient tox$/i.test(displayName) && /facial wrinkles and fine lines/i.test(raw)) {
    return "Botox treatment can reduce the appearance of facial wrinkles and fine lines. Areas listed for treatment include the forehead, frown lines, crow’s feet, chin, and jawline.";
  }
  if (/^additional syringe$/i.test(displayName) && /dermal filler appointment/i.test(raw)) {
    return "This option adds an additional syringe to a dermal filler appointment. It can be used when more than one area is treated during the same visit.";
  }
  if (/^botox & filler$/i.test(displayName) && /botox and filler/i.test(raw)) {
    return "This visit combines Botox and dermal filler in one appointment. Your provider will recommend the treatment areas and amounts during an in-person assessment.";
  }
  if (/please only book this service if.*out of clinic party\/event/i.test(raw)) {
    return "This service is intended for an offsite party or event. The visit is coordinated with the nurse hosting your event.";
  }
  const sentences: string[] = [];
  const paragraphs = plainText(raw).split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    const text = paragraph.replace(/\s+/g, " ").trim();
    // Dedicated price blocks already have a separate place in the service row.
    if (!text || PRICE_BLOCK.test(text)
      || /^see\b.*\b(?:packages|deals)\b/i.test(text)) continue;
    let eventContext = false;
    for (const { segment } of segmenter.segment(text)) {
      let sentence = segment.trim().replace(/^[-*•]\s*/, "");
      // Following sentences in a policy paragraph often say only “it” or “this”.
      // Stop at the first policy sentence so that those fragments cannot leak.
      if (POLICY.test(sentence)) break;
      if (PREREQUISITE.test(sentence) || (eventContext && EVENT_CONTEXT.test(sentence))) {
        eventContext = /party|event/i.test(sentence);
        continue;
      }
      eventContext = false;
      if (!/[.!?]["'”’)]?$/.test(sentence)) {
        const completePrefix = sentence.match(/^(.*[.!?])[^.!?]*$/)?.[1];
        if (completePrefix) sentence = completePrefix;
        else if (sentence.split(/\s+/).length >= 6) sentence += ".";
        else continue;
      }
      if (!/[a-z]/i.test(sentence) || sentence.length > MAX_SENTENCE_LENGTH) continue;
      if ([...sentences, sentence].join(" ").length > MAX_DESCRIPTION_LENGTH) break;
      sentences.push(sentence);
      if (sentences.length === 2) return sentences.join(" ");
    }
  }
  const defaults = fallback(displayName);
  return sentences.length ? `${sentences[0]} ${defaults[1]}` : defaults.join(" ");
}
