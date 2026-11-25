import { describe, expect, it } from "vitest";
import { BOULEVARD_CHECKOUT, OFFERS, boulevardWidgetCheckoutEnabled, boulevardWidgetParams } from "./config";

describe("Black Friday Boulevard package checkout", () => {
  it("maps every offer at every clinic to Zach's package ids", () => {
    expect(boulevardWidgetParams("bf26-1000", "napa")).toEqual({
      locationId: "91eba843-57fb-49e9-8505-431d501ffec7",
      path: "/cart/menu/Other Packages/p_0c568ac1-560e-4a8f-a18e-a11cff0af950",
      visitType: "PACKAGE",
    });
    expect(boulevardWidgetParams("bf26-2100", "napa").path).toBe("/cart/menu/Other Packages/p_216ed6c4-0cc4-4717-bdd8-7430539ea3f2");
    expect(boulevardWidgetParams("bf26-1000", "vacaville")).toEqual({
      locationId: "0f146f87-364e-4dfd-b938-61ba49528820",
      path: "/cart/menu/Other Packages/p_b7d2e9ac-c9e0-42cd-b818-a7aba38b9676",
      visitType: "PACKAGE",
    });
    expect(boulevardWidgetParams("bf26-2100", "vacaville").path).toBe("/cart/menu/Other Packages/p_17a12f26-1eb3-4b93-823d-c58915152d11");
    for (const o of OFFERS) expect(Object.keys(BOULEVARD_CHECKOUT.packages[o.id]).sort()).toEqual(["napa", "vacaville"]);
    expect(BOULEVARD_CHECKOUT.businessId).toBe("a12f397a-6db3-4b18-bc34-01f02dfb7216");
  });

  it("rejects unknown offers or clinics", () => {
    expect(() => boulevardWidgetParams("nope" as never, "napa")).toThrow("unknown-package");
    expect(() => boulevardWidgetParams("bf26-1000", "sf" as never)).toThrow("unknown-package");
  });

  it("is preview-only and off unless the flag is exactly 1", () => {
    expect(boulevardWidgetCheckoutEnabled({})).toBe(false);
    expect(boulevardWidgetCheckoutEnabled({ BF_BOULEVARD_WIDGET_CHECKOUT: "true", VERCEL_ENV: "preview" })).toBe(false);
    expect(boulevardWidgetCheckoutEnabled({ BF_BOULEVARD_WIDGET_CHECKOUT: "1", VERCEL_ENV: "production" })).toBe(false);
    expect(boulevardWidgetCheckoutEnabled({ BF_BOULEVARD_WIDGET_CHECKOUT: "1", VERCEL_ENV: "preview" })).toBe(true);
  });
});
