import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CONTACT_INTENTS } from "@/lib/contact-intents";
import { ContactForm } from "./ContactForm";
import { ASSESSMENT_CONTACT_CONSENT, MARKETING_CONSENT } from "@/lib/guided-booking/policies";

describe("contact form intent", () => {
  it("shows both approved consent sentences with unchecked native controls and preserves email-only inquiries", () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain(ASSESSMENT_CONTACT_CONSENT);
    expect(html).toContain(MARKETING_CONSENT);
    const checks = html.match(/<input[^>]*type="checkbox"[^>]*>/g)!;
    expect(checks).toHaveLength(2);
    expect(checks[0]).toContain('name="operationalConsent"');
    expect(checks[0]).not.toContain("checked");
    expect(checks[0]).not.toContain("required"); // Phone is empty; email alone remains valid.
    expect(checks[1]).toContain('name="marketingConsent"');
    expect(checks[1]).toContain("disabled");
    expect(checks[1]).not.toContain("checked");
    expect(checks[1]).not.toContain("required");
  });
  it("selects an approved initial inquiry", () => {
    const html = renderToStaticMarkup(
      <ContactForm initialServiceInterest={CONTACT_INTENTS.membership} />,
    );
    expect(html).toContain('<option value="Membership Questions" selected="">');
  });

  it("defaults to no service selection", () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain('<option value="" selected="">Select a service</option>');
  });

  it.each(Object.values(CONTACT_INTENTS))(
    "renders the approved %s option",
    (interest) => {
      const html = renderToStaticMarkup(
        <ContactForm initialServiceInterest={interest} />,
      );
      expect(html).toContain(`<option value="${interest}" selected="">`);
    },
  );
});
