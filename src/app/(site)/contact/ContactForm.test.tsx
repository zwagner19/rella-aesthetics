import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactForm, MEMBERSHIP_CONTACT_INTENT } from "./ContactForm";

describe("contact form intent", () => {
  it("renders the existing membership option selected on the first response", () => {
    expect(MEMBERSHIP_CONTACT_INTENT).toBe("Membership Questions");
    const html = renderToStaticMarkup(
      <ContactForm initialServiceInterest={MEMBERSHIP_CONTACT_INTENT} />,
    );
    expect(html).toContain('<option value="Membership Questions" selected="">');
  });

  it("defaults to no service selection without an approved server intent", () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain('<option value="" selected="">Select a service</option>');
  });
});
