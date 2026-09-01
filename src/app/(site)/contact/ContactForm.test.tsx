import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CONTACT_INTENTS } from "@/lib/contact-intents";
import { ContactForm } from "./ContactForm";

describe("contact form intent", () => {
  it("renders the existing membership option selected on the first response", () => {
    const html = renderToStaticMarkup(
      <ContactForm initialServiceInterest={CONTACT_INTENTS.membership} />,
    );
    expect(html).toContain('<option value="Membership Questions" selected="">');
  });

  it("defaults to no service selection without an approved server intent", () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain('<option value="" selected="">Select a service</option>');
  });

  it.each(Object.values(CONTACT_INTENTS))(
    "renders the approved %s inquiry option",
    (interest) => {
      const html = renderToStaticMarkup(
        <ContactForm initialServiceInterest={interest} />,
      );
      expect(html).toContain(`<option value="${interest}" selected="">`);
    },
  );
});
