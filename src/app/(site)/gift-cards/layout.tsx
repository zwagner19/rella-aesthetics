import { Poppins } from "next/font/google";
import s from "@/components/gift-cards/gift.module.css";

// Route-local Poppins Medium Italic for expressive headlines. The root layout
// (300/400/500/700 upright) is intentionally unchanged.
const poppinsItalic = Poppins({
  variable: "--font-poppins-italic",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
});

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-gift-root className={`${poppinsItalic.variable} ${s.root}`}>
      {children}
    </div>
  );
}
