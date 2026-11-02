import type { MouseEvent, ReactElement } from "react";
import { beforeEach, expect, it, vi } from "vitest";
const booking = vi.hoisted(() => ({ open: vi.fn() }));
vi.mock("./BookingExperienceProvider", () => ({ useGuidedBooking: () => booking }));
import { BookTrigger } from "./BookTrigger";

beforeEach(() => { vi.clearAllMocks(); });
it("keeps a guarded mobile trigger mounted and opens its existing modal on resumed click", () => {
  const closeMenu = vi.fn();
  const intent = { location: "napa" as const };
  const trigger = BookTrigger({ intent, children: "Book", onClick: closeMenu }) as ReactElement<{ onClick(event: MouseEvent<HTMLAnchorElement>): void }>;
  trigger.props.onClick({ defaultPrevented: true } as MouseEvent<HTMLAnchorElement>);
  expect(closeMenu).not.toHaveBeenCalled();
  expect(booking.open).not.toHaveBeenCalled();

  const preventDefault = vi.fn();
  trigger.props.onClick({ defaultPrevented: false, button: 0, preventDefault } as unknown as MouseEvent<HTMLAnchorElement>);
  expect(closeMenu).toHaveBeenCalledTimes(1);
  expect(preventDefault).toHaveBeenCalledTimes(1);
  expect(booking.open).toHaveBeenCalledExactlyOnceWith(intent);
});
