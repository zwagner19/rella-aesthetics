import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CONTACT_INTENTS } from "@/lib/contact-intents";
import { ContactForm } from "./ContactForm";

describe("contact form intent", () => {
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
